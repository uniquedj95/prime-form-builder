<template>
  <div class="slider-container" :class="{ loading: isLoading }" v-tooltip="model.tooltip">
    <InputLabel :model="model" class="mb-4" />
    <small v-if="model.error" class="p-error" style="display: block; margin-bottom: 0.5rem">{{
      model.error
    }}</small>

    <Slider
      :id="model.id"
      ref="inputRef"
      class="mt-4"
      v-model="input"
      :min="typeof model.min === 'number' ? model.min : 0"
      :max="typeof model.max === 'number' ? model.max : 100"
      :step="model.step || 1"
      :range="model.range"
      :orientation="model.orientation || 'horizontal'"
      :disabled="model.disabled || isLoading"
      :class="[model.className, { 'p-invalid': model.error }]"
      @focus="onFocus"
      @change="onValueUpdate"
      @blur="onValueUpdate"
    />
  </div>
</template>

<script lang="ts" setup>
import Slider from 'primevue/slider';
import InputLabel from '../shared/InputLabel.vue';
import { FormField, FormSchema } from '@/types';
import { ComponentPublicInstance, computed, PropType, ref, watch } from 'vue';
import { useInputValidation } from '@/composables/useInputValidation';
import { useFormFieldValue } from '@/composables/useFormFieldValue';

const props = defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<ComponentPublicInstance | null>(null);
const schema = computed(() => props.schema);

// Use form field value resolution
const { resolvedValue, isLoading, error: valueError } = useFormFieldValue(model);

// Initialize input with resolved value - can be single number or array for range
const input = ref<number | number[]>(0);

// Watch for resolved value changes and update input
watch(
  resolvedValue,
  newValue => {
    if (newValue !== undefined && newValue !== null) {
      if (model.value.range) {
        // For range sliders, expect array
        input.value = Array.isArray(newValue)
          ? newValue.map(v => Number(v) || 0)
          : [0, Number(newValue) || 0];
      } else {
        // For single sliders, expect number
        input.value = Number(newValue) || 0;
      }
    } else {
      input.value = model.value.range ? [0, 0] : 0;
    }
  },
  { immediate: true }
);

// Use input validation composable
const { isValid, onValueUpdate, onFocus, onReset, getErrors } = useInputValidation(
  inputRef,
  model,
  input,
  schema
);

// Enhanced getErrors to include value resolution errors
const getErrorsWithValueErrors = () => {
  const validationErrors = getErrors();
  if (valueError.value) {
    return [...validationErrors, valueError.value];
  }
  return validationErrors;
};

defineExpose({
  onReset,
  onValueUpdate,
  getErrors: getErrorsWithValueErrors,
  isValid,
  isLoading,
  valueError,
});
</script>

<style scoped>
.slider-container {
  width: 100%;
}

.slider-container.loading {
  opacity: 0.8;
}
</style>
