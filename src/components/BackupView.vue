<template>
  <div class="container-fluid pb-5 mb-5 mt-4 px-4">
    <div class="d-flex justify-content-between align-items-center mb-4 mt-2">
      <div>
        <h3 class="mb-0 fw-bold">Respaldo</h3>
        <span class="text-muted small fw-medium">Protege tus datos</span>
      </div>
    </div>

    <!-- Componente de Estado -->
    <CalendarStatus ref="statusRef" />

    <!-- Alertas -->
    <div v-if="exportError" class="alert alert-danger py-2 small rounded-3 border-0 shadow-sm" role="alert">
      <i class="bi bi-exclamation-circle me-2"></i>{{ exportError }}
    </div>
    <div v-if="importError" class="alert alert-danger py-2 small rounded-3 border-0 shadow-sm" role="alert">
      <i class="bi bi-exclamation-circle me-2"></i>{{ importError }}
    </div>
    <div v-if="importSuccess" class="alert alert-success py-2 small rounded-3 border-0 shadow-sm" role="alert">
      <i class="bi bi-check-circle me-2"></i>{{ importSuccess }}
    </div>

    <!-- Opciones de Exportación -->
    <div class="card card-theme border-0 shadow-sm rounded-4 mb-4">
      <div class="card-body p-4">
        <h6 class="card-title fw-bold mb-3 d-flex align-items-center">
          <div class="bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-3 d-inline-flex">
            <i class="bi bi-cloud-arrow-up-fill fs-5"></i>
          </div>
          Exportar Datos
        </h6>
        
        <p class="text-muted small mb-4">Descarga tus datos en formato seguro (JSON) para respaldo, o en Excel (CSV) para leerlos fácilmente.</p>

        <div class="d-flex gap-2 mb-4">
          <button 
            class="btn btn-primary w-50 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center" 
            @click="handleExportAll" 
            :disabled="isExporting"
          >
            <i class="bi bi-filetype-json me-2" v-if="!isExporting"></i> JSON
          </button>
          <button 
            class="btn btn-success w-50 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center" 
            @click="handleExportCSV" 
            :disabled="isExporting"
          >
            <i class="bi bi-filetype-csv me-2" v-if="!isExporting"></i> Excel
          </button>
        </div>

        <div class="position-relative mb-4">
          <hr class="text-muted opacity-25">
          <span class="position-absolute top-50 start-50 translate-middle px-2 small text-muted card-theme">Exportar un día (JSON)</span>
        </div>

        <div class="input-group">
          <input type="date" class="form-control bg-transparent" v-model="selectedDate">
          <button 
            class="btn btn-outline-primary fw-medium px-4" 
            @click="handleExportDate" 
            :disabled="!selectedDate || isExporting"
          >
            Exportar Día
          </button>
        </div>
      </div>
    </div>

    <!-- Opciones de Importación -->
    <div class="card card-theme border-0 shadow-sm rounded-4 mb-4">
      <div class="card-body p-4">
        <h6 class="card-title fw-bold mb-3 d-flex align-items-center">
          <div class="bg-info bg-opacity-10 text-info rounded-circle p-2 me-3 d-inline-flex">
            <i class="bi bi-cloud-arrow-down-fill fs-5"></i>
          </div>
          Restaurar Respaldo
        </h6>
        
        <p class="text-muted small mb-4">Carga un archivo JSON previamente exportado. No se duplicarán datos ya existentes.</p>

        <div class="mb-3">
          <input 
            class="form-control bg-transparent" 
            type="file" 
            accept=".json"
            @change="handleFileChange"
            ref="fileInput"
          >
        </div>
        
        <button 
          class="btn btn-info text-white w-100 rounded-pill fw-bold shadow-sm" 
          @click="handleImport" 
          :disabled="!selectedFile || isImporting"
        >
          <i class="bi bi-upload me-2" v-if="!isImporting"></i>
          {{ isImporting ? 'Restaurando...' : 'Importar Archivo JSON' }}
        </button>
      </div>
    </div>

    <!-- Opciones de Reset Completo -->
    <div class="card card-theme border-0 shadow-sm rounded-4">
      <div class="card-body p-4">
        <h6 class="card-title fw-bold mb-3 d-flex align-items-center">
          <div class="bg-danger bg-opacity-10 text-danger rounded-circle p-2 me-3 d-inline-flex">
            <i class="bi bi-trash3-fill fs-5"></i>
          </div>
          Reset Completo
        </h6>
        
        <p class="text-muted small mb-4">Elimina absolutamente todos los datos de la aplicación: registros, presupuesto, configuración y usuario. Esta acción no se puede deshacer.</p>

        <button 
          class="btn btn-outline-danger w-100 rounded-pill fw-bold border-2 d-flex align-items-center justify-content-center gap-2 btn-reset-all-hover"
          @click="promptResetAll"
        >
          <i class="bi bi-exclamation-triangle"></i> Borrar Todo
        </button>
      </div>
    </div>

    <!-- Modal de Confirmación para Reset Completo -->
    <ConfirmModal 
      ref="resetAllModalRef" 
      title="Reset Completo" 
      message="¿Estás absolutamente seguro? Esta acción eliminará permanentemente todos tus datos, incluyendo registros, presupuesto, configuración y cerrará tu sesión. Esta acción no se puede deshacer."
      @confirm="executeResetAll"
    />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import CalendarStatus from './CalendarStatus.vue'
