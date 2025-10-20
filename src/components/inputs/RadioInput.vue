<template>
  <div class="radio-container">
    <InputLabel :model="model" class="mb-4" />
    <small v-if="model.error" class="p-error" style="display: block; margin-bottom: 0.5rem">
      {{ model.error }}
    </small>

    <div class="radio-group">
      <div v-for="option of options" :key="option.value" class="radio-option">
        <RadioButton
          :inputId="`${model.id}_${option.value}`"
          :value="option"
          v-model="input"
          :disabled="model.disabled || option.disabled"
          @focus="onFocus"
          @change="onValueUpdate"
          @blur="onValueUpdate"
        />
        <label :for="`${model.id}_${option.value}`">
          {{ option.label }}
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import RadioButton from 'primevue/radiobutton';
import InputLabel from '../shared/InputLabel.vue';
import { FormField, FormSchema, Option } from '@/types';
import { ComponentPublicInstance, PropType, ref, watch, computed, onMounted } from 'vue';
import { useInputValidation } from '@/composables/useInputValidation';

const props = defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<ComponentPublicInstance | null>(null);
const schema = computed(() => props.schema);
const options = ref<Option[]>([]);

// Initialize input
const input = ref<Option | undefined>(undefined);

// Watch for model value changes
watch(
  () => model.value.value,
  newValue => {
    if (newValue !== undefined && newValue !== null) {
      // If newValue is an Option object, use it directly
      if (typeof newValue === 'object' && 'value' in newValue && 'label' in newValue) {
        input.value = newValue as Option;
      } else {
        // If it's a primitive value, find the corresponding option
        const matchingOption = options.value.find(opt => opt.value === newValue);
        input.value = matchingOption;
      }
    } else {
      input.value = undefined;
    }
  },
  { immediate: true }
);

// Use the input validation helpers
const { onValueUpdate, onFocus, getErrors, isValid } = useInputValidation(
  inputRef,
  model,
  input,
  schema
);

// Custom onReset for radio group
function onReset() {
  model.value.error = '';
  input.value = undefined;
  model.value.value = undefined;
}

async function initializeOptions() {
  if (typeof model.value.options === 'function') {
    options.value = await model.value.options();
  } else {
    options.value = model.value.options as Option[];
  }
}

defineExpose({
  onValueUpdate,
  onReset,
  getErrors,
  isValid,
});

onMounted(initializeOptions);
</script>

<style scoped>
.radio-container {
  width: 100%;
}

.radio-group-label {
  display: block;
  margin-bottom: 1rem;
  font-weight: 600;
}

.required-asterisk {
  color: var(--red-500);
  margin-left: 0.25rem;
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
  gap: 0.5rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.radio-option label {
  cursor: pointer;
  user-select: none;
}

.radio-option:has(:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}

.radio-option:has(:disabled) label {
  cursor: not-allowed;
}
</style>
