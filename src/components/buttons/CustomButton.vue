<template>
  <Button
    @click="button.action"
    :severity="getSeverity(button.color ?? 'primary')"
    :outlined="button.fill === 'outline'"
    :size="button.size ?? 'small'"
    :class="button.expand === 'block' ? 'w-full' : ''"
  >
    {{ button.label }}
  </Button>
</template>

<script setup lang="ts">
import { CustomButton } from '@/types';
import Button from 'primevue/button';
import { PropType } from 'vue';

defineProps({
  button: {
    type: Object as PropType<CustomButton>,
    required: true,
  },
});

const getSeverity = (color: string) => {
  const colorMap: Record<string, string> = {
    primary: 'primary',
    secondary: 'secondary',
    success: 'success',
    danger: 'danger',
    warning: 'warn',
    info: 'info',
    light: 'secondary',
    dark: 'contrast',
  };
  return colorMap[color] || 'primary';
};
</script>
