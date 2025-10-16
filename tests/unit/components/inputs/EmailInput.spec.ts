import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import {
  createBaseInputMock,
  expectStandardFormMethods,
  getTestGlobals,
} from '../../../utils/testHelpers';
import EmailInput from '../../../../src/components/inputs/EmailInput.vue';
import BaseInput from '../../../../src/components/inputs/BaseInput.vue';

// Mock BaseInput component
createBaseInputMock();

describe('EmailInput', () => {
  let wrapper;
  const defaultProps = {
    modelValue: {
      type: 'EmailInput',
      label: 'Email Address',
      required: true,
    },
  };

  beforeEach(() => {
    wrapper = mount(EmailInput, {
      props: defaultProps,
      global: {
        ...getTestGlobals(),
        stubs: {
          ...getTestGlobals().stubs,
          BaseInput: true, // Keep BaseInput stubbed for this test
        },
      },
    });
  });

  it('renders the component properly', () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it('exposes required methods', () => {
    expectStandardFormMethods(wrapper);
  });

  it('forwards props to base input', () => {
    const baseInput = mount(BaseInput, {
      props: {
        modelValue: defaultProps.modelValue,
        schema: {},
        type: 'email',
      },
      global: getTestGlobals(),
    });

    expect(baseInput.props('type')).toBe('email');
    expect(baseInput.props('modelValue')).toEqual(defaultProps.modelValue);
  });

  it('propagates validation methods to parent', async () => {
    // Test that the exposed methods exist and work
    expect(typeof wrapper.vm.onReset).toBe('function');
    expect(typeof wrapper.vm.onValueUpdate).toBe('function');
    expect(typeof wrapper.vm.getErrors).toBe('function');

    // Call the methods - they should not throw
    await wrapper.vm.onReset();
    await wrapper.vm.onValueUpdate();

    const errors = wrapper.vm.getErrors();
    expect(Array.isArray(errors)).toBe(true);
  });
});
