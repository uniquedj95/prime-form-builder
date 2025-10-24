<template>
  <div class="multicheckbox-container" v-tooltip="model.tooltip">
    <Fieldset
      :class="['multicheckbox-fieldset', model.className, { 'p-invalid': model.error }]"
      :disabled="model.disabled"
    >
      <template #legend>
        <InputLabel :model="model" class="p-2" />
      </template>

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
            <div v-if="shouldShowDescription(option, input.includes(option.value))">
              <Message
                :severity="option.description?.color || 'secondary'"
                variant="simple"
                size="small"
              >
                {{ option.description?.text }}
              </Message>
            </div>
          </label>
        </div>
      </div>
    </Fieldset>
    <small v-if="model.error" class="p-error" style="display: block; margin-top: 0.5rem">
      {{ model.error }}
    </small>
  </div>
</template>

<script lang="ts" setup>
import Checkbox from 'primevue/checkbox';
import Fieldset from 'primevue/fieldset';
import InputLabel from '../shared/InputLabel.vue';
import { FormField, FormSchema, Option } from '@/types';
import { ComponentPublicInstance, PropType, ref, watch, computed, onMounted } from 'vue';
import { useInputValidation } from '@/composables/useInputValidation';
import { shouldShowDescription } from '@/utils';
import Message from 'primevue/message';

const props = defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<ComponentPublicInstance | null>(null);
const schema = computed(() => props.schema);
const options = ref<Option[]>([]);

const flexDirection = computed(() => (model.value.inline ? 'row' : 'column'));

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

.multicheckbox-fieldset {
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius);
  padding: 1rem;
  position: relative;
  transition: border-color 0.2s;
  background: var(--p-surface-0);
}

.multicheckbox-fieldset:hover:not(:disabled) {
  border-color: var(--p-primary-color);
}

.multicheckbox-fieldset:focus-within:not(:disabled) {
  border-color: var(--p-primary-color);
  box-shadow: 0 0 0 0.2rem color-mix(in srgb, var(--p-primary-color), transparent 80%);
}

.multicheckbox-fieldset.p-invalid {
  border-color: var(--p-red-500);
}

.multicheckbox-fieldset.p-invalid:focus-within {
  box-shadow: 0 0 0 0.2rem color-mix(in srgb, var(--p-red-500), transparent 80%);
}

.multicheckbox-fieldset:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--p-surface-100);
}

.multicheckbox-legend {
  position: absolute;
  top: -0.5rem;
  left: 0.75rem;
  padding: 0 0.5rem;
  background: var(--p-surface-0);
  font-size: 0.75rem;
  color: var(--p-text-color);
  transition: all 0.2s;
}

.multicheckbox-fieldset:focus-within .multicheckbox-legend {
  color: var(--p-primary-color);
}

.multicheckbox-fieldset.p-invalid .multicheckbox-legend {
  color: var(--p-red-500);
}

.multicheckbox-fieldset:disabled .multicheckbox-legend {
  background: var(--p-surface-100);
}

.multicheckbox-group {
  display: flex;
  flex-direction: v-bind(flexDirection);
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
