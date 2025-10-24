<template>
  <div class="checkbox-container">
    <Checkbox
      :id="model.id || model.name"
      ref="inputRef"
      v-model="input"
      :class="[model.className, { 'p-invalid': model.error }]"
      :required="model.required"
      :disabled="model.disabled"
      :binary="true"
      @focus="onFocus"
      @change="onValueUpdate"
      @blur="onValueUpdate"
    />
    <label :for="model.id || model.name" class="checkbox-label">
      {{ labelTextWithAsterisk }}
    </label>
    <Message variant="simple" severity="secondary" v-if="model.placeholder" class="mt-0 mb-3">
      {{ model.placeholder }}
    </Message>
    <small v-if="model.error" class="p-error" style="display: block; margin-top: 0.25rem">{{
      model.error
    }}</small>
  </div>
</template>

<script lang="ts" setup>
import Checkbox from 'primevue/checkbox';
import Message from 'primevue/message';
import { FormField, FormSchema } from '@/types';
import { ComponentPublicInstance, PropType, ref, watch, computed } from 'vue';
import { useInputValidation } from '@/composables/useInputValidation';
import { getLabelText } from '@/utils';

const props = defineProps<{ schema?: FormSchema }>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const inputRef = ref<ComponentPublicInstance | null>(null);
const schema = computed(() => props.schema);

// Initialize input
const input = ref<boolean>(false);

// Watch for model value changes
watch(
  () => model.value.value,
  newValue => {
    input.value = Boolean(newValue);
  },
  { immediate: true }
);

// Checkbox label text with asterisk if required
const labelTextWithAsterisk = computed(() => getLabelText(model.value));

// Use input validation composable
const { onValueUpdate, onFocus, getErrors } = useInputValidation(inputRef, model, input, schema);

// Custom onReset for checkbox (default to false)
function onReset() {
  input.value = false;
  model.value.error = '';
  model.value.value = false;
}

defineExpose({
  onValueUpdate,
  onReset,
  getErrors,
});
</script>

<style scoped>
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-label {
  cursor: pointer;
  user-select: none;
}
</style>
