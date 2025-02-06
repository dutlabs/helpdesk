<template>
  <Dialog v-model="showDialog" :options="{ title: __('Move To'), actions }">
    <template #body-content>
      <div class="flex flex-1 flex-col gap-3">
        <Link
          v-model="category"
          class="form-control"
          doctype="HD Article Category"
          :placeholder="__('Select Category')"
          :label="__('Category')"
          :page-length="100"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Dialog } from "frappe-ui";
import { Link } from "@/components";

const emit = defineEmits(["move"]);
const showDialog = defineModel<boolean>();

const category = ref("");

const actions = [
  {
    label: __("Move"),
    variant: "solid",
    onClick: () => {
      emit("move", category.value);
      category.value = "";
    },
  },
];
</script>
