<template>
  <div
    v-if="!categories.loading"
    class="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4"
  >
    <CategoryFolder v-for="category in categories.data" :category="category" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { categories } from "@/stores/knowledgeBase";
import CategoryFolder from "./CategoryFolder.vue";

onMounted(() => {
  categories.fetch();
});
</script>
