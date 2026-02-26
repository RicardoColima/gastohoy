<template>
  <div class="container-fluid pb-5 mb-5 mt-3 px-4">
    <!-- Header with Desktop Actions -->
    <div class="d-flex justify-content-between align-items-end mb-4 mt-2">
      <div>
        <h2 class="mb-0 fw-bold">Hola, {{ user?.name }}</h2>
        <span class="text-muted small fw-medium">{{ currentDate }}</span>
      </div>
      
      <!-- Desktop Quick Actions (Hidden on Mobile) -->
      <div class="d-none d-md-flex gap-2">
        <button 
          class="btn btn-outline-danger rounded-pill fw-bold px-4 py-2 d-flex align-items-center gap-2 btn-hover-lift"
          @click="openModal('expense')"
        >
          <i class="bi bi-arrow-up-right"></i> Gasto
        </button>
        <button 
          class="btn btn-success rounded-pill fw-bold px-4 py-2 d-flex align-items-center gap-2 btn-hover-lift shadow-sm"
          @click="openModal('income')"
        >
          <i class="bi bi-arrow-down-right "></i> Ingreso
        </button>
      </div>
    </div>

    <div class="row">
      <!-- Columna Izquierda (Resumen y Widgets) -->
      <div class="col-md-5 col-lg-4 mb-4 mb-md-0">
        <!-- Premium Balance Card -->
        <div class="card border-0 shadow-lg rounded-4 mb-4 balance-card position-relative overflow-hidden">
          <div class="balance-card-bg"></div>
          <div class="card-body p-4 position-relative z-1 text-white">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h6 class="text-white-50 text-uppercase small fw-bold mb-0" style="letter-spacing: 0.1em;">Balance Total</h6>
              <i class="bi bi-wallet2 fs-4 opacity-50"></i>
            </div>
            <div v-if="isLoading" class="skeleton-text mb-2 bg-light bg-opacity-25" style="width: 150px; height: 40px;"></div>
            <h1 v-else class="display-4 fw-bold mb-1 tracking-tight">
              ${{ currentBalance.toFixed(2) }}
            </h1>
            <div class="d-flex align-items-center mt-3 pt-3 border-top border-light border-opacity-25">
              <div class="flex-grow-1">
                <span class="text-white-50 small d-block" style="font-size: 0.7rem;">Ingresos</span>
                <span class="fw-bold small">+${{ monthIncome.toFixed(2) }}</span>
              </div>
              <div class="flex-grow-1 border-start border-light border-opacity-25 ps-3">
                <span class="text-white-50 small d-block" style="font-size: 0.7rem;">Gastos</span>
                <span class="fw-bold small">-${{ monthTotal.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Gestión de Presupuesto Mensual -->
        <div class="mb-4">
          <div class="d-flex justify-content-between align-items-end mb-2">
            <h6 class="mb-0 fw-bold">Presupuesto Mensual</h6>
            <button class="btn btn-link p-0 text-decoration-none small" @click="openBudgetModal">Definir</button>
          </div>
          
          <div v-if="monthlyBudget > 0" class="card card-theme border-0 shadow-sm rounded-4">
            <div class="card-body p-3">
              <div class="d-flex justify-content-between small mb-2">
                <span class="text-muted">Gastado: <strong>${{ monthTotal.toFixed(2) }}</strong></span>
                <span class="text-muted">Límite: <strong>${{ monthlyBudget.toFixed(2) }}</strong></span>
              </div>
              <div class="progress rounded-pill" style="height: 10px; background-color: var(--bs-secondary-bg);">
                <div 
                  class="progress-bar rounded-pill" 
                  role="progressbar" 
                  :style="{ width: Math.min(budgetPercentage, 100) + '%' }" 
                  :class="budgetColorClass"
                ></div>
              </div>
              <div class="text-end small mt-1 fw-bold" :class="budgetColorClass.replace('bg-', 'text-')">
                {{ budgetPercentage.toFixed(0) }}%
              </div>
            </div>
          </div>
          <div v-else class="alert alert-secondary border-0 small rounded-3 mb-0">
            No has definido un límite mensual. <a href="#" @click.prevent="openBudgetModal" class="alert-link">Toca aquí para definirlo.</a>
          </div>
        </div>

        <!-- Reset Balance Button -->
        <div class="mb-4">
          <button 
            class="btn btn-outline-warning w-100 rounded-pill fw-bold border-2 d-flex align-items-center justify-content-center gap-2 btn-reset-hover"
            @click="promptResetBalance"
          >
            <i class="bi bi-arrow-clockwise"></i> Reiniciar Balance
          </button>
        </div>

        <!-- Cards de Resumen Mensual (Gastos / Ingresos) - Hidden on desktop since it's in the main card now -->
        <div class="row g-3 mb-4 mb-md-0 d-md-none">
          <div class="col-6">
            <div 
              class="card bg-danger bg-gradient text-white h-100 border-0 shadow-sm rounded-4 interactive-card"
              @click="openModal('expense')"
              role="button"
            >
              <div class="card-body p-3 d-flex flex-column justify-content-between">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div class="bg-white bg-opacity-25 rounded p-1 d-flex align-items-center justify-content-center">
                    <i class="bi bi-arrow-down-right text-white"></i>
                  </div>
                  <i class="bi bi-plus-circle-fill text-white opacity-50"></i>
                </div>
                <div>
                  <h6 class="card-title text-white-50 mb-0 fw-bold small text-uppercase" style="font-size: 0.7rem;">Gastos Mes</h6>
                  <h4 class="mb-0 fw-bold text-truncate">${{ monthTotal.toFixed(2) }}</h4>
                </div>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div 
              class="card bg-success bg-gradient text-white h-100 border-0 shadow-sm rounded-4 interactive-card"
              @click="openModal('income')"
              role="button"
            >
              <div class="card-body p-3 d-flex flex-column justify-content-between">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div class="bg-white bg-opacity-25 rounded p-1 d-flex align-items-center justify-content-center">
                    <i class="bi bi-arrow-up-right text-white"></i>
                  </div>
                  <i class="bi bi-plus-circle-fill text-white opacity-50"></i>
                </div>
                <div>
                  <h6 class="card-title text-white-50 mb-0 fw-bold small text-uppercase" style="font-size: 0.7rem;">Ingresos Mes</h6>
                  <h4 class="mb-0 fw-bold text-truncate">${{ monthIncome.toFixed(2) }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna Derecha (Historial de Actividad) -->
      <div class="col-md-7 col-lg-8">
        <!-- Lista de Transacciones Recientes -->
        <div class="card card-theme border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="mb-0 fw-bold">Actividad Reciente</h5>
              <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2" v-if="recentExpenses.length > 0">{{ recentExpenses.length }}</span>
            </div>

            <!-- Skeleton Loaders -->
            <div v-if="isLoading" class="list-group list-group-flush bg-transparent gap-3">
              <div v-for="i in 4" :key="i" class="list-group-item d-flex justify-content-between align-items-center p-3 border-0 bg-body-tertiary rounded-4">
                <div class="d-flex align-items-center">
                  <div class="skeleton-circle me-3" style="width: 48px; height: 48px;"></div>
                  <div>
                    <div class="skeleton-text mb-2" style="width: 120px; height: 16px;"></div>
                    <div class="skeleton-text" style="width: 80px; height: 12px;"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else-if="recentExpenses.length === 0" class="text-center py-5 text-muted bg-body-tertiary rounded-4 mt-3">
              <div class="bg-secondary bg-opacity-10 rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style="width: 80px; height: 80px;">
                <i class="bi bi-wallet2" style="font-size: 2rem;"></i>
              </div>
              <p class="mb-0 fw-medium">No hay actividad reciente.<br>¡Agrega un registro!</p>
            </div>

            <div v-else class="list-group list-group-flush bg-transparent gap-3 position-relative">
              <TransitionGroup name="list">
                <div 
                  v-for="expense in recentExpenses" 
                  :key="expense.id" 
                  class="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-3 border-0 bg-body-tertiary rounded-4 hover-lift"
                  @click="editExpense(expense)"
                  style="cursor: pointer;"
                >
                  <div class="d-flex align-items-center overflow-hidden">
                    <div 
                      class="rounded-circle d-flex justify-content-center align-items-center me-3 flex-shrink-0 bg-white shadow-sm" 
                      :class="getCategoryDetails(expense.categoryId, expense.type).color"
                      style="width: 48px; height: 48px;"
                    >
                      <i class="bi fs-5" :class="getCategoryDetails(expense.categoryId, expense.type).icon"></i>
                    </div>
                    <div class="text-truncate pe-2">
                      <h6 class="mb-1 fw-bold text-truncate">{{ expense.note }}</h6>
                      <div class="text-muted small d-flex align-items-center text-truncate">
                        <i class="bi bi-clock me-1"></i>
                        {{ formatTime(expense.date) }}
                        <span v-if="expense.backedUp" class="badge bg-success bg-opacity-10 text-success ms-2 rounded-pill px-2 py-1" style="font-size: 0.65rem;">
                          <i class="bi bi-cloud-check me-1"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="text-end d-flex flex-column align-items-end flex-shrink-0 ms-2">
                    <span class="fw-bold fs-5" :class="expense.type === 'income' ? 'text-success' : 'text-body'">
                      {{ expense.type === 'income' ? '+' : '-' }}${{ expense.amount.toFixed(2) }}
                    </span>
                    <button @click.stop="promptDelete(expense.id)" class="btn btn-link text-danger p-0 mt-1 text-decoration-none small z-index-2 d-flex align-items-center" style="font-size: 0.8rem;">
                      <i class="bi bi-trash3 me-1"></i>Eliminar
                    </button>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Action Button with Menu (Hidden on Desktop) -->
    <div class="fab-container d-md-none" :class="{ 'fab-active': isFabMenuOpen }">
      <!-- Backdrop -->
      <div v-if="isFabMenuOpen" class="fab-backdrop" @click="toggleFabMenu"></div>
      
      <!-- Options -->
      <div class="fab-options d-flex flex-column align-items-end gap-3 mb-3">
        <button 
          class="btn btn-success rounded-pill shadow-sm d-flex align-items-center gap-2 px-3 py-2"
          @click="openModal('income')"
        >
          <span class="fw-bold small">Nuevo Ingreso</span>
          <div class="bg-white text-success rounded-circle d-flex align-items-center justify-content-center shadow-sm" style="width: 32px; height: 32px;">
            <i class="bi bi-arrow-up-right fw-bold"></i>
          </div>
        </button>
        <button 
          class="btn btn-danger rounded-pill shadow-sm d-flex align-items-center gap-2 px-3 py-2"
          @click="openModal('expense')"
        >
          <span class="fw-bold small">Nuevo Gasto</span>
          <div class="bg-white text-danger rounded-circle d-flex align-items-center justify-content-center shadow-sm" style="width: 32px; height: 32px;">
            <i class="bi bi-arrow-down-right fw-bold"></i>
          </div>
        </button>
      </div>

      <!-- Main FAB Button -->
      <button 
        class="btn btn-primary rounded-circle shadow-lg fab-main d-flex justify-content-center align-items-center border-0"
        @click="toggleFabMenu"
        aria-label="Agregar Registro"
      >
        <i class="bi bi-plus-lg text-white" :class="{ 'rotate-icon': isFabMenuOpen }"></i>
      </button>
    </div>

    <!-- Modals -->
    <AddExpenseModal ref="modalRef" @expense-saved="handleExpenseSaved" />
    <BudgetModal ref="budgetModalRef" />
    <ConfirmModal 
      ref="confirmModalRef" 
      title="Eliminar Registro" 
      message="¿Estás seguro de que deseas eliminar este registro de forma permanente?"
      @confirm="executeDelete"
    />
    <ConfirmModal 
      ref="resetBalanceModalRef" 
      title="Reiniciar Balance" 
      message="¿Estás seguro de que deseas reiniciar tu balance? Esto eliminará todos tus registros de ingresos y gastos, así como tu presupuesto mensual."
      @confirm="executeResetBalance"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useExpenses } from '../composables/useExpenses'
import { useHaptic } from '../composables/useHaptic'
import AddExpenseModal from './AddExpenseModal.vue'
import BudgetModal from './BudgetModal.vue'
import ConfirmModal from './ConfirmModal.vue'

const { user } = useAuth()
const { hapticLight, hapticHeavy } = useHaptic()
const { 
  isLoading, 
  loadExpenses, 
  deleteExpense, 
  todayTotal, 
  monthTotal, 
  monthIncome,
  currentBalance,
  recentExpenses, 
  getCategoryDetails,
  monthlyBudget,
  resetBalance
} = useExpenses()

const modalRef = ref(null)
const budgetModalRef = ref(null)
const confirmModalRef = ref(null)
const resetBalanceModalRef = ref(null)
const isFabMenuOpen = ref(false)
const expenseToDelete = ref(null)

const currentDate = computed(() => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const dateStr = new Date().toLocaleDateString('es-ES', options)
  return dateStr.charAt(0).toUpperCase() + dateStr.slice(1)
})

const formatTime = (isoString) => {
  return new Date(isoString).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

const budgetPercentage = computed(() => {
  if (monthlyBudget.value <= 0) return 0
  return (monthTotal.value / monthlyBudget.value) * 100
})

const budgetColorClass = computed(() => {
  const p = budgetPercentage.value
  if (p < 50) return 'bg-success'
  if (p < 80) return 'bg-warning'
  return 'bg-danger'
})

onMounted(() => {
  loadExpenses()
})

const toggleFabMenu = () => {
  hapticLight()
  isFabMenuOpen.value = !isFabMenuOpen.value
}

const openBudgetModal = () => {
  hapticLight()
  if (budgetModalRef.value) {
    budgetModalRef.value.open()
  }
}

const openModal = (type = 'expense') => {
  hapticHeavy()
  isFabMenuOpen.value = false // cerrar menú si está abierto
  if (modalRef.value) {
    modalRef.value.open(type)
  }
}

const editExpense = (expense) => {
  hapticLight()
  if (modalRef.value) {
    modalRef.value.open(expense)
  }
}

const handleExpenseSaved = () => {
  // manejado reactivamente
}

const promptDelete = (id) => {
  hapticHeavy()
  expenseToDelete.value = id
  if (confirmModalRef.value) {
    confirmModalRef.value.open()
  }
}

const executeDelete = async () => {
  if (expenseToDelete.value) {
    await deleteExpense(expenseToDelete.value)
    expenseToDelete.value = null
  }
}

const promptResetBalance = () => {
  hapticHeavy()
  if (resetBalanceModalRef.value) {
    resetBalanceModalRef.value.open()
  }
}

const executeResetBalance = async () => {
  const success = await resetBalance()
  if (success) {
    // Los datos se actualizarán automáticamente debido al estado reactivo
  }
}

</script>

<style scoped>
/* Premium Balance Card */
.balance-card {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #0a4291 100%);
}

[data-bs-theme="dark"] .balance-card {
  background: linear-gradient(135deg, #0d47a1 0%, #001e45 100%);
}

.balance-card-bg {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
  border-radius: 50%;
  z-index: 0;
}

.btn-hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn-hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}

.btn-reset-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn-reset-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255,193,7,0.3) !important;
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
[data-bs-theme="dark"] .card-theme {
  background-color: #212529 !important;
  color: #f8f9fa !important;
}
[data-bs-theme="light"] .card-theme {
  background-color: #ffffff !important;
  color: #212529 !important;
}
.z-index-2 {
  position: relative;
  z-index: 2;
}

.interactive-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.interactive-card:active {
  transform: scale(0.96);
}

.list-group-item {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.list-group-item:active {
  transform: scale(0.98);
}

/* List animations */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.9) translateX(30px);
}

