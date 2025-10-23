<template>
  <div class="demo-page">
    <Toast />
    <div class="demo-content">
      <div class="demo-container">
        <Card class="p-4 slide-in-left">
          <template #header>
            <h3 class="card-title">Advanced Form Features</h3>
            <p class="card-subtitle">
              Showcasing all input types including ListBox, InputMask, OTP, Knob, ToggleSwitch,
              Rating, and Slider
            </p>
          </template>

          <template #content>
            <VForm
              :schema="formSchema"
              @submit="handleSubmit"
              :custom-buttons="customButtons"
              submit-button-text="Process Order"
            />
          </template>
        </Card>

        <Card v-if="submittedData" class="p-4 mt-4">
          <template #header>
            <h3 class="card-title">Processed Data</h3>
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
import { useToast } from 'primevue/usetoast';
import Card from 'primevue/card';
import Toast from 'primevue/toast';
import type { FormData, ComputedData, FormSchema, CustomButton } from 'pv-form';

const submittedData = ref<any>(null);
const toast = useToast();

const customButtons: CustomButton[] = [
  {
    label: 'Save Draft',
    color: 'secondary',
    action: () => {
      toast.add({
        severity: 'success',
        summary: 'Draft Saved',
        detail: 'Your form has been saved as a draft.',
        life: 3000,
      });
    },
    icon: '',
  },
];

const formSchema: FormSchema = {
  sectionBasicInfo: {
    type: 'FormSection',
    title: 'Basic Product Information',
    subtitle: 'Enter the essential details about the product',
  },
  productName: {
    type: 'TextInput',
    label: 'Product Name',
    value: '',
    placeholder: 'Enter product name',
    required: true,
    grid: { xs: 12, md: 6 },
  },
  sku: {
    type: 'MaskInput',
    label: 'SKU',
    value: '',
    mask: 'aaa-9999',
    placeholder: 'SKU-0000',
    required: true,
    grid: { xs: 12, md: 6 },
  },
  price: {
    type: 'NumberInput',
    label: 'Unit Price ($)',
    placeholder: '0.00',
    min: 0,
    grid: { xs: 12, md: 4 },
  },
  quantity: {
    type: 'NumberInput',
    label: 'Quantity',
    value: 1,
    min: 1,
    max: 1000,
    grid: { xs: 12, md: 4 },
    onChange: (_value, schema) => {
      const price = Number(schema.price?.value) || 0;
      const quantity = Number(schema.quantity?.value) || 1;
      schema.totalPrice.value = (price * quantity).toFixed(2);
    },
  },
  totalPrice: {
    type: 'NumberInput',
    label: 'Total Price ($)',
    disabled: true,
    grid: { xs: 12, md: 4 },
  },
  category: {
    type: 'ListBoxInput',
    label: 'Categories',
    value: '',
    multiple: true,
    options: [
      {
        label: 'Electronics',
        value: 'electronics',
      },
      {
        label: 'Clothing',
        value: 'clothing',
      },
      {
        label: 'Books',
        value: 'books',
      },
      {
        label: 'Home & Garden',
        value: 'home_garden',
      },
      {
        label: 'Sports',
        value: 'sports',
      },
    ],
    required: true,
    grid: { xs: 12, md: 6 },
  },
  services: {
    type: 'MultiCheckboxInput',
    label: 'Services Interested In',
    required: true,
    options: [
      { label: 'Web Development', value: 'web_dev' },
      { label: 'Mobile App Development', value: 'mobile_dev' },
      { label: 'UI/UX Design', value: 'design' },
      { label: 'Cloud Services', value: 'cloud' },
      { label: 'DevOps', value: 'devops' },
      { label: 'Consulting', value: 'consulting', disabled: true },
    ],
    grid: { xs: 12, md: 6 },
  },
  qualityLevel: {
    type: 'KnobInput',
    label: 'Quality Level (%)',
    min: 0,
    max: 100,
    step: 10,
    value: 80,
    size: 120,
    valueColor: '#3b82f6',
    rangeColor: '#e5e7eb',
    grid: { xs: 12, md: 6 },
  },
  sectionContact: {
    type: 'FormSection',
    title: 'Contact & Verification',
    subtitle: 'Contact information and verification details',
  },
  phoneNumber: {
    type: 'MaskInput',
    label: 'Contact Phone',
    value: '',
    mask: '(999) 999-9999',
    placeholder: '(555) 123-4567',
    grid: { xs: 12, md: 6 },
  },
  verificationCode: {
    type: 'OtpInput',
    label: 'Verification Code',
    length: 6,
    integerOnly: true,
    grid: { xs: 12, md: 6 },
  },

  sectionSettings: {
    type: 'FormSection',
    title: 'Processing Settings',
    subtitle: 'Configure processing priority and settings',
  },
  urgent: {
    type: 'ToggleSwitchInput',
    label: 'Urgent Processing',
    value: false,
    grid: { xs: 12, md: 6 },
  },
  priceRange: {
    type: 'SliderInput',
    label: 'Acceptable Price Range ($)',
    min: 0,
    max: 1000,
    step: 50,
    range: true,
    value: [100, 500],
    grid: { xs: 12, md: 6 },
  },
  customerRating: {
    type: 'RatingInput',
    label: 'Customer Rating',
    stars: 5,
    cancel: true,
    grid: { xs: 12, md: 6 },
  },
  priority: {
    type: 'MultiCheckboxInput',
    label: 'Priority Level',
    options: [
      {
        label: 'Low',
        value: 'low',
        description: {
          color: 'secondary',
          text: 'Standard processing time, no rush needed',
          show: 'onSelected',
        },
      },
      {
        label: 'Normal',
        value: 'normal',
        description: {
          color: 'info',
          text: 'Regular priority with standard delivery timeframe',
          show: 'onSelected',
        },
      },
      {
        label: 'High',
        value: 'high',
        description: {
          color: 'warn',
          text: 'Expedited processing with faster turnaround',
          show: 'always',
        },
      },
      {
        label: 'Critical',
        value: 'critical',
        description: {
          color: 'error',
          text: 'Immediate attention required - highest priority (Requires approval)',
          show: 'onSelected',
        },
      },
    ],
    grid: { xs: 12 },
  },

  sectionNotes: {
    type: 'FormSection',
    title: 'Additional Information',
  },
  notes: {
    type: 'TextAreaInput',
    label: 'Additional Notes',
    value: '',
    placeholder: 'Any special instructions or notes...',
    rows: 4,
    grid: { xs: 12 },
  },
};

function handleSubmit(formData: FormData, computedData: ComputedData) {
  console.log('Advanced form submitted:', formData, computedData);
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
</style>
