<template>
  <div class="card card-theme border-0 shadow-sm mb-4 rounded-4">
    <div class="card-body p-4">
      <h6 class="card-title text-muted mb-4 text-uppercase small fw-bold d-flex align-items-center">
        <i class="bi bi-calendar-check me-2 text-primary"></i>
        Estado de Días Trabajados
      </h6>
      
      <div v-if="isLoading" class="text-center py-3">
        <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
      </div>
      
      <div v-else class="row text-center g-3">
        <div class="col-4">
          <div class="p-3 status-box rounded-4 shadow-sm h-100 d-flex flex-column justify-content-center">
            <div class="fs-3 fw-bold">{{ totalDays }}</div>
            <small class="text-muted d-block lh-sm fw-medium mt-1" style="font-size: 0.75rem;">Días<br>Registrados</small>
          </div>
        </div>
        <div class="col-4">
          <div class="p-3 status-box rounded-4 shadow-sm h-100 d-flex flex-column justify-content-center">
            <div class="fs-3 fw-bold text-success">{{ backedUpDays }}</div>
            <small class="text-muted d-block lh-sm fw-medium mt-1" style="font-size: 0.75rem;">Días<br>Respaldados</small>
          </div>
        </div>
        <div class="col-4">
          <div class="p-3 status-box rounded-4 shadow-sm h-100 d-flex flex-column justify-content-center">
            <div class="fs-3 fw-bold" :class="pendingDays > 0 ? 'text-danger' : 'text-success'">{{ pendingDays }}</div>
            <small class="text-muted d-block lh-sm fw-medium mt-1" style="font-size: 0.75rem;">Pendientes<br>Respaldo</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllExpenses } from '../utils/db'

const isLoading = ref(true)
const totalDays = ref(0)
const backedUpDays = ref(0)
const pendingDays = ref(0)

const calculateStatus = async () => {
  isLoading.value = true
  try {
    const expenses = await getAllExpenses()
    
    // Agrupar por fecha (YYYY-MM-DD)
    const daysMap = {}
    
    expenses.forEach(exp => {
      // Asumiendo que date es string ISO: 2026-07-04T...
      const dateKey = exp.date.split('T')[0]
      if (!daysMap[dateKey]) {
        daysMap[dateKey] = {
          total: 0,
          backedUp: 0
        }
      }
      daysMap[dateKey].total++
      if (exp.backedUp) {
        daysMap[dateKey].backedUp++
      }
    })
    
    const uniqueDays = Object.keys(daysMap)
    totalDays.value = uniqueDays.length
    
    let backedUpCount = 0
    let pendingCount = 0
    
    uniqueDays.forEach(day => {
      // Un día está respaldado si TODOS sus gastos están respaldados
      if (daysMap[day].backedUp === daysMap[day].total && daysMap[day].total > 0) {
        backedUpCount++
      } else {
        pendingCount++
      }
    })
    
    backedUpDays.value = backedUpCount
    pendingDays.value = pendingCount
    
  } catch (error) {
    console.error('Error calculating calendar status:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  calculateStatus()
})

// Exponer método para actualizar desde el padre si es necesario
defineExpose({
  refresh: calculateStatus
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

[data-bs-theme="dark"] .status-box {
  background-color: #2b3035;
}
[data-bs-theme="light"] .status-box {
  background-color: #f8f9fa;
}
</style>
