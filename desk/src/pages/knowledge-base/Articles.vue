<template>
  <div class="w-full items-center overflow-scroll p-5 px-10 md:pb-10">
    <LayoutHeader>
      <template #left-header>
        <Breadcrumbs :items="breadcrumbs" />
      </template>
    </LayoutHeader>
    <div
      class="flex w-full max-w-4xl flex-col gap-2 pt-0 sm:px-5 2xl:max-w-5xl"
    >
      <div
        v-if="articles.data"
        class="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5"
      >
        <ArticleCard
          v-for="article in articles.data"
          :key="article.name"
          :article="article"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { categoryName } from "@/stores/knowledgeBase";
import { Breadcrumbs, createResource } from "frappe-ui";
import LayoutHeader from "@/components/LayoutHeader.vue";
import ArticleCard from "@/components/knowledge-base/ArticleCard.vue";
import { capture } from "@/telemetry";

const props = defineProps({
  categoryId: {
    required: true,
    type: String,
  },
});

const articles = createResource({
  url: "helpdesk.api.knowledge_base.get_category_articles",
  cache: ["articles", props.categoryId],
  params: {
    category: props.categoryId,
  },
  auto: true,
});

onMounted(() => {
  categoryName.fetch({
    category: props.categoryId,
  });
  capture("kb_customer_page_articles", {
    data: {
      category: props.categoryId,
    },
  });
});

const categoryTitle = computed(() => {
  if (!categoryName.data) return;
  return categoryName.data;
});

const breadcrumbs = computed(() => {
  return [
    {
      label: __("Knowledge Base"),
      route: {
        name: "CustomerKnowledgeBase",
      },
    },
    {
      label: categoryTitle.value,
    },
  ];
});
</script>