.list-leave-active {
  position: absolute;
}

/* Skeleton Loaders */
.skeleton-text, .skeleton-circle {
  background: linear-gradient(90deg, rgba(0,0,0,0.06) 25%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.06) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}
.skeleton-circle {
  border-radius: 50%;
}
[data-bs-theme="dark"] .skeleton-text, [data-bs-theme="dark"] .skeleton-circle {
  background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
  background-size: 200% 100%;
}
@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Floating Action Button & Menu */
.fab-container {
  position: fixed;
  bottom: 90px;
  right: 30px;
  z-index: 1050;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.fab-main {
  width: 65px;
  height: 65px;
  background: linear-gradient(135deg, var(--bs-primary) 0%, #0056b3 100%);
  font-size: 1.5rem;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fab-main:active {
  transform: scale(0.9);
}

.rotate-icon {
  transform: rotate(45deg);
  transition: transform 0.3s ease;
}

.bi-plus-lg {
  transition: transform 0.3s ease;
}

.fab-options {
  position: absolute;
  bottom: 80px;
  right: 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  pointer-events: none;
}

.fab-active .fab-options {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  pointer-events: auto;
}

.fab-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.4);
  z-index: -1;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.3s ease;
}

[data-bs-theme="dark"] .fab-backdrop {
  background-color: rgba(255,255,255,0.1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
