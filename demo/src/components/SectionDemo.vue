<template>
  <div class="demo-page">
    <h1 class="demo-title">Section Demo</h1>

    <div class="demo-content">
      <div class="demo-container">
        <Card>
          <template #header>
            <h3 class="card-title">Employee Registration Form</h3>
            <p class="card-subtitle">Demonstrates form sections with titles</p>
          </template>

          <template #content>
            <VForm
              :schema="formSchema"
              @submit="handleSubmit"
              @clear="handleClear"
              @cancel="handleCancel"
              :show-labels="true"
              submit-button-text="Register Employee"
              clear-button-text="Reset Form"
            />
          </template>
        </Card>

        <Card v-if="submittedData">
          <template #header>
            <h3 class="card-title">Form Submission Result</h3>
          </template>

          <template #content>
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
  // Personal Information Section
  personalInfoSection: {
    type: 'FormSection',
    title: 'Personal Information',
    subtitle: 'Basic employee details',
  },
  firstName: {
    type: 'TextInput',
    label: 'First Name',
    value: '',
    placeholder: 'Enter first name',
    required: true,
    grid: { xs: 12, md: 6 },
  },
  lastName: {
    type: 'TextInput',
    label: 'Last Name',
    value: '',
    placeholder: 'Enter last name',
    required: true,
    grid: { xs: 12, md: 6 },
  },
  email: {
    type: 'EmailInput',
    label: 'Email Address',
    value: '',
    placeholder: 'employee@company.com',
    required: true,
    grid: { xs: 12, md: 6 },
  },
  phone: {
    type: 'TextInput',
    label: 'Phone Number',
    value: '',
    placeholder: '+1 (555) 123-4567',
    grid: { xs: 12, md: 6 },
  },
  birthDate: {
    type: 'DateInput',
    label: 'Date of Birth',
    value: '',
    required: true,
    grid: { xs: 12, md: 6 },
  },

  // Employment Details Section
  employmentSection: {
    type: 'FormSection',
    title: 'Employment Details',
    subtitle: 'Job-related information',
  },
  jobTitle: {
    type: 'TextInput',
    label: 'Job Title',
    value: '',
    placeholder: 'Software Engineer',
    required: true,
    grid: { xs: 12, md: 6 },
  },
  department: {
    type: 'SelectInput',
    label: 'Department',
    value: '',
    required: true,
    options: [
      { label: 'Engineering', value: 'engineering' },
      { label: 'Marketing', value: 'marketing' },
      { label: 'Sales', value: 'sales' },
      { label: 'Human Resources', value: 'hr' },
      { label: 'Finance', value: 'finance' },
    ],
    grid: { xs: 12, md: 6 },
  },
  startDate: {
    type: 'DateInput',
    label: 'Start Date',
    value: '',
    required: true,
    grid: { xs: 12, md: 6 },
  },
  salary: {
    type: 'NumberInput',
    label: 'Annual Salary',
    value: '',
    placeholder: '50000',
    min: 20000,
    grid: { xs: 12, md: 6 },
  },
  employmentType: {
    type: 'RadioInput',
    label: 'Employment Type',
    value: 'full-time',
    options: [
      { label: 'Full-time', value: 'full-time' },
      { label: 'Part-time', value: 'part-time' },
      { label: 'Contract', value: 'contract' },
      { label: 'Intern', value: 'intern' },
    ],
    grid: { xs: 12 },
  },

  // Address Information Section
  addressSection: {
    type: 'FormSection',
    title: 'Address Information',
    subtitle: 'Residential address details',
  },
  streetAddress: {
    type: 'TextInput',
    label: 'Street Address',
    value: '',
    placeholder: '123 Main St',
    required: true,
    grid: { xs: 12 },
  },
  city: {
    type: 'TextInput',
    label: 'City',
    value: '',
    placeholder: 'New York',
    required: true,
    grid: { xs: 12, md: 4 },
  },
  state: {
    type: 'SelectInput',
    label: 'State',
    value: '',
    required: true,
    options: [
      { label: 'California', value: 'CA' },
      { label: 'New York', value: 'NY' },
      { label: 'Texas', value: 'TX' },
      { label: 'Florida', value: 'FL' },
      { label: 'Illinois', value: 'IL' },
    ],
    grid: { xs: 12, md: 4 },
  },
  zipCode: {
    type: 'TextInput',
    label: 'ZIP Code',
    value: '',
    placeholder: '10001',
    required: true,
    grid: { xs: 12, md: 4 },
  },

  // Additional Information Section
  additionalSection: {
    type: 'FormSection',
    title: 'Additional Information',
    subtitle: 'Optional details about the employee',
  },
  bio: {
    type: 'TextAreaInput',
    label: 'Biography',
    value: '',
    placeholder: 'Tell us about yourself...',
    rows: 4,
    grid: { xs: 12 },
  },
  skills: {
    type: 'SelectInput',
    label: 'Skills',
    multiple: true,
    options: [
      { label: 'JavaScript', value: 'javascript' },
      { label: 'Python', value: 'python' },
      { label: 'React', value: 'react' },
      { label: 'Vue.js', value: 'vue' },
      { label: 'Node.js', value: 'nodejs' },
      { label: 'SQL', value: 'sql' },
      { label: 'Project Management', value: 'project-management' },
    ],
    grid: { xs: 12, md: 6 },
  },
  emergencyContact: {
    type: 'TextInput',
    label: 'Emergency Contact',
    value: '',
    placeholder: 'John Doe (+1 555-999-8888)',
    grid: { xs: 12, md: 6 },
  },
};

function handleSubmit(formData: FormData, computedData: ComputedData) {
  console.log('Form submitted:', { formData, computedData });
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
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

ion-card {
  margin: 1rem 0;
}

pre {
  background: var(--ion-color-light);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.875rem;
}
</style>
