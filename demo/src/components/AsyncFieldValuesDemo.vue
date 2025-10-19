<template>
  <div class="demo-page">
    <div class="demo-content">
      <div class="demo-container">
        <Card class="p-4 slide-in-left">
          <template #header>
            <h3 class="card-title">Async Form Field Values</h3>
            <p class="card-subtitle">dynamically loading field values via functions and Promises</p>
          </template>

          <template #content>
            <v-form
              :schema="formSchema"
              @submit="handleSubmit"
              :custom-buttons="customButtons"
              submit-button-text="Submit Form"
            />
          </template>
        </Card>

        <!-- Results Section -->
        <Card v-if="submittedData" class="p-4 mt-4">
          <template #header>
            <h3 class="card-title">Submitted Data</h3>
          </template>
          <template #content>
            <pre>{{ JSON.stringify(submittedData, null, 2) }}</pre>
          </template>
        </Card>

        <!-- Documentation Section -->
        <Card class="p-4 mt-4">
          <template #header>
            <h3 class="card-title">Async Field Values</h3>
            <p class="card-subtitle">Supporting functions and Promises for field values</p>
          </template>

          <template #content>
            <p>This demo showcases the new <code>FormFieldValue</code> type that supports:</p>

            <div class="feature-list">
              <div class="feature-item">
                <h4>Direct Values</h4>
                <p>Traditional static values like strings, numbers, booleans</p>
              </div>

              <div class="feature-item">
                <h4>Function Values</h4>
                <p>Functions that return values (computed synchronously)</p>
              </div>

              <div class="feature-item">
                <h4>Async Function Values</h4>
                <p>Functions that return Promises for async data loading</p>
              </div>

              <div class="feature-item">
                <h4>Promise Values</h4>
                <p>Direct Promise objects that resolve to values</p>
              </div>
            </div>

            <h4>Supported Field Types</h4>
            <div class="feature-list">
              <div class="feature-item">
                <h4>Text Inputs</h4>
                <p>TextInput, EmailInput, PasswordInput, NumberInput</p>
              </div>

              <div class="feature-item">
                <h4>Selection Inputs</h4>
                <p>SelectInput, RadioInput, CheckboxInput</p>
              </div>

              <div class="feature-item">
                <h4>Specialized Inputs</h4>
                <p>TextAreaInput, DateInput</p>
              </div>
            </div>

            <h4>Examples</h4>

            <h5>1. Direct Value</h5>
            <pre><code>firstName: {
  type: 'TextInput',
  label: 'First Name',
  value: 'John Doe', // Direct string value
}</code></pre>

            <h5>2. Function Value</h5>
            <pre><code>computedField: {
  type: 'TextInput',
  label: 'Computed Value',
  value: () => 'Generated: ' + new Date().toISOString(),
}</code></pre>

            <h5>3. Async Function Value</h5>
            <pre><code>asyncField: {
  type: 'TextInput',
  label: 'From API',
  value: async () => {
    const response = await fetch('/api/user');
    const data = await response.json();
    return data.name;
  },
}</code></pre>

            <h5>4. Promise Value</h5>
            <pre><code>promiseField: {
  type: 'TextInput',
  label: 'Promise Data',
  value: fetch('/api/data').then(r => r.json()).then(d => d.value),
}</code></pre>

            <h5>5. Checkbox with Async Boolean</h5>
            <pre><code>asyncCheckbox: {
  type: 'CheckboxInput',
  label: 'User Preference',
  value: async () => {
    const prefs = await fetch('/api/preferences');
    return prefs.emailNotifications;
  },
}</code></pre>

            <h5>6. Radio with Async Selection</h5>
            <pre><code>asyncRadio: {
  type: 'RadioInput',
  label: 'Default Option',
  value: async () => {
    return await getDefaultOption();
  },
  options: [...],
}</code></pre>

            <h5>7. TextArea with Async Content</h5>
            <pre><code>asyncTextArea: {
  type: 'TextAreaInput',
  label: 'User Bio',
  value: async () => {
    const profile = await fetchUserProfile();
    return profile.bio;
  },
}</code></pre>

            <p>
              <strong>Loading States:</strong> All fields show loading spinners when resolving async
              values. Fields are disabled during value resolution to prevent user interaction.
            </p>

            <p>
              <strong>Error Handling:</strong> If value resolution fails, error messages are
              displayed and included in form validation.
            </p>

            <p>
              <strong>Performance:</strong> Function values are evaluated once during form
              initialization. For dynamic updates, use computed values or reactive dependencies.
            </p>

            <p>
              <strong>Type Safety:</strong> All FormFieldValue types are fully typed in TypeScript,
              ensuring compile-time validation and excellent developer experience.
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
import type { FormData, ComputedData, FormSchema } from 'pv-form';

const submittedData = ref<any>(null);

// Mock API calls for demonstration
const mockApiCall = (data: string, delay: number = 2000): Promise<string> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`API Result: ${data} (loaded after ${delay}ms)`);
    }, delay);
  });
};

const fetchUserProfile = async (): Promise<string> => {
  // Simulate API call with longer delay to see loading spinner
  await new Promise(resolve => setTimeout(resolve, 2500));
  return 'John Doe (from API)';
};

