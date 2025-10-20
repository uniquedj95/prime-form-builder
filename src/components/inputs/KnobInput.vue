<template>
  <div class="knob-container" :class="{ loading: isLoading }">
    <Knob
      :id="model.id"
      ref="inputRef"
      v-model="input"
      :min="typeof model.min === 'number' ? model.min : 0"
      :max="typeof model.max === 'number' ? model.max : 100"
      :step="model.step || 1"
      :size="model.size || 100"
      :disabled="model.disabled || isLoading"
      :valueColor="model.valueColor"
      :rangeColor="model.rangeColor"
      :class="[model.className, { 'p-invalid': model.error }]"
      @focus="onFocus"
      @change="onValueUpdate"
      @blur="onValueUpdate"
    />
    <InputLabel :model="model" class="mt-4" />
    <small v-if="model.error" class="p-error" style="display: block; margin-bottom: 0.5rem">
      {{ model.error }}
    </small>
  </div>
</template>

<script lang="ts" setup>
import Knob from 'primevue/knob';
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

// Initialize input with resolved value
const input = ref<number>(0);

// Watch for resolved value changes and update input
watch(
  resolvedValue,
  newValue => {
    if (newValue !== undefined && newValue !== null) {
      input.value = Number(newValue) || 0;
    } else {
      input.value = 0;
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
.knob-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.knob-container.loading {
  opacity: 0.8;
}
</style>
