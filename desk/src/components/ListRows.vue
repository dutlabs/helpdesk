<template>
  <div v-if="showGroupedRows" class="mx-3 h-full overflow-y-auto sm:mx-5">
    <div v-for="group in groupedRows" :key="group.group">
      <ListGroupHeader :group="group">
        <div
          class="text-ink-gray-8 my-2 mr-1 flex w-full items-center justify-between gap-2 text-base font-medium"
        >
          <div class="flex w-full items-center gap-2">
            <component :is="group.icon" v-if="group.icon" />
            <div
              v-if="group.group.label != ''"
              class="flex w-full items-center gap-1"
            >
              <span>{{ group.group.label }}</span>
              <span class="text-ink-gray-5 text-xs"
                >{{
                  group.rows.length +
                  __(" Article") +
                  (group.rows.length > 1 ? "s" : "")
                }}
              </span>
            </div>
          </div>
          <Dropdown v-if="groupByActions.length > 0" :options="actions(group)">
            <Button variant="ghost">
              <template #icon>
                <IconMoreHorizontal class="h-4 w-4" />
              </template>
            </Button>
          </Dropdown>
        </div>
      </ListGroupHeader>
      <ListGroupRows id="list-rows" :group="group" class="!mt-0">
        <ListRow
          v-for="row in group.rows"
          :key="row.name"
          v-slot="{ idx, column, item }"
          :row="row"
          class="row truncate text-base"
        >
          <slot v-bind="{ idx, column, item, row }" />
        </ListRow>
      </ListGroupRows>
    </div>
  </div>
  <ListRows v-else id="list-rows" class="mx-3 sm:mx-5">
    <ListRow
      v-for="row in groupedRows"
      :key="row.name"
      v-slot="{ idx, column, item }"
      :row="row"
      class="truncate text-base"
    >
      <slot v-bind="{ idx, column, item, row }" />
    </ListRow>
  </ListRows>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import {
  ListRows,
  ListRow,
  ListGroupHeader,
  ListGroupRows,
  Dropdown,
  Button,
} from "frappe-ui";

import IconMoreHorizontal from "~icons/lucide/more-horizontal";
const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },
  groupByActions: {
    type: Array,
    default: () => [],
  },
});

const groupedRows = ref(props.rows);

const actions = (group) => {
  let _actions = props.groupByActions.map((action) => {
    return {
      ...action,
      onClick: () => action.onClick(group),
    };
  });
  if (group.group.label == "General") {
    _actions = _actions.filter(
      (action) => action.label === __("Add New Article")
    );
  }
  return _actions;
};

watch(
  () => props.rows,
  (val) => (groupedRows.value = val)
);

let showGroupedRows = computed(() => {
  return props.rows.every(
    (row) => row.group && row.rows && Array.isArray(row.rows)
  );
});
</script>

<style></style>
