<template>
  <div
    class="mb-4 mt-8 flex h-8 items-center justify-between text-xl font-semibold text-gray-800 md:mx-5 md:my-8"
  >
    {{ __("Activity") }}
  </div>
  <div class="grow overflow-auto px-5 pb-20">
    <div
      v-for="c in allCommunications"
      :id="c.name"
      :key="c.name"
      class="items-between relative mt-4 flex justify-center gap-4"
    >
      <div
        class="activity grid w-full grid-cols-[30px_minmax(auto,_1fr)] gap-2 sm:gap-4"
      >
        <div
          class="relative flex justify-center after:absolute after:left-[50%] after:top-[12%] after:-z-10 after:h-full after:border-l after:border-gray-200"
        >
          <Avatar
            size="lg"
            :label="c.user.name"
            :image="c.user.image"
            class="relative mt-1"
          />
        </div>
        <TicketCommunication
          :content="c.content"
          :date="c.creation"
          :user="c.user"
          :sender-image="c.sender"
          :cc="c.cc || ''"
          :bcc="c.bcc || ''"
          :attachments="c.attachments"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import { useElementVisibility } from "@vueuse/core";
import { Avatar } from "frappe-ui";
import { orderBy } from "lodash";
import { dayjs } from "@/dayjs";
import TicketCommunication from "./TicketCommunication.vue";
import { ITicket } from "./symbols";

interface P {
  focus?: string;
}

const props = withDefaults(defineProps<P>(), {
  focus: "",
});
const route = useRoute();
const ticket = inject(ITicket);
const allCommunications = computed(() => {
  const combined = [
    ...(ticket.data.communications || []),
    ...(ticket.data.comments || []),
  ];

  return orderBy(combined, (c) => dayjs(c.creation));
});

function scroll(id: string) {
  const e = document.getElementById(id);
  if (!useElementVisibility(e).value) {
    e.scrollIntoView({ behavior: "smooth" });
    e.focus();
  }
}

watch(
  () => props.focus,
  (id: string) => scroll(id)
);
nextTick(() => {
  const hash = route.hash.slice(1);
  const id = hash || communications.value.slice(-1).pop()?.name;
  if (id) setTimeout(() => scroll(id), 1000);
});
</script>
