<template>
  <div class="single-step-form">
    <div class="p-grid">
      <div class="p-col-12">
        <template v-for="formId of Object.keys(activeSchema)" :key="formId">
          <div
            :class="getGridClasses(activeSchema[formId])"
            class="form-field-col"
            v-if="canRenderField(activeSchema[formId], formData, computedData)"
          >
            <component
              :is="activeSchema[formId].type"
              v-model="activeSchema[formId]"
              :schema="activeSchema"
              :form-id="formId"
              ref="dynamicRefs"
              :ref-key="formId"
              style="width: 100%"
            />
          </div>
        </template>
      </div>

      <!-- Form action buttons -->
      <div
        v-if="!hideButtons"
        class="p-col-12"
        style="display: flex; gap: 0.5rem"
        :style="{ justifyContent: buttonPlacement }"
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
        <ActionButton
          type="submit"
          :label="submitButtonText"
          color="success"
          @click="handleSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, defineExpose } from 'vue';
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
