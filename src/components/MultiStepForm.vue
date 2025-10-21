<template>
  <div class="multi-step-form hospital-theme">
    <!-- PrimeVue Stepper with enhanced styling -->
    <Stepper v-model:value="currentStepIndex" :linear="!multiStepConfig.allowStepNavigation">
      <!-- Horizontal scroll container for steps -->
      <div class="steps-scroll-container" ref="stepsScrollContainer">
        <StepList class="steps-list">
          <Step
            v-for="(step, index) in visibleSteps"
            :key="step.id"
            :value="index"
            v-slot="{ activateCallback, value, a11yAttrs }"
            asChild
          >
            <div class="step-item-wrapper" v-bind="a11yAttrs?.root">
              <button
                class="step-button"
                :class="{
                  'step-active': currentStepIndex === Number(value),
                  'step-completed': Number(value) < currentStepIndex,
                  'step-disabled': !canNavigateToStep(Number(value)),
                }"
                @click="handleStepClickWithCallback(index, activateCallback)"
                v-bind="a11yAttrs?.header"
              >
                <div class="step-header-content">
                  <span
                    :class="[
                      'step-indicator',
                      {
                        'step-indicator-active': Number(value) <= currentStepIndex,
                        'step-indicator-inactive': Number(value) > currentStepIndex,
                      },
                    ]"
                  >
                    <i v-if="step.icon" :class="['step-icon', step.icon]"></i>
                    <span v-else class="step-number">{{ index + 1 }}</span>
                  </span>
                  <span class="step-title">{{ step.title }}</span>
                </div>
                <p v-if="step.subtitle" class="step-subtitle">
                  {{ step.subtitle }}
                </p>
              </button>
              <Divider v-if="index < visibleSteps.length - 1" class="step-divider" />
            </div>
          </Step>
        </StepList>
      </div>

      <StepPanels>
        <StepPanel v-for="(step, index) in visibleSteps" :key="step.id" :value="index">
          <KeepAlive>
            <component
              v-if="step.component"
              :is="step.component"
              v-bind="step.componentProps || {}"
              @update:data="handleCustomComponentDataUpdate"
              ref="customComponentRef"
            />
            <template v-else>
              <div class="grid grid-cols-12 gap-4 p-4 h-full">
                <template v-for="(field, formId) in activeSchema" :key="formId">
                  <div :class="getGridClasses(field)" v-if="checkFieldVisibility(field)">
                    <component
                      :is="field.type"
                      v-model="activeSchema[formId]"
                      :schema="activeSchema"
                      :form-id="formId"
                      ref="dynamicRefs"
                      :ref-key="formId"
                    />
                  </div>
                </template>
              </div>
            </template>
          </KeepAlive>

          <!-- Multi-step buttons -->
          <div
            v-if="!hideButtons"
            class="col-span-12 flex gap-2 mt-4"
            :class="{
              'justify-start': buttonPlacement === 'start',
              'justify-center': buttonPlacement === 'middle',
              'justify-end': buttonPlacement === 'end',
            }"
          >
            <ActionButton
              type="previous"
              :label="previousButtonText"
              @click="handlePreviousStep"
              v-if="canGoPrevious"
            />
            <ActionButton
              type="cancel"
              :label="cancelButtonText"
              @click="handleCancelAction"
              v-if="showCancelButton"
            />
            <ActionButton
              type="clear"
              :label="clearButtonText"
              @click="handleClearAction"
              v-if="showClearButton"
            />
            <CustomButton :button="btn" v-for="btn of customButtons" :key="btn.label" />
            <ActionButton
              type="next"
              :label="nextButtonText"
              @click="handleNextStep"
              v-if="canGoNext"
            />
            <ActionButton
              type="submit"
              :label="submitButtonText"
              @click="handleSubmit"
              v-if="isLastStep"
            />
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, nextTick } from 'vue';
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import StepPanel from 'primevue/steppanel';
import Step from 'primevue/step';
import Divider from 'primevue/divider';
import type {
  MultiStepFormData,
  MultiStepConfig,
  FormField,
  CustomButton as CustomButtonType,
} from '@/types';
import { deepClone, getGridClasses, resetFormInputsWithFieldCheck } from '@/utils';
import {
  useFormValidation,
  useDataTransformation,
  useMultiStepForm,
  useFieldVisibility,
} from '@/composables';
import ActionButton from './buttons/ActionButton.vue';
import CustomButton from './buttons/CustomButton.vue';

