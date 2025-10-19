<template>
  <div class="demo-page">
    <div class="demo-content">
      <div class="demo-container">
        <Card class="p-4">
          <template #header>
            <h3 class="card-title">User Registration - Multi-Step</h3>
            <p class="card-subtitle">A comprehensive registration form with multiple steps</p>
          </template>

          <template #content>
            <div class="demo-controls">
              <SelectButton
                v-model="stepPosition"
                :options="stepPositionOptions"
                option-label="label"
                option-value="value"
                class="step-position-selector"
              />

              <div class="demo-options">
                <div class="flex align-items-center">
                  <Checkbox
                    v-model="showProgress"
                    @change="handleOptionsChange"
                    input-id="show-progress"
                  />
                  <label for="show-progress" class="ml-2">Show Progress</label>
                </div>
                <div class="flex align-items-center">
                  <Checkbox
                    v-model="allowNavigation"
                    @change="handleOptionsChange"
                    input-id="allow-navigation"
                  />
                  <label for="allow-navigation" class="ml-2">Allow Step Navigation</label>
                </div>
              </div>
            </div>

            <VForm
              :multi-step-config="multiStepConfig"
              @multi-step-submit="handleMultiStepSubmit"
              @step-change="handleStepChange"
              @clear="handleClear"
              @cancel="handleCancel"
              :show-labels="true"
              submit-button-text="Complete Registration"
              previous-button-text="Back"
              next-button-text="Continue"
              button-placement="end"
            />
          </template>
        </Card>

        <Card v-if="submittedData" class="p-4">
          <template #header>
            <h3 class="card-title">Multi-Step Form Submission Result</h3>
          </template>

          <template #content>
            <Accordion multiple>
              <AccordionPanel value="0">
                <AccordionHeader>Form Data</AccordionHeader>
                <AccordionContent>
                  <div class="accordion-content">
                    <pre>{{ JSON.stringify(submittedData.formData, null, 2) }}</pre>
                  </div>
                </AccordionContent>
              </AccordionPanel>
              <AccordionPanel value="1">
                <AccordionHeader>Computed Data</AccordionHeader>
                <AccordionContent>
                  <div class="accordion-content">
                    <pre>{{ JSON.stringify(submittedData.computedData, null, 2) }}</pre>
                  </div>
                </AccordionContent>
              </AccordionPanel>
            </Accordion>
          </template>
        </Card>

        <Card v-if="currentStepInfo" class="p-4 mt-4">
          <template #header>
            <h3 class="card-title">Current Step Info</h3>
          </template>
          <template #content>
            <p>
              <strong>Step:</strong> {{ currentStepInfo.index + 1 }} of
              {{ multiStepConfig.steps.length }}
            </p>
            <p><strong>Step ID:</strong> {{ currentStepInfo.id }}</p>
            <p><strong>Step Title:</strong> {{ currentStepInfo.title }}</p>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import Card from 'primevue/card';
import SelectButton from 'primevue/selectbutton';
import Checkbox from 'primevue/checkbox';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import type { MultiStepConfig, MultiStepFormData, StepPosition } from 'pv-form';

const submittedData = ref<any>(null);
const currentStepInfo = ref<{ index: number; id: string; title: string } | null>(null);

// Demo configuration
const stepPosition = ref<StepPosition>('top');
const showProgress = ref(true);
const allowNavigation = ref(false);

const stepPositionOptions = ref([
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
]);

