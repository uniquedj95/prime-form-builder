<template>
  <Button
    :severity="color"
    :outlined="config?.buttons?.[type]?.fill === 'outline'"
    :size="config?.buttons?.[type]?.size ?? 'small'"
    :class="config?.buttons?.[type]?.expand === 'block' ? 'w-full' : ''"
  >
    {{ finalLabel }}
  </Button>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import { ActionButtonType, GlobalConfig } from '@/types';
import { computed, inject } from 'vue';

const config: GlobalConfig | undefined = inject('globalConfig');

const props = defineProps({
  type: {
    type: String as () => ActionButtonType,
    default: 'submit',
  },
  label: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    default: 'primary',
  },
});

const finalLabel = computed(() => {
  return props.label ?? config?.buttons?.[props.type]?.label ?? props.type;
});
</script>
