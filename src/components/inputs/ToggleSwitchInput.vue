<template>
  <div class="toggle-switch-container" :class="{ loading: isLoading }" v-tooltip="model.tooltip">
    <InputLabel :model="model" class="mr-4" />
    <small v-if="model.error" class="p-error" style="display: block; margin-bottom: 0.5rem">{{
      model.error
    }}</small>

    <ToggleSwitch
      :id="model.id"
      ref="inputRef"
      v-model="input"
      :disabled="model.disabled || isLoading"
      :class="[model.className, { 'p-invalid': model.error }]"
      @focus="onFocus"
      @change="onValueUpdate"
      @blur="onValueUpdate"
    />
  </div>
</template>

<script lang="ts" setup>
import ToggleSwitch from 'primevue/toggleswitch';
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
const input = ref<boolean>(false);

// Watch for resolved value changes and update input
watch(
  resolvedValue,
  newValue => {
    if (newValue !== undefined && newValue !== null) {
      input.value = Boolean(newValue);
    } else {
      input.value = false;
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
.toggle-switch-container {
  width: 100%;
  display: flex;
  align-items: center;
}

.toggle-switch-container.loading {
  opacity: 0.8;
}
</style>
