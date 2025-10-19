<template>
  <div class="single-step-form">
    <!-- Render rows grouped by the row property -->
    <template v-for="(row, _rowIndex) of groupedRows" :key="_rowIndex">
      <div :class="getRowGridClasses(row, getVisibleFieldsInRow(row).length)" class="mb-4">
        <template v-for="formId of row" :key="formId">
          <div
            :class="getGridClasses(activeSchema[formId])"
            v-if="checkFieldVisibility(activeSchema[formId])"
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
        @click="() => handleCancel(onCancel)"
        v-if="showCancelButton"
      />
      <ActionButton
        type="clear"
        color="warning"
        :label="clearButtonText"
        @click="() => handleClear(onClear)"
        v-if="showClearButton"
      />
      <CustomButton :button="btn" v-for="btn of customButtons" :key="btn.label" />
      <ActionButton
        type="submit"
        :label="submitButtonText"
        color="success"
        @click="() => handleSubmit(onSubmit)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, defineExpose } from 'vue';
import type { ComputedData, FormData, FormField, CustomButton as CustomButtonType } from '@/types';
import { deepClone, getGridClasses } from '@/utils';
import {
  useFormValidation,
  useDataTransformation,
  useRowGrouping,
  useFormActions,
  useFieldVisibility,
} from '@/composables';
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

// Form validation and data management
// Create a deep copy of the schema to avoid mutating props
const activeSchema = ref<Record<string, FormField>>(deepClone(props.schema));
const { dynamicRefs, isFormValid } = useFormValidation();
const { formData, computedData } = useDataTransformation(activeSchema);

// Use composables for common functionality
const { groupedRows, getRowGridClasses } = useRowGrouping(activeSchema);
const { handleSubmit, handleClear, handleCancel } = useFormActions(
  dynamicRefs,
  activeSchema,
  formData,
  computedData,
  isFormValid
);
const { setupFieldVisibilityWatcher, checkFieldVisibility } = useFieldVisibility(
  activeSchema,
  formData,
  computedData,
  props.schema
);

// Helper function to count visible fields in a row
const getVisibleFieldsInRow = (row: string[]) => {
  return row.filter(formId => checkFieldVisibility(activeSchema.value[formId]));
};

// Initialize form with schema values
watch(
  () => props.schema,
  newSchema => {
    // Create a deep copy to avoid mutating the prop
    activeSchema.value = deepClone(newSchema);
  },
  { deep: true, immediate: true }
);

// Setup field visibility watcher
setupFieldVisibilityWatcher();

// Form action handlers
async function onSubmit() {
  emit('submit', formData.value, computedData.value);
}

function onClear() {
  emit('clear');
}

function onCancel() {
  emit('cancel');
}

// Expose methods for parent component
defineExpose({
  formData,
  computedData,
  resetForm: () => handleClear(),
  isFormValid,
  submitForm: () => handleSubmit(onSubmit),
});
</script>

<style scoped>
/* Minimal styles - using Tailwind for grid layout */
.single-step-form {
  width: 100%;
}
</style>
