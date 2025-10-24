<template>
  <div class="listbox-container" :class="{ loading: isValueLoading }" v-tooltip="model.tooltip">
    <InputLabel :model="model" class="mb-4" />
    <small v-if="model.error" class="p-error" style="display: block; margin-bottom: 0.5rem">{{
      model.error
    }}</small>

    <ListBox
      :id="model.id"
      ref="inputRef"
      v-model="selectedValue"
      :options="options"
      optionLabel="label"
      :multiple="model.multiple"
      :disabled="model.disabled || isValueLoading"
      :filter="true"
      :filterPlaceholder="'Search...'"
      :class="[model.className, { 'p-invalid': model.error }]"
      @focus="onFocus"
      @change="onValueUpdate"
      @blur="onValueUpdate"
    >
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
    </ListBox>

    <i v-if="isValueLoading" class="pi pi-spin pi-spinner loading-spinner"></i>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, PropType, watch, ComponentPublicInstance, onMounted } from 'vue';
import ListBox from 'primevue/listbox';
import InputLabel from '../shared/InputLabel.vue';
import { FormSchema, BaseFieldTypes, FormField, Option } from '@/types';
import { deepEqual, isFormField, shouldShowDescription } from '@/utils';
import { useInputValidation } from '@/composables/useInputValidation';
import { useFormFieldValue } from '@/composables/useFormFieldValue';

const props = defineProps({
  schema: Object as PropType<FormSchema>,
  type: String as PropType<BaseFieldTypes>,
  formId: String,
});

const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<ComponentPublicInstance | null>(null);
const options = ref<Option[]>([]);
const selectedValue = ref<Option | Option[] | null>(null);

// Use form field value resolution for async values
const { isLoading: isValueLoading } = useFormFieldValue(model);

// Initialize options
async function loadOptions() {
  if (typeof model.value.options === 'function') {
    const result = await model.value.options('', {});
    options.value = result.filter(o => !!o.label);
  } else if (Array.isArray(model.value.options)) {
    options.value = model.value.options;
  }
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
      await loadOptions();
    }
  },
  { deep: true }
);

// Initialize from model value
watch(
  () => model.value.value,
  newValue => {
    if (model.value.multiple && Array.isArray(newValue)) {
      selectedValue.value = options.value.filter(opt =>
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
      selectedValue.value = model.value.multiple ? [] : null;
    }
  },
  { immediate: true }
);

const schema = computed(() => props.schema);

// Use input validation
const { onValueUpdate, onFocus } = useInputValidation(inputRef, model, selectedValue, schema);

function onReset() {
  model.value.error = '';
  selectedValue.value = model.value.multiple ? [] : null;
  model.value.value = model.value.multiple ? [] : '';
}

function isSelected(option: Option): boolean {
  if (model.value.multiple && Array.isArray(selectedValue.value)) {
    return selectedValue.value.some((v: Option) => v.value === option.value);
  }
  return (selectedValue.value as Option)?.value === option.value;
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
.listbox-container {
  width: 100%;
}

.listbox-container.loading {
  opacity: 0.8;
}

.loading-spinner {
  cursor: wait;
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
