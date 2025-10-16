<template>
  <label v-if="showLabel" class="input-label">
    {{ labelText }}
    <span class="required-asterisk" v-if="showRequired">*</span>
  </label>
</template>

<script lang="ts" setup>
import type { FormField } from '@/types';
import { useLabelTemplate } from '@/composables/useLabelTemplate';
import { toRef } from 'vue';

const props = defineProps<{
  model: FormField;
  slotName?: string;
}>();

const { showLabel, showRequired, labelText } = useLabelTemplate(toRef(props, 'model'));
</script>

<style scoped>
.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.required-asterisk {
  color: var(--red-500);
  margin-left: 0.25rem;
}
</style>
