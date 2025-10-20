import { describe, it, expect } from 'vitest';
import { ref, nextTick } from 'vue';
import { useFieldVisibility } from '../../../src/composables/useFieldVisibility';
import { FormSchema, FormData, ComputedData } from '../../../src/types';

describe('useFieldVisibility', () => {
  it('should check field visibility based on condition', () => {
    const activeSchema = ref<FormSchema>({
      field1: {
        type: 'TextInput',
        value: '',
        condition: (data: FormData) => data.trigger === 'show',
      },
      field2: {
        type: 'TextInput',
        value: '',
      },
    });

    const formData = ref<FormData>({ trigger: 'hide' });
    const computedData = ref<ComputedData>({});

    const { checkFieldVisibility } = useFieldVisibility(activeSchema, formData, computedData);

    // field1 should not be visible when trigger is 'hide'
    expect(checkFieldVisibility(activeSchema.value.field1)).toBe(false);

    // field2 should always be visible (no condition)
    expect(checkFieldVisibility(activeSchema.value.field2)).toBe(true);
  });

  it('should update field visibility when form data changes', async () => {
    const activeSchema = ref<FormSchema>({
      field1: {
        type: 'TextInput',
        value: '',
        condition: (data: FormData) => data.trigger === 'show',
      },
    });

    const formData = ref<FormData>({ trigger: 'hide' });
    const computedData = ref<ComputedData>({});

    const { checkFieldVisibility } = useFieldVisibility(activeSchema, formData, computedData);

    // Initially field1 should not be visible
    expect(checkFieldVisibility(activeSchema.value.field1)).toBe(false);

    // Change form data to trigger visibility
    formData.value = { trigger: 'show' };
    await nextTick();

    // Now field1 should be visible
    expect(checkFieldVisibility(activeSchema.value.field1)).toBe(true);
  });

  it('should reset hidden fields to original values', async () => {
    const originalSchema: FormSchema = {
      field1: {
        type: 'TextInput',
        value: 'original',
        condition: (data: FormData) => data.trigger === 'show',
      },
    };

    const activeSchema = ref<FormSchema>({
      field1: {
        type: 'TextInput',
        value: 'modified',
        condition: (data: FormData) => data.trigger === 'show',
      },
    });

    const formData = ref<FormData>({ trigger: 'hide' });
    const computedData = ref<ComputedData>({});

    const { setupFieldVisibilityWatcher } = useFieldVisibility(
      activeSchema,
      formData,
      computedData,
      originalSchema
    );

    // Setup the watcher
    setupFieldVisibilityWatcher();

    // Wait for watcher to execute
    await nextTick();

    // field1 should be reset to original value since it's hidden
    expect(activeSchema.value.field1.value).toBe('original');
  });

  it('should reset hidden fields when condition changes', async () => {
    const originalSchema: FormSchema = {
      field1: {
        type: 'TextInput',
        value: 'original',
        condition: (data: FormData) => data.trigger === 'show',
      },
    };

    const activeSchema = ref<FormSchema>({
      field1: {
        type: 'TextInput',
        value: 'modified',
        condition: (data: FormData) => data.trigger === 'show',
      },
    });

    const formData = ref<FormData>({ trigger: 'show' });
    const computedData = ref<ComputedData>({});

    const { setupFieldVisibilityWatcher, checkFieldVisibility } = useFieldVisibility(
      activeSchema,
      formData,
      computedData,
      originalSchema
    );

    // Setup the watcher
    setupFieldVisibilityWatcher();
    await nextTick();

    // Field is visible, so value should remain modified
    expect(checkFieldVisibility(activeSchema.value.field1)).toBe(true);
    expect(activeSchema.value.field1.value).toBe('modified');

    // Change trigger to hide the field
    formData.value = { trigger: 'hide' };
    await nextTick();

    // Field is now hidden, so value should be reset
    expect(checkFieldVisibility(activeSchema.value.field1)).toBe(false);
    expect(activeSchema.value.field1.value).toBe('original');
  });

  it('should handle computed ref for original schema', async () => {
    const originalSchemaRef = ref<FormSchema>({
      field1: {
        type: 'TextInput',
        value: 'original',
        condition: (data: FormData) => data.trigger === 'show',
      },
    });

    const activeSchema = ref<FormSchema>({
      field1: {
        type: 'TextInput',
        value: 'modified',
        condition: (data: FormData) => data.trigger === 'show',
      },
    });

    const formData = ref<FormData>({ trigger: 'hide' });
    const computedData = ref<ComputedData>({});

    const { setupFieldVisibilityWatcher } = useFieldVisibility(
      activeSchema,
      formData,
      computedData,
      originalSchemaRef
    );

    // Setup the watcher
    setupFieldVisibilityWatcher();
    await nextTick();

    // field1 should be reset to original value from ref
    expect(activeSchema.value.field1.value).toBe('original');
  });

  it('should handle fields without conditions as always visible', () => {
    const activeSchema = ref<FormSchema>({
      field1: {
        type: 'TextInput',
        value: 'test',
      },
      field2: {
        type: 'EmailInput',
        value: '',
      },
    });

    const formData = ref<FormData>({});
    const computedData = ref<ComputedData>({});

    const { checkFieldVisibility } = useFieldVisibility(activeSchema, formData, computedData);

    // Both fields should be visible
    expect(checkFieldVisibility(activeSchema.value.field1)).toBe(true);
    expect(checkFieldVisibility(activeSchema.value.field2)).toBe(true);
  });

  it('should handle complex conditions with computedData', async () => {
    const activeSchema = ref<FormSchema>({
      field1: {
        type: 'TextInput',
        value: '',
        condition: (data: FormData, computed: ComputedData) =>
          data.trigger === 'show' && computed.isValid === true,
      },
    });

    const formData = ref<FormData>({ trigger: 'show' });
    const computedData = ref<ComputedData>({ isValid: false });

    const { checkFieldVisibility } = useFieldVisibility(activeSchema, formData, computedData);

    // Field should not be visible because isValid is false
    expect(checkFieldVisibility(activeSchema.value.field1)).toBe(false);

    // Update computed data
    computedData.value = { isValid: true };

    // Now field should be visible
    expect(checkFieldVisibility(activeSchema.value.field1)).toBe(true);
  });
});
