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
          <!-- Regular schema-based form with row grouping -->
          <template v-else>
            <template v-for="(row, _rowIndex) of groupedRows" :key="_rowIndex">
              <div class="flex flex-row mb-2 gap-2">
                <template v-for="formId of row" :key="formId">
                  <div
                    :class="getGridClasses(activeSchema[formId])"
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
            </template>
          </template>

          <!-- Multi-step buttons -->
          <div
            v-if="!hideButtons"
            class="col-12 flex gap-2 mt-4"
            :class="{
              'justify-content-start': buttonPlacement === 'start',
              'justify-content-center': buttonPlacement === 'middle',
              'justify-content-end': buttonPlacement === 'end',
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

// Helper function to generate PrimeFlex grid classes
const getGridClasses = (field: FormField) => {
  const classes = [];
  const xs = field.grid?.xs ?? 12;
  const sm = field.grid?.sm;
  const md = field.grid?.md;
  const lg = field.grid?.lg;
  const xl = field.grid?.xl;

  // Base size (xs) - PrimeFlex uses col-{number}
  classes.push(`col-${xs}`);

  // Responsive sizes - PrimeFlex uses breakpoint:col-{number}
  if (sm) classes.push(`sm:col-${sm}`);
  if (md) classes.push(`md:col-${md}`);
  if (lg) classes.push(`lg:col-${lg}`);
  if (xl) classes.push(`xl:col-${xl}`);

  return classes.join(' ');
};

// Group fields by their row property
const groupedRows = computed(() => {
  const result: Array<string[]> = [];
  const processedFields = new Set<string>();

  // Process fields in their original order
  for (const formId of Object.keys(activeSchema.value)) {
    if (processedFields.has(formId)) {
      continue; // Skip if already processed as part of a group
    }

    const field = activeSchema.value[formId];

    if (field.row !== undefined && field.row !== null) {
      // Find all fields with the same row identifier
      const rowFields = Object.keys(activeSchema.value).filter(
        id => activeSchema.value[id].row === field.row
      );

      // Add the group row
      result.push(rowFields);

      // Mark all fields in this group as processed
      for (const id of rowFields) {
        processedFields.add(id);
      }
    } else {
      // Field without row - gets its own row
      result.push([formId]);
      processedFields.add(formId);
    }
  }

  return result;
});

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
/* Minimal styles - using Tailwind for grid layout */
.multi-step-form {
  width: 100%;
}

.multi-step-stepper {
  margin-bottom: 1rem;
}
</style>
