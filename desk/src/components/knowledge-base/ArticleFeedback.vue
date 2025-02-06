<template>
  <div class="mb-8 flex items-center justify-between rounded-lg bg-gray-50 p-4">
    <!-- Feedback Section -->
    <div>
      <!-- was this article helpful? -->
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-800">
          {{ __("Did this article solve your issue?") }}
        </span>
        <div class="flex items-center gap-1">
          <component
            :is="_feedback === 1 ? ThumbsUpFilledIcon : ThumbsUpIcon"
            class="h-4 w-4 cursor-pointer"
            @click="handleFeedbackClick(1)"
          />
          <component
            :is="_feedback === 2 ? ThumbsDownFilledIcon : ThumbsDownIcon"
            class="h-4 w-4 cursor-pointer"
            @click="handleFeedbackClick(2)"
          />
        </div>
      </div>
    </div>
    <!-- Create a ticket CTA -->
    <div class="flex items-center justify-center gap-2">
      <span class="text-sm font-normal">
        {{ __("Can’t find what you’re looking for?") }}
      </span>
      <router-link :to="{ name: 'TicketNew' }">
        <p class="font-base text-sm underline">
          {{ __("Create a ticket") }} &rightarrow;
        </p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FeedbackAction } from "@/types";
import {
  ThumbsUpIcon,
  ThumbsUpFilledIcon,
  ThumbsDownIcon,
  ThumbsDownFilledIcon,
} from "@/components/icons";
import { setFeedback } from "@/stores/knowledgeBase";
import { ref } from "vue";

interface P {
  feedback: FeedbackAction;
  articleId: string;
}

const props = withDefaults(defineProps<P>(), {
  feedback: 0,
});

const _feedback = ref(props.feedback);

function handleFeedbackClick(action: FeedbackAction) {
  _feedback.value = action;
  if (action === props.feedback) return;
  setFeedback.submit({ articleId: props.articleId, action });
}
</script>

<style scoped></style>
