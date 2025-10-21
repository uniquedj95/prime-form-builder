import { describe, it, expect, beforeAll } from 'vitest';
import { mount } from '@vue/test-utils';
import {
  createVueRouterMock,
  createIonicMocks,
  createIonicIconsMock,
  getTestGlobals,
  expectStandardFormMethods,
  mockMatchMedia,
} from '../../../utils/testHelpers';

// Mock dependencies
createVueRouterMock();
createIonicMocks();
createIonicIconsMock();

// Import the component after mocks
import MultiCheckboxInput from '../../../../src/components/inputs/MultiCheckboxInput.vue';

describe('MultiCheckboxInput', () => {
  // Mock matchMedia before all tests
  beforeAll(() => {
    mockMatchMedia();
  });

  it('renders the component properly', () => {
    const wrapper = mount(MultiCheckboxInput, {
      props: {
        modelValue: {
          type: 'MultiCheckboxInput',
          label: 'Test Multi Checkbox',
          value: [],
          options: [
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
            { label: 'Option 3', value: '3' },
          ],
        },
      },
      global: getTestGlobals(),
    });

    expect(wrapper.exists()).toBeTruthy();
  });

  it('renders with the correct props', () => {
    const wrapper = mount(MultiCheckboxInput, {
      props: {
        modelValue: {
          type: 'MultiCheckboxInput',
          label: 'Test Multi Checkbox',
          value: [],
          options: [
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
            { label: 'Option 3', value: '3' },
          ],
        },
      },
      global: getTestGlobals(),
    });

    expect(wrapper.props().modelValue.label).toBe('Test Multi Checkbox');
    expect(wrapper.props().modelValue.options).toHaveLength(3);
    expect(Array.isArray(wrapper.props().modelValue.value)).toBe(true);
  });

  it('renders all options as checkboxes', async () => {
    const wrapper = mount(MultiCheckboxInput, {
      props: {
        modelValue: {
          type: 'MultiCheckboxInput',
          label: 'Test Multi Checkbox',
          value: [],
          options: [
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
            { label: 'Option 3', value: '3' },
          ],
        },
      },
      global: getTestGlobals(),
    });

    // Wait for component to mount
    await wrapper.vm.$nextTick();

    // Check that checkboxes are rendered
    const checkboxOptions = wrapper.findAll('.multicheckbox-option');
    expect(checkboxOptions.length).toBe(3);
  });

  it('handles pre-selected values', () => {
    const wrapper = mount(MultiCheckboxInput, {
      props: {
        modelValue: {
          type: 'MultiCheckboxInput',
          label: 'Test Multi Checkbox',
          value: ['1', '3'],
          options: [
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
            { label: 'Option 3', value: '3' },
          ],
        },
      },
      global: getTestGlobals(),
    });

    expect(wrapper.props().modelValue.value).toEqual(['1', '3']);
  });

  it('handles disabled options', () => {
    const wrapper = mount(MultiCheckboxInput, {
      props: {
        modelValue: {
          type: 'MultiCheckboxInput',
          label: 'Test Multi Checkbox',
          value: [],
          options: [
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2', disabled: true },
            { label: 'Option 3', value: '3' },
          ],
        },
      },
      global: getTestGlobals(),
    });

    expect(wrapper.props().modelValue.options[1].disabled).toBe(true);
  });

  it('exposes required methods', () => {
    const wrapper = mount(MultiCheckboxInput, {
      props: {
        modelValue: {
          type: 'MultiCheckboxInput',
          label: 'Test Multi Checkbox',
          value: [],
          options: [
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
          ],
        },
      },
      global: getTestGlobals(),
    });

    // Use shared helper function to check standard methods
    expectStandardFormMethods(wrapper);
  });

  it('displays label correctly', async () => {
    const wrapper = mount(MultiCheckboxInput, {
      props: {
        modelValue: {
          type: 'MultiCheckboxInput',
          label: 'Select Your Toppings',
          value: [],
          options: [
            { label: 'Cheese', value: 'cheese' },
            { label: 'Mushroom', value: 'mushroom' },
          ],
        },
      },
      global: getTestGlobals(),
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Select Your Toppings');
  });

  it('displays error message when present', async () => {
    const wrapper = mount(MultiCheckboxInput, {
      props: {
        modelValue: {
          type: 'MultiCheckboxInput',
          label: 'Test Multi Checkbox',
          value: [],
          error: 'Please select at least one option',
          options: [
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
          ],
        },
      },
      global: getTestGlobals(),
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Please select at least one option');
  });

  it('handles required field', () => {
    const wrapper = mount(MultiCheckboxInput, {
      props: {
        modelValue: {
          type: 'MultiCheckboxInput',
          label: 'Required Field',
          value: [],
          required: true,
          options: [
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
          ],
        },
      },
      global: getTestGlobals(),
    });

    expect(wrapper.props().modelValue.required).toBe(true);
  });
});
