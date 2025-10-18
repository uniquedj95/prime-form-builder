<template>
  <div
    v-for="(child, index) of childrens"
    class="repeat-input-wrapper"
    :class="model.className"
    :key="index"
  >
    <div class="repeat-row">
      <div class="form-fields-column">
        <div class="fields-row">
          <template v-for="formId of Object.keys(child)">
            <div
              :key="`${index}-${formId}`"
              :class="getPrimeVueGridClasses(child[formId])"
              class="field-col"
              v-if="checkFieldVisibility(child[formId])"
            >
              <component
                :is="child[formId].type"
                v-model="child[formId]"
                :schema="child"
                :ref-key="`${index}-${formId}`"
                ref="dynamicRefs"
                style="width: 100%"
              />
            </div>
          </template>
        </div>
      </div>
      <div class="button-column">
        <div class="button-container">
          <Button
            @click="addSet"
            severity="success"
            size="small"
            icon="pi pi-plus"
            rounded
            v-if="index === childrens.length - 1"
          />
          <Button
            @click="removeSet(index)"
            severity="danger"
            size="small"
            icon="pi pi-minus"
            rounded
            v-if="childrens.length > 1"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ComputedData, FormData, FormField, FormSchema, Option } from '@/types';
import Button from 'primevue/button';
import {
  deepClone,
  isFormField,
  resetFormInputsWithCustomResolver,
  getPrimeVueGridClasses,
} from '@/utils';
import { useFormValidation, useRepeatInputFieldVisibility } from '@/composables';
import { computed, onMounted, PropType, ref, watch } from 'vue';

interface PropsI {
  schema?: FormSchema;
  data: FormData;
  computedData: ComputedData;
}

const props = defineProps<PropsI>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const childrens = ref<FormSchema[]>([]);

// Get accent color from field config (optional)
const accentColor = computed(() => {
  const colorValue = model.value.borderAccentColor;

  // If no accent color is defined, return null to not apply border
  if (!colorValue) {
    return null;
  }

  // If it's a hex color (starts with #), return as is
  if (colorValue.startsWith('#')) {
    return colorValue;
  }

  // Map PrimeVue theme color names to CSS custom properties
  const primeVueColors: Record<string, string> = {
    primary: 'var(--p-primary-color)',
    secondary: 'var(--p-surface-300)',
    success: 'var(--p-green-500)',
    info: 'var(--p-blue-500)',
    warn: 'var(--p-yellow-500)',
    danger: 'var(--p-red-500)',
    help: 'var(--p-purple-500)',
    surface: 'var(--p-surface-400)',
  };

  return primeVueColors[colorValue] || null;
});

// Use form validation composable
const { dynamicRefs, getFormErrors, updateFormValues } = useFormValidation();

// Use field visibility composable for RepeatInput
const { checkFieldVisibility } = useRepeatInputFieldVisibility(props.data, props.computedData);

const inputValue = computed<Array<Option>>(() => {
  return childrens.value.map((child, index) => ({
    label: `Set ${index + 1}`,
    value: index,
    other: Object.entries(child).reduce(
      (acc, [id, field]) => {
        // Only process FormField items, not FormSection items
        if (isFormField(field)) {
          acc[id] = field.value;
        }
        return acc;
      },
      {} as Record<string, any>
    ),
  }));
});

watch(
  inputValue,
  value => {
    model.value.value = value;
  },
  { deep: true, immediate: true }
);

onMounted(addSet);

function addSet() {
  if (model.value.children) {
    childrens.value.push(deepClone<FormSchema>(model.value.children));
  }
}

function removeSet(index: number) {
  childrens.value.splice(index, 1);
}

function onReset() {
  // Create a resolver function for the RepeatInput's nested schema structure
  const getFieldFromRefKey = (refKey: string) => {
    // Parse the ref-key format: "${index}-${formId}"
    const [indexStr, formId] = refKey.split('-');
    const index = Number.parseInt(indexStr, 10);

    if (
      !Number.isNaN(index) &&
      formId &&
      childrens.value[index] &&
      childrens.value[index][formId]
    ) {
      return childrens.value[index][formId];
    }

    return null;
  };

  // Use the utility function with our custom resolver
  resetFormInputsWithCustomResolver(
    dynamicRefs.value,
    props.data,
    props.computedData,
    getFieldFromRefKey
  );
}

