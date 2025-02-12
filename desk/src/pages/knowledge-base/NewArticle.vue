<template>
  <div class="flex flex-1 flex-col">
    <LayoutHeader>
      <template #left-header>
        <Breadcrumbs :items="breadcrumbs" />
      </template>
      <template #right-header> </template>
    </LayoutHeader>
    <div class="mx-auto w-full max-w-4xl px-5 pt-6">
      <div class="flex w-full flex-col gap-3 rounded-lg border p-4">
        <div class="mb-3 flex items-center justify-between">
          <!-- Author Info -->
          <div
            class="mr-7 flex max-w-fit flex-1 items-center gap-1 overflow-hidden"
          >
            <UserAvatar :name="user.name" :expand="true" />
            <span>{{ __("in") }}</span>
            <Link
              v-model="categoryId"
              class="form-control"
              doctype="HD Article Category"
              placeholder="Select Category"
              :page-length="100"
              :hide-clear-button="true"
            />
          </div>
          <!-- Action Buttons -->
          <div class="flex gap-2">
            <Button :label="__('Discard')" @click="handleArticleDiscard" />
            <Button
              :label="__('Create')"
              variant="solid"
              @click="handleCreateArticle"
            />
          </div>
        </div>
        <!-- Title -->
        <textarea
          v-model="title"
          class="placeholder:text-ink-gray-3 w-full resize-none border-0 border-b border-gray-200 p-0 pb-3 text-3xl font-bold focus:border-gray-200 focus:ring-0"
          :placeholder="__('Title')"
          rows="1"
          wrap="soft"
          maxlength="140"
          autofocus
          @input="
          (e: Event) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = `${target.scrollHeight}px`;
          }
          "
        />
        <!-- Article Content -->
        <TextEditor
          :content="content"
          :placeholder="__('Write your article here...')"
          editor-class="rounded-b-lg max-w-[unset] prose-sm h-[calc(100vh-340px)] sm:h-[calc(100vh-250px)] overflow-auto"
          @change="content = $event"
        >
          <template #bottom>
            <TextEditorFixedMenu
              class="-ml-1 w-full overflow-x-auto"
              :buttons="textEditorMenuButtons"
            />
          </template>
        </TextEditor>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  usePageMeta,
  TextEditor,
  TextEditorFixedMenu,
  confirmDialog,
  Breadcrumbs,
} from "frappe-ui";
import { useRouter, useRoute } from "vue-router";
import { newArticle } from "@/stores/knowledgeBase";
import { useUserStore } from "@/stores/user";
import { LayoutHeader, UserAvatar } from "@/components";
import { createToast, textEditorMenuButtons } from "@/utils";
import { Article } from "@/types";

const userStore = useUserStore();
const user = userStore.getUser();
const router = useRouter();
const route = useRoute();

const title = ref("");
const content = ref("");

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const categoryId = ref(props.id || null);
const categoryName = computed(() => (route.query.title as string) || "");

function handleCreateArticle() {
  newArticle.submit(
    { title: title.value, content: content.value, category: categoryId.value },
    {
      onSuccess: (article: Article) => {
        createToast({
          title: __("Article created successfully"),
          icon: "check",
          iconClasses: "text-green-600",
        });
        resetState();
        router.push({
          name: "Article",
          params: {
            articleId: article.name,
          },
        });
      },
      onError: (error: string) => {
        createToast({
          title: error,
          icon: "x",
          iconClasses: "text-red-600",
        });
      },
    }
  );
}
function handleArticleDiscard() {
  if (!title.value && !content.value) {
    router.push({
      name: "AgentKnowledgeBase",
    });
    return;
  }
  confirmDialog({
    title: __("Discard Article"),
    message: __("Are you sure you want to discard this article?"),
    onConfirm: ({ hideDialog }: { hideDialog: Function }) => {
      router.push({
        name: "AgentKnowledgeBase",
      });
      resetState();
      hideDialog();
    },
  });
}

function resetState() {
  title.value = "";
  content.value = "";
}

const breadcrumbs = computed(() => {
  const options: Array<{ label: string; route?: { name: string } }> = [
    {
      label: __("Knowledge Base"),
      route: { name: "AgentKnowledgeBase" },
    },
  ];
  if (categoryName.value) {
    options.push({
      label: categoryName.value,
      route: { name: "AgentKnowledgeBase" },
    });
  }
  options.push({
    label: __("New Article"),
  });
  return options;
});

usePageMeta(() => {
  return {
    title: __("New Article"),
  };
});
</script>
