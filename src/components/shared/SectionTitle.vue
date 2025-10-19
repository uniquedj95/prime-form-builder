<template>
  <div :class="['form-section-container', section.className, getGridClasses(section)]">
    <!-- Section Divider -->
    <Divider
      align="left"
      type="solid"
      :class="[
        'section-divider-prime',
        { 'divider-collapsible': section.collapsible },
        section.className,
      ]"
      @click="section.collapsible ? toggleSection() : null"
    >
      <div class="section-title-content">
        <i v-if="section.icon" :class="['section-icon-compact', section.icon]"></i>
        <span class="section-title-text">{{ section.title }}</span>
        <i
          v-if="section.collapsible"
          :class="[
            'section-toggle-compact pi',
            section.collapsed ? 'pi-chevron-down' : 'pi-chevron-up',
          ]"
        ></i>
      </div>
    </Divider>
  </div>
</template>

<script lang="ts" setup>
import type { FormField, FormSchema } from '@/types';
import { getGridClasses } from '@/utils';
import Divider from 'primevue/divider';

interface SectionTitleProps {
  // Standard form component props (even though we don't use modelValue)
  modelValue?: FormField;
  schema?: FormSchema;
  formId?: string;
  refKey?: string;
}

const props = defineProps<SectionTitleProps>();
const emit = defineEmits(['section-toggle']);

// Extract the section data from modelValue (which contains the FormSection)
const section = props.modelValue!;

const toggleSection = () => {
  if (section && section.collapsible) {
    section.collapsed = !section.collapsed;
    emit('section-toggle', {
      section,
      collapsed: section.collapsed,
    });
  }
};

// Helper function to generate grid classes
// const getGridClasses = () => {
//   const classes = [];
//   const xs = section.grid?.xs ?? '12';
//   const sm = section.grid?.sm;
//   const md = section.grid?.md;
//   const lg = section.grid?.lg;
//   const xl = section.grid?.xl;

//   classes.push(`p-col-${xs}`);
//   if (sm) classes.push(`p-sm-${sm}`);
//   if (md) classes.push(`p-md-${md}`);
//   if (lg) classes.push(`p-lg-${lg}`);
//   if (xl) classes.push(`p-xl-${xl}`);

//   return classes.join(' ');
// };
</script>

<style scoped>
/* Adopt styles from FormStepContent.vue */
.form-section-container {
  padding: 0 !important;
}

:deep(.section-divider-prime) {
  margin: 0rem 0 1.5rem 0;
}

:deep(.section-divider-prime .p-divider-content) {
  background: var(--hospital-bg-card, #ffffff);
  padding: 0 1rem;
}

.divider-collapsible {
  cursor: pointer;
}

.section-title-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--hospital-primary, #2563eb);
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.section-icon-compact {
  font-size: 1rem;
  color: inherit;
  flex-shrink: 0;
}

.section-title-text {
  color: inherit;
  white-space: nowrap;
  flex-grow: 1;
}

.section-toggle-compact {
  font-size: 0.875rem;
  color: var(--hospital-text-muted, #94a3b8);
  transition:
    transform 0.3s ease,
    color 0.3s ease;
  flex-shrink: 0;
}

.divider-collapsible:hover .section-title-content {
  color: var(--hospital-primary-dark, #1d4ed8);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  :deep(.section-divider-prime) {
    margin: 0rem 0 1rem 0;
  }

  .section-title-content {
    font-size: 0.9rem;
  }
}
</style>