export interface MultiStepFormProps {
  multiStepConfig: MultiStepConfig;
  showLabels?: boolean;
  showClearButton?: boolean;
  showCancelButton?: boolean;
  hideButtons?: boolean;
  buttonPlacement?: 'start' | 'middle' | 'end';
  submitButtonText?: string;
  clearButtonText?: string;
  cancelButtonText?: string;
  nextButtonText?: string;
  previousButtonText?: string;
  customButtons?: CustomButtonType[];
}

export interface MultiStepFormEmits {
  (e: 'submit', data: MultiStepFormData): void;
  (e: 'step-change', stepIndex: number, stepId: string): void;
  (e: 'clear'): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<MultiStepFormProps>(), {
  showLabels: true,
  showClearButton: true,
  showCancelButton: true,
  hideButtons: false,
  buttonPlacement: 'start',
  submitButtonText: 'Submit',
  clearButtonText: 'Clear',
  cancelButtonText: 'Cancel',
  nextButtonText: 'Next',
  previousButtonText: 'Previous',
  customButtons: () => [],
});

const emit = defineEmits<MultiStepFormEmits>();

// Multi-step form logic
const multiStepForm = useMultiStepForm(props.multiStepConfig);
const activeSchema = ref<Record<string, FormField>>({});
const { dynamicRefs, isFormValid } = useFormValidation();
const { formData: data, computedData } = useDataTransformation(activeSchema);
const customComponentRef = ref<any>(null);
const stepsScrollContainer = ref<HTMLElement | null>(null);

// Use composables for common functionality
const { checkFieldVisibility } = useFieldVisibility(activeSchema, data, computedData);

// Multi-step computed properties
const currentStepIndex = computed(() => multiStepForm.currentStepIndex.value);
const currentStep = computed(() => multiStepForm.currentStep.value);
const visibleSteps = computed(() => multiStepForm.visibleSteps.value);
const isLastStep = computed(() => multiStepForm.isLastStep.value);
const canGoNext = computed(() => multiStepForm.canGoNext.value);
const canGoPrevious = computed(() => multiStepForm.canGoPrevious.value);

// Update active schema when step changes
watch(
  currentStep,
  newStep => {
    if (newStep) {
      // Create a deep copy to avoid mutating the step's schema
      activeSchema.value = deepClone(newStep.schema || {});
    }
  },
  { immediate: true }
);

// Update multi-step data when form data changes
watch(
  [data, computedData],
  ([newData, newComputedData]) => {
    if (currentStep.value) {
      multiStepForm.updateStepData(currentStep.value.id, newData);
      multiStepForm.updateStepComputedData(currentStep.value.id, newComputedData);
    }
  },
  { deep: true }
);

// Setup field visibility watcher with current step context
const { setupFieldVisibilityWatcher } = useFieldVisibility(
  activeSchema,
  data,
  computedData,
  computed(() => currentStep.value?.schema)
);

// Initialize field visibility watcher
setupFieldVisibilityWatcher();

// Function to scroll to active step
function scrollToActiveStep() {
  if (!stepsScrollContainer.value) return;

  const activeStepButton = stepsScrollContainer.value.querySelector('.step-active');
  if (activeStepButton) {
    activeStepButton.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }
}

// Watch for step changes to auto-scroll
watch(
  currentStepIndex,
  () => {
    // Use nextTick to ensure DOM is updated
    nextTick(() => {
      scrollToActiveStep();
    });
  },
  { flush: 'post' }
);

// Form actions
async function handleSubmit() {
  // Validate current step if it has a custom component
  if (currentStep.value?.component && customComponentRef.value) {
    if (typeof customComponentRef.value.validate === 'function') {
      const isValid = await customComponentRef.value.validate();
      if (!isValid) return;
    }
  }

  // Validate all steps
  const isValid = await multiStepForm.validateAllSteps();
  if (!isValid) return;

  const multiStepData = multiStepForm.getMultiStepFormData();
  emit('submit', multiStepData);
}

function resetFormWithFieldCheck() {
  resetFormInputsWithFieldCheck(
    dynamicRefs.value,
    activeSchema.value,
    data.value,
    computedData.value
  );
}

function handleClearAction() {
  if (currentStep.value) {
    multiStepForm.clearStepData(currentStep.value.id);
    resetFormWithFieldCheck();
  }
  emit('clear');
}

function handleCancelAction() {
  multiStepForm.resetForm();
  emit('cancel');
}

