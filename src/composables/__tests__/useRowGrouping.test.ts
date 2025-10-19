import { ref } from 'vue';
import { describe, it, expect } from 'vitest';
import { useRowGrouping } from '../useRowGrouping';
import { FormSchema } from '@/types';

describe('useRowGrouping', () => {
  it('should group fields by row identifier using Map', () => {
    const schema: FormSchema = {
      field1: { type: 'TextInput', row: 1, label: 'Field 1' },
      field2: { type: 'TextInput', row: 1, label: 'Field 2' },
      field3: { type: 'TextInput', row: 2, label: 'Field 3' },
      field4: { type: 'TextInput', label: 'Field 4' }, // No row
      field5: { type: 'TextInput', row: 1, label: 'Field 5' }, // Same row as field1, field2
    };

    const activeSchema = ref(schema);
    const { groupedRows } = useRowGrouping(activeSchema);

    const result = groupedRows.value;

    // Should have 3 rows: [field1, field2, field5], [field3], [field4]
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual(['field1', 'field2', 'field5']);
    expect(result[1]).toEqual(['field3']);
    expect(result[2]).toEqual(['field4']);
  });

  it('should maintain field order within rows', () => {
    const schema: FormSchema = {
      fieldA: { type: 'TextInput', row: 'row1', label: 'Field A' },
      fieldB: { type: 'TextInput', label: 'Field B' },
      fieldC: { type: 'TextInput', row: 'row1', label: 'Field C' },
      fieldD: { type: 'TextInput', row: 'row2', label: 'Field D' },
    };

    const activeSchema = ref(schema);
    const { groupedRows } = useRowGrouping(activeSchema);

    const result = groupedRows.value;

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual(['fieldA', 'fieldC']); // row1 fields
    expect(result[1]).toEqual(['fieldD']); // row2 field
    expect(result[2]).toEqual(['fieldB']); // no row field
  });

  it('should generate correct grid classes for different field counts', () => {
    const schema: FormSchema = {};
    const activeSchema = ref(schema);
    const { getRowGridClasses } = useRowGrouping(activeSchema);

    expect(getRowGridClasses([], 0)).toBe('hidden');
    expect(getRowGridClasses(['field1'], 1)).toBe('grid grid-cols-1 gap-4');
    expect(getRowGridClasses(['field1', 'field2'], 2)).toBe(
      'grid grid-cols-1 md:grid-cols-2 gap-4'
    );
    expect(getRowGridClasses(['field1', 'field2', 'field3'], 3)).toBe(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
    );
    expect(getRowGridClasses(['field1', 'field2', 'field3', 'field4'], 4)).toBe(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
    );
    expect(getRowGridClasses(['field1', 'field2', 'field3', 'field4', 'field5'], 5)).toBe(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
    );
  });

  it('should handle empty schema', () => {
    const schema: FormSchema = {};
    const activeSchema = ref(schema);
    const { groupedRows } = useRowGrouping(activeSchema);

    expect(groupedRows.value).toEqual([]);
  });

  it('should handle fields with string and number row identifiers', () => {
    const schema: FormSchema = {
      field1: { type: 'TextInput', row: 1, label: 'Field 1' },
      field2: { type: 'TextInput', row: '1', label: 'Field 2' },
      field3: { type: 'TextInput', row: 'string-row', label: 'Field 3' },
    };

    const activeSchema = ref(schema);
    const { groupedRows } = useRowGrouping(activeSchema);

    const result = groupedRows.value;

    // field1 and field2 should be grouped together (both row "1")
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(['field1', 'field2']);
    expect(result[1]).toEqual(['field3']);
  });
});
