import { createApp, Plugin } from 'vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Lara from '@primevue/themes/lara';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';

// Import PrimeVue styles
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

// Import VForm from the built package
import VForm from 'pv-form';
import 'pv-form/style.css';

// Import demo styles
import './demo-styles.css';
import './assets/animations.css';
import './assets/variables.css';

import BasicDemo from './components/BasicDemo.vue';
import SectionDemo from './components/SectionDemo.vue';
import MultiStepDemo from './components/MultiStepDemo.vue';
import AdvancedDemo from './components/AdvancedDemo.vue';
import ValidationDemo from './components/ValidationDemo.vue';
import DependentFieldsDemo from './components/DependentFieldsDemo.vue';
import CustomStylesDemo from './components/CustomStylesDemo.vue';
import CustomComponentExample from './components/CustomComponentDemo.vue';
import ConditionalStepsDemo from './components/ConditionalStepsDemo.vue';
import RepeatInputDemo from './components/RepeatInputDemo.vue';
import AsyncFieldValuesDemo from './components/AsyncFieldValuesDemo.vue';
import EnhancedStepperDemo from './components/EnhancedStepperDemo.vue';

const routes = [
  { path: '/', redirect: '/basic' },
  { path: '/basic', component: BasicDemo, meta: { title: 'Basic Form' } },
  { path: '/sections', component: SectionDemo, meta: { title: 'Section Demo' } },
  { path: '/multi-step', component: MultiStepDemo, meta: { title: 'Multi-Step Form' } },
  { path: '/advanced', component: AdvancedDemo, meta: { title: 'Advanced Features' } },
  { path: '/validation', component: ValidationDemo, meta: { title: 'Validation Examples' } },
  { path: '/dependent', component: DependentFieldsDemo, meta: { title: 'Dependent Fields' } },
  { path: '/styles', component: CustomStylesDemo, meta: { title: 'Custom Styles' } },
  {
    path: '/custom-component',
    component: CustomComponentExample,
    meta: { title: 'Custom Component Demo' },
  },
  {
    path: '/conditional-steps',
    component: ConditionalStepsDemo,
    meta: { title: 'Conditional Steps Demo' },
  },
  {
    path: '/repeat-input',
    component: RepeatInputDemo,
    meta: { title: 'Repeat Input Demo' },
  },
  {
    path: '/async-field-values',
    component: AsyncFieldValuesDemo,
    meta: { title: 'Async Field Values Demo' },
  },
  {
    path: '/enhanced-stepper',
    component: EnhancedStepperDemo,
    meta: { title: 'Enhanced Stepper Demo' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Lara,
    options: {
      prefix: 'p',
      darkModeSelector: '.dark-mode',
      cssLayer: false,
    },
  },
});
app.use(ToastService);
app.use(router);
app.use(VForm as Plugin);

router.isReady().then(() => {
  app.mount('#app');
});
