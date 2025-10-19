<template>
  <div class="demo-page">
    <div class="demo-content">
      <div class="demo-container">
        <Card class="p-4">
          <template #header>
            <h3 class="card-title">Inventory Items</h3>
            <h4 class="card-subtitle">Add multiple items with dynamically repeatable fields</h4>
          </template>

          <template #content>
            <VForm
              :schema="formSchema"
              @submit="handleSubmit"
              submit-button-text="Save Items"
              clear-button-text="Clear All"
              :show-labels="true"
              button-placement="end"
            />
          </template>
        </Card>

        <Card class="p-4">
          <template #header>
            <h3 class="card-title">Contact List</h3>
            <p class="card-subtitle">Complex repeatable fields with validation</p>
          </template>

          <template #content>
            <VForm
              :schema="contactsSchema"
              @submit="handleContactsSubmit"
              submit-button-text="Save Contacts"
              clear-button-text="Clear List"
              :show-labels="true"
              button-placement="end"
            />
          </template>
        </Card>

        <Card v-if="submittedData" class="p-4 mt-4">
          <template #header>
            <h3 class="card-title">Form Result</h3>
          </template>

          <template #content>
            <TabView v-model:activeIndex="activeTabIndex">
              <TabPanel value="0" header="Submitted Data">
                <h4>Form Data</h4>
                <pre>{{ JSON.stringify(submittedData, null, 2) }}</pre>
              </TabPanel>
              <TabPanel value="1" header="Computed Data">
                <h4>Computed Data</h4>
                <pre>{{ JSON.stringify(computedDataValue, null, 2) }}</pre>
              </TabPanel>
            </TabView>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { FormSchema, FormData, ComputedData } from 'pv-form';
import Card from 'primevue/card';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

// Simple inventory items with repeatable fields
const formSchema = ref<FormSchema>({
  inventoryItems: {
    type: 'RepeatInput',
    label: 'Inventory Items',
    className: 'inventory-repeat',
    borderAccentColor: '#4d76ff',
    children: {
      itemName: {
        type: 'TextInput',
        label: 'Item Name',
        required: true,
        grid: { xs: 12, md: 6 },
      },
      quantity: {
        type: 'NumberInput',
        label: 'Quantity',
        required: true,
        min: 1,
        grid: { xs: 12, md: 3 },
      },
      unitPrice: {
        type: 'NumberInput',
        label: 'Unit Price ($)',
        required: true,
        min: 0,
        grid: { xs: 12, md: 3 },
      },
    },
  },
});

// Complex contacts list with nested fields and validation
const contactsSchema = ref<FormSchema>({
  contactList: {
    type: 'RepeatInput',
    label: 'Contact List',
    className: 'contacts-repeat',
    children: {
      contactSection: {
        type: 'FormSection',
        title: 'Contact Information',
      },
      name: {
        type: 'TextInput',
        label: 'Full Name',
        required: true,
        grid: { xs: 12, md: 6 },
      },
      email: {
        type: 'EmailInput',
        label: 'Email Address',
        required: true,
        grid: { xs: 12, md: 6 },
        validation: value => {
          if (!value || typeof value !== 'string') return ['Email is required'];
          if (!value.includes('@')) return ['Invalid email format'];
          return null;
        },
      },
      phoneType: {
        type: 'SelectInput',
        label: 'Phone Type',
        grid: { xs: 12, md: 4 },
        options: [
          { label: 'Mobile', value: 'mobile' },
          { label: 'Work', value: 'work' },
          { label: 'Home', value: 'home' },
        ],
      },
      phoneNumber: {
        type: 'TextInput',
        label: 'Phone Number',
        grid: { xs: 12, md: 8 },
        pattern: String.raw`\(\d{3}\) \d{3}-\d{4}`,
        placeholder: '(555) 555-5555',
      },
      addressSection: {
        type: 'FormSection',
        title: 'Address',
        subtitle: 'Optional',
      },
      street: {
        type: 'TextInput',
        label: 'Street Address',
        grid: { xs: 12 },
      },
      city: {
        type: 'TextInput',
        label: 'City',
        grid: { xs: 12, md: 4 },
      },
      state: {
        type: 'TextInput',
        label: 'State/Province',
        grid: { xs: 12, md: 4 },
      },
      zip: {
        type: 'TextInput',
        label: 'ZIP/Postal Code',
        grid: { xs: 12, md: 4 },
      },
      notes: {
        type: 'TextAreaInput',
        label: 'Notes',
        rows: 2,
        autoGrow: true,
        grid: { xs: 12 },
      },
    },
  },
});

const submittedData = ref<FormData | null>(null);
const computedDataValue = ref<ComputedData | null>(null);
const activeTabIndex = ref(0);

const handleSubmit = (data: FormData, computedData: ComputedData) => {
  console.log('Inventory items submitted:', data, computedData);
  submittedData.value = data;
  computedDataValue.value = computedData;

  // Define inventory item type
  interface InventoryItemData {
    quantity: string | number;
    unitPrice: string | number;
    itemName?: string;
  }

  // Calculate total value
  let totalValue = 0;
  if (data.inventoryItems && Array.isArray(data.inventoryItems)) {
    for (const item of data.inventoryItems) {
      // RepeatInput stores data in the 'other' property of each Option
      const itemData = item.other as InventoryItemData;
      if (itemData) {
        const quantity = Number(itemData.quantity) || 0;
        const price = Number(itemData.unitPrice) || 0;
        totalValue += quantity * price;
      }
    }
  }

  console.log('Total inventory value:', totalValue);
};

const handleContactsSubmit = (data: FormData, computedData: ComputedData) => {
  console.log('Contacts submitted:', data, computedData);
  submittedData.value = data;
  computedDataValue.value = computedData;
};
</script>

<style scoped>
.demo-container {
  margin: 0 auto;
}

pre {
  background-color: var(--p-surface-100);
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 0.85rem;
}

h4 {
  margin-top: 0;
  color: var(--p-primary-color);
  font-weight: 500;
}
</style>
