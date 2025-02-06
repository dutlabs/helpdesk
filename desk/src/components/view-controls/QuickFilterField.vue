<template>
  <FormControl
    v-if="filter.type == 'Check'"
    v-model="filter.value"
    :label="filter.label"
    type="checkbox"
    @change.stop="updateFilter(filter, $event.target.checked)"
  />
  <FormControl
    v-else-if="filter.type === 'Select'"
    v-model="filter.value"
    class="form-control cursor-pointer [&_select]:cursor-pointer"
    type="select"
    :options="filter.options"
    :placeholder="filter.label"
    @change.stop="updateFilter(filter, $event.target.value)"
  />
  <Link
    v-else-if="filter.type === 'Link'"
    :value="filter.value"
    :doctype="filter.options"
    :placeholder="filter.label"
    @change="(data) => updateFilter(filter, data)"
  />
  <component
    :is="filter.type === 'Date' ? DatePicker : DateTimePicker"
    v-else-if="['Date', 'Datetime'].includes(filter.type)"
    class="border-none"
    :value="filter.value"
    :placeholder="filter.label"
    @change="(v) => updateFilter(filter, v)"
  />
  <TextInput
    v-else
    v-model="filter.value"
    type="text"
    :placeholder="filter.label"
    @input.stop="debouncedFn(filter, $event.target.value)"
  />
</template>
<script setup>
import { TextInput, FormControl, DatePicker, DateTimePicker } from "frappe-ui";
import { Link } from "@/components";
import { useDebounceFn } from "@vueuse/core";

const props = defineProps({
  filter: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["applyQuickFilter"]);

const debouncedFn = useDebounceFn((f, value) => {
  emit("applyQuickFilter", f, value);
}, 500);

function updateFilter(f, value) {
  emit("applyQuickFilter", f, value);
}
</script>
