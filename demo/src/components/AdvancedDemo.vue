<template>
  <div class="demo-page">
    <Toast />
    <h1 class="demo-title">Advanced Features</h1>

    <div class="demo-content">
      <div class="demo-container">
        <Card>
          <template #header>
            <h3 class="card-title">Advanced Form Features</h3>
            <p class="card-subtitle">
              Masking, computed values, dynamic options, and option descriptions
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

        <Card v-if="submittedData">
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
import type { FormData, ComputedData, FormSchema, CustomButton } from '@uniquedj95/vform';

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
  productName: {
    type: 'TextInput',
    label: 'Product Name',
    value: '',
    placeholder: 'Enter product name',
    required: true,
    grid: { xs: '12', md: '6' },
  },
  sku: {
    type: 'TextInput',
    label: 'SKU',
    value: '',
    placeholder: 'SKU-0000',
    pattern: 'SKU-0000',
    grid: { xs: '12', md: '6' },
  },
  price: {
    type: 'NumberInput',
    label: 'Unit Price ($)',
    placeholder: '0.00',
    min: 0,
    grid: { xs: '12', md: '4' },
  },
  quantity: {
    type: 'NumberInput',
    label: 'Quantity',
    value: 1,
    min: 1,
    max: 1000,
    grid: { xs: '12', md: '4' },
    onChange: (_value, schema) => {
      const price = Number(schema.price?.value) || 0;
      const quantity = Number(schema.quantity?.value) || 1;
      schema.totalPrice.value = (price * quantity).toFixed(2);
      return quantity;
    },
  },
  totalPrice: {
    type: 'NumberInput',
    label: 'Total Price ($)',
    disabled: true,
    grid: { xs: '12', md: '4' },
  },
  category: {
    type: 'SelectInput',
    label: 'Category',
    value: '',
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
        description: {
          color: 'secondary',
          text: 'Furniture, decor, gardening tools, and household items (Currently unavailable)',
        },
      },
      {
        label: 'Sports',
        value: 'sports',
      },
    ],
    required: true,
    grid: { xs: '12', md: '6' },
  },
  tags: {
    type: 'TextAreaInput',
    label: 'Tags (comma separated)',
    value: '',
    placeholder: 'tag1, tag2, tag3',
    rows: 3,
    grid: { xs: '12', md: '6' },
  },
  phoneNumber: {
    type: 'TextInput',
    label: 'Contact Phone',
    value: '',
    placeholder: '(000) 000-0000',
    grid: { xs: '12', md: '6' },
  },
  urgent: {
    type: 'CheckboxInput',
    label: 'Urgent Processing',
    value: false,
    grid: { xs: '12', md: '6' },
  },
  priority: {
    type: 'RadioInput',
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
          color: 'primary',
          text: 'Regular priority with standard delivery timeframe',
          show: 'onSelected',
        },
      },
      {
        label: 'High',
        value: 'high',
        description: {
          color: 'warning',
          text: 'Expedited processing with faster turnaround',
          show: 'onSelected',
        },
      },
      {
        label: 'Critical',
        value: 'critical',
        description: {
          color: 'danger',
          text: 'Immediate attention required - highest priority (Requires approval)',
          show: 'onSelected',
        },
      },
    ],
    grid: { xs: '12' },
  },
  notes: {
    type: 'TextAreaInput',
    label: 'Additional Notes',
    value: '',
    placeholder: 'Any special instructions or notes...',
    rows: 4,
    grid: { xs: '12' },
  },
};

function handleSubmit(formData: FormData, computedData: ComputedData) {
  console.log('Advanced form submitted:', formData, computedData);
  submittedData.value = { formData, computedData };
}
</script>

<style scoped>
.demo-container {
  padding: 20px;
  max-width: 900px;
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
