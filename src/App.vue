<template>
  <div class="app-wrapper min-vh-100 bg-body text-body transition-bg d-flex">
    
    <!-- Sidebar for Desktop -->
    <aside class="desktop-sidebar bg-body shadow-lg border-end border-secondary-subtle d-none d-md-flex flex-column transition-bg position-fixed top-0 start-0 vh-100" style="width: 280px; z-index: 1040;">
      <div class="p-4 d-flex align-items-center mb-2 mt-2">
        <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" style="width: 40px; height: 40px;">
          <i class="bi bi-wallet2 fs-5"></i>
        </div>
        <h4 class="mb-0 fw-bold text-primary tracking-tight">GastoHoy</h4>
      </div>
      
      <div class="px-3 flex-grow-1 d-flex flex-column gap-2 mt-3" v-if="isAuthenticated">
        <div class="text-muted small fw-bold text-uppercase px-3 mb-1" style="letter-spacing: 0.05em; font-size: 0.7rem;">Menú Principal</div>
        
        <button 
          class="btn text-start border-0 rounded-4 px-3 py-3 d-flex align-items-center gap-3 transition-bg w-100 sidebar-btn"
          :class="currentView === 'dashboard' ? 'active bg-primary bg-opacity-10 text-primary fw-bold' : 'text-body-secondary hover-bg'"
          @click="changeView('dashboard')"
        >
          <i class="bi fs-5" :class="currentView === 'dashboard' ? 'bi-house-door-fill' : 'bi-house-door'"></i>
          <span>Inicio</span>
        </button>
        
        <button 
          class="btn text-start border-0 rounded-4 px-3 py-3 d-flex align-items-center gap-3 transition-bg w-100 sidebar-btn"
          :class="currentView === 'stats' ? 'active bg-primary bg-opacity-10 text-primary fw-bold' : 'text-body-secondary hover-bg'"
          @click="changeView('stats')"
        >
          <i class="bi fs-5" :class="currentView === 'stats' ? 'bi-pie-chart-fill' : 'bi-pie-chart'"></i>
          <span>Estadísticas</span>
        </button>
        
        <button 
          class="btn text-start border-0 rounded-4 px-3 py-3 d-flex align-items-center gap-3 transition-bg w-100 sidebar-btn"
          :class="currentView === 'backup' ? 'active bg-primary bg-opacity-10 text-primary fw-bold' : 'text-body-secondary hover-bg'"
          @click="changeView('backup')"
        >
          <i class="bi fs-5" :class="currentView === 'backup' ? 'bi-cloud-arrow-up-fill' : 'bi-cloud-arrow-up'"></i>
          <span>Respaldo</span>
        </button>
      </div>

      <div class="p-4 mt-auto border-top border-secondary-subtle bg-body-tertiary" v-if="isAuthenticated">
        <div class="d-flex gap-2 justify-content-between mb-3">
          <button class="btn bg-body rounded-circle shadow-sm border border-secondary-subtle d-flex align-items-center justify-content-center" style="width: 45px; height: 45px;" @click="changeView('about')" title="Acerca de">
            <i class="bi bi-info-circle text-primary"></i>
          </button>
          <button class="btn bg-body rounded-circle shadow-sm border border-secondary-subtle d-flex align-items-center justify-content-center" style="width: 45px; height: 45px;" @click="handleToggleTheme" title="Alternar Tema">
            <i class="bi" :class="isDark ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-secondary'"></i>
          </button>
        </div>
        <button class="btn btn-outline-danger w-100 rounded-pill fw-bold border-2 d-flex align-items-center justify-content-center gap-2 btn-logout-hover" @click="doLogout">
          <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
        </button>
      </div>
    </aside>

    <!-- Main Content App Container -->
    <div class="app-content-area flex-grow-1 d-flex flex-column position-relative desktop-canvas-bg min-vh-100 ms-md-sidebar">
      <LoginView v-if="!isAuthenticated" @authenticated="handleLogin" />
      
      <div v-else class="min-vh-100 d-flex flex-column flex-grow-1 position-relative pb-5 pb-md-0">
        
        <!-- Top Navigation Bar for Mobile Only -->
        <nav class="navbar pt-3 pb-2 px-3 sticky-top bg-body transition-bg shadow-sm d-md-none" style="z-index: 1040;">
          <div class="container-fluid px-0 d-flex justify-content-between align-items-center">
            <span class="navbar-brand mb-0 h1 fw-bold text-primary d-flex align-items-center m-0">
              <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2 shadow-sm" style="width: 32px; height: 32px;">
                <i class="bi bi-wallet2 fs-6"></i>
              </div>
              GastoHoy
            </span>
            
            <div class="d-flex gap-2">
              <button class="btn border-0 rounded-circle shadow-sm transition-bg bg-body-secondary" style="width: 40px; height: 40px;" @click="changeView('about')" title="Acerca de">
                <i class="bi bi-info-circle text-primary"></i>
              </button>
              <button class="btn border-0 rounded-circle shadow-sm transition-bg bg-body-secondary" style="width: 40px; height: 40px;" @click="handleToggleTheme" title="Alternar Tema">
                <i class="bi" :class="isDark ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill text-secondary'"></i>
              </button>
              <button class="btn border-0 rounded-circle shadow-sm transition-bg bg-danger bg-opacity-10" style="width: 40px; height: 40px;" @click="doLogout" title="Cerrar Sesión">
                <i class="bi bi-box-arrow-right text-danger"></i>
              </button>
            </div>
          </div>
        </nav>

        <!-- Main Content Area -->
        <main class="flex-grow-1 mb-5 mb-md-0 pb-4 pt-md-4 content-wrapper mx-auto w-100 max-w-desktop">
          <transition name="fade" mode="out-in">
            <DashboardView 
              v-if="currentView === 'dashboard'" 
              @logout="doLogout" 
            />
            <StatsView 
              v-else-if="currentView === 'stats'" 
            />
            <BackupView 
              v-else-if="currentView === 'backup'" 
              @back="changeView('dashboard')" 
            />
            <AboutView 
              v-else-if="currentView === 'about'" 
              @back="changeView('dashboard')" 
            />
          </transition>
        </main>

        <!-- Bottom Navigation Bar for Mobile Only -->
        <nav class="bottom-nav fixed-bottom shadow-lg transition-bg bg-body border-top border-secondary-subtle d-md-none">
          <div class="container-fluid px-0">
            <div class="d-flex justify-content-around align-items-center py-2">
              <button 
                class="btn btn-nav d-flex flex-column align-items-center border-0 w-100 py-2"
                :class="currentView === 'dashboard' ? 'text-primary active-nav' : 'text-body-secondary'"
                @click="changeView('dashboard')"
              >
                <i class="bi fs-4 mb-1 lh-1" :class="currentView === 'dashboard' ? 'bi-house-door-fill' : 'bi-house-door'"></i>
                <span class="small fw-medium" style="font-size: 0.7rem;">Inicio</span>
              </button>
              
              <button 
                class="btn btn-nav d-flex flex-column align-items-center border-0 w-100 py-2"
                :class="currentView === 'stats' ? 'text-primary active-nav' : 'text-body-secondary'"
                @click="changeView('stats')"
              >
                <i class="bi fs-4 mb-1 lh-1" :class="currentView === 'stats' ? 'bi-pie-chart-fill' : 'bi-pie-chart'"></i>
                <span class="small fw-medium" style="font-size: 0.7rem;">Estadísticas</span>
              </button>
              
              <button 
                class="btn btn-nav d-flex flex-column align-items-center border-0 w-100 py-2"
                :class="currentView === 'backup' ? 'text-primary active-nav' : 'text-body-secondary'"
                @click="changeView('backup')"
              >
                <i class="bi fs-4 mb-1 lh-1" :class="currentView === 'backup' ? 'bi-cloud-arrow-up-fill' : 'bi-cloud-arrow-up'"></i>
                <span class="small fw-medium" style="font-size: 0.7rem;">Respaldo</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from './composables/useAuth'
