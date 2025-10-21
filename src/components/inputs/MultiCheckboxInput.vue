<template>
  <div class="multicheckbox-container">
    <InputLabel :model="model" class="mb-4" />
    <small v-if="model.error" class="p-error" style="display: block; margin-bottom: 0.5rem">
      {{ model.error }}
    </small>

    <div class="multicheckbox-group">
      <div v-for="option of options" :key="option.value" class="multicheckbox-option">
        <Checkbox
          :inputId="`${model.id}_${option.value}`"
          :value="option.value"
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
import Checkbox from 'primevue/checkbox';
import InputLabel from '../shared/InputLabel.vue';
import { FormField, FormSchema, Option } from '@/types';
import { ComponentPublicInstance, PropType, ref, watch, computed, onMounted } from 'vue';
import { useInputValidation } from '@/composables/useInputValidation';

const props = defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<ComponentPublicInstance | null>(null);
const schema = computed(() => props.schema);
const options = ref<Option[]>([]);

// Initialize input as an array for multiple selection
const input = ref<Array<string | number>>([]);

// Watch for model value changes
watch(
  () => model.value.value,
  newValue => {
    if (Array.isArray(newValue)) {
      // If the array contains Option objects, extract just the values
      input.value = newValue.map(item =>
        typeof item === 'object' && item !== null && 'value' in item ? item.value : item
      );
    } else if (newValue !== undefined && newValue !== null) {
      // If it's a single value, convert to array
      input.value = [newValue as string | number];
    } else {
      input.value = [];
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

// Custom onReset for multi checkbox group
function onReset() {
  model.value.error = '';
  input.value = [];
  model.value.value = [];
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
.multicheckbox-container {
  width: 100%;
}

.multicheckbox-group {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  margin-left: 1rem;
  gap: 0.75rem;
}

.multicheckbox-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.multicheckbox-option label {
  cursor: pointer;
  user-select: none;
}

.multicheckbox-option:has(:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}

.multicheckbox-option:has(:disabled) label {
  cursor: not-allowed;
}
</style>
