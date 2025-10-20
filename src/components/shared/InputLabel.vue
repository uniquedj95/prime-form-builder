<template>
  <label v-if="showLabel" class="input-label" :for="model.id">
    {{ labelText }}
    <span class="required-asterisk" v-if="showRequired">*</span>
  </label>
</template>

<script lang="ts" setup>
import type { FormField } from '@/types';
import { useLabelTemplate } from '@/composables/useLabelTemplate';
import { toRef } from 'vue';

const props = defineProps<{ model: FormField }>();
const { showLabel, showRequired, labelText } = useLabelTemplate(toRef(props, 'model'));
</script>

<style scoped>
.input-label {
  font-weight: 600;
  color: var(--hospital-text-secondary, #64748b);
  font-size: 0.9rem;
  background: var(--hospital-bg-card, #ffffff);
  padding: 0 0.5rem;
}

.required-asterisk {
  color: red;
  margin-left: 0.25rem;
}
</style>