import { useTheme } from './composables/useTheme'
import { useHaptic } from './composables/useHaptic'
import LoginView from './components/LoginView.vue'
import DashboardView from './components/DashboardView.vue'
import BackupView from './components/BackupView.vue'
import StatsView from './components/StatsView.vue'
import AboutView from './components/AboutView.vue'

const { isAuthenticated, logout } = useAuth()
const { isDark, toggleTheme } = useTheme()
const { hapticLight, hapticMedium } = useHaptic()
const currentView = ref('dashboard')

const handleLogin = () => {
  currentView.value = 'dashboard'
}

const doLogout = () => {
  hapticMedium()
  logout()
}

const handleToggleTheme = () => {
  hapticLight()
  toggleTheme()
}

const changeView = (view) => {
  if (currentView.value !== view) {
    hapticLight()
    currentView.value = view
  }
}
</script>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  background-color: var(--bs-body-bg);
  overflow-x: hidden;
}

.app-wrapper {
  max-width: 100vw;
}

.app-content-area {
  max-width: 100vw;
  min-height: 100vh;
}

/* Ensure the central content doesn't stretch infinitely on huge screens */
.max-w-desktop {
  max-width: 1200px;
}

/* Desktop and Sidebar tweaks */
@media (min-width: 768px) {
  .ms-md-sidebar {
    margin-left: 280px;
  }
  
  .desktop-canvas-bg {
    background-color: var(--bs-body-bg);
  }
  [data-bs-theme="light"] .desktop-canvas-bg {
    background-color: #f4f6f9 !important;
  }
  [data-bs-theme="dark"] .desktop-canvas-bg {
    background-color: #121416 !important;
  }
  
  .content-wrapper {
    padding: 2rem !important;
  }
}

.tracking-tight {
  letter-spacing: -0.02em;
}

.sidebar-btn {
  transition: all 0.2s ease;
}

.sidebar-btn.active {
  transform: translateX(5px);
}

.sidebar-btn:hover:not(.active) {
  background-color: rgba(0,0,0,0.05);
}
[data-bs-theme="dark"] .sidebar-btn:hover:not(.active) {
  background-color: rgba(255,255,255,0.05);
}

.btn-logout-hover {
  transition: all 0.2s ease;
}
.btn-logout-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(220,53,69,0.3) !important;
}

.hover-bg:hover {
  background-color: rgba(0,0,0,0.05);
}
[data-bs-theme="dark"] .hover-bg:hover {
  background-color: rgba(255,255,255,0.05);
}

.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
}
[data-bs-theme="dark"] .hover-lift:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
}

.bottom-nav {
  z-index: 1030;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.btn-nav {
  background: transparent;
  transition: all 0.2s ease;
}

.btn-nav:hover {
  background: rgba(0,0,0,0.05);
}

[data-bs-theme="dark"] .btn-nav:hover {
  background: rgba(255,255,255,0.05);
}

.active-nav {
  position: relative;
}

.active-nav::after {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background-color: var(--bs-primary);
  border-radius: 50%;
}

/* Modal centering override for desktop vs mobile */
.modal-backdrop {
  z-index: 1050;
}
@media (max-width: 767.98px) {
  .modal-backdrop {
    left: 50% !important;
    transform: translateX(-50%);
    width: 100%;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.transition-bg {
  transition: background-color 0.3s ease, color 0.3s ease;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.2);
  border-radius: 10px;
}
[data-bs-theme="dark"] ::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.2);
}
</style>
