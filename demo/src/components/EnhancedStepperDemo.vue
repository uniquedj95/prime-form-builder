<template>
  <div class="demo-page">
    <h1 class="demo-title">Enhanced Stepper Demo</h1>
    <p class="demo-description">
      This demo showcases the enhanced stepper design inspired by PrimeVueFormBuilderSteps.vue.
      Notice how steps with icons display the icon, while steps without icons show step numbers.
    </p>

    <div class="demo-content">
      <div class="demo-container">
        <Card>
          <template #header>
            <h3 class="card-title">Mixed Icon & Number Steps</h3>
            <p class="card-subtitle">Demonstrating both icon and number-based step indicators</p>
          </template>

          <template #content>
            <VForm
              :multi-step-config="enhancedMultiStepConfig"
              @multi-step-submit="handleSubmit"
              @step-change="handleStepChange"
              @clear="handleClear"
              @cancel="handleCancel"
              :show-labels="true"
              submit-button-text="Complete Process"
              previous-button-text="Back"
              next-button-text="Continue"
              clear-button-text="Reset"
              cancel-button-text="Cancel"
            />
          </template>
        </Card>

        <!-- Debug Panel -->
        <Card v-if="submittedData || currentStepInfo" class="mt-4">
          <template #header>
            <h3 class="card-title">Debug Information</h3>
          </template>
          <template #content>
            <div v-if="currentStepInfo" class="mb-4">
              <h4>Current Step:</h4>
              <p>
                <strong>Index:</strong> {{ currentStepInfo.index }}<br />
                <strong>ID:</strong> {{ currentStepInfo.id }}<br />
                <strong>Title:</strong> {{ currentStepInfo.title }}
              </p>
            </div>

            <div v-if="submittedData">
              <h4>Submitted Data:</h4>
              <pre>{{ JSON.stringify(submittedData, null, 2) }}</pre>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import Card from 'primevue/card';
import type { MultiStepConfig, MultiStepFormData } from 'pv-form';

const submittedData = ref<any>(null);
const currentStepInfo = ref<{ index: number; id: string; title: string } | null>(null);

const enhancedMultiStepConfig = reactive<MultiStepConfig>({
  steps: [
    {
      id: 'step-with-icon-1',
      title: 'User Information',
      subtitle: 'Step with user icon',
      icon: 'pi pi-user',
      schema: {
        name: {
          type: 'TextInput',
          label: 'Full Name',
          required: true,
          placeholder: 'Enter your full name',
          grid: { xs: 12 },
        },
        email: {
          type: 'EmailInput',
          label: 'Email Address',
          required: true,
          placeholder: 'Enter your email',
          grid: { xs: 12 },
        },
      },
    },
    {
      id: 'step-without-icon',
      title: 'Additional Details',
      subtitle: 'Step without icon (shows number)',
      // No icon property - should show step number
      schema: {
        age: {
          type: 'NumberInput',
          label: 'Age',
          required: true,
          placeholder: 'Enter your age',
          grid: { xs: 12, md: 6 },
        },
        phone: {
          type: 'TextInput',
          label: 'Phone Number',
          placeholder: 'Enter your phone number',
          grid: { xs: 12, md: 6 },
        },
      },
    },
    {
      id: 'step-with-icon-2',
      title: 'Settings',
      subtitle: 'Step with settings icon',
      icon: 'pi pi-cog',
      schema: {
        notifications: {
          type: 'CheckboxInput',
          label: 'Enable Notifications',
          options: [
            { label: 'Email notifications', value: 'email' },
            { label: 'SMS notifications', value: 'sms' },
            { label: 'Push notifications', value: 'push' },
          ],
          grid: { xs: 12 },
        },
      },
    },
    {
      id: 'final-step',
      title: 'Review & Submit',
      subtitle: 'Final step without icon',
      // No icon property - should show step number
      schema: {
        terms: {
          type: 'CheckboxInput',
          label: 'Terms and Conditions',
          required: true,
          options: [{ label: 'I agree to the terms and conditions', value: 'agreed' }],
          grid: { xs: 12 },
        },
        comments: {
          type: 'TextAreaInput',
          label: 'Additional Comments',
          placeholder: 'Any additional comments...',
          rows: 3,
          grid: { xs: 12 },
        },
      },
    },
  ],
  allowStepNavigation: true,
});

function handleSubmit(data: MultiStepFormData) {
  console.log('Form submitted:', data);
  submittedData.value = data;
}

function handleStepChange(stepIndex: number, stepId: string) {
  const step = enhancedMultiStepConfig.steps[stepIndex];
  currentStepInfo.value = {
    index: stepIndex,
    id: stepId,
    title: step?.title || 'Unknown',
  };
  console.log('Step changed:', { stepIndex, stepId, title: step?.title });
}

function handleClear() {
  submittedData.value = null;
  console.log('Form cleared');
}

function handleCancel() {
  submittedData.value = null;
  currentStepInfo.value = null;
  console.log('Form cancelled');
}
</script>

<style scoped>
.demo-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.demo-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #2563eb;
}

.demo-description {
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.demo-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.demo-container {
  width: 100%;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.card-subtitle {
  color: #64748b;
  margin: 0.5rem 0 0 0;
  font-size: 0.95rem;
}

pre {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow-x: auto;
  font-size: 0.875rem;
}

h4 {
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.mt-4 {
  margin-top: 1.5rem;
}
</style>
