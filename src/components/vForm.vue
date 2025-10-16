<template>
  <div class="v-form-container">
    <!-- Route to MultiStepForm or SingleStepForm based on config -->
    <MultiStepForm
      v-if="isMultiStep"
      ref="formRef"
      :multi-step-config="multiStepConfig!"
      :show-labels="showLabels"
      :show-clear-button="showClearButton"
      :show-cancel-button="showCancelButton"
      :hide-buttons="hideButtons"
      :button-placement="buttonPlacement"
      :submit-button-text="submitButtonText"
      :clear-button-text="clearButtonText"
      :cancel-button-text="cancelButtonText"
      :next-button-text="nextButtonText"
      :previous-button-text="previousButtonText"
      :custom-buttons="customButtons"
      @submit="handleMultiStepSubmit"
      @step-change="handleStepChange"
      @clear="emit('clear')"
      @cancel="emit('cancel')"
    />
    <SingleStepForm
      v-else
      ref="formRef"
      :schema="schema!"
      :show-labels="showLabels"
      :show-clear-button="showClearButton"
      :show-cancel-button="showCancelButton"
      :hide-buttons="hideButtons"
      :button-placement="buttonPlacement"
      :submit-button-text="submitButtonText"
      :clear-button-text="clearButtonText"
      :cancel-button-text="cancelButtonText"
      :custom-buttons="customButtons"
      @submit="handleSingleStepSubmit"
      @clear="emit('clear')"
      @cancel="emit('cancel')"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { FormData, ComputedData, MultiStepFormData, FormProps } from '@/types';
import SingleStepForm from './SingleStepForm.vue';
import MultiStepForm from './MultiStepForm.vue';

interface FormEmits {
  (e: 'submit', formData: FormData, computedFormData: ComputedData): void;
  (e: 'multi-step-submit', data: MultiStepFormData): void;
  (e: 'step-change', stepIndex: number, stepId: string): void;
  (e: 'clear'): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<FormProps>(), {
  showLabels: true,
  showClearButton: true,
  showCancelButton: true,
  hideButtons: false,
  buttonPlacement: 'start',
});

const emit = defineEmits<FormEmits>();

// Computed property for multi-step detection
const isMultiStep = computed(() => !!props.multiStepConfig);

// Reference to the active form component (either SingleStepForm or MultiStepForm)
const formRef = ref<
  InstanceType<typeof SingleStepForm> | InstanceType<typeof MultiStepForm> | null
>(null);

// Event handlers
function handleSingleStepSubmit(formData: FormData, computedFormData: ComputedData) {
  emit('submit', formData, computedFormData);
}

function handleMultiStepSubmit(data: MultiStepFormData) {
  emit('multi-step-submit', data);
}

function handleStepChange(stepIndex: number, stepId: string) {
  emit('step-change', stepIndex, stepId);
}

// Expose methods for parent component (maintains backward compatibility)
defineExpose({
  // Common properties/methods
  computedData: computed(() => formRef.value?.computedData),
  formData: computed(() => formRef.value?.formData),
  resetForm: () => formRef.value?.resetForm(),
  submitForm: () => formRef.value?.submitForm(),
  isFormValid: () => formRef.value?.isFormValid(),

  // Multi-step specific methods
  isLastStep: computed(() =>
    formRef.value && 'isLastStep' in formRef.value ? formRef.value.isLastStep : true
  ),
  canGoNext: computed(() =>
    formRef.value && 'canGoNext' in formRef.value ? formRef.value.canGoNext : false
  ),
  canGoPrevious: computed(() =>
    formRef.value && 'canGoPrevious' in formRef.value ? formRef.value.canGoPrevious : false
  ),
  nextStep: () =>
    formRef.value && 'nextStep' in formRef.value ? formRef.value.nextStep() : undefined,
  previousStep: () =>
    formRef.value && 'previousStep' in formRef.value ? formRef.value.previousStep() : undefined,
  goToStep: (stepIndex: number) =>
    formRef.value && 'goToStep' in formRef.value ? formRef.value.goToStep(stepIndex) : undefined,
  getCurrentStep: () =>
    formRef.value && 'getCurrentStep' in formRef.value ? formRef.value.getCurrentStep() : undefined,
  getCurrentStepIndex: () =>
    formRef.value && 'getCurrentStepIndex' in formRef.value
      ? formRef.value.getCurrentStepIndex()
      : undefined,

  // Backward compatibility method
  resolveData: () => {
    if (isMultiStep.value && formRef.value && 'getMultiStepFormData' in formRef.value) {
      return formRef.value.getMultiStepFormData();
    }
    return {
      formData: formRef.value?.formData,
      computedData: formRef.value?.computedData,
    };
  },
});
</script>

<style>
.v-form-container {
  width: 100%;
}

.input-wrapper {
  position: relative;
  transition: transform 0.2s ease;
  margin-bottom: 1rem;
}

.input-wrapper:focus-within {
  transform: translateY(-1px);
}

.p-error {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--hospital-danger, #dc2626);
  font-weight: 500;
}

.p-help {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: var(--hospital-text-muted, #94a3b8);
  font-style: italic;
}

.p-invalid {
  border-color: var(--hospital-danger, #dc2626) !important;
}

.hospital-required {
  color: var(--hospital-danger, #dc2626);
  font-weight: bold;
}

.hospital-primary {
  color: var(--hospital-primary, #2563eb) !important;
}

:deep(.p-iftalabel label) {
  font-weight: 600;
  color: var(--hospital-text-secondary, #64748b);
  font-size: 0.9rem;
  background: var(--hospital-bg-card, #ffffff);
  padding: 0 0.5rem;
}

:deep(.p-iftalabel:has(.p-focus) label) {
  color: var(--hospital-primary, #2563eb);
  font-weight: 700;
}

:deep(.p-inputtext),
:deep(.p-inputnumber-input),
:deep(.p-dropdown),
:deep(.p-datepicker-input),
:deep(.p-textarea),
:deep(.p-inputmask) {
  border: 2px solid var(--hospital-border, #e2e8f0);
  border-radius: 8px;
  padding: 0.875rem 1rem;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: var(--hospital-bg-card, #ffffff);
}

:deep(.p-inputtext:focus),
:deep(.p-inputnumber-input:focus),
:deep(.p-dropdown:focus),
:deep(.p-datepicker-input:focus),
:deep(.p-textarea:focus),
:deep(.p-inputmask:focus) {
  border-color: var(--hospital-primary, #2563eb);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  outline: none;
}
</style>
