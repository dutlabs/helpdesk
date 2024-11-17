<template>
  <div class="flex flex-1 flex-col">
    <ActivityHeader :title="title" />
    <div v-if="activities.length">
      <div v-for="(activity, i) in activities" :key="activity.key">
        <!-- single activity -->
        <div
          class="activity grid w-full grid-cols-[30px_minmax(auto,_1fr)] gap-2 px-3 sm:gap-4 sm:px-10"
        >
          <div
            class="relative flex justify-center after:absolute after:left-[50%] after:top-0 after:-z-10 after:border-l after:border-gray-200"
            :class="[i != activities.length - 1 ? 'after:h-full' : 'after:h-4']"
          >
            <div
              class="z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white"
              :class="[
                activity.type === 'comment' ? 'mt-0.5' : '',
                activity.type === 'email' ? 'mt-2' : '',
              ]"
            >
              <Avatar
                v-if="activity.type === 'email'"
                size="md"
                :label="activity.sender?.full_name"
                :image="getUser(activity.sender?.name).user_image"
                class="bg-white"
              />
              <CommentIcon
                v-else-if="activity.type === 'comment'"
                class="text-gray-800"
              />
              <DotIcon v-else class="text-gray-600" />
            </div>
          </div>
          <div class="mb-4 w-full">
            <EmailArea
              v-if="activity.type === 'email'"
              :activity="activity"
              class="py-2 px-3"
              @reply="(e) => emit('email:reply', e)"
            />
            <CommentBox
              v-else-if="activity.type === 'comment'"
              :activity="activity"
              @update="() => emit('update')"
            />
            <HistoryBox v-else :activity="activity" />
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="flex h-full flex-col items-center justify-center gap-3 text-xl font-medium text-gray-500"
    >
      <component :is="emptyTextIcon" class="h-10 w-10" />
      <span>{{ emptyText }}</span>
      <Button
        v-if="title == __('Emails')"
        :label="__('New Email')"
        @click="communicationAreaRef.toggleEmailBox()"
      />
      <Button
        v-else-if="title == __('Comments')"
        :label="__('New Comment')"
        @click="communicationAreaRef.toggleCommentBox()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, inject, h, computed, onMounted, watch } from "vue";
import { useElementVisibility } from "@vueuse/core";
import {
  DotIcon,
  EmailAtIcon,
  CommentIcon,
  EmailIcon,
  ActivityIcon,
} from "@/components/icons";
import { EmailArea, CommentBox, HistoryBox } from "@/components";
import { useUserStore } from "@/stores/user";
import { Avatar } from "frappe-ui";

const props = defineProps({
  activities: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["email:reply", "update"]);

const { getUser } = useUserStore();
const communicationAreaRef: Ref = inject("communicationArea");

// TODO: Check if translating these titles affect behaviour
const emptyText = computed(() => {
  let text = __("No Activities");
  if (props.title == __("Emails")) {
    text = __("No Email Communications");
  } else if (props.title == __("Comments")) {
    text = __("No Comments");
  }
  return text;
});

const emptyTextIcon = computed(() => {
  let icon = ActivityIcon;
  if (props.title == __("Emails")) {
    icon = EmailIcon;
  } else if (props.title == __("Comments")) {
    icon = CommentIcon;
  }
  return h(icon, { class: "text-gray-500" });
});

function scrollToLatestActivity() {
  setTimeout(() => {
    let el;
    let e = document.getElementsByClassName("activity");
    el = e[e.length - 1];
    if (el && !useElementVisibility(el).value) {
      el.scrollIntoView({ behavior: "smooth" });
      el.focus();
    }
  }, 500);
}

defineExpose({
  scrollToLatestActivity,
});

onMounted(() => {
  scrollToLatestActivity();
});

watch(
  () => props.title,
  () => {
    scrollToLatestActivity();
  }
);
</script>
