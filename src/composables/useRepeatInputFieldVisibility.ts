import { ComputedData, FormData, FormField } from '@/types';
import { canRenderField } from '@/utils';

/**
 * Composable for RepeatInput field visibility checks
 * Handles the special case where RepeatInput has nested field structures
 */
export function useRepeatInputFieldVisibility(data: FormData, computedData: ComputedData) {
  /**
   * Checks if a field can be rendered within a RepeatInput context
   */
  function checkFieldVisibility(field: FormField): boolean {
    return canRenderField(field, data, computedData);
  }

  return {
    checkFieldVisibility,
  };
}
