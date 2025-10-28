<template>
  <div class="select-container" :class="{ loading: isValueLoading }" v-tooltip="model.tooltip">
    <!-- Multi-select with IftaLabel -->
    <IftaLabel v-if="model.multiple && model.label">
      <MultiSelect
        :id="model.id"
        ref="inputRef"
        v-model="selectedValues"
        :options="options"
        optionLabel="label"
        :placeholder="isValueLoading ? 'Loading...' : model.placeholder || 'Select options'"
        :disabled="model.disabled || isValueLoading"
        :filter="true"
        :filterPlaceholder="'Search...'"
        :class="[model.className, { 'p-invalid': model.error }]"
        fluid
        @focus="onFocus"
        @change="onValueUpdate"
        @blur="onValueUpdate"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value && slotProps.value.length" class="selected-items">
            <Chip
              v-for="val in slotProps.value"
              :key="val.value"
              :label="val.label"
              removable
              @remove="removeChip(val)"
            />
          </div>
          <span v-else>{{ slotProps.placeholder }}</span>
        </template>
        <template #option="slotProps">
          <div class="option-content">
            <div>{{ slotProps.option.label }}</div>
            <small
              v-if="shouldShowDescription(slotProps.option, isSelected(slotProps.option))"
              :class="`option-description text-${slotProps.option.description?.color || 'secondary'}`"
            >
              {{ slotProps.option.description?.text }}
            </small>
          </div>
        </template>
      </MultiSelect>
      <InputLabel :model="model" />
    </IftaLabel>

    <!-- Multi-select without IftaLabel -->
    <MultiSelect
      v-else-if="model.multiple"
      :id="model.id"
      ref="inputRef"
      v-model="selectedValues"
      :options="options"
      optionLabel="label"
      :placeholder="isValueLoading ? 'Loading...' : model.placeholder || 'Select options'"
      :disabled="model.disabled || isValueLoading"
      :filter="true"
      :filterPlaceholder="'Search...'"
      :class="[model.className, { 'p-invalid': model.error }]"
      fluid
      @focus="onFocus"
      @change="onValueUpdate"
      @blur="onValueUpdate"
    >
      <template #value="slotProps">
        <div v-if="slotProps.value && slotProps.value.length" class="selected-items">
          <Chip
            v-for="val in slotProps.value"
            :key="val.value"
            :label="val.label"
            removable
            @remove="removeChip(val)"
          />
        </div>
        <span v-else>{{ slotProps.placeholder }}</span>
      </template>
      <template #option="slotProps">
        <div class="option-content">
          <div>{{ slotProps.option.label }}</div>
          <small
            v-if="shouldShowDescription(slotProps.option, isSelected(slotProps.option))"
            :class="`option-description text-${slotProps.option.description?.color || 'secondary'}`"
          >
            {{ slotProps.option.description?.text }}
          </small>
        </div>
      </template>
    </MultiSelect>

    <!-- Single select (Dropdown) with IftaLabel -->
    <IftaLabel v-else-if="model.label">
      <Select
        :id="model.id"
        ref="inputRef"
        v-model="selectedValue"
        :options="options"
        optionLabel="label"
        :placeholder="isValueLoading ? 'Loading...' : model.placeholder || 'Select an option'"
        :disabled="model.disabled || isValueLoading"
        :filter="true"
        :filterPlaceholder="'Search...'"
        :showClear="!model.required"
        :class="[model.className, { 'p-invalid': model.error }]"
        fluid
        @focus="onFocus"
        @change="onValueUpdate"
        @blur="onValueUpdate"
      >
        <template #value="slotProps">
          <span v-if="slotProps.value">{{ slotProps.value.label }}</span>
          <span v-else>{{ slotProps.placeholder }}</span>
        </template>
        <template #option="slotProps">
          <div class="option-content">
            <div>{{ slotProps.option.label }}</div>
            <small
              v-if="shouldShowDescription(slotProps.option, isSelected(slotProps.option))"
              :class="`option-description text-${slotProps.option.description?.color || 'secondary'}`"
            >
              {{ slotProps.option.description?.text }}
            </small>
          </div>
        </template>
      </Select>
      <InputLabel :model="model" />
    </IftaLabel>

    <!-- Single select (Dropdown) without IftaLabel -->
    <Select
      v-else
      :id="model.id"
      ref="inputRef"
      v-model="selectedValue"
      :options="options"
      optionLabel="label"
      :placeholder="isValueLoading ? 'Loading...' : model.placeholder || 'Select an option'"
      :disabled="model.disabled || isValueLoading"
      :filter="true"
      :filterPlaceholder="'Search...'"
      :showClear="!model.required"
      :class="[model.className, { 'p-invalid': model.error }]"
      fluid
      @focus="onFocus"
      @change="onValueUpdate"
      @blur="onValueUpdate"
    >
      <template #value="slotProps">
        <span v-if="slotProps.value">{{ slotProps.value.label }}</span>
        <span v-else>{{ slotProps.placeholder }}</span>
      </template>
      <template #option="slotProps">
        <div class="option-content">
          <div>{{ slotProps.option.label }}</div>
          <small
            v-if="shouldShowDescription(slotProps.option, isSelected(slotProps.option))"
            :class="`option-description text-${slotProps.option.description?.color || 'secondary'}`"
          >
            {{ slotProps.option.description?.text }}
          </small>
        </div>
      </template>
    </Select>

    <small v-if="model.error" class="p-error">{{ model.error }}</small>
    <i v-if="isValueLoading" class="pi pi-spin pi-spinner loading-spinner"></i>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, PropType, watch, ComponentPublicInstance, onMounted } from 'vue';
