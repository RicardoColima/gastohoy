<template>
  <div class="modal fade" id="addExpenseModal" tabindex="-1" aria-labelledby="addExpenseModalLabel" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content border-0 rounded-4 shadow-lg card-theme">
        <div class="modal-header border-bottom-0 pb-0 px-4 pt-4">
          <h5 class="modal-title fw-bold" id="addExpenseModalLabel">
            <i class="bi me-2" :class="isEditing ? 'bi-pencil-fill text-primary' : (type === 'expense' ? 'bi-dash-circle-fill text-danger' : 'bi-plus-circle-fill text-success')"></i>
            {{ isEditing ? 'Editar Registro' : (type === 'expense' ? 'Agregar Gasto' : 'Agregar Ingreso') }}
          </h5>
          <button type="button" class="btn-close bg-secondary bg-opacity-10 rounded-circle p-2" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        
        <!-- Tabs de Selección de Tipo (Solo al crear) -->
        <div class="px-4 mt-3" v-if="!isEditing">
          <div class="d-flex bg-body-tertiary rounded-pill p-1">
            <button 
              class="btn rounded-pill w-50 fw-medium small transition-all"
              :class="type === 'expense' ? 'btn-danger shadow-sm text-white' : 'btn-transparent text-body-secondary'"
              @click="setType('expense')"
            >
              Gasto
            </button>
            <button 
              class="btn rounded-pill w-50 fw-medium small transition-all"
              :class="type === 'income' ? 'btn-success shadow-sm text-white' : 'btn-transparent text-body-secondary'"
              @click="setType('income')"
            >
              Ingreso
            </button>
          </div>
        </div>

        <div class="modal-body p-4">
          <form @submit.prevent="submitForm">
            
            <div class="mb-4">
              <label for="amount" class="form-label text-muted small fw-bold text-uppercase">Monto</label>
              <div class="input-group input-group-lg bg-body-tertiary rounded-3 overflow-hidden">
                <span class="input-group-text border-0 bg-transparent fw-bold text-secondary ps-4">$</span>
                <input 
                  type="number" 
                  class="form-control border-0 bg-transparent fw-bold fs-3 text-body" 
                  :class="type === 'expense' ? 'text-danger' : 'text-success'"
                  id="amount" 
                  v-model.number="amount" 
                  required 
                  min="0.01" 
                  step="0.01"
                  placeholder="0.00"
                  autofocus
                >
              </div>
            </div>

            <div class="mb-4">
              <label for="category" class="form-label text-muted small fw-bold text-uppercase">Categoría</label>
              <div class="d-flex flex-wrap gap-2">
                <button 
                  type="button"
                  v-for="cat in currentCategories" 
                  :key="cat.id"
                  class="btn rounded-pill px-3 py-2 border-0 d-flex align-items-center gap-2 transition-all"
                  :class="categoryId === cat.id ? `${cat.bg} text-white shadow-sm` : 'bg-body-secondary text-body-secondary'"
                  @click="categoryId = cat.id"
                >
                  <i class="bi" :class="cat.icon"></i>
                  <span class="small fw-medium">{{ cat.name }}</span>
                </button>
              </div>
            </div>

            <div class="mb-4">
              <label for="note" class="form-label text-muted small fw-bold text-uppercase">Nota / Descripción</label>
              <div class="input-group input-group-lg bg-body-tertiary rounded-3 overflow-hidden">
                <span class="input-group-text border-0 bg-transparent text-secondary ps-4">
                  <i class="bi bi-pencil-square"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control border-0 bg-transparent text-body" 
                  id="note" 
                  v-model="note" 
                  required 
                  placeholder="Ej. Comida, Transporte, Salario..."
                >
              </div>
            </div>
            
            <div class="d-grid mt-4">
              <button 
                type="submit" 
                class="btn btn-lg rounded-pill fw-bold shadow-sm text-white" 
                :class="type === 'expense' ? 'btn-danger' : 'btn-success'"
                :disabled="isSubmitting"
              >
                <i class="bi bi-check-circle me-2" v-if="!isSubmitting"></i>
                {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Registro' : 'Guardar') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Modal } from 'bootstrap'
import { useExpenses, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../composables/useExpenses'
import { useHaptic } from '../composables/useHaptic'

const { addExpense, updateExpense } = useExpenses()
const { hapticLight, hapticSuccess, hapticError } = useHaptic()
const emit = defineEmits(['expense-saved'])

const amount = ref('')
const note = ref('')
const categoryId = ref('other')
const type = ref('expense')
const currentEditId = ref(null)

const isEditing = ref(false)
const isSubmitting = ref(false)
const modalRef = ref(null)
let modalInstance = null

const currentCategories = computed(() => {
  return type.value === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES
})

const setType = (newType) => {
  type.value = newType
  // Establecer categoría por defecto al cambiar
  categoryId.value = newType === 'expense' ? 'other' : 'other_income'
  hapticLight()
}

onMounted(() => {
  if (modalRef.value) {
    modalInstance = new Modal(modalRef.value)
  }
})

const resetForm = () => {
  amount.value = ''
  note.value = ''
  type.value = 'expense'
  categoryId.value = 'other'
  isEditing.value = false
  currentEditId.value = null
}

const submitForm = async () => {
  if (isSubmitting.value) return
  if (!amount.value || !note.value) return
  
  isSubmitting.value = true
  hapticLight()
  
  try {
    let success = false
    if (isEditing.value && currentEditId.value) {
      success = await updateExpense(currentEditId.value, {
        amount: amount.value,
        note: note.value,
        categoryId: categoryId.value,
        type: type.value
      })
    } else {
      success = await addExpense(amount.value, note.value, categoryId.value, type.value)
    }

    if (success) {
      hapticSuccess()
      emit('expense-saved')
      if (modalInstance) {
        modalInstance.hide()
      }
      setTimeout(resetForm, 300) // Reset after hide animation
    } else {
      hapticError()
    }
  } catch (error) {
    console.error('Error saving record:', error)
    hapticError()
  } finally {
    setTimeout(() => {
      isSubmitting.value = false
    }, 500)
  }
}

// Expose open method for parent component
const open = (data = null) => {
  if (data && typeof data === 'object' && data.id) {
    isEditing.value = true
    currentEditId.value = data.id
    amount.value = data.amount
    note.value = data.note
    type.value = data.type || 'expense'
    categoryId.value = data.categoryId || (type.value === 'expense' ? 'other' : 'other_income')
  } else {
    resetForm()
    if (typeof data === 'string') {
      type.value = data
      categoryId.value = data === 'expense' ? 'other' : 'other_income'
    }
  }

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

/* Ensure focus styles feel native but customized */
.input-group:focus-within {
  box-shadow: 0 0 0 2px var(--bs-primary);
}

.transition-all {
  transition: all 0.2s ease-in-out;
}
</style>