const formSchema: FormSchema = {
  // Section header
  section1: {
    type: 'FormSection',
    title: 'Direct and Function Values',
    subtitle: 'Static and computed values',
  },

  // Direct value (traditional)
  directValue: {
    type: 'TextInput',
    label: 'Direct Value',
    value: 'Static value set directly',
    placeholder: 'This field has a direct value',
    grid: { xs: 12, md: 6 },
  },

  // Function value that computes synchronously
  functionValue: {
    type: 'TextInput',
    label: 'Function Value',
    value: () => `Generated at: ${new Date().toLocaleTimeString()}`,
    placeholder: 'This field uses a function',
    grid: { xs: 12, md: 6 },
  },

  // Section header
  section2: {
    type: 'FormSection',
    title: 'Async Values',
    subtitle: 'Values loaded asynchronously',
  },

  // Async function value
  asyncFunctionValue: {
    type: 'TextInput',
    label: 'Async Function Value',
    value: async () => {
      return await mockApiCall('User Data', 1500);
    },
    placeholder: 'Loading from async function...',
    grid: { xs: 12, md: 6 },
  },

  // Direct Promise value
  promiseValue: {
    type: 'TextInput',
    label: 'Promise Value',
    value: mockApiCall('Configuration', 1800),
    placeholder: 'Loading from promise...',
    grid: { xs: 12, md: 6 },
  },

  // Section header
  section3: {
    type: 'FormSection',
    title: 'Select Fields with Async Values',
    subtitle: 'Dropdown fields with async default values',
  },

  // Select field with async default value
  asyncSelectValue: {
    type: 'SelectInput',
    label: 'Async Select Value',
    multiple: true,
    value: async () => {
      // Simulate selecting a default option from API with longer delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return 'option2'; // This will select "Option 2" by default
    },
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
    placeholder: 'Select an option',
    grid: { xs: 12, md: 6 },
  },

  // Complex async value for user profile
  userProfile: {
    type: 'TextInput',
    label: 'User Profile',
    value: fetchUserProfile,
    placeholder: 'Loading user profile...',
    grid: { xs: 12, md: 6 },
  },

  // Section header
  section4: {
    type: 'FormSection',
    title: 'Checkbox and Radio Fields',
    subtitle: 'Boolean and option selection with async values',
  },

  // Checkbox with async boolean value
  asyncCheckbox: {
    type: 'CheckboxInput',
    label: 'Terms Accepted (from user preferences)',
    value: async () => {
      // Simulate fetching user preference
      await new Promise(resolve => setTimeout(resolve, 1200));
      return true; // User has previously accepted terms
    },
    grid: { xs: 12, md: 6 },
  },

  // Radio field with async default selection
  asyncRadio: {
    type: 'RadioInput',
    label: 'Preferred Contact Method',
    value: async () => {
      // Simulate fetching user's preferred contact method
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { label: 'Email', value: 'email' };
    },
    options: [
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
      { label: 'SMS', value: 'sms' },
    ],
    grid: { xs: 12, md: 6 },
  },

  // Section header
  section5: {
    type: 'FormSection',
    title: 'TextArea and Other Fields',
    subtitle: 'Multi-line text and specialized inputs',
  },

  // TextArea with async content
  asyncTextArea: {
    type: 'TextAreaInput',
    label: 'User Bio',
    value: async () => {
      // Simulate fetching user bio from profile
      await new Promise(resolve => setTimeout(resolve, 1500));
      return 'Experienced developer with expertise in Vue.js, TypeScript, and modern web technologies. Passionate about creating intuitive user interfaces and scalable applications.';
    },
    rows: 4,
    placeholder: 'Loading user bio...',
    grid: { xs: 12 },
  },

  // Date field with function value
  computedDate: {
    type: 'DateInput',
    label: 'Next Business Day',
    value: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      // Skip weekends
      if (tomorrow.getDay() === 6) tomorrow.setDate(tomorrow.getDate() + 2); // Saturday -> Monday
      if (tomorrow.getDay() === 0) tomorrow.setDate(tomorrow.getDate() + 1); // Sunday -> Monday
      return tomorrow.toISOString().split('T')[0];
    },
    grid: { xs: 12, md: 6 },
  },

  // Password field with async validation
  generatedPassword: {
    type: 'PasswordInput',
    label: 'Generated Secure Password',
    value: async () => {
      // Simulate password generation
      await new Promise(resolve => setTimeout(resolve, 800));
      return 'SecurePass123!@#';
    },
    placeholder: 'Generating secure password...',
    grid: { xs: 12, md: 6 },
  },

  // Section header
  section6: {
    type: 'FormSection',
    title: 'Mixed Values',
    subtitle: 'Combination of different value types',
  },

  // Number field with function value
  computedNumber: {
    type: 'NumberInput',
    label: 'Computed Number',
    value: () => Math.floor(Math.random() * 100),
    grid: { xs: 12, md: 4 },
  },

  // Email field with async value
  asyncEmail: {
    type: 'EmailInput',
    label: 'Email from Settings',
    value: async () => {
      // Simulate fetching email from user settings
      await new Promise(resolve => setTimeout(resolve, 300));
      return 'user@example.com';
    },
    grid: { xs: 12, md: 4 },
  },

  // Regular field for comparison
  regularField: {
    type: 'TextInput',
    label: 'Regular Field',
    value: '',
    placeholder: 'Enter value manually',
    grid: { xs: 12, md: 4 },
  },
};

const customButtons = [
  {
    label: 'Reset Values',
    icon: 'refresh',
    fill: 'outline',
    color: 'warning',
    action: () => {
      // Reset form (this could trigger re-evaluation of function values)
      location.reload();
    },
  },
];

function handleSubmit(formData: FormData, computedData: ComputedData) {
  console.log('Async values form submitted:', formData, computedData);
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
  white-space: pre-wrap;
}

code {
  background: var(--p-surface-100);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

h4,
h5 {
  margin-top: 20px;
  margin-bottom: 10px;
  color: var(--p-primary-color);
}

.feature-list {
  margin: 16px 0;
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
</style>
