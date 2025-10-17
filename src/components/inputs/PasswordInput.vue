<template>
  <div class="input-container" :class="{ loading: isLoading }">
    <IftaLabel v-if="model.label">
      <Password
        :id="model.id"
        ref="inputRef"
        v-model="input"
        :class="[model.className, { 'p-invalid': model.error }]"
        :required="model.required"
        :autofocus="model.autoFocus"
        :placeholder="isLoading ? 'Loading...' : model.placeholder"
        :disabled="model.disabled || isLoading"
        :maxlength="model.maxLength"
        :minlength="model.minLength"
        fluid
        toggleMask
        :feedback="false"
        @focus="onFocus"
        @change="onValueUpdate"
        @blur="onValueUpdate"
      />
      <InputLabel :model="model" />
    </IftaLabel>
    <Password
      v-else
      :id="model.id"
      ref="inputRef"
      v-model="input"
      :class="[model.className, { 'p-invalid': model.error }]"
      :required="model.required"
      :autofocus="model.autoFocus"
      :placeholder="isLoading ? 'Loading...' : model.placeholder"
      :disabled="model.disabled || isLoading"
      :maxlength="model.maxLength"
      :minlength="model.minLength"
      fluid
      toggleMask
      :feedback="false"
      @focus="onFocus"
      @change="onValueUpdate"
      @blur="onValueUpdate"
    />
    <small v-if="model.error" class="p-error">{{ model.error }}</small>
    <small v-if="model.counter && model.maxLength" class="counter-text">
      {{ input.length }} / {{ model.maxLength }}
    </small>
  </div>
</template>

<script lang="ts" setup>
import Password from 'primevue/password';
import IftaLabel from 'primevue/iftalabel';
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
.input-container {
  width: 100%;
}

.input-container.loading {
  opacity: 0.8;
}

.counter-text {
  display: block;
  text-align: right;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
