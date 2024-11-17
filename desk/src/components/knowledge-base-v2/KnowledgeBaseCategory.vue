<template>
  <div
    v-if="
      !categoryTreeResource.isLoading &&
      (!!category.subCategories.length || !!category.articles.length)
    "
    class="flex w-full flex-col overflow-hidden p-5 px-10"
  >
    <!-- Top Section -->
    <section class="mb-5 flex flex-col gap-3.5">
      <h3 class="text-2xl font-semibold text-gray-800">
        {{ category.categoryName }}
      </h3>
      <FormControl
        v-model="categorySearch"
        type="text"
        class="w-full"
        :placeholder="__('Search (title, subtitle, author)')"
        size="md"
        @input="searchArticles"
      >
        <template #prefix>
          <Icon icon="lucide:search" class="h-4 w-4 text-gray-500" />
        </template>
      </FormControl>
    </section>
    <div class="overflow-scroll">
      <!-- Sub categories Section -->
      <section
        v-if="!!category.subCategories.length"
        class="mb-8 flex flex-col gap-3"
      >
        <h3 class="text-lg font-semibold text-gray-900">
          {{ __("Sub-categories") }}
        </h3>
        <!-- sub category card container-->
        <div class="flex flex-wrap gap-5 text-lg">
          <!-- sub category card -->
          <div
            v-for="subCategory in category.subCategories"
            class="min-w-[190px] max-w-[190px] cursor-pointer rounded border px-3.5 py-3 hover:border-gray-500"
            @click="handleSubCategoryClick(subCategory)"
          >
            <h5 class="truncate text-lg">{{ subCategory?.category_name }}</h5>
            <span class="text-sm text-gray-600">
              {{ __("{0} articles", [subCategory.articles.length]) }}
            </span>
          </div>
        </div>
      </section>
      <!-- Article List View -->
      <section v-if="!!_articles.length" class="flex flex-col gap-3">
        <h4 class="text-lg font-semibold text-gray-900">
          {{ showAllArticles ? __("All Articles") : __("Articles") }}
        </h4>
        <!-- Article Container -->
        <div class="flex max-w-full flex-col gap-x-2 divide-y">
          <!-- Article Card -->
          <ArticleCard
            v-for="article in _articles"
            :key="article.name"
            :article="article"
            :author="category.authors[article.author]"
          />
        </div>
      </section>
      <div
        v-else
        class="items center flex h-[300px] w-full justify-center text-gray-600"
      >
        {{ __("No articles found") }}
      </div>
    </div>
  </div>
  <div
    v-else
    class="flex h-[300px] w-full items-center justify-center text-gray-600"
  >
    {{ __("No articles found") }}
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref, Reactive } from "vue";
import { createResource, FormControl, createListResource } from "frappe-ui";
import ArticleCard from "@/components/knowledge-base-v2/ArticleCard.vue";
import { Article, Author, Category, SubCategory } from "@/types";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

interface P {
  categoryId?: string;
  showAllArticles?: boolean;
}
const props = withDefaults(defineProps<P>(), {
  categoryId: "",
  showAllArticles: false,
});

const router = useRouter();
const userStore = useUserStore();

const category: Reactive<Category> = reactive({
  categoryName: "",
  subCategories: [],
  articles: [],
  authors: {},
});

const categorySearch = ref("");
const _articles = ref([]);

const categoryTreeResource = createResource({
  url: "helpdesk.api.kbase.get_sub_categories_and_articles",
  name: props.categoryId,
  cache: ["category", props.categoryId],
  params: {
    category: props.categoryId,
  },
  auto: !props.showAllArticles,
});

const allArticles = createListResource({
  doctype: "HD Article",
  fields: [
    "name",
    "title",
    "category",
    "published_on",
    "author",
    "subtitle",
    "article_image",
    "_user_tags",
  ],
  filters: {
    status: "Published",
  },
  pageLength: 100,
  auto: props.showAllArticles,
  onSuccess(articles: Article[]) {
    category.articles = articles;
    _articles.value = articles;
    const authors = [...new Set(articles.map((article) => article.author))];
    category.authors = authors.reduce((acc, author) => {
      const authorInfo = userStore.getUser(author);
      acc[author] = {
        name: authorInfo.full_name ?? authorInfo.email,
        image: authorInfo.user_image ?? "",
      };
      return acc;
    }, {});
  },
});

function searchArticles() {
  const search = categorySearch.value.toLowerCase();
  const articles = category.articles.filter(
    (article) =>
      article.title.toLowerCase().includes(search) ||
      category.authors[article.author].name.toLowerCase().includes(search)
  );
  _articles.value = articles;
}

function handleSubCategoryClick(subCategory: SubCategory) {
  categoryTreeResource.update({
    params: {
      category: subCategory.name,
    },
  });
  categoryTreeResource.reload();
  router.push({
    query: {
      category: categoryTreeResource.data.root_category.category_id,
      subCategory: subCategory.name,
    },
  });
}

watch(
  () => router.currentRoute.value.query,
  () => {
    const { category, subCategory } = router.currentRoute.value.query as {
      category: string;
      subCategory: string;
    };
    if (!subCategory && category !== "Explore all articles") {
      categoryTreeResource.update({
        params: {
          category: category,
        },
      });
      categoryTreeResource.reload();
    }
  }
);

watch(
  async () => categoryTreeResource.data,
  async () => {
    const data = await categoryTreeResource.data;
    category.categoryName = data["root_category"].category_name;
    category.subCategories = data["sub_categories"];
    category.articles = data["all_articles"];
    category.authors = data["authors"];
    _articles.value = category.articles;
    return data;
  }
);

watch(
  () => props.categoryId,
  () => {
    categoryTreeResource.update({
      params: {
        category: props.categoryId,
      },
    });
    categoryTreeResource.reload();
  }
);
</script>

<style scoped></style>
