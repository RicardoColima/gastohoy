<template>
  <div class="modal fade" id="budgetModal" tabindex="-1" aria-labelledby="budgetModalLabel" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 rounded-4 shadow-lg card-theme">
        <div class="modal-header border-bottom-0 pb-0 px-4 pt-4">
          <h5 class="modal-title fw-bold" id="budgetModalLabel">
            <i class="bi bi-bullseye text-primary me-2"></i>
            Definir Presupuesto
          </h5>
          <button type="button" class="btn-close bg-secondary bg-opacity-10 rounded-circle p-2" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        
        <div class="modal-body p-4">
          <p class="text-muted small mb-4">
            Establece un límite de gastos mensuales. Te ayudaremos a visualizar cuánto te queda disponible.
          </p>

          <form @submit.prevent="submitForm">
            <div class="mb-4">
              <label for="budgetAmount" class="form-label text-muted small fw-bold text-uppercase">Límite Mensual</label>
              <div class="input-group input-group-lg bg-body-tertiary rounded-3 overflow-hidden">
                <span class="input-group-text border-0 bg-transparent fw-bold text-secondary ps-4">$</span>
                <input 
                  type="number" 
                  class="form-control border-0 bg-transparent fw-bold fs-3 text-body" 
                  id="budgetAmount" 
                  v-model.number="amount" 
                  required 
                  min="0" 
                  step="0.01"
                  placeholder="0.00"
                  autofocus
                >
              </div>
            </div>

            <div class="form-check form-switch mb-4">
              <input class="form-check-input" type="checkbox" role="switch" id="addAsIncome" v-model="addAsIncome">
              <label class="form-check-label small" for="addAsIncome">
                Registrar este monto también como <strong>Ingreso del mes</strong>
              </label>
            </div>
            
            <div class="d-grid mt-2">
              <button 
                type="submit" 
                class="btn btn-primary btn-lg rounded-pill fw-bold shadow-sm text-white" 
                :disabled="isSubmitting"
              >
                <i class="bi bi-check-circle me-2" v-if="!isSubmitting"></i>
                {{ isSubmitting ? 'Guardando...' : 'Guardar Presupuesto' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { useExpenses } from '../composables/useExpenses'
import { useHaptic } from '../composables/useHaptic'

const { setBudget, addExpense, monthlyBudget } = useExpenses()
const { hapticLight, hapticSuccess, hapticError } = useHaptic()

const amount = ref('')
const addAsIncome = ref(true)
const isSubmitting = ref(false)
const modalRef = ref(null)
let modalInstance = null

onMounted(() => {
  if (modalRef.value) {
    modalInstance = new Modal(modalRef.value)
  }
})

const submitForm = async () => {
  // Evitar dobles submits si el usuario presiona Enter varias veces rápido
  if (isSubmitting.value) return;
  if (amount.value === '' || amount.value < 0) return;
  
  isSubmitting.value = true
  hapticLight()
  
  try {
    // 1. Guardar el presupuesto
    setBudget(amount.value)
    
    // 2. Si el usuario lo pidió, registrarlo como ingreso
    if (addAsIncome.value && amount.value > 0) {
      await addExpense(amount.value, 'Presupuesto Mensual', 'salary', 'income')
    }

    hapticSuccess()
    if (modalInstance) {
      modalInstance.hide()
    }
  } catch (error) {
    console.error('Error saving budget:', error)
    hapticError()
  } finally {
    // Pequeño delay antes de habilitar el botón de nuevo
    setTimeout(() => {
      isSubmitting.value = false
    }, 500)
  }
}

// Exponer método abierto para componente padre
const open = () => {
  amount.value = monthlyBudget.value > 0 ? monthlyBudget.value : ''
  addAsIncome.value = monthlyBudget.value <= 0 // Sugerir añadir como ingreso solo si es nuevo
  
  if (modalInstance) {
    modalInstance.show()
  }
}

defineExpose({
  open
})
</script>

<style scoped>
.form-control:focus {
  box-shadow: none;
}

.input-group:focus-within {
  box-shadow: 0 0 0 2px var(--bs-primary);
}

/* Theme support */
[data-bs-theme="dark"] .card-theme {
  background-color: #212529 !important;
  color: #f8f9fa !important;
}
[data-bs-theme="light"] .card-theme {
  background-color: #ffffff !important;
  color: #212529 !important;
}

.form-check-input:checked {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}
</style>
