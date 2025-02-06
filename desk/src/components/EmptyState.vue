<template>
  <div class="flex h-full items-center justify-center">
    <div
      class="text-ink-gray-4 flex flex-col items-center gap-3 text-xl font-medium"
    >
      <!-- Icon -->
      <component :is="icon" v-if="icon" class="h-10 w-10" />
      <!-- title -->
      <span>{{ title }}</span>
      <!-- Button which emits Empty State Action -->
      <Button
        :label="__('Create')"
        variant="subtle"
        @click="emit('emptyStateAction')"
      >
        <template #prefix><FeatherIcon name="plus" class="h-4" /></template>
      </Button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: __("No Data Found"),
  },
  icon: {
    type: String || HTMLElement,
    default: "",
  },
});

const emit = defineEmits(["emptyStateAction"]);
</script>

<style lang="scss" scoped></style>
