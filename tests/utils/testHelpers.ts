import { vi, expect } from 'vitest';

/**
 * Mock matchMedia for components that use it (like PrimeVue Select)
 */
export const mockMatchMedia = () => {
  Object.defineProperty(globalThis, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

/**
 * Common Ionic component mocks for testing
 * Reduces duplication across test files
 */
export const createIonicMocks = () => {
  return vi.mock('@ionic/vue', () => ({
    IonButton: {
      name: 'IonButton',
      template: '<button class="ion-button"><slot></slot></button>',
    },
    IonGrid: {
      name: 'IonGrid',
      template: '<div class="ion-grid"><slot></slot></div>',
    },
    IonRow: {
      name: 'IonRow',
      template: '<div class="ion-row"><slot></slot></div>',
    },
    IonCol: {
      name: 'IonCol',
      template: '<div class="ion-col"><slot></slot></div>',
    },
    IonIcon: {
      name: 'IonIcon',
      template: '<div class="ion-icon"></div>',
    },
    IonInput: {
      name: 'IonInput',
      template:
        '<div class="ion-input"><slot name="label"></slot><slot name="start"></slot><slot></slot><slot name="end"></slot></div>',
    },
    IonList: {
      name: 'IonList',
      template: '<div class="ion-list"><slot></slot></div>',
    },
    IonItem: {
      name: 'IonItem',
      template: '<div class="ion-item"><slot name="start"></slot><slot></slot></div>',
    },
    IonLabel: {
      name: 'IonLabel',
      template: '<div class="ion-label"><slot></slot></div>',
    },
    IonChip: {
      name: 'IonChip',
      template: '<div class="ion-chip"><slot></slot></div>',
    },
    IonText: {
      name: 'IonText',
      template: '<div class="ion-text"><slot></slot></div>',
    },
    IonCheckbox: {
      name: 'IonCheckbox',
      template: '<div class="ion-checkbox"></div>',
    },
    actionSheetController: {
      create: vi.fn().mockResolvedValue({ present: vi.fn() }),
    },
    alertController: {
      create: vi.fn().mockResolvedValue({ present: vi.fn() }),
    },
  }));
};

/**
 * Common Ionic component stubs for Vue Test Utils
 * Reduces duplication in component mounting
 */
export const ionicComponentStubs = {
  'ion-button': true,
  'ion-grid': true,
  'ion-row': true,
  'ion-col': true,
  'ion-icon': true,
  'ion-input': {
    template:
      '<div class="ion-input"><slot name="label"></slot><slot name="start"></slot><slot></slot><slot name="end"></slot></div>',
  },
  'ion-list': {
    template: '<div class="ion-list"><slot></slot></div>',
  },
  'ion-item': {
    template: '<div class="ion-item"><slot name="start"></slot><slot></slot></div>',
  },
  'ion-label': {
    template: '<div class="ion-label"><slot></slot></div>',
  },
  'ion-chip': {
    template: '<div class="ion-chip"><slot></slot></div>',
  },
  'ion-text': {
    template: '<div class="ion-text"><slot></slot></div>',
  },
  'ion-checkbox': {
    template: '<div class="ion-checkbox"></div>',
  },
};

/**
 * Common form input component stubs
 * Reduces duplication in form component testing
 */
export const formInputStubs = {
  'text-input': true,
  'email-input': true,
  'password-input': true,
  'number-input': true,
  'select-input': true,
  'textarea-input': true,
  'checkbox-input': true,
  'date-input': true,
  'repeat-input': true,
};

/**
 * Mock for ionicons
 * Reduces duplication in icon mocking
 */
export const createIonicIconsMock = () => {
  return vi.mock('ionicons/icons', () => ({
    chevronDown: 'chevron-down',
    close: 'close',
    add: 'add',
    remove: 'remove',
    calendar: 'calendar',
  }));
};

/**
 * Common BaseInput mock for input component testing
 * Reduces duplication in input component tests
 */
export const createBaseInputMock = () => {
  return vi.mock('../../../../src/components/inputs/BaseInput.vue', () => ({
    default: {
      name: 'BaseInput',
      props: ['modelValue', 'schema', 'type'],
      template: `
        <div class="base-input">
          <div v-if="modelValue.label" class="label">
            {{ modelValue.label }}
            <span v-if="modelValue.required" class="required-indicator">*</span>
          </div>
          <div class="input-field"></div>
          <div v-if="modelValue.error" class="error">{{ modelValue.error }}</div>
        </div>
      `,
      methods: {
        onReset: vi.fn(),
        onValueUpdate: vi.fn(),
        getErrors: vi.fn().mockReturnValue([]),
      },
    },
  }));
};

/**
 * Common vue-router mock
 * Reduces duplication in router mocking
 */
export const createVueRouterMock = () => {
  return vi.mock('vue-router', () => ({
    routeLocationKey: Symbol('routeLocationKey'),
    matchedRouteKey: Symbol('matchedRouteKey'),
    useRoute: vi.fn(),
  }));
};

/**
 * Mock maskito directive for testing
 * Prevents "Failed to resolve directive: maskito" warnings
 */
export const createMaskitoMock = () => {
  return vi.mock('@maskito/vue', () => ({
    maskito: {
      beforeMount: vi.fn(),
      updated: vi.fn(),
      unmounted: vi.fn(),
    },
  }));
};

/**
 * Common global configuration for Vue Test Utils
 * Includes directive mocks to prevent warnings
 */
export const getTestGlobals = () => ({
  directives: {
    maskito: {
      beforeMount: vi.fn(),
      updated: vi.fn(),
      unmounted: vi.fn(),
    },
  },
  provide: {
    globalConfig: {
      ripple: false,
      inputStyle: null,
      locale: {
        startsWith: 'Starts with',
        contains: 'Contains',
        notContains: 'Not contains',
        endsWith: 'Ends with',
        equals: 'Equals',
        notEquals: 'Not equals',
      },
      filterMatchModeOptions: {},
      config: {
        ripple: false,
        inputStyle: null,
        theme: {
          preset: {},
        },
      },
    },
  },
  mocks: {
    $primevue: {
      config: {
        ripple: false,
        inputStyle: null,
        locale: {},
        filterMatchModeOptions: {},
        theme: {
          preset: {},
        },
      },
    },
  },
  stubs: {
    ...ionicComponentStubs,
    IftaLabel: {
      template: '<div class="ifta-label"><slot></slot></div>',
    },
  },
});

/**
 * Standard test methods that many components should expose
 * Reduces duplication in component method testing
 */
export const expectStandardFormMethods = (wrapper: any) => {
  const vm = wrapper.vm as any;
  expect(typeof vm.onValueUpdate).toBe('function');
  expect(typeof vm.onReset).toBe('function');
  expect(typeof vm.getErrors).toBe('function');
};
