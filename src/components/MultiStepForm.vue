<template>
  <div class="multi-step-form">
    <!-- PrimeVue Stepper -->
    <Stepper
      v-model:value="currentStepIndex"
      :linear="!multiStepConfig.allowStepNavigation"
      class="multi-step-stepper"
    >
      <StepList>
        <Step
          v-for="(step, index) in visibleSteps"
          :key="step.id"
          :value="index"
          @click="handleStepClick(index)"
        >
          {{ step.title }}
        </Step>
      </StepList>

      <StepPanels>
        <StepPanel v-for="(step, index) in visibleSteps" :key="step.id" :value="index">
          <!-- Custom Component if provided -->
          <component
            v-if="step.component"
            :is="step.component"
            v-bind="step.componentProps || {}"
            @update:data="handleCustomComponentDataUpdate"
            ref="customComponentRef"
          />
          <!-- Regular schema-based form -->
          <div v-else class="p-grid">
            <div class="p-col-12">
              <template v-for="formId of Object.keys(activeSchema)" :key="formId">
                <div
                  :class="getGridClasses(activeSchema[formId])"
                  class="form-field-col"
                  v-if="canRenderField(activeSchema[formId], data, computedData)"
                >
                  <component
                    :is="activeSchema[formId].type"
                    v-model="activeSchema[formId]"
                    :schema="activeSchema"
                    :form-id="formId"
                    ref="dynamicRefs"
                    :ref-key="formId"
                  />
                </div>
              </template>
            </div>
          </div>

          <!-- Multi-step buttons -->
          <div v-if="!hideButtons" class="p-grid">
            <div
              class="p-col-12"
              style="display: flex; gap: 0.5rem; margin-top: 1rem"
              :style="{ justifyContent: buttonPlacement }"
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
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import StepPanel from 'primevue/steppanel';
import Step from 'primevue/step';
import type {
  MultiStepFormData,
  MultiStepConfig,
  FormField,
  CustomButton as CustomButtonType,
} from '@/types';
import { canRenderField, isFormField, resetFormInputsWithFieldCheck, deepClone } from '@/utils';
import { useFormValidation } from '@/composables/useFormValidation';
import { useDataTransformation } from '@/composables/useDataTransformation';
import { useMultiStepForm } from '@/composables/useMultiStepForm';
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

// Helper function to generate grid classes
const getGridClasses = (field: FormField) => {
  const classes = [];
  const xs = field.grid?.xs ?? '12';
  const sm = field.grid?.sm;
  const md = field.grid?.md;
  const lg = field.grid?.lg;
  const xl = field.grid?.xl;

  classes.push(`p-col-${xs}`);
  if (sm) classes.push(`p-sm-${sm}`);
  if (md) classes.push(`p-md-${md}`);
  if (lg) classes.push(`p-lg-${lg}`);
  if (xl) classes.push(`p-xl-${xl}`);

  return classes.join(' ');
};

// Multi-step form logic
const multiStepForm = useMultiStepForm(props.multiStepConfig);
const activeSchema = ref<Record<string, FormField>>({});
const { dynamicRefs, isFormValid } = useFormValidation();
const { formData: data, computedData } = useDataTransformation(activeSchema);
const customComponentRef = ref<any>(null);

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

// Field visibility logic - reset hidden field values
watch(
  data,
  () => {
    for (const [k, f] of Object.entries(activeSchema.value)) {
      if (!canRenderField(f, data.value, computedData.value)) {
        const originalSchema = currentStep.value?.schema?.[k];
        if (originalSchema && isFormField(originalSchema) && 'value' in originalSchema) {
          f.value = originalSchema.value;
        } else {
          f.value = undefined;
        }
      }
    }
  },
  { deep: true, immediate: true }
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
/* PrimeVue Flex Grid System */
.p-grid {
  display: flex;
  flex-wrap: wrap;
  margin-right: -0.5rem;
  margin-left: -0.5rem;
  margin-top: -0.5rem;
}

.p-col-12,
.p-col-6,
.p-col-4,
.p-col-3,
.p-sm-12,
.p-sm-6,
.p-sm-4,
.p-sm-3,
.p-md-12,
.p-md-6,
.p-md-4,
.p-md-3,
.p-lg-12,
.p-lg-6,
.p-lg-4,
.p-lg-3,
.p-xl-12,
.p-xl-6,
.p-xl-4,
.p-xl-3 {
  position: relative;
  padding: 0.5rem;
}

.p-col-12 {
  flex: 0 0 auto;
  width: 100%;
}
.p-col-6 {
  flex: 0 0 auto;
  width: 50%;
}
.p-col-4 {
  flex: 0 0 auto;
  width: 33.3333%;
}
.p-col-3 {
  flex: 0 0 auto;
  width: 25%;
}

@media (min-width: 576px) {
  .p-sm-12 {
    width: 100%;
  }
  .p-sm-6 {
    width: 50%;
  }
  .p-sm-4 {
    width: 33.3333%;
  }
  .p-sm-3 {
    width: 25%;
  }
}

@media (min-width: 768px) {
  .p-md-12 {
    width: 100%;
  }
  .p-md-6 {
    width: 50%;
  }
  .p-md-4 {
    width: 33.3333%;
  }
  .p-md-3 {
    width: 25%;
  }
}

@media (min-width: 992px) {
  .p-lg-12 {
    width: 100%;
  }
  .p-lg-6 {
    width: 50%;
  }
  .p-lg-4 {
    width: 33.3333%;
  }
  .p-lg-3 {
    width: 25%;
  }
}

@media (min-width: 1200px) {
  .p-xl-12 {
    width: 100%;
  }
  .p-xl-6 {
    width: 50%;
  }
  .p-xl-4 {
    width: 33.3333%;
  }
  .p-xl-3 {
    width: 25%;
  }
}

.form-field-col {
  margin-bottom: 1rem;
}
</style>