import Select from 'primevue/select';
import MultiSelect from 'primevue/multiselect';
import Chip from 'primevue/chip';
import IftaLabel from 'primevue/iftalabel';
import { FormSchema, BaseFieldTypes, FormField, Option } from '@/types';
import { deepEqual, isFormField, shouldShowDescription } from '@/utils';
import { useInputValidation } from '@/composables/useInputValidation';
import { useFormFieldValue } from '@/composables/useFormFieldValue';
import InputLabel from '../shared/InputLabel.vue';

const props = defineProps({
  schema: Object as PropType<FormSchema>,
  type: String as PropType<BaseFieldTypes>,
  formId: String,
});

const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<ComponentPublicInstance | null>(null);
const options = ref<Option[]>([]);
const selectedValue = ref<Option | null>(null);
const selectedValues = ref<Option[]>([]);

// Use form field value resolution for async values
const { isLoading: isValueLoading } = useFormFieldValue(model);

// Initialize options
async function loadOptions() {
  const filtered: Option[] = [];

  // Handle function-based options (including dependent options)
  if (typeof model.value.options === 'function') {
    // Get dependency values if this field has dependencies
    let dependencyValues: Record<string, any> = {};

    if (model.value.dependsOn && props.schema) {
      const dependsOn = Array.isArray(model.value.dependsOn)
        ? model.value.dependsOn
        : [model.value.dependsOn];

      // Check if dependencies have values, especially on initial load
      let allDependenciesHaveValues = true;

      dependencyValues = dependsOn.reduce(
        (acc, depId) => {
          const field = props.schema![depId];
          acc[depId] = isFormField(field) ? field.value : undefined;

          // Check if this dependency has a value
          if (acc[depId] === undefined || acc[depId] === null || acc[depId] === '') {
            allDependenciesHaveValues = false;
          }

          return acc;
        },
        {} as Record<string, any>
      );

      // Proceed only if all dependencies have values
      if (allDependenciesHaveValues) {
        // Call the options function with filter and dependency values
        const res = await model.value.options('', dependencyValues);
        filtered.push(...res.filter(o => !!o.label));
      }
    } else {
      // No dependencies, just call the options function
      const res = await model.value.options('', {});
      filtered.push(...res.filter(o => !!o.label));
    }
  }
  // Handle static array options
  else if (Array.isArray(model.value.options)) {
    filtered.push(...model.value.options);
  }

  options.value = filtered;
}

// Watch for dependency value changes
watch(
  () => {
    if (!model.value.dependsOn || !props.schema) return null;
    const dependsOn = Array.isArray(model.value.dependsOn)
      ? model.value.dependsOn
      : [model.value.dependsOn];
    return dependsOn.map(depId => {
      const field = props.schema![depId];
      return isFormField(field) ? field.value : undefined;
    });
  },
  async (newValues, oldValues) => {
    if (newValues && oldValues && !deepEqual(newValues, oldValues)) {
      onReset();
      options.value = [];
      await loadOptions();
    }
  },
  { deep: true }
);

// Initialize from model value
watch(
  [() => model.value.value, options],
  ([newValue]) => {
    // Only newValue is processed; options changes trigger the callback to re-sync selected values.
    if (model.value.multiple && Array.isArray(newValue)) {
      selectedValues.value = options.value.filter(opt =>
        newValue.some((v: any) => (typeof v === 'object' ? v.value === opt.value : v === opt.value))
      );
    } else if (newValue) {
      selectedValue.value =
        options.value.find(opt => {
          if (typeof newValue === 'object' && 'value' in newValue) {
            return newValue.value === opt.value;
          }
          return newValue === opt.value;
        }) || null;
    } else {
      selectedValue.value = null;
      selectedValues.value = [];
    }
  },
  { immediate: true }
);

const schema = computed(() => props.schema);

// Use input validation
const { onValueUpdate, onFocus } = useInputValidation(
  inputRef,
  model,
  model.value.multiple ? selectedValues : selectedValue,
  schema
);

function onReset() {
  model.value.error = '';
  selectedValue.value = null;
  selectedValues.value = [];
  model.value.value = model.value.multiple ? [] : '';
}

function removeChip(val: Option) {
  selectedValues.value = selectedValues.value.filter(v => v.value !== val.value);
  onValueUpdate();
}

function isSelected(option: Option): boolean {
  if (model.value.multiple) {
    return selectedValues.value.some(v => v.value === option.value);
  }
  return selectedValue.value?.value === option.value;
}

onMounted(async () => {
  await loadOptions();
});

defineExpose({
  onValueUpdate,
  onReset,
  getErrors: () => (model.value.error ? [model.value.error] : []),
});
</script>

<style scoped>
/* Minimal overrides - use PrimeVue defaults */
.select-container {
  width: 100%;
}

.select-container.loading {
  opacity: 0.8;
}

.loading-spinner {
  cursor: wait;
}

.selected-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.option-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.option-description {
  font-size: 0.875rem;
  line-height: 1.2;
}
</style>
