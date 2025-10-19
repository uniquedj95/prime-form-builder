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
        :showOnFocus="true"
        :showTime="!!model.enableTime"
        :timeOnly="!!model.timeOnly"
        :hourFormat="model.hourFormat || '24'"
        :showButtonBar="shouldShowButtonBar"
        :view="model.view || 'date'"
        :dateFormat="model.dateFormat"
        :selectionMode="model.selectionMode || 'single'"
        :minDate="model.min ? new Date(model.min) : undefined"
        :maxDate="model.max ? new Date(model.max) : undefined"
        :disabledDates="model.disabledDates"
        :disabledDays="model.disabledDays"
        :inline="!!model.inline"
        @update:modelValue="handleDateChange"
      >
        <!-- Simple Button Bar with Today button only -->
        <template v-if="shouldShowButtonBar" #buttonbar="{ todayCallback }">
          <div class="flex justify-center w-full">
            <Button
              size="small"
              :label="model.todayButtonLabel || 'Today'"
              @click="todayCallback"
              variant="outlined"
            />
          </div>
        </template>
      </DatePicker>
      <InputLabel :model="model" />
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
      :showOnFocus="true"
      :showTime="!!model.enableTime"
      :timeOnly="!!model.timeOnly"
      :hourFormat="model.hourFormat || '24'"
      :showButtonBar="shouldShowButtonBar"
      :view="model.view || 'date'"
      :dateFormat="model.dateFormat"
      :selectionMode="model.selectionMode || 'single'"
      :minDate="model.min ? new Date(model.min) : undefined"
      :maxDate="model.max ? new Date(model.max) : undefined"
      :disabledDates="model.disabledDates"
      :disabledDays="model.disabledDays"
      :inline="!!model.inline"
      @update:modelValue="handleDateChange"
    >
      <!-- Simple Button Bar with Today button only -->
      <template v-if="shouldShowButtonBar" #buttonbar="{ todayCallback }">
        <div class="flex justify-center w-full">
          <Button
            size="small"
            :label="model.todayButtonLabel || 'Today'"
            @click="todayCallback"
            variant="outlined"
          />
        </div>
      </template>
    </DatePicker>
    <small v-if="model.error" class="p-error">{{ model.error }}</small>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, PropType } from 'vue';
import DatePicker from 'primevue/datepicker';
import IftaLabel from 'primevue/iftalabel';
import Button from 'primevue/button';
import InputLabel from '../shared/InputLabel.vue';
import { FormField, FormSchema } from '@/types';

defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const datePickerRef = ref<any>(null);
const dateValue = ref<Date | Date[] | null>(null);

// Compute whether to show button bar automatically
const shouldShowButtonBar = computed(() => {
  // Show button bar for time-only or non-date views (month/year) to provide "today" functionality
  return model.value.timeOnly || (model.value.view && model.value.view !== 'date');
});

// Parse string dates to Date objects for DatePicker
watch(
  () => model.value.value,
  newValue => {
    if (typeof newValue === 'string' && newValue) {
      // Handle different date formats
      const parsedDate = new Date(newValue);
      if (!Number.isNaN(parsedDate.getTime())) {
        dateValue.value = parsedDate;
      }
    } else if (newValue instanceof Date) {
      dateValue.value = newValue;
    } else if (Array.isArray(newValue)) {
      // Handle multiple dates or date ranges (for string arrays)
      const dates = newValue
        .map(item => {
          if (typeof item === 'string') {
            const parsed = new Date(item);
            return Number.isNaN(parsed.getTime()) ? null : parsed;
          }
          return item instanceof Date ? item : null;
        })
        .filter((date): date is Date => date !== null);
      dateValue.value = dates;
    } else {
      dateValue.value = null;
    }
  },
  { immediate: true }
);

function handleDateChange(date: Date | Date[] | (Date | null)[] | null | undefined) {
  if (date instanceof Date) {
    // Single date selection
    if (model.value.timeOnly) {
      // For time-only, format as time string
      model.value.value = date.toTimeString().split(' ')[0];
    } else {
      model.value.value = date.toISOString();
    }
  } else if (Array.isArray(date)) {
    // Multiple dates or date range
    const validDates = date.filter((d): d is Date => d instanceof Date && d !== null);
    if (validDates.length > 0) {
      model.value.value = validDates.map(d => d!.toISOString()) as any;
    } else {
      model.value.value = [];
    }
  } else {
    // Clear value
    model.value.value =
      model.value.selectionMode === 'multiple' || model.value.selectionMode === 'range' ? [] : '';
  }
  model.value.error = '';
}

function onValueUpdate() {
  // Trigger validation if needed
}

function onReset() {
  model.value.error = '';
  dateValue.value = null;
  model.value.value =
    model.value.selectionMode === 'multiple' || model.value.selectionMode === 'range' ? [] : '';
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