async function handleNextStep() {
  // Validate current step
  let isCurrentStepValid = true;

  if (currentStep.value?.component && customComponentRef.value) {
    if (typeof customComponentRef.value.validate === 'function') {
      isCurrentStepValid = await customComponentRef.value.validate();
    }
  } else {
    isCurrentStepValid = await isFormValid();
  }

  if (!isCurrentStepValid) return;

  const success = await multiStepForm.nextStep();
  if (success && currentStep.value) {
    emit('step-change', currentStepIndex.value, currentStep.value.id);
  }
}

async function handlePreviousStep() {
  const success = await multiStepForm.previousStep();
  if (success && currentStep.value) {
    emit('step-change', currentStepIndex.value, currentStep.value.id);
  }
}

async function handleStepClick(stepIndex: number) {
  // If moving forward, validate current step first
  if (stepIndex > currentStepIndex.value) {
    let isCurrentStepValid = true;

    if (currentStep.value?.component && customComponentRef.value) {
      if (typeof customComponentRef.value.validate === 'function') {
        isCurrentStepValid = await customComponentRef.value.validate();
      }
    } else {
      isCurrentStepValid = await isFormValid();
    }

    if (!isCurrentStepValid) return;
  }

  const success = await multiStepForm.goToStep(stepIndex);
  if (success && currentStep.value) {
    emit('step-change', stepIndex, currentStep.value.id);
  }
}

function handleCustomComponentDataUpdate(updateData: any) {
  if (currentStep.value) {
    multiStepForm.updateStepData(currentStep.value.id, updateData);
  }
}

// Enhanced stepper methods
function canNavigateToStep(stepIndex: number): boolean {
  if (props.multiStepConfig.allowStepNavigation === false) {
    return stepIndex === currentStepIndex.value;
  }
  return stepIndex <= currentStepIndex.value || !props.multiStepConfig.allowStepNavigation;
}

async function handleStepClickWithCallback(stepIndex: number, activateCallback: () => void) {
  // If moving forward, validate current step first
  if (stepIndex > currentStepIndex.value) {
    let isCurrentStepValid = true;

    if (currentStep.value?.component && customComponentRef.value) {
      if (typeof customComponentRef.value.validate === 'function') {
        isCurrentStepValid = await customComponentRef.value.validate();
      }
    } else {
      isCurrentStepValid = await isFormValid();
    }

    if (!isCurrentStepValid) return;
  }

  const success = await multiStepForm.goToStep(stepIndex);
  if (success && currentStep.value) {
    if (typeof activateCallback === 'function') {
      activateCallback();
    }
    emit('step-change', stepIndex, currentStep.value.id);
  }
}

// Expose methods for parent component
defineExpose({
  isLastStep,
  canGoNext,
  canGoPrevious,
  computedData,
  formData: data,
  resetForm: handleCancelAction,
  submitForm: handleSubmit,
  isFormValid,
  getMultiStepFormData: () => multiStepForm.getMultiStepFormData(),
  nextStep: handleNextStep,
  previousStep: handlePreviousStep,
  goToStep: handleStepClick,
  getCurrentStep: () => currentStep.value,
  getCurrentStepIndex: () => currentStepIndex.value,
});
</script>

<style scoped>
/* Hospital Theme Styles inspired by PrimeVueFormBuilderSteps.vue */
.multi-step-form.hospital-theme {
  --hospital-primary: #2563eb;
  --hospital-primary-light: #3b82f6;
  --hospital-primary-dark: #1d4ed8;
  --hospital-secondary: #64748b;
  --hospital-accent: #0ea5e9;
  --hospital-success: #16a34a;
  --hospital-warning: #f59e0b;
  --hospital-danger: #dc2626;
  --hospital-info: #0284c7;
  --hospital-bg-primary: #f8fafc;
  --hospital-bg-card: #ffffff;
  --hospital-bg-secondary: #f1f5f9;
  --hospital-bg-accent: #e0f2fe;
  --hospital-text-primary: #1e293b;
  --hospital-text-secondary: #64748b;
  --hospital-text-muted: #94a3b8;
  --hospital-border: #e2e8f0;
  --hospital-border-focus: #2563eb;

  width: 100%;
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  background: var(--hospital-bg-primary);
}

