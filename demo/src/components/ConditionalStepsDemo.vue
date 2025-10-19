<template>
  <div class="demo-page">
    <div class="demo-content">
      <div class="container">
        <h1>Conditional Steps Demo</h1>
        <p>
          This example demonstrates how to conditionally show or hide steps in a multi-step form
          based on the values entered in previous steps.
        </p>

        <Card class="p-4 slide-in-left">
          <template #header>
            <h3 class="card-title">Demo Form</h3>
            <p class="card-subtitle">Try changing the form options to see steps appear/disappear</p>
          </template>

          <template #content>
            <v-form
              :multi-step-config="multiStepConfig"
              @multi-step-submit="handleSubmit"
              @step-change="handleStepChange"
            />
          </template>
        </Card>

        <!-- Submit Results -->
        <Card v-if="submittedData" class="p-4 mt-4">
          <template #header>
            <h3 class="card-title">Form Submission Data</h3>
          </template>

          <template #content>
            <Accordion multiple>
              <AccordionPanel value="0">
                <AccordionHeader>View Submitted Data</AccordionHeader>
                <AccordionContent>
                  <div class="accordion-content">
                    <pre>{{ JSON.stringify(submittedData, null, 2) }}</pre>
                  </div>
                </AccordionContent>
              </AccordionPanel>
            </Accordion>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import Card from 'primevue/card';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import type { MultiStepConfig, MultiStepFormData, Option } from 'pv-form';

const submittedData = ref<MultiStepFormData | null>(null);

const multiStepConfig = reactive<MultiStepConfig>({
  steps: [
    // Step 1: Basic Information
    {
      id: 'basic-info',
      title: 'Basic Information',
      subtitle: 'Your personal details',
      schema: {
        fullName: {
          type: 'TextInput',
          label: 'Full Name',
          required: true,
        },
        email: {
          type: 'EmailInput',
          label: 'Email',
          required: true,
        },
        accountType: {
          type: 'SelectInput',
          label: 'Account Type',
          options: [
            { label: 'Personal', value: 'personal' },
            { label: 'Business', value: 'business' },
            { label: 'Educational', value: 'educational' },
          ],
          value: 'personal',
          required: true,
        },
      },
    },

    // Step 2: Business Information (Conditional - only show if account type is business)
    {
      id: 'business-info',
      title: 'Business Information',
      subtitle: 'Your business details',
      schema: {
        companyName: {
          type: 'TextInput',
          label: 'Company Name',
          required: true,
        },
        businessType: {
          type: 'SelectInput',
          label: 'Business Type',
          options: [
            { label: 'Sole Proprietorship', value: 'sole-prop' },
            { label: 'LLC', value: 'llc' },
            { label: 'Corporation', value: 'corp' },
            { label: 'Partnership', value: 'partnership' },
            { label: 'Non-Profit', value: 'non-profit' },
          ],
          required: true,
        },
        employeeCount: {
          type: 'NumberInput',
          label: 'Number of Employees',
          required: true,
        },
      },
      // Condition: Only show if accountType is 'business'
      condition: formData => (formData['basic-info']?.accountType as Option)?.value === 'business',
    },
    // Step 3: Educational Information (Conditional - only show if account type is educational)
    {
      id: 'educational-info',
      title: 'Educational Information',
      subtitle: 'Your institution details',
      schema: {
        institutionName: {
          type: 'TextInput',
          label: 'Institution Name',
          required: true,
        },
        institutionType: {
          type: 'SelectInput',
          label: 'Institution Type',
          options: [
            { label: 'K-12 School', value: 'k12' },
            { label: 'University', value: 'university' },
            { label: 'Community College', value: 'community-college' },
            { label: 'Technical School', value: 'technical' },
            { label: 'Other', value: 'other' },
          ],
          required: true,
        },
        studentCount: {
          type: 'NumberInput',
          label: 'Number of Students',
          required: true,
        },
      },
      // Condition: Only show if accountType is 'educational'
      condition: formData =>
        (formData['basic-info']?.accountType as Option)?.value === 'educational',
    },
    // Step 4: Preferences
    {
      id: 'preferences',
      title: 'Preferences',
      subtitle: 'Set your account preferences',
      schema: {
        theme: {
          type: 'SelectInput',
          label: 'Preferred Theme',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'System Default', value: 'system' },
          ],
          value: 'system',
        },
        notifications: {
          type: 'CheckboxInput',
          label: 'Notification Preferences',
          options: [
            { label: 'Email notifications', value: 'email' },
            { label: 'SMS notifications', value: 'sms' },
            { label: 'In-app notifications', value: 'app' },
          ],
        },
      },
    },

    // Step 5: Review & Confirm
    {
      id: 'review',
      title: 'Review & Confirm',
      subtitle: 'Confirm your information',
      schema: {
        terms: {
          type: 'CheckboxInput',
          label: 'Terms and Conditions',
          options: [
            { label: 'I agree to the Terms of Service and Privacy Policy', value: 'agreed' },
          ],
          required: true,
        },
      },
    },
  ],
  stepPosition: 'top',
  showProgress: true,
  allowStepNavigation: true,
});

function handleStepChange(stepIndex: number, stepId: string) {
  console.log(`Moving to step ${stepIndex + 1}: ${stepId}`);
}

function handleSubmit(data: MultiStepFormData) {
  submittedData.value = data;
  console.log('Form submitted with data:', data);
}
</script>

<style scoped>
.container {
  margin: 0 auto;
}

.accordion-content {
  padding: 16px;
  background-color: var(--p-surface-100);
  border-radius: 0 0 8px 8px;
  overflow-x: auto;
}

pre {
  margin: 0;
  white-space: pre-wrap;
}
</style>
