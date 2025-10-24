<template>
  <div class="demo-page">
    <div class="demo-content">
      <div class="demo-container">
        <Card class="p-4 slide-in-left">
          <template #header>
            <h3 class="card-title">Dynamic Field Dependencies</h3>
            <p>Fields that show/hide and update based on other field values</p>
          </template>

          <template #content>
            <VForm
              :schema="formSchema"
              @submit="handleSubmit"
              submit-button-text="Submit Application"
            />
          </template>
        </Card>

        <Card v-if="submittedData" class="p-4 mt-4">
          <template #header>
            <h3 class="card-title">Application Data</h3>
          </template>

          <template #content>
            <pre>{{ JSON.stringify(submittedData, null, 2) }}</pre>
          </template>
        </Card>

        <Card class="p-4 mt-4">
          <template #header>
            <h3 class="card-title">How Dependencies Work</h3>
          </template>

          <template #content>
            <div class="dependency-list">
              <div class="dependency-item">
                <h4>Country → States</h4>
                <p>State options update based on selected country</p>
              </div>
              <div class="dependency-item">
                <h4>Employment Status → Company Details</h4>
                <p>Company fields only show if "Employed" is selected</p>
              </div>
              <div class="dependency-item">
                <h4>Student Status → School Info</h4>
                <p>School field appears when "Student" is checked</p>
              </div>
              <div class="dependency-item">
                <h4>Contact Method → Phone/Email</h4>
                <p>Required contact field changes based on preference</p>
              </div>
            </div>
          </template>
        </Card>

        <Card class="p-4 mt-4">
          <template #header>
            <h3 class="card-title">Resetting Dependent Fields</h3>
            <p class="card-subtitle">Best practices for clearing dependent field values</p>
          </template>

          <template #content>
            <p>
              When a dependency changes, you often want to reset the dependent field's value to
              prevent invalid combinations. The form library provides automatic reset functionality
              with a manual workaround when needed.
            </p>

            <h4>Method 1: Automatic Reset (Built-in)</h4>
            <p>
              The SelectInput component automatically detects dependency changes and resets the
              field value. This works automatically with the <code>dependsOn</code> property:
            </p>
            <pre><code>state: {
  type: 'SelectInput',
  label: 'State',
  dependsOn: 'country',
  options: (filter, dependencyValues) => {
    // Returns options based on country
    return getStatesForCountry(dependencyValues.country);
  }
}</code></pre>
            <p>
              When the country changes, the state field automatically resets to empty and reloads
              options.
            </p>

            <h4>Method 2: Manual Reset (Workaround)</h4>
            <p>
              If the automatic reset doesn't work as expected, you can manually reset dependent
              fields using the <code>onChange</code> callback:
            </p>
            <pre><code>country: {
  type: 'SelectInput',
  label: 'Country',
  options: [...],
  onChange: (value, schema) => {
    // Manual reset as workaround
    schema.state.value = '';
    return value;
  }
}</code></pre>

            <p>
              <strong>Note:</strong> Use the onChange approach as a workaround when the automatic
              reset doesn't work properly, or when you need to reset multiple fields or perform
              additional logic when dependencies change.
            </p>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Card from 'primevue/card';
import type { FormData, ComputedData, FormSchema, Option } from 'pv-form';

const submittedData = ref<any>(null);

