<template>
  <div id="app">
    <div class="layout-wrapper">
      <!-- Fixed Top Navigation Bar -->
      <header class="topbar">
        <button
          class="topbar-menu-toggle"
          @click="sidebarCollapsed = !sidebarCollapsed"
          :title="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <i class="pi pi-bars"></i>
        </button>
        <h1 class="topbar-title">VForm Builder Demo</h1>
        <div class="topbar-actions">
          <a href="https://github.com/uniquedj95/formBuilder" target="_blank" class="topbar-link">
            <i class="pi pi-github"></i>
            <span class="topbar-link-text">GitHub</span>
          </a>
        </div>
      </header>

      <!-- Fixed Left Sidebar -->
      <aside
        class="sidebar-left"
        :class="{ collapsed: sidebarCollapsed }"
        aria-label="left side menu"
      >
        <nav class="sidebar-nav" aria-label="Main Navigation">
          <router-link
            v-for="item in menuItems"
            :key="item.url"
            :to="item.url"
            class="nav-item"
            :class="{ active: $route.path === item.url }"
          >
            <i :class="item.icon"></i>
            <span v-if="!sidebarCollapsed" class="nav-label">{{ item.label }}</span>
          </router-link>
        </nav>

        <div v-if="!sidebarCollapsed" class="demo-info">
          <h4>About VForm</h4>
          <p>A simplified PrimeVue form builder with validation and dependent fields support.</p>
        </div>
      </aside>

      <!-- Mobile Menu Toggle -->
      <button class="mobile-menu-toggle" @click="mobileMenuVisible = !mobileMenuVisible">
        <i class="pi pi-bars"></i>
      </button>

      <!-- Mobile Overlay -->
      <div
        class="mobile-overlay"
        :class="{ visible: mobileMenuVisible }"
        @click="mobileMenuVisible = false"
      ></div>

      <!-- Mobile Sidebar -->
      <aside
        class="sidebar-mobile"
        :class="{ visible: mobileMenuVisible }"
        aria-label="sidebar label"
      >
        <div class="sidebar-header">
          <h2>VForm Demo</h2>
          <p class="subtitle">Explore all features</p>
          <button class="close-btn" @click="mobileMenuVisible = false">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <nav class="sidebar-nav" aria-label="Mobile Navigation">
          <router-link
            v-for="item in menuItems"
            :key="item.url"
            :to="item.url"
            class="nav-item"
            :class="{ active: $route.path === item.url }"
            @click="mobileMenuVisible = false"
          >
            <i :class="item.icon"></i>
            <span class="nav-label">{{ item.label }}</span>
          </router-link>
        </nav>

        <div class="demo-info">
          <h4>About VForm</h4>
          <p>A simplified PrimeVue form builder with validation and dependent fields support.</p>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="content-wrapper" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
        <div class="content-container">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const sidebarCollapsed = ref(false);
const mobileMenuVisible = ref(false);

const menuItems = [
  {
    label: 'Basic Form',
    url: '/basic',
    icon: 'pi pi-file',
  },
  {
    label: 'Section Demo',
    url: '/sections',
    icon: 'pi pi-list',
  },
  {
    label: 'Multi-Step Form',
    url: '/multi-step',
    icon: 'pi pi-folder',
  },
  {
    label: 'Advanced Features',
    url: '/advanced',
    icon: 'pi pi-cog',
  },
  {
    label: 'Validation Examples',
    url: '/validation',
    icon: 'pi pi-check-square',
  },
  {
    label: 'Dependent Fields',
    url: '/dependent',
    icon: 'pi pi-link',
  },
  {
    label: 'Custom Styles',
    url: '/styles',
    icon: 'pi pi-palette',
  },
  {
    label: 'Custom Components',
    url: '/custom-component',
    icon: 'pi pi-box',
  },
  {
    label: 'Conditional Steps',
    url: '/conditional-steps',
    icon: 'pi pi-eye',
  },
  {
    label: 'Repeat Input Fields',
    url: '/repeat-input',
    icon: 'pi pi-copy',
  },
  {
    label: 'Async Field Values',
    url: '/async-field-values',
    icon: 'pi pi-file-import',
  },
];
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  background: var(--surface-ground);
  color: var(--text-color);
}

