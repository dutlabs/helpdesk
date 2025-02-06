<template>
  <Teleport v-if="showHeader" to="#app-header">
    <slot>
      <header class="h-10.5 mx-4 flex items-center justify-between md:mr-0">
        <div class="flex max-w-[50%] items-center gap-2">
          <slot name="left-header" />
        </div>
        <div class="flex items-center gap-2">
          <slot name="right-header" class="flex items-center gap-2" />
        </div>
      </header>
    </slot>
  </Teleport>
</template>
<script setup>
import { ref, nextTick } from "vue";
const showHeader = ref(false);

nextTick(() => {
  showHeader.value = true;
});
</script>
