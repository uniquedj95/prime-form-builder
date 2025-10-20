<template>
  <div class="rating-container" :class="{ loading: isLoading }">
    <IftaLabel v-if="model.label">
      <Rating
        :id="model.id"
        ref="inputRef"
        v-model="input"
        :stars="model.stars || 5"
        :cancel="model.cancel !== false"
        :disabled="model.disabled || isLoading"
        :class="[model.className, { 'p-invalid': model.error }]"
        @focus="onFocus"
        @change="onValueUpdate"
        @blur="onValueUpdate"
      />
      <InputLabel :model="model" />
    </IftaLabel>

    <Rating
      v-else
      :id="model.id"
      ref="inputRef"
      v-model="input"
      :stars="model.stars || 5"
      :cancel="model.cancel !== false"
      :disabled="model.disabled || isLoading"
      :class="[model.className, { 'p-invalid': model.error }]"
      @focus="onFocus"
      @change="onValueUpdate"
      @blur="onValueUpdate"
    />

    <small v-if="model.error" class="p-error">{{ model.error }}</small>
  </div>
</template>

<script lang="ts" setup>
import Rating from 'primevue/rating';
import IftaLabel from 'primevue/iftalabel';
import { FormField, FormSchema } from '@/types';
import { ComponentPublicInstance, computed, PropType, ref, watch } from 'vue';
import { useInputValidation } from '@/composables/useInputValidation';
import { useFormFieldValue } from '@/composables/useFormFieldValue';
import InputLabel from '@/components/shared/InputLabel.vue';

const props = defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<ComponentPublicInstance | null>(null);
const schema = computed(() => props.schema);

// Use form field value resolution
const { resolvedValue, isLoading, error: valueError } = useFormFieldValue(model);

// Initialize input with resolved value
const input = ref<number | undefined>(undefined);

// Watch for resolved value changes and update input
watch(
  resolvedValue,
  newValue => {
    if (newValue !== undefined && newValue !== null) {
      input.value = Number(newValue) || undefined;
    } else {
      input.value = undefined;
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
.rating-container {
  width: 100%;
}

.rating-container.loading {
  opacity: 0.8;
}
</style>
