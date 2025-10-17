<template>
  <div class="single-step-form">
    <!-- Render rows grouped by the row property -->
    <template v-for="(row, _rowIndex) of groupedRows" :key="_rowIndex">
      <div class="flex flex-row mb-2 gap-2">
        <template v-for="formId of row" :key="formId">
          <div
            :class="getGridClasses(activeSchema[formId])"
            v-if="canRenderField(activeSchema[formId], formData, computedData)"
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

    <!-- Form action buttons -->
    <div
      v-if="!hideButtons"
      class="col-12 flex gap-2"
      :class="{
        'justify-content-start': buttonPlacement === 'start',
        'justify-content-center': buttonPlacement === 'middle',
        'justify-content-end': buttonPlacement === 'end',
      }"
    >
      <ActionButton
        type="cancel"
        color="secondary"
        :label="cancelButtonText"
        @click="handleCancel"
        v-if="showCancelButton"
      />
      <ActionButton
        type="clear"
        color="warning"
        :label="clearButtonText"
        @click="handleClear"
        v-if="showClearButton"
      />
      <CustomButton :button="btn" v-for="btn of customButtons" :key="btn.label" />
      <ActionButton type="submit" :label="submitButtonText" color="success" @click="handleSubmit" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, defineExpose } from 'vue';
import type { ComputedData, FormData, FormField, CustomButton as CustomButtonType } from '@/types';
import { deepClone, isFormField, canRenderField, resetFormInputsWithFieldCheck } from '@/utils';
import { useFormValidation } from '@/composables/useFormValidation';
import { useDataTransformation } from '@/composables/useDataTransformation';
import ActionButton from './buttons/ActionButton.vue';
import CustomButton from './buttons/CustomButton.vue';

export interface SingleStepFormProps {
  schema: Record<string, FormField>;
  showLabels?: boolean;
  showClearButton?: boolean;
  showCancelButton?: boolean;
  hideButtons?: boolean;
  buttonPlacement?: 'start' | 'middle' | 'end';
  submitButtonText?: string;
  clearButtonText?: string;
  cancelButtonText?: string;
  customButtons?: CustomButtonType[];
}

export interface SingleStepFormEmits {
  (e: 'submit', formData: FormData, computedFormData: ComputedData): void;
  (e: 'clear'): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<SingleStepFormProps>(), {
  showLabels: true,
  showClearButton: true,
  showCancelButton: true,
  hideButtons: false,
  buttonPlacement: 'start',
  submitButtonText: 'Submit',
  clearButtonText: 'Clear',
  cancelButtonText: 'Cancel',
  customButtons: () => [],
});

const emit = defineEmits<SingleStepFormEmits>();

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

// Form validation and data management
// Create a deep copy of the schema to avoid mutating props
const activeSchema = ref<Record<string, FormField>>(deepClone(props.schema));
const { dynamicRefs, isFormValid } = useFormValidation();
const { formData, computedData } = useDataTransformation(activeSchema);

// Initialize form with schema values
watch(
  () => props.schema,
  newSchema => {
    // Create a deep copy to avoid mutating the prop
    activeSchema.value = deepClone(newSchema);
  },
  { deep: true, immediate: true }
);

// Field visibility logic - reset hidden field values
watch(
  formData,
  () => {
    for (const [k, f] of Object.entries(activeSchema.value)) {
      if (!canRenderField(f, formData.value, computedData.value)) {
        const originalSchema = props.schema?.[k];
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
  if (!(await isFormValid())) return;
  emit('submit', formData.value, computedData.value);
}

function resetForm() {
  resetFormInputsWithFieldCheck(
    dynamicRefs.value,
    activeSchema.value,
    formData.value,
    computedData.value
  );
}

function handleClear() {
  resetForm();
  emit('clear');
}

function handleCancel() {
  resetForm();
  emit('cancel');
}

// Expose methods for parent component
defineExpose({
  formData,
  computedData,
  resetForm,
  isFormValid,
  submitForm: handleSubmit,
});
</script>

<style scoped>
/* Minimal styles - using Tailwind for grid layout */
.single-step-form {
  width: 100%;
}
</style>
