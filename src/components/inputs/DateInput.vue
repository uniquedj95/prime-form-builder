<template>
  <div class="date-input-container">
    <IftaLabel v-if="model.label">
      <DatePicker
        :id="model.id"
        ref="datePickerRef"
        v-model="dateValue"
        :class="[model.className, { 'p-invalid': model.error }]"
        :placeholder="model.placeholder"
        :disabled="model.disabled"
        :required="model.required"
        :showIcon="true"
        :fluid="true"
        :showOnFocus="false"
        :showTime="!!model.enableTime"
        @update:modelValue="handleDateChange"
      />
      <label :for="model.id">{{ model.label }}</label>
    </IftaLabel>
    <DatePicker
      v-else
      :id="model.id"
      ref="datePickerRef"
      v-model="dateValue"
      :class="[model.className, { 'p-invalid': model.error }]"
      :placeholder="model.placeholder"
      :disabled="model.disabled"
      :required="model.required"
      :showIcon="true"
      :fluid="true"
      :showOnFocus="false"
      :showTime="!!model.enableTime"
      @update:modelValue="handleDateChange"
    />
    <small v-if="model.error" class="p-error">{{ model.error }}</small>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, PropType } from 'vue';
import DatePicker from 'primevue/datepicker';
import IftaLabel from 'primevue/iftalabel';
import { FormField, FormSchema } from '@/types';

defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const datePickerRef = ref<any>(null);
const dateValue = ref<Date | null>(null);

// Parse string dates to Date objects for DatePicker
watch(
  () => model.value.value,
  newValue => {
    if (typeof newValue === 'string' && newValue) {
      dateValue.value = new Date(newValue);
    } else if (newValue instanceof Date) {
      dateValue.value = newValue;
    } else {
      dateValue.value = null;
    }
  },
  { immediate: true }
);

function handleDateChange(date: Date | Date[] | (Date | null)[] | null | undefined) {
  if (date instanceof Date) {
    model.value.value = date.toISOString();
  } else {
    model.value.value = '';
  }
  model.value.error = '';
}

function onValueUpdate() {
  // Trigger validation if needed
}

function onReset() {
  model.value.error = '';
  dateValue.value = null;
  model.value.value = '';
}

defineExpose({
  onValueUpdate,
  onReset,
  getErrors: () => (model.value.error ? [model.value.error] : []),
});
</script>

<style scoped>
/* Minimal overrides - use PrimeVue defaults */
.date-input-container {
  width: 100%;
}
</style>
