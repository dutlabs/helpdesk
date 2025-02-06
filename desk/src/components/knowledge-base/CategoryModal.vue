<template>
  <Dialog
    v-model="showDialog"
    :options="{ title: dialogTitle, actions: getActionButton() }"
  >
    <template #body-content>
      <div class="flex flex-1 flex-col gap-3">
        <textarea
          ref="titleRef"
          v-model="newTitle"
          class="bg-surface-gray-2 placeholder:text-ink-gray-4 hover:border-outline-gray-modals hover:bg-surface-gray-3 focus:bg-surface-white focus:border-outline-gray-4 focus-visible:ring-outline-gray-3 text-ink-gray-8 block w-full rounded border border-[--surface-gray-2] py-1.5 px-2 text-base transition-colors focus:shadow-sm focus:ring-0 focus-visible:ring-2"
          :placeholder="__('Support Issues')"
          :rows="1"
          maxlength="50"
          autofocus
          @input="(e: Event) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = `${target.scrollHeight}px`;
          }"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Dialog } from "frappe-ui";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  edit: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update", "create"]);

const showDialog = defineModel<boolean>();
const newTitle = defineModel<string>("title");

const dialogTitle = computed(() =>
  props.edit ? __("Edit Category") : __("Create Category")
);

const titleRef = ref(null);
watch(
  () => titleRef.value,
  (newVal) => {
    if (!newVal) return;
    titleRef.value.style.height =
      newVal.scrollHeight > newVal.clientHeight
        ? newVal.scrollHeight + "px"
        : newVal.scrollHeight + "px";
  }
);

function getActionButton() {
  const action = [];
  if (props.edit) {
    action.push({
      label: __("Save"),
      variant: "solid",
      onClick: () => {
        emit("update");
      },
    });
  } else {
    action.push({
      label: __("Create"),
      variant: "solid",
      onClick: () => {
        emit("create");
      },
    });
  }
  return action;
}
</script>
