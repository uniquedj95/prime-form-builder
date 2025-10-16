<template>
  <div class="input-container" :class="{ loading: isLoading }">
    <InputLabel :model="model" />
    <span class="p-input-icon-left p-input-icon-right" style="width: 100%">
      <i v-if="model.prefix" class="prefix-text">{{ model.prefix }}</i>
      <InputText
        ref="inputRef"
        v-model="input"
        v-maskito="maskitoOptions"
        :class="[model.className, { 'p-invalid': model.error }]"
        :type="type === 'password' ? (showPassword ? 'text' : 'password') : (type ?? 'text')"
        :required="model.required"
        :autofocus="model.autoFocus"
        :placeholder="isLoading ? 'Loading...' : (maskitoOptions?.placeholder ?? model.placeholder)"
        :disabled="model.disabled || isLoading"
        :min="model.min"
        :max="model.max"
        :maxlength="model.maxLength"
        :minlength="model.minLength"
        :pattern="model.pattern"
        style="width: 100%"
        @focus="onFocus"
        @change="onValueUpdate"
        @blur="onValueUpdate"
      />
      <i
        v-if="type === 'password'"
        :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
        class="password-toggle"
        @click="showPassword = !showPassword"
      ></i>
      <i v-if="model.suffix" class="suffix-text">{{ model.suffix }}</i>
      <i v-if="isLoading" class="pi pi-spin pi-spinner loading-spinner"></i>
      <i v-if="input && !isLoading" class="pi pi-times clear-icon" @click="handleClear"></i>
    </span>
    <small v-if="model.error" class="p-error">{{ model.error }}</small>
    <small v-if="model.counter && model.maxLength" class="counter-text">
      {{ input.length }} / {{ model.maxLength }}
    </small>
  </div>
</template>

<script lang="ts" setup>
import InputText from 'primevue/inputtext';
import { FormField, FormSchema, BaseFieldTypes } from '@/types';
import { generateMaskitoOptions } from '@/utils';
import { ComponentPublicInstance, computed, PropType, ref, watch } from 'vue';
import { useInputValidation } from '@/composables/useInputValidation';
import { useFormFieldValue } from '@/composables/useFormFieldValue';
import InputLabel from '../shared/InputLabel.vue';

const props = defineProps<{ schema?: FormSchema; type?: BaseFieldTypes }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<ComponentPublicInstance | null>(null);
const schema = computed(() => props.schema);
const showPassword = ref(false);

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
const { isValid, onValueUpdate, onFocus, onReset, getErrors } = useInputValidation(
  inputRef,
  model,
  input,
  schema
);

const maskitoOptions = computed(() => {
  if (model.value.pattern) return generateMaskitoOptions(model.value.pattern);
  return undefined;
});

const handleClear = () => {
  input.value = '';
  onValueUpdate();
};

// Enhanced getErrors to include value resolution errors
const getErrorsWithValueErrors = () => {
  const validationErrors = getErrors();
  if (valueError.value) {
    return [...validationErrors, valueError.value];
  }
  return validationErrors;
};

defineExpose({
  onValueUpdate,
  onReset,
  getErrors: getErrorsWithValueErrors,
  isValid,
  isLoading,
  valueError,
});
</script>

<style scoped>
/* Minimal overrides - use PrimeVue defaults */
.input-container {
  width: 100%;
}

.input-container.loading {
  opacity: 0.8;
}

.password-toggle,
.clear-icon {
  cursor: pointer;
}

.counter-text {
  display: block;
  text-align: right;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