// Mock data for dependent options
const countryStates: Record<string, Option[]> = {
  us: [
    { label: 'California', value: 'ca' },
    { label: 'New York', value: 'ny' },
    { label: 'Texas', value: 'tx' },
    { label: 'Florida', value: 'fl' },
  ],
  ca: [
    { label: 'Ontario', value: 'on' },
    { label: 'Quebec', value: 'qc' },
    { label: 'British Columbia', value: 'bc' },
    { label: 'Alberta', value: 'ab' },
  ],
  uk: [
    { label: 'England', value: 'en' },
    { label: 'Scotland', value: 'sc' },
    { label: 'Wales', value: 'wa' },
    { label: 'Northern Ireland', value: 'ni' },
  ],
};

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
  country: {
    type: 'SelectInput',
    label: 'Country',
    value: 'us',
    options: [
      { label: 'United States', value: 'us' },
      { label: 'Canada', value: 'ca' },
      { label: 'United Kingdom', value: 'uk' },
    ],
    required: true,
    grid: { xs: 12, md: 6 },
    // Workaround: Reset dependent field when country changes
    onChange: (value, schema) => {
      schema.state.value = ''; // Reset state when country changes
      return value;
    },
  },
  state: {
    type: 'SelectInput',
    label: 'State/Province',
    value: '',
    options: (filter, dependencyValues) => {
      console.log(
        'State options computed with filter:',
        filter,
        'and dependency values:',
        dependencyValues
      );
      const country = (dependencyValues?.country as Option)?.value;
      return countryStates[country] || [];
    },
    dependsOn: 'country',
    condition: data => !!(data.country as Option)?.value,
    required: true,
    grid: { xs: 12, md: 6 },
  },
  employmentStatus: {
    type: 'SelectInput',
    label: 'Employment Status',
    value: '',
    options: [
      { label: 'Employed', value: 'employed' },
      { label: 'Unemployed', value: 'unemployed' },
      { label: 'Self-employed', value: 'self_employed' },
      { label: 'Retired', value: 'retired' },
    ],
    required: true,
    grid: { xs: 6 },
  },
  companyName: {
    type: 'TextInput',
    label: 'Company Name',
    value: '',
    placeholder: 'Enter your company name',
    condition: data => (data.employmentStatus as Option)?.value === 'employed',
    validation: async (value, schema) => {
      if ((schema?.employmentStatus as Option)?.value === 'employed' && !value) {
        return ['Company name is required for employed status'];
      }
      return null;
    },
    grid: { xs: 12, md: 6 },
  },
  jobTitle: {
    type: 'TextInput',
    label: 'Job Title',
    value: '',
    placeholder: 'Enter your job title',
    condition: schema => (schema.employmentStatus as Option)?.value === 'employed',
    validation: async (value, schema) => {
      if ((schema?.employmentStatus as Option)?.value === 'employed' && !value) {
        return ['Job title is required for employed status'];
      }
      return null;
    },
    grid: { xs: 12, md: 6 },
  },
  isStudent: {
    type: 'CheckboxInput',
    label: 'I am currently a student',
    value: false,
    grid: { xs: 12 },
  },
  schoolName: {
    type: 'TextInput',
    label: 'School/University Name',
    value: '',
    placeholder: 'Enter your school name',
    condition: schema => !!schema.isStudent,
    validation: async (value, schema) => {
      if (schema?.isStudent?.value && !value) {
        return ['School name is required if you are a student'];
      }
      return null;
    },
    grid: { xs: 12 },
  },
  preferredContact: {
    type: 'RadioInput',
    label: 'Preferred Contact Method',
    value: 'email',
    disabled: true,
    options: [
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
    ],
    grid: { xs: 12 },
  },
  email: {
    type: 'EmailInput',
    label: 'Email Address',
    value: '',
    placeholder: 'your.email@example.com',
    grid: { xs: 12, md: 6 },
  },
  phone: {
    type: 'TextInput',
    label: 'Phone Number',
    value: '',
    placeholder: '(000) 000-0000',
    grid: { xs: 12, md: 6 },
  },
  additionalInfo: {
    type: 'TextAreaInput',
    label: 'Additional Information',
    value: '',
    placeholder: "Any additional details you'd like to share...",
    rows: 4,
    grid: { xs: 12 },
  },
};

function handleSubmit(formData: FormData, computedData: ComputedData) {
  console.log('Dependent fields form submitted:', formData, computedData);
  submittedData.value = { formData, computedData };
}
</script>

<style scoped>
.demo-container {
  margin: 0 auto;
}

pre {
  background: var(--p-surface-100);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.4;
}

.dependency-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dependency-item {
  background: var(--p-surface-50);
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid var(--p-primary-color);
}

.dependency-item h4 {
  margin: 0 0 8px 0;
  color: var(--p-primary-color);
  font-size: 1.1rem;
  font-weight: 600;
}

.dependency-item p {
  margin: 0;
  color: var(--p-text-muted-color);
  font-size: 0.9rem;
}
</style>
