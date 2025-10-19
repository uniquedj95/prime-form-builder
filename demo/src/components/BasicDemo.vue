<template>
  <div class="demo-page">
    <div class="demo-content">
      <div class="demo-container">
        <Card class="p-4 slide-in-left">
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

        <Card v-if="submittedData" class="p-4">
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
  },
  lastName: {
    type: 'TextInput',
    label: 'Last Name',
    value: '',
    placeholder: 'Enter your last name',
    required: true,
    grid: { xs: 12, md: 6 },
  },
  email: {
    type: 'EmailInput',
    label: 'Email Address',
    value: '',
    placeholder: 'your.email@example.com',
    required: true,
    grid: { xs: 12, sm: 12, md: 8 },
  },
  phone: {
    type: 'TextInput',
    label: 'Phone Number',
    value: '',
    placeholder: 'Enter your phone number',
    grid: { xs: 12, sm: 6, md: 4 },
  },
  password: {
    type: 'PasswordInput',
    label: 'Password',
    value: '',
    placeholder: 'Enter a secure password',
    required: true,
    grid: { xs: 12, sm: 6, md: 6, lg: 4 },
  },
  confirmPassword: {
    type: 'PasswordInput',
    label: 'Confirm Password',
    value: '',
    placeholder: 'Confirm your password',
    required: true,
    grid: { xs: 12, sm: 6, md: 6, lg: 4 },
  },
  twoFactorEnabled: {
    type: 'CheckboxInput',
    label: 'Enable 2FA',
    value: false,
    grid: { xs: 12, sm: 12, md: 12, lg: 4 },
  },
  birthDate: {
    type: 'DateInput',
    label: 'Date of Birth',
    value: new Date().toISOString().split('T')[0],
    required: true,
    grid: { xs: 12, sm: 6, md: 6 },
  },
  appointmentDateTime: {
    type: 'DateInput',
    label: 'Appointment Date & Time',
    value: new Date().toISOString().substring(0, 16),
    enableTime: true,
    required: true,
    disabled: true,
    grid: { xs: 12, sm: 6, md: 6 },
  },
  age: {
    type: 'NumberInput',
    label: 'Age',
    placeholder: 'Your age',
    min: 13,
    max: 120,
    grid: { xs: 6, sm: 4, md: 3 },
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
    grid: { xs: 6, sm: 4, md: 3 },
  },
  country: {
    type: 'SelectInput',
    label: 'Country',
    value: '',
    options: [
      { label: 'United States', value: 'us' },
      { label: 'Canada', value: 'ca' },
      { label: 'United Kingdom', value: 'uk' },
      { label: 'Australia', value: 'au' },
      { label: 'Germany', value: 'de' },
      { label: 'France', value: 'fr' },
    ],
    grid: { xs: 12, sm: 4, md: 6 },
  },
  preferences: {
    type: 'SelectInput',
    label: 'Communication Preferences',
    multiple: true,
    options: [
      { label: 'Email Newsletters', value: 'newsletters' },
      { label: 'Product Updates', value: 'product_updates' },
      { label: 'Special Promotions', value: 'promotions' },
      { label: 'Beta Features Access', value: 'beta_features' },
      { label: 'Community Events', value: 'community_events' },
      { label: 'Survey Invitations', value: 'surveys' },
    ],
    placeholder: 'Select your communication preferences',
    grid: { xs: 12, sm: 8, md: 8 },
  },
  notifications: {
    type: 'CheckboxInput',
    label: 'Email Notifications',
    value: true,
    grid: { xs: 6, sm: 2, md: 2 }, // Half → 1/6 → 1/6
  },
  marketingEmails: {
    type: 'CheckboxInput',
    label: 'Marketing Emails',
    value: false,
    grid: { xs: 6, sm: 2, md: 2 }, // Half → 1/6 → 1/6
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