import ConfirmModal from './ConfirmModal.vue'
import { useBackup } from '../composables/useBackup'
import { useTheme } from '../composables/useTheme'
import { useHaptic } from '../composables/useHaptic'
import { useExpenses } from '../composables/useExpenses'
import { useAuth } from '../composables/useAuth'

const { isDark } = useTheme()
const { hapticLight, hapticSuccess, hapticError, hapticHeavy } = useHaptic()
const { resetAllData } = useExpenses()
const { logout } = useAuth()

const { 
  isExporting, 
  isImporting, 
  exportError, 
  importError, 
  importSuccess, 
  exportAll, 
  exportByDate, 
  exportCSV,
  importBackup 
} = useBackup()

const selectedDate = ref('')
const selectedFile = ref(null)
const fileInput = ref(null)
const statusRef = ref(null)
const resetAllModalRef = ref(null)

const handleExportAll = async () => {
  hapticLight()
  const success = await exportAll()
  if (success && statusRef.value) {
    hapticSuccess()
    statusRef.value.refresh()
  } else {
    hapticError()
  }
}

const handleExportCSV = async () => {
  hapticLight()
  const success = await exportCSV()
  if (success) {
    hapticSuccess()
  } else {
    hapticError()
  }
}

const handleExportDate = async () => {
  if (!selectedDate.value) return
  hapticLight()
  const success = await exportByDate(selectedDate.value)
  if (success && statusRef.value) {
    hapticSuccess()
    statusRef.value.refresh()
  } else {
    hapticError()
  }
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file && file.type === 'application/json') {
    selectedFile.value = file
  } else {
    selectedFile.value = null
    alert('Por favor selecciona un archivo JSON válido.')
    if (fileInput.value) fileInput.value.value = ''
  }
}

const handleImport = async () => {
  if (!selectedFile.value) return
  hapticLight()
  const success = await importBackup(selectedFile.value)
  if (success) {
    hapticSuccess()
    selectedFile.value = null
    if (fileInput.value) fileInput.value.value = ''
    if (statusRef.value) {
      statusRef.value.refresh()
    }
  } else {
    hapticError()
  }
}

const promptResetAll = () => {
  hapticHeavy()
  if (resetAllModalRef.value) {
    resetAllModalRef.value.open()
  }
}

const executeResetAll = async () => {
  const success = await resetAllData()
  if (success) {
    // Cerrar sesión después de reset exitoso
    await logout()
  }
}
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

[data-bs-theme="dark"] .form-control {
  color: #f8f9fa;
  border-color: #495057;
}

[data-bs-theme="dark"] .form-control::-webkit-calendar-picker-indicator {
  filter: invert(1);
}

.btn-reset-all-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn-reset-all-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220,53,69,0.3) !important;
}
</style>
