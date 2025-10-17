import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { expectStandardFormMethods, getTestGlobals } from '../../../utils/testHelpers';
import EmailInput from '../../../../src/components/inputs/EmailInput.vue';

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

  it('uses InputText with type email', () => {
    // EmailInput now uses PrimeVue InputText component with type="email"
    const inputText = wrapper.findComponent({ name: 'InputText' });
    expect(inputText.exists()).toBe(true);
    expect(inputText.attributes('type')).toBe('email');
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
