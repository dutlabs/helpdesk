<template>
  <div class="w-full items-center overflow-scroll p-5 px-10 pb-10">
    <LayoutHeader>
      <template #left-header>
        <div class="text-lg font-medium text-gray-900">
          {{ __("Knowledge Base") }}
        </div>
      </template>
    </LayoutHeader>
    <div
      class="flex w-full max-w-4xl flex-col gap-4 pt-4 sm:px-5 2xl:max-w-5xl"
    >
      <Popover
        :popover-class="['max-w-[310px] md:max-w-[842px] !top-1 ']"
        class="flex w-full"
      >
        <template #target="{ open, close }">
          <FormControl
            ref="searchInputRef"
            v-model="query"
            type="text"
            class="w-full border-inherit shadow-none outline-none focus:outline-none"
            :placeholder="__('Ask a question...')"
            size="md"
            autofocus
            autocomplete="off"
            @update:model-value="
              (e:string) => {
                if (e.length >= 3) {
                  open();
                } else {
                  close();
                }
              }
            "
          >
            <template #prefix>
              <Icon icon="lucide:search" class="h-4 w-4 text-gray-500" />
            </template>
          </FormControl>
        </template>
        <template #body-main>
          <!-- Searched Articles -->
          <div
            class="flex max-h-[320px] flex-col overflow-scroll md:max-h-[420px]"
          >
            <SearchArticles
              :query="query"
              :hide-view-all="true"
              class="border-0 p-3 py-2"
            />
          </div>
        </template>
      </Popover>

      <!-- Categories Folder -->
      <section class="flex flex-col gap-3">
        <!-- Heading -->
        <p class="text-lg text-gray-900">{{ __("Categories") }}</p>
        <CategoryFolderContainer />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { FormControl, usePageMeta, Popover } from "frappe-ui";
import { Icon } from "@iconify/vue";
import { LayoutHeader } from "@/components";
import CategoryFolderContainer from "@/components/knowledge-base/CategoryFolderContainer.vue";
import SearchArticles from "../../components/SearchArticles.vue";
import { capture } from "@/telemetry";

const query = ref("");
const searchInputRef = ref(null);

onMounted(() => {
  capture("kb_customer_page_viewed");
});
usePageMeta(() => {
  return {
    title: __("Knowledge Base"),
  };
});
</script>
