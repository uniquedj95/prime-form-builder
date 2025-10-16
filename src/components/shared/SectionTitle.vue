<template>
  <div :class="['form-section-container', section.className, getGridClasses()]">
    <div class="form-section-header">
      <h3 class="form-section-title">{{ section.title }}</h3>
      <p v-if="section.subtitle" class="form-section-subtitle">{{ section.subtitle }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormField, FormSchema } from '@/types';

interface SectionTitleProps {
  // Standard form component props (even though we don't use modelValue)
  modelValue?: FormField;
  schema?: FormSchema;
  formId?: string;
  refKey?: string;
}

const props = defineProps<SectionTitleProps>();

// Extract the section data from modelValue (which contains the FormSection)
const section = props.modelValue!;

// Helper function to generate grid classes
const getGridClasses = () => {
  const classes = [];
  const xs = section.grid?.xs ?? '12';
  const sm = section.grid?.sm;
  const md = section.grid?.md;
  const lg = section.grid?.lg;
  const xl = section.grid?.xl;

  classes.push(`p-col-${xs}`);
  if (sm) classes.push(`p-sm-${sm}`);
  if (md) classes.push(`p-md-${md}`);
  if (lg) classes.push(`p-lg-${lg}`);
  if (xl) classes.push(`p-xl-${xl}`);

  return classes.join(' ');
};
</script>

<style scoped>
/* Minimal overrides - use PrimeVue defaults */
.form-section-container {
  padding: 0 !important;
}

.form-section-header {
  margin: 1.5rem 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid;
}

.form-section-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.2;
}

.form-section-subtitle {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.3;
}

/* First section should have less top margin */
:first-child .form-section-header {
  margin-top: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-section-header {
    margin: 1rem 0 0.75rem 0;
  }

  .form-section-title {
    font-size: 1.125rem;
  }

  .form-section-subtitle {
    font-size: 0.8rem;
  }
}
</style>
