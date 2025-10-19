import { computed, Ref } from 'vue';
import { FormSchema } from '@/types';

/**
 * Groups fields by their row identifier using Map for efficient grouping
 */
function groupFieldsByRow(schema: FormSchema): {
  rowMap: Map<string, string[]>;
  fieldsWithoutRow: string[];
} {
  const rowMap = new Map<string, string[]>();
  const fieldsWithoutRow: string[] = [];

  for (const [formId, field] of Object.entries(schema)) {
    if (field.row !== undefined && field.row !== null) {
      const rowKey = String(field.row);
      if (!rowMap.has(rowKey)) {
        rowMap.set(rowKey, []);
      }
      rowMap.get(rowKey)!.push(formId);
    } else {
      fieldsWithoutRow.push(formId);
    }
  }

  return { rowMap, fieldsWithoutRow };
}

/**
 * Creates ordered rows maintaining field order from the original schema
 */
function createOrderedRows(
  schema: FormSchema,
  rowMap: Map<string, string[]>,
  fieldsWithoutRow: string[]
): string[][] {
  const result: string[][] = [];
  const processedRows = new Set<string>();

  // Process grouped rows in field order
  for (const formId of Object.keys(schema)) {
    const field = schema[formId];
    if (field.row !== undefined && field.row !== null) {
      const rowKey = String(field.row);
      if (!processedRows.has(rowKey) && rowMap.has(rowKey)) {
        result.push(rowMap.get(rowKey)!);
        processedRows.add(rowKey);
      }
    }
  }

  // Add individual fields without row identifier
  for (const formId of fieldsWithoutRow) {
    result.push([formId]);
  }

  return result;
}

/**
 * Composable for grouping form fields by their row property
 * Uses Map for proper grouping and maintains field order within rows
 * Reduces duplication in row grouping logic across components
 */
export function useRowGrouping(activeSchema: Ref<FormSchema>) {
  const groupedRows = computed(() => {
    const { rowMap, fieldsWithoutRow } = groupFieldsByRow(activeSchema.value);
    return createOrderedRows(activeSchema.value, rowMap, fieldsWithoutRow);
  });

  /**
   * Gets responsive grid classes for a row based on the number of visible fields
   * Uses CSS Grid with responsive breakpoints instead of Flexbox
   */
  const getRowGridClasses = (row: string[], visibleFieldsCount?: number) => {
    const fieldCount = visibleFieldsCount ?? row.length;

    // Base grid classes with responsive breakpoints
    if (fieldCount === 0) return 'hidden';
    if (fieldCount === 1) return 'grid grid-cols-1 gap-4';
    if (fieldCount === 2) return 'grid grid-cols-1 md:grid-cols-2 gap-4';
    if (fieldCount === 3) return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
    if (fieldCount >= 4)
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';

    return 'grid grid-cols-1 gap-4';
  };

  return {
    groupedRows,
    getRowGridClasses,
  };
}