#app {
  min-height: 100vh;
}

.layout-wrapper {
  display: flex;
  min-height: 100vh;
  position: relative;
}

/* Fixed Top Navigation Bar */
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color) 100%);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  padding: 0 2rem;
  gap: 1rem;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.topbar-menu-toggle {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  backdrop-filter: blur(5px);
}

.topbar-menu-toggle:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.topbar-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  flex: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: -0.02em;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.topbar-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  color: white;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
}

.topbar-link:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.topbar-link i {
  font-size: 1.125rem;
}

/* Fixed Left Sidebar */
.sidebar-left {
  position: fixed;
  left: 0;
  top: 70px;
  height: calc(100vh - 70px);
  width: 320px;
  background: linear-gradient(145deg, var(--surface-card) 0%, var(--surface-50) 100%);
  border-right: 1px solid var(--surface-border);
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.08);
}

.sidebar-left.collapsed {
  width: 85px;
}

.sidebar-left::-webkit-scrollbar {
  width: 8px;
}

.sidebar-left::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

.sidebar-left::-webkit-scrollbar-thumb {
  background: var(--surface-border);
  border-radius: 8px;
  transition: background 0.2s ease;
}

.sidebar-left::-webkit-scrollbar-thumb:hover {
  background: var(--primary-color);
}

/* Sidebar Header */
.sidebar-header {
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid var(--surface-border);
  position: relative;
}

.sidebar-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
  transition: opacity 0.2s;
}

.sidebar-header .collapsed-title {
  text-align: center;
  font-size: 1.25rem;
}

.sidebar-header .subtitle {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  white-space: nowrap;
}

/* Sidebar Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1.5rem 1rem;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  text-decoration: none;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  gap: 1rem;
  position: relative;
  white-space: nowrap;
  background: transparent;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: var(--primary-color);
  border-radius: 0 4px 4px 0;
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.nav-item:hover {
  background: var(--surface-hover);
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-item:hover::before {
  transform: scaleY(1);
}

.nav-item.active {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transform: translateX(8px);
}

.nav-item.active::before {
  transform: scaleY(1);
  background: white;
}

.nav-item i {
  font-size: 1.25rem;
  min-width: 1.5rem;
  color: var(--text-color-secondary);
  transition: all 0.3s ease;
}

.nav-item:hover i {
  color: var(--primary-color);
  transform: scale(1.1);
}

.nav-item.active i {
  color: white;
  transform: scale(1.1);
}

.nav-label {
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  letter-spacing: -0.01em;
}

.sidebar-left.collapsed .nav-item {
  justify-content: center;
  padding: 1rem 0.75rem;
  transform: none;
}

.sidebar-left.collapsed .nav-item:hover {
  transform: translateX(0) scale(1.05);
}

.sidebar-left.collapsed .nav-item.active {
  transform: translateX(0) scale(1.05);
}

.sidebar-left.collapsed .nav-label {
  position: absolute;
  left: 100%;
  background: var(--surface-overlay);
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  margin-left: 1rem;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
  z-index: 1000;
  font-weight: 600;
  color: var(--text-color);
}

.sidebar-left.collapsed .nav-item:hover .nav-label {
  opacity: 1;
  transform: translateX(4px);
}

/* Demo Info */
.demo-info {
  padding: 1.5rem 1.25rem;
  margin-top: auto;
  border-top: 1px solid var(--surface-border);
  background: var(--surface-hover);
  border-radius: 16px 16px 0 0;
  transition: opacity 0.3s ease;
}

.demo-info h4 {
  margin: 0 0 0.75rem 0;
  color: var(--primary-color);
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.demo-info h4::before {
  content: '💡';
  font-size: 1.1rem;
}

.demo-info p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text-color-secondary);
  font-weight: 500;
}

