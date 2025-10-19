<template>
  <div class="single-step-form">
    <div class="grid grid-cols-12 gap-4">
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

    <!-- Form action buttons -->
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

// Initialize form with schema values
watch(
  () => props.schema,
  newSchema => {
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
.single-step-form {
  width: 100%;
}
</style>
