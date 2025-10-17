import { computed, Ref } from 'vue';
import { FormSchema } from '@/types';

/**
 * Composable for grouping form fields by their row property
 * Reduces duplication in row grouping logic across components
 */
export function useRowGrouping(activeSchema: Ref<FormSchema>) {
  const groupedRows = computed(() => {
    const result: Array<string[]> = [];
    const processedFields = new Set<string>();

    // Process fields in their original order
    for (const formId of Object.keys(activeSchema.value)) {
      if (processedFields.has(formId)) continue;

      const field = activeSchema.value[formId];
      if (field.row !== undefined && field.row !== null) {
        // Find all fields with the same row identifier
        const rowFields = Object.keys(activeSchema.value).filter(
          id => activeSchema.value[id].row === field.row
        );

        // Add the group row
        result.push(rowFields);

        // Mark all fields in this group as processed
        for (const id of rowFields) {
          processedFields.add(id);
        }
      } else {
        // Field without row - gets its own row
        result.push([formId]);
        processedFields.add(formId);
      }
    }

    return result;
  });

  return {
    groupedRows,
  };
}
