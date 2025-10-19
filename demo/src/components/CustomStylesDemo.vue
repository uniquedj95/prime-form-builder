<template>
  <div class="demo-page">
    <div class="demo-content">
      <div class="demo-container">
        <SelectButton
          v-model="selectedTheme"
          :options="themeOptions"
          option-label="label"
          option-value="value"
          class="theme-selector mb-4"
        />

        <Card :class="'theme-' + selectedTheme" class="p-4 slide-in-left">
          <template #header>
            <h3 class="card-title">Styled Form Demo</h3>
            <p class="card-subtitle">Custom styling and theming examples</p>
          </template>

          <template #content>
            <VForm
              :schema="formSchema"
              @submit="handleSubmit"
              :button-placement="'end'"
              submit-button-text="Submit with Style"
              class="styled-form"
            />
          </template>
        </Card>

        <Card v-if="submittedData" class="p-4 mt-4">
          <template #header>
            <h3 class="card-title">Styled Form Data</h3>
          </template>

          <template #content>
            <pre>{{ JSON.stringify(submittedData, null, 2) }}</pre>
          </template>
        </Card>

        <Card class="p-4 mt-4">
          <template #header>
            <h3 class="card-title">Styling Features</h3>
          </template>

          <template #content>
            <div class="feature-list">
              <div class="feature-item">
                <h4>Theme Support</h4>
                <p>Switch between default, dark, and colorful themes</p>
              </div>
              <div class="feature-item">
                <h4>CSS Custom Properties</h4>
                <p>Easy customization with CSS variables</p>
              </div>
              <div class="feature-item">
                <h4>Responsive Grid</h4>
                <p>Built-in responsive grid system for different screen sizes</p>
              </div>
              <div class="feature-item">
                <h4>Custom Animations</h4>
                <p>Smooth transitions and hover effects</p>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Card from 'primevue/card';
import SelectButton from 'primevue/selectbutton';
import type { FormData, ComputedData, FormSchema } from 'pv-form';

const submittedData = ref<any>(null);
const selectedTheme = ref('default');

const themeOptions = ref([
  { label: 'Default', value: 'default' },
  { label: 'Dark Theme', value: 'dark' },
  { label: 'Colorful', value: 'colorful' },
]);

const formSchema: FormSchema = {
  title: {
    type: 'SelectInput',
    label: 'Title',
    value: '',
    options: [
      { label: 'Mr.', value: 'mr' },
      { label: 'Ms.', value: 'ms' },
      { label: 'Mrs.', value: 'mrs' },
      { label: 'Dr.', value: 'dr' },
    ],
    grid: { xs: 12, sm: 4, md: 3 },
  },
  firstName: {
    type: 'TextInput',
    label: 'First Name',
    value: '',
    placeholder: 'Enter first name',
    required: true,
    grid: { xs: 12, sm: 8, md: 9 },
  },
  lastName: {
    type: 'TextInput',
    label: 'Last Name',
    value: '',
    placeholder: 'Enter last name',
    required: true,
    grid: { xs: 12 },
  },
  email: {
    type: 'EmailInput',
    label: 'Email Address',
    value: '',
    placeholder: 'Enter email address',
    required: true,
    grid: { xs: 12, md: 6 },
  },
  phone: {
    type: 'TextInput',
    label: 'Phone Number',
    value: '',
    placeholder: '(000) 000-0000',
    grid: { xs: 12, md: 6 },
  },
  birthDate: {
    type: 'DateInput',
    label: 'Date of Birth',
    value: '',
    grid: { xs: 12, md: 6 },
  },
  favoriteColor: {
    type: 'SelectInput',
    label: 'Favorite Color',
    value: '',
    options: [
      { label: 'Red', value: 'red' },
      { label: 'Blue', value: 'blue' },
      { label: 'Green', value: 'green' },
      { label: 'Purple', value: 'purple' },
      { label: 'Orange', value: 'orange' },
    ],
    grid: { xs: 12, md: 6 },
  },
  interests: {
    type: 'TextAreaInput',
    label: 'Interests & Hobbies',
    value: '',
    placeholder: 'Tell us about your interests...',
    rows: 4,
    grid: { xs: 12 },
  },
  newsletter: {
    type: 'CheckboxInput',
    label: 'Subscribe to our newsletter',
    value: false,
    grid: { xs: 12, md: 6 },
  },
  notifications: {
    type: 'CheckboxInput',
    label: 'Enable push notifications',
    value: true,
    grid: { xs: 12, md: 6 },
  },
  contactMethod: {
    type: 'RadioInput',
    label: 'Preferred Contact Method',
    value: 'email',
    options: [
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
      { label: 'SMS', value: 'sms' },
    ],
    grid: { xs: 12 },
  },
};

function handleSubmit(formData: FormData, computedData: ComputedData) {
  console.log('Styled form submitted:', formData, computedData);
  submittedData.value = { formData, computedData };
}
</script>

<style scoped>
.demo-container {
  margin: 0 auto;
}

.theme-selector {
  margin-bottom: 20px;
}

pre {
  background: var(--p-surface-100);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.4;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  background: var(--p-surface-50);
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid var(--p-primary-color);
}

.feature-item h4 {
  margin: 0 0 8px 0;
  color: var(--p-primary-color);
  font-size: 1.1rem;
  font-weight: 600;
}

.feature-item p {
  margin: 0;
  color: var(--p-text-muted-color);
  font-size: 0.9rem;
}

/* Default Theme */
.theme-default {
  --background: #ffffff;
  --color: #333333;
}

/* Dark Theme */
.theme-dark {
  --background: #1a1a1a;
  --color: #ffffff;
  background: var(--background);
  color: var(--color);
}

.theme-dark :deep(.p-card-header) {
  color: var(--p-surface-0);
}

.theme-dark :deep(.p-card-content) {
  color: var(--p-surface-0);
}

/* Colorful Theme */
.theme-colorful {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  background: var(--background);
}

.theme-colorful :deep(.p-card-header) {
  color: white;
}

.theme-colorful :deep(.p-card-content) {
  color: white;
}

/* Styled Form */
.styled-form {
  transition: all 0.3s ease;
}

/* Custom animations and effects */
.styled-form :deep(.p-inputtext) {
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;
}

.styled-form :deep(.p-inputtext:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.styled-form :deep(.p-button) {
  border-radius: 25px;
  padding: 12px 24px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.styled-form :deep(.p-button:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(var(--p-primary-color-rgb), 0.4);
}

.styled-form :deep(.p-dropdown),
.styled-form :deep(.p-multiselect) {
  border-radius: 12px;
}

.styled-form :deep(.p-field-label) {
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--p-primary-color);
}
</style>
