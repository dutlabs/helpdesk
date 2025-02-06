<template>
  <div
    v-if="!isEmpty(articles.data) && query.length > 2"
    class="rounded border p-4 text-base"
  >
    <div v-if="!hideViewAll" class="mb-2 pl-2 font-medium">
      {{ __("These articles may already cover what you are looking for") }}
      <RouterLink
        class="group cursor-pointer space-x-1 hover:text-gray-900"
        :to="{
          name: 'CustomerKnowledgeBase',
        }"
        target="_blank"
      >
        <span class="text-xs underline">{{ __("(View All)") }}</span>
      </RouterLink>
    </div>
    <dl
      v-if="articles.data.length > 0"
      class="mx-auto flex w-full flex-col gap-2"
    >
      <div
        v-for="a in articles.data"
        :key="a.id"
        class="hover:bg-surface-gray-2 rounded-md border-2 border-hidden p-2"
      >
        <RouterLink
          class="group flex cursor-pointer flex-col gap-1 hover:text-gray-900"
          :to="{
            name: 'ArticlePublic',
            params: {
              articleId: a.name.split('#')[0],
            },
            hash: `#${a.name.split('#')[1]}`,
          }"
          target="_blank"
          @click="handleSearchArticleClick(a)"
        >
          <dt class="font-base">{{ a.subject }} - {{ a.headings }}</dt>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <dd
            class="font-base text-p-sm line-clamp-1 text-gray-600"
            v-html="a.description"
          ></dd>
        </RouterLink>
      </div>
    </dl>
  </div>
  <div
    v-else-if="
      !articles.loading && articles.data?.length === 0 && query.length > 2
    "
    class="flex h-[240px] flex-col items-center justify-center gap-2 rounded border"
  >
    <Icon icon="heroicons-outline:search" class="h-8 w-8 text-gray-400" />
    <div class="flex flex-col items-center justify-center">
      <p class="font-base">{{ __("No answers found") }}</p>
      <span class="font-base text-p-sm text-center text-gray-600">
        {{ __("Rephrase the question and try again with some keywords") }}
      </span>
    </div>
  </div>
  <div
    v-else-if="articles.loading"
    class="flex h-[240px] flex-col items-center justify-center gap-2 rounded border"
  >
    <Icon icon="heroicons-outline:search" class="h-8 w-8 text-gray-400" />
    <div class="flex flex-col items-center justify-center">
      <p class="font-base">{{ __("Searching...") }}</p>
      <span class="font-base text-p-sm text-center text-gray-600">
        {{ __("Please wait while we search for the answers") }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { createResource } from "frappe-ui";
import { isEmpty } from "lodash";
import { Icon } from "@iconify/vue";
import { capture } from "@/telemetry";
interface P {
  query: string;
  hideViewAll?: boolean;
}

const { query = "", hideViewAll = false } = defineProps<P>();
const articles = createResource({
  url: "helpdesk.api.article.search",
  debounce: 500,
  auto: false,
});
watch(
  () => query,
  (query) => {
    if (query.length < 3) return;
    articles.update({
      params: {
        query: query,
      },
    });
    articles.reload();
  }
);

function handleSearchArticleClick(article) {
  capture("kb_customer_search_article_clicked", {
    data: {
      article: article.subject,
    },
  });
}
</script>
