<template>
  <div
    class="flex cursor-pointer items-center justify-between border-b border-gray-200 p-2"
  >
    <!-- avatar and name -->
    <div class="flex items-center justify-between gap-2">
      <EmailProviderIcon :logo="emailIcon[emailAccount.service]" />
      <div>
        <p class="font-semibold text-gray-700">
          {{ emailAccount.email_account_name }}
        </p>
        <div class="text-sm text-gray-500">{{ emailAccount.email_id }}</div>
      </div>
    </div>
    <div>
      <Badge
        variant="subtle"
        :label="badgeTitleColor[0]"
        :theme="badgeTitleColor[1]"
      />
    </div>
    <!-- email id -->
  </div>
</template>

<script setup lang="ts">
import { EmailAccount } from "@/types";
import { emailIcon } from "./emailConfig";
import EmailProviderIcon from "./EmailProviderIcon.vue";
import { computed } from "vue";

interface P {
  emailAccount: EmailAccount;
}

const props = defineProps<P>();

const badgeTitleColor = computed(() => {
  if (
    props.emailAccount.default_incoming &&
    props.emailAccount.default_outgoing
  ) {
    const color =
      props.emailAccount.enable_incoming && props.emailAccount.enable_outgoing
        ? "blue"
        : "gray";
    return [__("Default Sending and Inbox"), color];
  } else if (props.emailAccount.default_incoming) {
    const color = props.emailAccount.enable_incoming ? "blue" : "gray";
    return [__("Default Inbox"), color];
  } else if (props.emailAccount.default_outgoing) {
    const color = props.emailAccount.enable_outgoing ? "blue" : "gray";
    return [__("Default Sending"), color];
  } else {
    const color = props.emailAccount.enable_incoming ? "blue" : "gray";
    return [__("Inbox"), color];
  }
});
</script>

<style scoped></style>
