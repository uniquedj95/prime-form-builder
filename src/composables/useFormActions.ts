import { Ref } from 'vue';
import { FormData, ComputedData, FormSchema } from '@/types';
import { resetFormInputsWithFieldCheck } from '@/utils';

/**
 * Composable for common form actions (submit, clear, cancel)
 * Reduces duplication in form action handling across components
 */
export function useFormActions(
  dynamicRefs: Ref<any[]>,
  activeSchema: Ref<FormSchema>,
  formData: Ref<FormData>,
  computedData: Ref<ComputedData>,
  isFormValid: () => Promise<boolean>
) {
  /**
   * Resets the form using the field check utility
   */
  function resetForm() {
    resetFormInputsWithFieldCheck(
      dynamicRefs.value,
      activeSchema.value,
      formData.value,
      computedData.value
    );
  }

  /**
   * Handles form submission with validation
   * @param onSubmit - Callback function to execute after successful validation
   */
  async function handleSubmit(onSubmit: () => void | Promise<void>) {
    if (!(await isFormValid())) return;
    await onSubmit();
  }

  /**
   * Handles clear action
   * @param onClear - Optional callback function to execute after clearing
   */
  function handleClear(onClear?: () => void) {
    resetForm();
    onClear?.();
  }

  /**
   * Handles cancel action
   * @param onCancel - Optional callback function to execute after canceling
   */
  function handleCancel(onCancel?: () => void) {
    resetForm();
    onCancel?.();
  }

  return {
    resetForm,
    handleSubmit,
    handleClear,
    handleCancel,
  };
}
