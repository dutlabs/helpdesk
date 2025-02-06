<template>
  <router-link
    class="flex cursor-pointer flex-col gap-2 rounded-lg border border-gray-200 p-3 hover:shadow-xl"
    :to="{
      name: __('Articles'),
      params: {
        categoryId: category.name,
      },
    }"
  >
    <div>
      <FeatherIcon
        name="folder"
        class="fill-ink-gray-3 -ml-[2px] h-8 w-8 text-gray-400"
      />
    </div>
    <div class="flex flex-col gap-1">
      <p class="truncate text-base font-medium text-gray-800">
        {{ category.category_name }}
      </p>
      <span class="text-ink-gray-5 truncate text-xs md:text-sm">
        {{ category.article_count }} {{ __("articles") }}
      </span>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { FeatherIcon } from "frappe-ui";
const props = defineProps({
  category: {
    required: true,
    type: Object,
  },
});
</script>
