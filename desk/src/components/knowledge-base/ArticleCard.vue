<template>
  <router-link
    class="h-30 hover:bg-surface-gray-2 flex cursor-pointer flex-col gap-3 rounded border border-gray-200 p-4 pb-2 transition-all"
    :to="{
      name: 'ArticlePublic',
      params: {
        articleId: article.name,
      },
    }"
  >
    <!-- Title and sub content -->
    <div class="flex flex-1 gap-3">
      <div class="flex w-full flex-col gap-1.5">
        <h5 class="truncate text-base font-medium text-gray-800">
          {{ article.title }}
        </h5>
        <div class="text-p-sm line-clamp-2 text-gray-600">
          {{ article.content }}
        </div>
      </div>
    </div>
    <!-- Avatar and published date -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Avatar :label="article.author.name" :image="article.author.image" />
        <span class="flex-1 truncate text-sm text-gray-600">{{
          article.author.name
        }}</span>
      </div>
      <span class="text-sm text-gray-600">{{
        dayjs.tz(article.modified).fromNow()
      }}</span>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { Avatar } from "frappe-ui";
import { Article } from "@/types";
import { dayjs } from "@/dayjs";

const props = defineProps<{
  article: Article;
}>();
</script>
