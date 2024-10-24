<template>
  <div class="rounded p-3 shadow">
    <FTextEditor
      ref="e"
      v-bind="$attrs"
      editor-class="prose-f max-h-64 max-w-none overflow-auto my-4 min-h-[5rem]"
      bubble-menu
      :content="modelValue"
      @change="$emit('update:modelValue', $event)"
    >
      <template #top>
        <span class="text-base">
          <span class="flex items-center justify-between">
            <UserAvatar
              :name="authStore.userName"
              :image="authStore.userImage"
              expand
              strong
            />
            <slot name="top-right" />
          </span>
          <slot name="top-bottom" />
        </span>
      </template>
      <template #bottom>
        <div class="flex flex-col gap-2">
          <slot name="bottom-top" />
          <div
            class="flex flex-col space-y-1.5 overflow-auto sm:flex-row sm:justify-between"
          >
            <div class="flex items-center gap-1">
              <TextEditorFixedMenu :buttons="fixedMenu" />
              <slot name="bottom-left" />
            </div>
            <div class="flex items-center gap-2">
              <Button
                :label="__('Discard')"
                theme="gray"
                variant="subtle"
                @click="
                  () => {
                    editor.commands.clearContent(true);
                    $emit('clear');
                  }
                "
              />
              <slot name="bottom-right" />
            </div>
          </div>
        </div>
      </template>
    </FTextEditor>
  </div>
</template>
<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { TextEditor as FTextEditor, TextEditorFixedMenu } from "frappe-ui";
import { useAuthStore } from "@/stores/auth";
import { UserAvatar } from "@/components";

interface P {
  modelValue: string;
  autofocus?: boolean;
}

interface E {
  (event: "clear"): void;
  (event: "update:modelValue"): string;
}

const props = withDefaults(defineProps<P>(), {
  autofocus: false,
});

defineEmits<E>();

const e = ref(null);
const editor = computed(() => e.value.editor);
const authStore = useAuthStore();
const fixedMenu = [
  __("Paragraph"),
  [__("Heading 2"), __("Heading 3"), __("Heading 4"), __("Heading 5")],
  __("Bullet List"),
  __("Numbered List"),
  __("Image"),
  __("Video"),
  __("Link"),
  __("Blockquote"),
  __("Code"),
];

defineExpose({
  editor,
});

if (props.autofocus) {
  nextTick(() => e.value.editor.commands.focus());
}
</script>
