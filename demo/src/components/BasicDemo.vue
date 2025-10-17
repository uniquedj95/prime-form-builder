<template>
  <div class="demo-page">
    <div class="page-header">
      <h1 class="demo-title">
        <i class="pi pi-file"></i>
        Basic Form Demo
      </h1>
      <p class="demo-description">
        Create beautiful forms with common input types including text, email, password, date, and
        number fields with built-in validation.
      </p>
    </div>

    <div class="demo-content">
      <div class="demo-container">
        <Card class="p-4">
          <template #header>
            <h3 class="card-title">
              <i class="pi pi-user"></i>
              User Registration
            </h3>
            <p class="card-subtitle">Fill out the form below to create a new account</p>
          </template>

          <template #content>
            <VForm
              :schema="formSchema"
              @submit="handleSubmit"
              @clear="handleClear"
              @cancel="handleCancel"
              :show-labels="true"
              submit-button-text="Register"
              clear-button-text="Reset Form"
            />
          </template>
        </Card>

        <Card v-if="submittedData" class="result-card">
          <template #header>
            <h3 class="card-title">
              <i class="pi pi-check-circle"></i>
              Form Submission Result
            </h3>
            <p class="card-subtitle">Here's the data that was submitted</p>
          </template>

          <template #content>
            <div class="success-message">
              <i class="pi pi-check"></i>
              <span>Form submitted successfully!</span>
            </div>
            <pre>{{ JSON.stringify(submittedData, null, 2) }}</pre>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Card from 'primevue/card';
import type { FormData, ComputedData, FormSchema } from 'pv-form';

const submittedData = ref<any>(null);

const formSchema: FormSchema = {
  firstName: {
    type: 'TextInput',
    label: 'First Name',
    value: '',
    placeholder: 'Enter your first name',
    required: true,
    grid: { xs: 12, md: 6 },
    row: 'first-row',
  },
  lastName: {
    type: 'TextInput',
    label: 'Last Name',
    value: '',
    placeholder: 'Enter your last name',
    required: true,
    grid: { xs: 12, md: 6 },
    row: 'first-row',
  },
  email: {
    type: 'EmailInput',
    label: 'Email Address',
    value: '',
    placeholder: 'your.email@example.com',
    required: true,
    grid: { xs: 12, md: 3 },
    row: 'second-row',
  },
  phone: {
    type: 'TextInput',
    label: 'Phone Number',
    value: '',
    placeholder: 'Enter your phone number',
    grid: { xs: 12, md: 3 },
    row: 'second-row',
  },
  password: {
    type: 'PasswordInput',
    label: 'Password',
    value: '',
    placeholder: 'Enter a secure password',
    required: true,
    grid: { xs: 12, md: 3 },
    row: 'second-row',
  },
  confirmPassword: {
    type: 'PasswordInput',
    label: 'Confirm Password',
    value: '',
    placeholder: 'Confirm your password',
    required: true,
    grid: { xs: 12, md: 3 },
    row: 'second-row',
  },
  birthDate: {
    type: 'DateInput',
    label: 'Date of Birth',
    value: new Date().toISOString().split('T')[0],
    required: true,
    grid: { xs: 12, md: 6 },
    row: 'dates',
  },
  appointmentDateTime: {
    type: 'DateInput',
    label: 'Appointment Date & Time',
    value: new Date().toISOString().substring(0, 16), // Format: YYYY-MM-DDTHH:MM
    enableTime: true,
    required: true,
    disabled: true,
    grid: { xs: 12, md: 6 },
    row: 'dates',
  },
  age: {
    type: 'NumberInput',
    label: 'Age',
    placeholder: 'Your age',
    min: 13,
    max: 120,
    grid: { xs: 12, md: 6 },
    row: 'demographic',
  },
  gender: {
    type: 'SelectInput',
    label: 'Gender',
    value: '',
    options: [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
      { label: 'Other', value: 'other' },
      { label: 'Prefer not to say', value: 'not_specified' },
    ],
    grid: { xs: 12, md: 6 },
    row: 'demographic',
  },
  preferences: {
    type: 'SelectInput',
    label: 'Preferences',
    multiple: true,
    options: [
      { label: 'Newsletters', value: 'newsletters' },
      { label: 'Product Updates', value: 'product_updates' },
      { label: 'Promotions', value: 'promotions' },
      { label: 'Beta Features', value: 'beta_features' },
      { label: 'Community Events', value: 'community_events' },
      { label: 'Surveys', value: 'surveys' },
      { label: 'No Preferences', value: 'none' },
    ],
    placeholder: 'Select your preference',
    grid: { xs: 12, md: 6 },
    row: 'preferences',
  },
  notifications: {
    type: 'CheckboxInput',
    label: 'Email Notifications',
    value: true,
    grid: { xs: 12, md: 6 },
    row: 'preferences',
  },
  bio: {
    type: 'TextAreaInput',
    label: 'Bio',
    value: '',
    placeholder: 'Tell us about yourself...',
    rows: 4,
    grid: { xs: 12 },
  },
};

function handleSubmit(formData: FormData, computedData: ComputedData) {
  console.log('Form submitted:', formData, computedData);
  submittedData.value = { formData, computedData };
}

function handleClear() {
  console.log('Form cleared');
  submittedData.value = null;
}

function handleCancel() {
  console.log('Form cancelled');
  submittedData.value = null;
}
</script>

<style scoped>
.demo-container {
  padding: 20px;
  margin: 0 auto;
}

pre {
  background: var(--ion-color-light);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.4;
}
</style>
