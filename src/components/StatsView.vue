<template>
  <div class="container-fluid pb-5 mb-5 mt-4 px-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4 mt-2">
      <div>
        <h3 class="mb-0 fw-bold">Estadísticas</h3>
        <span class="text-muted small fw-medium">Resumen de tus gastos</span>
      </div>
    </div>

    <div class="row">
      <!-- Left Column: Chart -->
      <div class="col-md-5 col-lg-4 mb-4 mb-md-0">
        <!-- Chart Card -->
        <div class="card card-theme border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4 d-flex flex-column">
            <h6 class="card-title fw-bold mb-3 d-flex justify-content-between align-items-center">
              <span><i class="bi bi-pie-chart-fill text-primary me-2"></i>Gastos por Categoría</span>
              <button v-if="selectedCategoryFilter" class="btn btn-sm btn-link text-danger p-0 small text-decoration-none" @click="clearCategoryFilter">
                Borrar Filtro
              </button>
            </h6>
            <div v-if="isLoading" class="text-center py-4 flex-grow-1 d-flex align-items-center justify-content-center">
              <div class="spinner-border text-primary" role="status"></div>
            </div>
            <div v-else-if="expenses.length === 0" class="text-center py-4 text-muted flex-grow-1 d-flex align-items-center justify-content-center">
              No hay datos suficientes para graficar.
            </div>
            <div v-else class="flex-grow-1 d-flex flex-column justify-content-center" style="min-height: 250px; position: relative;">
              <Doughnut :data="chartData" :options="chartOptions" @click="handleChartClick" ref="chartRef" />
            </div>
            <div v-if="selectedCategoryFilter" class="text-center mt-4 small text-muted bg-danger bg-opacity-10 text-danger rounded-pill py-2">
              Filtrando: <strong>{{ getCategoryDetails(selectedCategoryFilter).name }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Full History and Search -->
      <div class="col-md-7 col-lg-8">
        <div class="card card-theme border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4">
            <!-- Full History Header -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="mb-0 fw-bold">Historial Completo</h5>
              <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 shadow-sm">{{ filteredExpenses.length }}</span>
            </div>

            <!-- Buscador -->
            <div class="mb-4">
              <div class="input-group bg-body-tertiary rounded-pill overflow-hidden shadow-sm border border-secondary-subtle">
                <span class="input-group-text border-0 bg-transparent text-secondary ps-4">
                  <i class="bi bi-search"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control border-0 bg-transparent text-body shadow-none py-2" 
                  v-model="searchQuery" 
                  placeholder="Buscar por nota o monto..."
                >
                <button v-if="searchQuery" class="btn border-0 text-secondary pe-4" @click="searchQuery = ''">
                  <i class="bi bi-x-circle-fill"></i>
                </button>
              </div>
            </div>

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
            
            <div v-else-if="filteredExpenses.length === 0" class="text-center py-5 text-muted bg-body-tertiary rounded-4 mt-3">
              <div class="bg-secondary bg-opacity-10 rounded-circle d-inline-flex justify-content-center align-items-center mb-3" style="width: 80px; height: 80px;">
                <i class="bi bi-search" style="font-size: 2rem;"></i>
              </div>
              <p class="mb-0 fw-medium">No se encontraron resultados.</p>
            </div>

            <div v-else class="list-group list-group-flush bg-transparent gap-2 position-relative">
              <TransitionGroup name="list">
                <div 
                  v-for="expense in filteredExpenses" 
                  :key="expense.id" 
                  class="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-3 border-0 bg-body-tertiary rounded-4 mb-2 hover-lift"
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
                      <div class="text-muted small d-flex flex-column text-truncate">
                        <span><i class="bi bi-calendar3 me-1"></i>{{ formatDate(expense.date) }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="text-end d-flex flex-column align-items-end flex-shrink-0 ms-2">
                    <span class="fw-bold fs-5" :class="expense.type === 'income' ? 'text-success' : 'text-body'">
                      {{ expense.type === 'income' ? '+' : '-' }}${{ expense.amount.toFixed(2) }}
                    </span>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useExpenses } from '../composables/useExpenses'
import { useTheme } from '../composables/useTheme'
import { useHaptic } from '../composables/useHaptic'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

const { expenses, isLoading, loadExpenses, getCategoryDetails } = useExpenses()
const { isDark } = useTheme()
const { hapticLight } = useHaptic()

const chartRef = ref(null)
const searchQuery = ref('')
const selectedCategoryFilter = ref(null)
// Almacenar el mapa de índice de gráfico a categoryId para habilitar filtrado
const chartIndexToCategoryId = ref([])

onMounted(() => {
  loadExpenses()
})

const formatDate = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// Mapear clases de color de Bootstrap a colores hex reales para chart.js
const colorMap = {
  'bg-warning': '#ffc107',
  'bg-info': '#0dcaf0',
  'bg-primary': '#0d6efd',
  'bg-danger': '#dc3545',
  'bg-success': '#198754',
  'bg-secondary': '#6c757d'
}

const chartData = computed(() => {
  const categoryTotals = {}
  
  // Solo graficamos GASTOS en la dona de estadísticas para no confundir
  expenses.value.filter(e => e.type === 'expense' || !e.type).forEach(exp => {
    const catId = exp.categoryId || 'other'
    if (!categoryTotals[catId]) {
      categoryTotals[catId] = 0
    }
    categoryTotals[catId] += exp.amount
  })

  const labels = []
  const data = []
  const backgroundColor = []
  const idMap = []

  Object.entries(categoryTotals).forEach(([catId, total]) => {
    const details = getCategoryDetails(catId, 'expense')
    labels.push(details.name)
    data.push(total)
    backgroundColor.push(colorMap[details.bg] || '#6c757d')
    idMap.push(catId)
  })

  chartIndexToCategoryId.value = idMap

  return {
    labels,
    datasets: [
      {
        backgroundColor,
        data,
        borderWidth: isDark.value ? 2 : 2,
        borderColor: isDark.value ? '#212529' : '#ffffff',
        hoverOffset: 4
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: isDark.value ? '#f8f9fa' : '#212529',
        font: {
          family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        },
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed !== null) {
            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed);
          }
          return label;
        }
      }
    }
  },
  onClick: (event, elements) => {
    if (elements && elements.length > 0) {
      const index = elements[0].index
      const categoryId = chartIndexToCategoryId.value[index]
      if (selectedCategoryFilter.value === categoryId) {
        selectedCategoryFilter.value = null // Desactivar
      } else {
        selectedCategoryFilter.value = categoryId
      }
      hapticLight()
    }
  },
  cutout: '70%'
}))

const clearCategoryFilter = () => {
  selectedCategoryFilter.value = null
  hapticLight()
}

// Computado para Búsqueda y Filtro
const filteredExpenses = computed(() => {
  let result = expenses.value

  if (selectedCategoryFilter.value) {
    result = result.filter(e => e.categoryId === selectedCategoryFilter.value && (e.type === 'expense' || !e.type))
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(e => 
      e.note.toLowerCase().includes(q) || 
      e.amount.toString().includes(q)
    )
  }

  return result
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

/* List animations */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
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

.form-control:focus {
  box-shadow: none;
}
</style>