const multiStepConfig = reactive<MultiStepConfig>({
  steps: [
    {
      id: 'personal-info',
      title: 'Personal Information',
      subtitle: 'Tell us about yourself',
      icon: 'pi pi-user',
      schema: {
        firstName: {
          type: 'TextInput',
          label: 'First Name',
          required: true,
          placeholder: 'Enter your first name',
          grid: { xs: 12, md: 6 },
        },
        lastName: {
          type: 'TextInput',
          label: 'Last Name',
          required: true,
          placeholder: 'Enter your last name',
          grid: { xs: 12, md: 6 },
        },
        email: {
          type: 'EmailInput',
          label: 'Email Address',
          required: true,
          placeholder: 'Enter your email',
          grid: { xs: 12 },
        },
        dateOfBirth: {
          type: 'DateInput',
          label: 'Date of Birth',
          required: true,
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
      id: 'address-info',
      title: 'Address Details',
      subtitle: 'Where can we reach you?',
      icon: 'pi pi-map-marker',
      schema: {
        street: {
          type: 'TextInput',
          label: 'Street Address',
          required: true,
          placeholder: 'Enter your street address',
          grid: { xs: 12 },
        },
        city: {
          type: 'TextInput',
          label: 'City',
          required: true,
          placeholder: 'Enter your city',
          grid: { xs: 12, md: 6 },
        },
        state: {
          type: 'SelectInput',
          label: 'State/Province',
          required: true,
          options: [
            { label: 'California', value: 'CA' },
            { label: 'New York', value: 'NY' },
            { label: 'Texas', value: 'TX' },
            { label: 'Florida', value: 'FL' },
            { label: 'Illinois', value: 'IL' },
          ],
          grid: { xs: 12, md: 6 },
        },
        zipCode: {
          type: 'TextInput',
          label: 'ZIP/Postal Code',
          required: true,
          placeholder: 'Enter ZIP code',
          grid: { xs: 12, md: 4 },
        },
        country: {
          type: 'SelectInput',
          label: 'Country',
          required: true,
          disabled: true,
          options: [
            { label: 'United States', value: 'US' },
            { label: 'Canada', value: 'CA' },
            { label: 'United Kingdom', value: 'UK' },
            { label: 'Australia', value: 'AU' },
            { label: 'Malawi', value: 'MW' },
          ],
          value: 'MW',
          grid: { xs: 12, md: 8 },
        },
      },
    },
    {
      id: 'preferences',
      title: 'Preferences',
      subtitle: 'Customize your experience',
      icon: 'pi pi-cog',
      schema: {
        interests: {
          type: 'CheckboxInput',
          label: 'Areas of Interest',
          multiple: true,
          options: [
            { label: 'Technology', value: 'tech' },
            { label: 'Sports', value: 'sports' },
            { label: 'Music', value: 'music' },
            { label: 'Travel', value: 'travel' },
            { label: 'Food', value: 'food' },
          ],
          grid: { xs: 12, md: 6 },
        },
        newsletter: {
          type: 'RadioInput',
          label: 'Newsletter Frequency',
          options: [
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
            { label: 'Never', value: 'never' },
          ],
          value: 'weekly',
          grid: { xs: 12, md: 6 },
        },
        bio: {
          type: 'TextAreaInput',
          label: 'Tell us about yourself',
          placeholder: 'Share a bit about your background and interests...',
          rows: 4,
          maxLength: 500,
          counter: true,
          grid: { xs: 12 },
        },
      },
    },
    {
      id: 'review',
      title: 'Review & Confirm',
      subtitle: 'Please review your information',
      schema: {
        terms: {
          type: 'CheckboxInput',
          label: 'Agreement',
          required: true,
          options: [
            { label: 'I agree to the Terms of Service and Privacy Policy', value: 'agreed' },
          ],
          grid: { xs: 12 },
        },
        marketing: {
          type: 'CheckboxInput',
          label: 'Marketing Communications',
          options: [
            { label: 'I would like to receive marketing communications', value: 'marketing' },
          ],
          grid: { xs: 12 },
        },
      },
    },
  ],
  stepPosition: stepPosition.value,
  showProgress: showProgress.value,
  allowStepNavigation: allowNavigation.value,
});

// Watch for stepPosition changes
watch(stepPosition, newValue => {
  multiStepConfig.stepPosition = newValue;
});

function handleOptionsChange() {
  multiStepConfig.showProgress = showProgress.value;
  multiStepConfig.allowStepNavigation = allowNavigation.value;
  multiStepConfig.stepPosition = stepPosition.value;
}

function handleMultiStepSubmit(data: MultiStepFormData) {
  submittedData.value = data;
  console.log('Multi-step form submitted:', data);
}

function handleStepChange(stepIndex: number, stepId: string) {
  const step = multiStepConfig.steps[stepIndex];
  currentStepInfo.value = {
    index: stepIndex,
    id: stepId,
    title: step.title,
  };
  console.log('Step changed:', { stepIndex, stepId });
}

function handleClear() {
  submittedData.value = null;
  currentStepInfo.value = null;
  console.log('Form cleared');
}

function handleCancel() {
  submittedData.value = null;
  currentStepInfo.value = null;
  console.log('Form cancelled');
}
</script>

<style scoped>
.demo-container {
  margin: 0 auto;
}

.demo-controls {
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--p-surface-100);
  border-radius: 8px;
}

.step-position-selector {
  margin-bottom: 1rem;
}

.demo-options {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.demo-options .p-checkbox,
.demo-options .p-dropdown {
  min-width: fit-content;
}

.accordion-content {
  padding: 1rem;
  background: var(--p-surface-100);
}

.accordion-content pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  margin: 0;
}

.accordion-content h4 {
  margin: 1rem 0 0.5rem 0;
  color: var(--p-primary-color);
  font-weight: 600;
}

.accordion-content h4:first-child {
  margin-top: 0;
}

@media (max-width: 768px) {
  .demo-container {
    padding: 0.5rem;
  }

  .demo-options {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
}
</style>