/* Horizontal scroll container for steps */
.steps-scroll-container {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.5rem 0;
  /* Scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: var(--hospital-border) transparent;
}

.steps-scroll-container::-webkit-scrollbar {
  height: 6px;
}

.steps-scroll-container::-webkit-scrollbar-track {
  background: transparent;
}

.steps-scroll-container::-webkit-scrollbar-thumb {
  background-color: var(--hospital-border);
  border-radius: 3px;
  transition: background-color 0.3s ease;
}

.steps-scroll-container::-webkit-scrollbar-thumb:hover {
  background-color: var(--hospital-primary);
}

.steps-list {
  display: flex;
  flex-direction: row;
  min-width: max-content;
  gap: 0.5rem;
}

.step-item-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.step-divider {
  flex-shrink: 0;
  width: 1px;
  height: 2rem;
  margin: 0;
}

/* Step Button Styles */
.step-button {
  min-width: 200px;
  max-width: 300px;
  text-align: left;
  padding: 1rem;
  border: none;
  background: transparent;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
}

.step-button:hover:not(.step-disabled) {
  background: var(--hospital-bg-accent);
  transform: translateY(-2px);
}

.step-button.step-active {
  background: var(--hospital-bg-accent);
  color: var(--hospital-primary);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
}

.step-button.step-completed {
  background: var(--hospital-bg-accent);
}

.step-button.step-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.step-header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.step-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 2px solid;
  font-weight: 600;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.step-indicator-active {
  background: var(--hospital-primary);
  color: white;
  border-color: var(--hospital-primary);
}

.step-indicator-inactive {
  background: var(--hospital-bg-card);
  color: var(--hospital-text-secondary);
  border-color: var(--hospital-border);
}

.step-button.step-active .step-indicator {
  background: var(--hospital-primary);
  color: white;
  border-color: var(--hospital-primary);
}

.step-icon {
  font-size: 1.125rem;
}

.step-number {
  font-size: 1rem;
  font-weight: 600;
}

.step-title {
  font-weight: 600;
  font-size: 1rem;
  color: inherit;
  flex: 1;
}

.step-button.step-active .step-title {
  color: var(--hospital-primary);
}

.step-subtitle {
  color: var(--hospital-text-muted);
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
  padding-left: 3.75rem;
}

.step-button.step-active .step-subtitle {
  color: var(--hospital-text-secondary);
}

/* Button Styles */
.hospital-btn-primary {
  background: linear-gradient(
    135deg,
    var(--hospital-primary),
    var(--hospital-primary-light)
  ) !important;
  border: none !important;
  color: white !important;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.hospital-btn-primary:hover {
  background: linear-gradient(
    135deg,
    var(--hospital-primary-dark),
    var(--hospital-primary)
  ) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.hospital-btn-secondary {
  background: var(--hospital-bg-secondary) !important;
  border: 1px solid var(--hospital-border) !important;
  color: var(--hospital-text-primary) !important;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.hospital-btn-outline {
  background: transparent !important;
  border: 2px solid var(--hospital-border) !important;
  color: var(--hospital-text-secondary) !important;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.hospital-btn-success {
  background: linear-gradient(135deg, var(--hospital-success), #22c55e) !important;
  border: none !important;
  color: white !important;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(22, 163, 74, 0.3);
}

.hospital-btn-warning {
  background: linear-gradient(135deg, var(--hospital-warning), #fbbf24) !important;
  border: none !important;
  color: white !important;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

@media (max-width: 768px) {
  .steps-scroll-container {
    /* Enable smooth scrolling on mobile */
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }

  .step-button {
    min-width: 150px;
    max-width: 200px;
    padding: 0.75rem;
  }

  .step-header-content {
    gap: 0.5rem;
  }

  .step-subtitle {
    padding-left: 0;
    text-align: left;
    font-size: 0.8rem;
    margin-top: 0.125rem;
  }

  .step-indicator {
    width: 2.5rem;
    height: 2.5rem;
  }

  .step-title {
    font-size: 0.875rem;
    line-height: 1.2;
  }

  .step-divider {
    height: 1.5rem;
  }
}

@media (max-width: 480px) {
  .step-button {
    min-width: 120px;
    max-width: 150px;
    padding: 0.5rem;
  }

  .step-header-content {
    flex-direction: column;
    text-align: center;
    gap: 0.25rem;
  }

  .step-title {
    font-size: 0.8rem;
  }

  .step-subtitle {
    text-align: center;
    font-size: 0.75rem;
  }

  .step-indicator {
    width: 2rem;
    height: 2rem;
  }

  .step-icon {
    font-size: 1rem;
  }

  .step-number {
    font-size: 0.875rem;
  }
}
</style>
