import { watch, Ref, unref } from 'vue';
import { FormData, ComputedData, FormSchema, FormField } from '@/types';
import { canRenderField, isFormField } from '@/utils';

/**
 * Composable for managing field visibility and resetting hidden field values
 * Reduces duplication in field visibility logic across components
 */
export function useFieldVisibility(
  activeSchema: Ref<FormSchema>,
  formData: Ref<FormData>,
  computedData: Ref<ComputedData>,
  originalSchema?: FormSchema | Ref<FormSchema | undefined>
) {
  /**
   * Gets the original field value for reset purposes
   */
  function getOriginalFieldValue(fieldKey: string): any {
    if (!originalSchema) return undefined;

    // Properly unwrap the ref or computed value
    const schema = unref(originalSchema);
    if (!schema) return undefined;

    const original = schema[fieldKey];
    return original && isFormField(original) && 'value' in original ? original.value : undefined;
  }

  /**
   * Resets a hidden field to its original value
   */
  function resetHiddenField(fieldKey: string, field: FormField): void {
    const originalValue = getOriginalFieldValue(fieldKey);
    field.value = originalValue;
  }

  /**
   * Sets up a watcher that resets hidden field values when form data changes
   * This ensures that fields that become hidden have their values reset
   */
  function setupFieldVisibilityWatcher() {
    return watch(
      formData,
      () => {
        for (const [fieldKey, field] of Object.entries(activeSchema.value)) {
          if (!canRenderField(field, formData.value, computedData.value)) {
            resetHiddenField(fieldKey, field);
          }
        }
      },
      { deep: true, immediate: true }
    );
  }

  /**
   * Checks if a field can be rendered based on its condition
   */
  function checkFieldVisibility(field: FormField): boolean {
    return canRenderField(field, formData.value, computedData.value);
  }

  return {
    setupFieldVisibilityWatcher,
    checkFieldVisibility,
    resetHiddenField,
  };
}
