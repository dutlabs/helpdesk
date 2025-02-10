<template>
  <RouterView class="antialiased" />
  <Toasts />
  <KeymapDialog />
  <Dialogs />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { createToast } from "@/utils";
import { useConfigStore } from "@/stores/config";
import KeymapDialog from "@/pages/KeymapDialog.vue";
import { stopSession } from "@/telemetry";
import { Dialogs, Toasts } from "frappe-ui";
useConfigStore();

onMounted(() => {
  window.addEventListener("online", () => {
    createToast({
      title: __("You are now online"),
      icon: "wifi",
      iconClasses: "stroke-green-600",
    });
  });

  window.addEventListener("offline", () => {
    createToast({
      title: __("You are now offline"),
      icon: "wifi-off",
      iconClasses: "stroke-red-600",
    });
  });
});

onUnmounted(() => {
  stopSession();
});
</script>
