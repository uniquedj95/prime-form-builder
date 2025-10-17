<template>
  <div
    v-for="(child, index) of childrens"
    class="repeat-input-wrapper"
    :class="model.className"
    :key="index"
  >
    <div class="repeat-row">
      <div class="form-fields-column">
        <div class="fields-row">
          <template v-for="formId of Object.keys(child)">
            <div
              :key="`${index}-${formId}`"
              :class="getPrimeVueGridClasses(child[formId])"
              class="field-col"
              v-if="checkFieldVisibility(child[formId])"
            >
              <component
                :is="child[formId].type"
                v-model="child[formId]"
                :schema="child"
                :ref-key="`${index}-${formId}`"
                ref="dynamicRefs"
                style="width: 100%"
              />
            </div>
          </template>
        </div>
      </div>
      <div class="button-column">
        <div class="button-container">
          <Button
            @click="addSet"
            severity="success"
            size="small"
            icon="pi pi-plus"
            rounded
            v-if="index === childrens.length - 1"
          />
          <Button
            @click="removeSet(index)"
            severity="danger"
            size="small"
            icon="pi pi-minus"
            rounded
            v-if="childrens.length > 1"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ComputedData, FormData, FormField, FormSchema, Option } from '@/types';
import Button from 'primevue/button';
import {
  deepClone,
  isFormField,
  resetFormInputsWithCustomResolver,
  getPrimeVueGridClasses,
} from '@/utils';
import { useFormValidation, useRepeatInputFieldVisibility } from '@/composables';
import { computed, onMounted, PropType, ref, watch } from 'vue';

interface PropsI {
  schema?: FormSchema;
  data: FormData;
  computedData: ComputedData;
}

const props = defineProps<PropsI>();
const model = defineModel({ type: Object as PropType<FormField>, default: {} });
const childrens = ref<FormSchema[]>([]);

// Use form validation composable
const { dynamicRefs, getFormErrors, updateFormValues } = useFormValidation();

// Use field visibility composable for RepeatInput
const { checkFieldVisibility } = useRepeatInputFieldVisibility(props.data, props.computedData);

const inputValue = computed<Array<Option>>(() => {
  return childrens.value.map((child, index) => ({
    label: `Set ${index + 1}`,
    value: index,
    other: Object.entries(child).reduce(
      (acc, [id, field]) => {
        // Only process FormField items, not FormSection items
        if (isFormField(field)) {
          acc[id] = field.value;
        }
        return acc;
      },
      {} as Record<string, any>
    ),
  }));
});

watch(
  inputValue,
  value => {
    model.value.value = value;
  },
  { deep: true, immediate: true }
);

onMounted(addSet);

function addSet() {
  if (model.value.children) {
    childrens.value.push(deepClone<FormSchema>(model.value.children));
  }
}

function removeSet(index: number) {
  childrens.value.splice(index, 1);
}

function onReset() {
  // Create a resolver function for the RepeatInput's nested schema structure
  const getFieldFromRefKey = (refKey: string) => {
    // Parse the ref-key format: "${index}-${formId}"
    const [indexStr, formId] = refKey.split('-');
    const index = Number.parseInt(indexStr, 10);

    if (
      !Number.isNaN(index) &&
      formId &&
      childrens.value[index] &&
      childrens.value[index][formId]
    ) {
      return childrens.value[index][formId];
    }

    return null;
  };

  // Use the utility function with our custom resolver
  resetFormInputsWithCustomResolver(
    dynamicRefs.value,
    props.data,
    props.computedData,
    getFieldFromRefKey
  );
}

function getErrors() {
  return getFormErrors();
}

async function onValueUpdate() {
  await updateFormValues();
}

defineExpose({
  onValueUpdate,
  onReset,
  getErrors,
});
</script>

<style scoped>
/* Minimal overrides - use PrimeVue defaults */
.repeat-row {
  display: flex;
  width: 100%;
  gap: 0.5rem;
  align-items: flex-start;
}

.form-fields-column {
  flex: 1;
}

.fields-row {
  display: flex;
  flex-wrap: wrap;
  margin: -0.5rem;
}

.field-col {
  padding: 0.5rem;
}

/* Grid classes for responsive layout */
.p-col-12 {
  width: 100%;
}
.p-col-6 {
  width: 50%;
}
.p-col-4 {
  width: 33.3333%;
}
.p-col-3 {
  width: 25%;
}

@media (min-width: 576px) {
  .p-sm-12 {
    width: 100%;
  }
  .p-sm-6 {
    width: 50%;
  }
  .p-sm-4 {
    width: 33.3333%;
  }
  .p-sm-3 {
    width: 25%;
  }
}

@media (min-width: 768px) {
  .p-md-12 {
    width: 100%;
  }
  .p-md-6 {
    width: 50%;
  }
  .p-md-4 {
    width: 33.3333%;
  }
  .p-md-3 {
    width: 25%;
  }
}

@media (min-width: 992px) {
  .p-lg-12 {
    width: 100%;
  }
  .p-lg-6 {
    width: 50%;
  }
  .p-lg-4 {
    width: 33.3333%;
  }
  .p-lg-3 {
    width: 25%;
  }
}

@media (min-width: 1200px) {
  .p-xl-12 {
    width: 100%;
  }
  .p-xl-6 {
    width: 50%;
  }
  .p-xl-4 {
    width: 33.3333%;
  }
  .p-xl-3 {
    width: 25%;
  }
}

.button-column {
  flex-shrink: 0;
  width: 60px;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  padding-top: 1.5rem;
}
</style>
