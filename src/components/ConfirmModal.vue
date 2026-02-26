<template>
  <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog modal-dialog-centered modal-sm">
      <div class="modal-content border-0 rounded-4 shadow-lg card-theme">
        <div class="modal-body p-4 text-center">
          <div class="mb-3 d-flex justify-content-center">
            <div class="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
              <i class="bi bi-exclamation-triangle fs-1"></i>
            </div>
          </div>
          <h5 class="fw-bold mb-2">{{ title }}</h5>
          <p class="text-muted small mb-4">{{ message }}</p>
          
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-light rounded-pill flex-grow-1 fw-medium shadow-sm" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="button" class="btn btn-danger rounded-pill flex-grow-1 fw-bold shadow-sm" @click="confirmAction">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'

const props = defineProps({
  title: {
    type: String,
    default: '¿Estás seguro?'
  },
  message: {
    type: String,
    default: 'Esta acción no se puede deshacer.'
  }
})

const emit = defineEmits(['confirm'])
const modalRef = ref(null)
let modalInstance = null

onMounted(() => {
  if (modalRef.value) {
    modalInstance = new Modal(modalRef.value)
  }
})

const open = () => {
  if (modalInstance) {
    modalInstance.show()
  }
}

const hide = () => {
  if (modalInstance) {
    modalInstance.hide()
  }
}

const confirmAction = () => {
  emit('confirm')
  hide()
}

defineExpose({
  open,
  hide
})
</script>

<style scoped>
/* Theme support */
[data-bs-theme="dark"] .card-theme {
  background-color: #212529 !important;
  color: #f8f9fa !important;
}
[data-bs-theme="light"] .card-theme {
  background-color: #ffffff !important;
  color: #212529 !important;
}

[data-bs-theme="dark"] .btn-light {
  background-color: #2c3034;
  border-color: #2c3034;
  color: #f8f9fa;
}
</style>
