<!-- ANCHistoryComponent.vue -->
<template>
  <div class="anc-history-component">
    <Card>
      <template #header>
        <h3 class="card-title">Previous ANC Visits</h3>
        <p class="card-subtitle">{{ patientName }}'s visit history</p>
      </template>

      <template #content>
        <div class="visits-list">
          <div v-if="loading" class="loading-state">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
            <p>Loading visit history...</p>
          </div>

          <template v-else>
            <!-- No data message -->
            <div v-if="visits.length === 0" class="no-data">
              <p>No previous visits recorded</p>
            </div>

            <!-- Visits data -->
            <div
              v-for="visit in visits"
              :key="visit.id"
              class="visit-item"
              :class="{ selected: visit.id === selectedVisit?.id }"
              @click="selectVisit(visit)"
            >
              <div class="visit-info">
                <h4>{{ formatDate(visit.date) }}</h4>
                <p>Week: {{ visit.week }}</p>
                <p>BP: {{ visit.bloodPressure }}</p>
                <p>Weight: {{ visit.weight }}kg</p>
              </div>
              <div class="visit-status">
                <span
                  :class="visit.id === selectedVisit?.id ? 'status-selected' : 'status-default'"
                >
                  {{ visit.id === selectedVisit?.id ? 'Selected' : 'Tap to select' }}
                </span>
              </div>
            </div>
          </template>
        </div>
      </template>
    </Card>

    <!-- Selected Visit Details -->
    <Card v-if="selectedVisit">
      <template #header>
        <h3 class="card-title">Visit Details</h3>
        <p class="card-subtitle">{{ formatDate(selectedVisit.date) }}</p>
      </template>

      <template #content>
        <div class="visit-details">
          <div class="detail-item">
            <h4>Gestational Age:</h4>
            <p>{{ selectedVisit.week }} weeks</p>
          </div>

          <div class="detail-item">
            <h4>Blood Pressure:</h4>
            <p>{{ selectedVisit.bloodPressure }}</p>
          </div>

          <div class="detail-item">
            <h4>Weight:</h4>
            <p>{{ selectedVisit.weight }}kg</p>
          </div>

          <div class="detail-item">
            <h4>Fetal Heart Rate:</h4>
            <p>{{ selectedVisit.fetalHeartRate }} bpm</p>
          </div>

          <div class="detail-item">
            <h4>Notes:</h4>
            <p>{{ selectedVisit.notes || 'No notes recorded' }}</p>
          </div>
        </div>
      </template>
    </Card>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <Button label="Refresh Data" icon="pi pi-refresh" outlined @click="refreshData" />

      <Button
        label="Continue"
        @click="continueToNextStep"
        :disabled="!selectedVisit && requireSelection"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';

// Define props
const props = defineProps({
  patientId: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    default: 'Patient',
  },
  requireSelection: {
    type: Boolean,
    default: true,
  },
});

// Define emits
const emit = defineEmits(['update:data']);

// Component state
const loading = ref(true);
const visits = ref<any[]>([]);
const selectedVisit = ref<any>(null);

// Mock data - in a real app you would fetch this from an API
const mockVisits = [
  {
    id: 'v1',
    date: new Date(2025, 5, 10),
    week: 12,
    bloodPressure: '120/80',
    weight: 65,
    fetalHeartRate: 140,
    notes: 'First trimester checkup, everything normal.',
  },
  {
    id: 'v2',
    date: new Date(2025, 6, 8),
    week: 16,
    bloodPressure: '118/76',
    weight: 67.5,
    fetalHeartRate: 145,
    notes: 'Patient reported mild nausea in the mornings.',
  },
  {
    id: 'v3',
    date: new Date(2025, 7, 5),
    week: 20,
    bloodPressure: '122/82',
    weight: 69.8,
    fetalHeartRate: 150,
    notes: 'Ultrasound performed, fetal development on track.',
  },
];

// Format date helper
function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Load data
function loadData() {
  loading.value = true;

  // Simulate API call
  setTimeout(() => {
    visits.value = [...mockVisits];
    loading.value = false;
  }, 1000);
}

// Select a visit
function selectVisit(visit: any) {
  selectedVisit.value = visit;

  // Emit data update to parent form
  emit('update:data', {
    selectedVisitId: visit.id,
    visitDate: visit.date,
    visitWeek: visit.week,
    previousData: {
      bloodPressure: visit.bloodPressure,
      weight: visit.weight,
      fetalHeartRate: visit.fetalHeartRate,
    },
  });
}

// Refresh the data
function refreshData() {
  loadData();
  selectedVisit.value = null;
}

// Continue to next step
function continueToNextStep() {
  // If selection is required but nothing selected
  if (props.requireSelection && !selectedVisit.value) {
    alert('Please select a visit to continue.');
    return;
  }

  // If no selection required, emit null data
  if (!selectedVisit.value) {
    emit('update:data', {
      selectedVisitId: null,
      newPatient: true,
    });
  }
}

// Validate method for the form integration
function validate() {
  if (props.requireSelection && !selectedVisit.value) {
    alert('Please select a visit before proceeding.');
    return false;
  }
  return true;
}

// Load data on component mount
onMounted(() => {
  loadData();
});

// Expose methods to parent
defineExpose({
  validate,
  refreshData,
});
</script>

<style scoped>
.anc-history-component {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.visits-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
  color: var(--text-color-secondary);
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: var(--text-color-secondary);
}

.visit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.visit-item:hover {
  background: var(--surface-hover);
  border-color: var(--primary-color);
}

.visit-item.selected {
  background: var(--primary-50);
  border-color: var(--primary-color);
}

.visit-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
}

.visit-info p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.visit-status {
  display: flex;
  align-items: center;
}

.status-selected {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 0.875rem;
}

.status-default {
  color: var(--text-color-secondary);
  font-size: 0.875rem;
}

.visit-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--surface-border);
}

.detail-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.detail-item h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color);
}

.detail-item p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 0;
}
</style>