function getErrors() {
  return getFormErrors();
}

async function onValueUpdate() {
  await updateFormValues();
}

defineExpose({
  onValueUpdate,
  onReset,
  getErrors,
});
</script>

<style scoped>
.repeat-input-wrapper {
  border: 2px solid var(--hospital-border, #e2e8f0);
  border-radius: 12px;
  padding: 1rem;
  background: var(--hospital-bg-secondary, #f1f5f9);
  margin-bottom: 1rem;
  border-left: v-bind(
    'accentColor ? `4px solid ${accentColor}` : "2px solid var(--hospital-border, #e2e8f0)"'
  );
}

.repeat-row {
  display: flex;
  width: 100%;
  gap: 1rem;
  align-items: flex-start;
  background: var(--hospital-bg-card, #ffffff);
  border: 1px solid var(--hospital-border, #e2e8f0);
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.repeat-row:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.form-fields-column {
  flex: 1;
}

.fields-row {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.field-col {
  min-width: 0; /* Prevent field overflow */
}

/* Grid classes for responsive layout */
.p-col-12 {
  grid-column: 1 / -1;
}
.p-col-6 {
  grid-column: span 2;
}
.p-col-4 {
  grid-column: span 1;
}
.p-col-3 {
  grid-column: span 1;
}

@media (min-width: 576px) {
  .fields-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .p-sm-12 {
    grid-column: 1 / -1;
  }
  .p-sm-6 {
    grid-column: span 1;
  }
  .p-sm-4 {
    grid-column: span 1;
  }
  .p-sm-3 {
    grid-column: span 1;
  }
}

@media (min-width: 768px) {
  .fields-row {
    grid-template-columns: repeat(3, 1fr);
  }
  .p-md-12 {
    grid-column: 1 / -1;
  }
  .p-md-6 {
    grid-column: span 2;
  }
  .p-md-4 {
    grid-column: span 1;
  }
  .p-md-3 {
    grid-column: span 1;
  }
}

@media (min-width: 992px) {
  .fields-row {
    grid-template-columns: repeat(4, 1fr);
  }
  .p-lg-12 {
    grid-column: 1 / -1;
  }
  .p-lg-6 {
    grid-column: span 2;
  }
  .p-lg-4 {
    grid-column: span 1;
  }
  .p-lg-3 {
    grid-column: span 1;
  }
}

@media (min-width: 1200px) {
  .p-xl-12 {
    grid-column: 1 / -1;
  }
  .p-xl-6 {
    grid-column: span 2;
  }
  .p-xl-4 {
    grid-column: span 1;
  }
  .p-xl-3 {
    grid-column: span 1;
  }
}

.button-column {
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  padding-top: 0.5rem;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

/* Hospital theme button styles */
.button-container :deep(.p-button.p-button-success) {
  background: linear-gradient(135deg, #16a34a, #22c55e) !important;
  border: none !important;
  color: white !important;
  font-weight: 600;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(22, 163, 74, 0.3);
}

.button-container :deep(.p-button.p-button-success:hover) {
  background: linear-gradient(135deg, #15803d, #16a34a) !important;
  transform: scale(1.05);
}

.button-container :deep(.p-button.p-button-danger) {
  background: linear-gradient(135deg, #dc2626, #ef4444) !important;
  border: none !important;
  color: white !important;
  font-weight: 600;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
}

.button-container :deep(.p-button.p-button-danger:hover) {
  background: linear-gradient(135deg, #b91c1c, #dc2626) !important;
  transform: scale(1.05);
}

/* Hospital theme colors */
.hospital-required {
  color: var(--hospital-danger, #dc2626);
  font-weight: bold;
}

@media (max-width: 768px) {
  .repeat-row {
    flex-direction: column;
    gap: 1rem;
  }

  .button-column {
    align-self: flex-end;
  }

  .button-container {
    flex-direction: row;
  }

  .fields-row {
    grid-template-columns: 1fr !important;
  }
}
</style>
