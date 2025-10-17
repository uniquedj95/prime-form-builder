<template>
  <div class="textarea-container" :class="{ loading: isLoading }">
    <IftaLabel v-if="model.label">
      <Textarea
        :id="model.id"
        ref="inputRef"
        v-model="input"
        :class="[model.className, { 'p-invalid': model.error }]"
        :required="model.required"
        :autofocus="model.autoFocus"
        :placeholder="isLoading ? 'Loading...' : model.placeholder"
        :disabled="model.disabled || isLoading"
        :rows="model.rows ?? 3"
        :cols="model.cols"
        :autoResize="model.autoGrow"
        :maxlength="model.maxLength"
        :minlength="model.minLength"
        fluid
        @focus="onFocus"
        @input="onValueUpdate"
        @blur="onValueUpdate"
      />
      <InputLabel :model="model" />
    </IftaLabel>
    <Textarea
      v-else
      :id="model.id"
      ref="inputRef"
      v-model="input"
      :class="[model.className, { 'p-invalid': model.error }]"
      :required="model.required"
      :autofocus="model.autoFocus"
      :placeholder="isLoading ? 'Loading...' : model.placeholder"
      :disabled="model.disabled || isLoading"
      :rows="model.rows ?? 3"
      :cols="model.cols"
      :autoResize="model.autoGrow"
      :maxlength="model.maxLength"
      :minlength="model.minLength"
      fluid
      @focus="onFocus"
      @input="onValueUpdate"
      @blur="onValueUpdate"
    />
    <small v-if="model.error" class="p-error">{{ model.error }}</small>
    <small v-if="model.counter && model.maxLength" class="counter-text">
      {{ input.length }} / {{ model.maxLength }}
    </small>
    <i v-if="isLoading" class="pi pi-spin pi-spinner loading-spinner"></i>
  </div>
</template>

<script lang="ts" setup>
import Textarea from 'primevue/textarea';
import IftaLabel from 'primevue/iftalabel';
import { FormField, FormSchema } from '@/types';
import { ComponentPublicInstance, PropType, ref, watch, computed } from 'vue';
import { useInputValidation } from '@/composables/useInputValidation';
import { useFormFieldValue } from '@/composables/useFormFieldValue';
import InputLabel from '../shared/InputLabel.vue';

const props = defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<ComponentPublicInstance | null>(null);
const schema = computed(() => props.schema);

// Use form field value resolution
const { resolvedValue, isLoading, error: valueError } = useFormFieldValue(model);

// Initialize input with resolved value
const input = ref<string>('');

// Watch for resolved value changes and update input
watch(
  resolvedValue,
  newValue => {
    if (newValue !== undefined && newValue !== null) {
      input.value = String(newValue);
    } else {
      input.value = '';
    }
  },
  { immediate: true }
);

// Use input validation composable
const { onValueUpdate, onFocus, onReset, getErrors } = useInputValidation(
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
  isLoading,
  valueError,
});
</script>

<style scoped>
/* Minimal overrides - use PrimeVue defaults */
.textarea-container {
  width: 100%;
}

.textarea-container.loading {
  opacity: 0.8;
}

.loading-spinner {
  cursor: wait;
}

.counter-text {
  display: block;
  text-align: right;
  font-size: 0.875rem;
}
</style>