/* Collapse Toggle */
.collapse-toggle {
  position: absolute;
  bottom: 1.5rem;
  right: -15px;
  background: var(--primary-color);
  color: white;
  border: 2px solid var(--surface-card);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s;
  z-index: 10;
}

.collapse-toggle:hover {
  background: var(--primary-color);
  transform: scale(1.1);
}

.collapse-toggle i {
  font-size: 0.875rem;
}

/* Main Content */
.content-wrapper {
  flex: 1;
  margin-left: 320px;
  margin-top: 70px;
  padding: 0;
  min-height: calc(100vh - 70px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--surface-ground);
}

.content-wrapper.sidebar-collapsed {
  margin-left: 85px;
}

/* Content Container */
.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2.5rem 2.5rem 4rem;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile Menu */
/* Mobile Menu Toggle Button */
.mobile-menu-toggle {
  display: none;
  position: fixed;
  top: 70px;
  right: 1.5rem;
  z-index: 1001;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

.mobile-menu-toggle:hover {
  background: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.mobile-menu-toggle i {
  font-size: 1.25rem;
}

.mobile-overlay {
  display: none;
  position: fixed;
  top: 60px;
  left: 0;
  width: 100%;
  height: calc(100% - 60px);
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

.sidebar-mobile {
  display: none;
  position: fixed;
  left: -100%;
  top: 60px;
  height: calc(100vh - 60px);
  width: 280px;
  background: var(--surface-card);
  z-index: 999;
  transition: left 0.3s ease;
  overflow-y: auto;
  flex-direction: column;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.15);
}

.sidebar-mobile.visible {
  left: 0;
}

.sidebar-mobile .close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: var(--text-color-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.sidebar-mobile .close-btn:hover {
  background: var(--surface-hover);
  color: var(--text-color);
}

.sidebar-mobile .close-btn i {
  font-size: 1.25rem;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .sidebar-left {
    width: 85px;
  }

  .sidebar-left .sidebar-header h2,
  .sidebar-left .subtitle,
  .sidebar-left .demo-info {
    display: none;
  }

  .sidebar-left .collapsed-title {
    display: block !important;
  }

  .sidebar-left .nav-label {
    position: absolute;
    left: 100%;
    background: var(--surface-overlay);
    padding: 0.75rem 1.25rem;
    border-radius: 12px;
    margin-left: 1rem;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    white-space: nowrap;
    z-index: 1000;
    font-weight: 600;
    color: var(--text-color);
  }

  .sidebar-left .nav-item:hover .nav-label {
    opacity: 1;
    transform: translateX(4px);
  }

  .sidebar-left .nav-item {
    justify-content: center;
    padding: 1rem 0.75rem;
    transform: none;
  }

  .sidebar-left .nav-item:hover {
    transform: translateX(0) scale(1.05);
  }

  .sidebar-left .nav-item.active {
    transform: translateX(0) scale(1.05);
  }

  .collapse-toggle {
    display: none;
  }

  .content-wrapper {
    margin-left: 85px;
  }
}

@media (max-width: 768px) {
  .topbar {
    height: 70px;
    padding: 0 1.5rem;
  }

  .topbar-title {
    font-size: 1.125rem;
  }

  .topbar-link-text {
    display: none;
  }

  .sidebar-left {
    display: none;
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .mobile-overlay {
    display: block;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .mobile-overlay.visible {
    opacity: 1;
    pointer-events: auto;
  }

  .sidebar-mobile {
    display: flex;
  }

  .content-wrapper {
    margin-left: 0;
    padding: 0;
    margin-top: 70px;
  }

  .content-wrapper.sidebar-collapsed {
    margin-left: 0;
  }

  .content-container {
    padding: 2rem 1.5rem 3rem;
  }
}

@media (max-width: 480px) {
  .topbar {
    padding: 0 1rem;
  }

  .topbar-title {
    font-size: 0.875rem;
  }

  .sidebar-mobile {
    width: 100%;
  }

  .content-wrapper {
    padding: 1rem 0.75rem;
  }
}
</style>
