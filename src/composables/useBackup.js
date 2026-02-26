import { ref, computed } from 'vue'
import { getAllExpenses, getExpensesByDateRange, markAsBackedUp, addExpense as dbAddExpense } from '../utils/db'

export function useBackup() {
  const isExporting = ref(false)
  const isImporting = ref(false)
  const exportError = ref('')
  const importError = ref('')
  const importSuccess = ref('')

  // Helper para descargar JSON
  const downloadJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Helper para descargar CSV
  const downloadCSV = (data, filename) => {
    if (!data || !data.length) return
    
    // Encabezados
    const headers = ['ID', 'Tipo', 'Monto', 'Categoría', 'Nota', 'Fecha']
    const rows = [headers.join(',')]

    data.forEach(e => {
      const type = e.type === 'income' ? 'Ingreso' : 'Gasto'
      // Escapar notas que puedan tener comas
      const note = `"${e.note.replace(/"/g, '""')}"`
      const date = new Date(e.date).toLocaleString()
      const row = [e.id, type, e.amount, e.categoryId || 'other', note, date]
      rows.push(row.join(','))
    })

    const csvContent = rows.join('\n')
    // Añadir BOM para que Excel detecte UTF-8
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Exportar todo (JSON)
  const exportAll = async () => {
    isExporting.value = true
    exportError.value = ''
    try {
      const allExpenses = await getAllExpenses()
      if (allExpenses.length === 0) {
        exportError.value = 'No hay datos para exportar.'
        return false
      }

      // Marcar como respaldados en DB
      const idsToMark = allExpenses.map(e => e.id)
      await markAsBackedUp(idsToMark)

      // Actualizar objeto en memoria antes de exportar
      const dataToExport = allExpenses.map(e => ({ ...e, backedUp: true }))
      
      const dateStr = new Date().toISOString().split('T')[0]
      downloadJSON(dataToExport, `GastoHoy-Backup-Total-${dateStr}.json`)
      return true
    } catch (error) {
      console.error('Error exporting all:', error)
      exportError.value = 'Hubo un error al exportar los datos.'
      return false
    } finally {
      isExporting.value = false
    }
  }

  // Exportar por fecha (YYYY-MM-DD)
  const exportByDate = async (dateString) => {
    isExporting.value = true
    exportError.value = ''
    try {
      // Crear inicio y fin del día en formato ISO string
      const startOfDay = new Date(`${dateString}T00:00:00.000Z`).toISOString()
      const endOfDay = new Date(`${dateString}T23:59:59.999Z`).toISOString()
      
      const dayExpenses = await getExpensesByDateRange(startOfDay, endOfDay)
      
      if (dayExpenses.length === 0) {
        exportError.value = `No hay gastos registrados el ${dateString}.`
        return false
      }

      const idsToMark = dayExpenses.map(e => e.id)
      await markAsBackedUp(idsToMark)

      const dataToExport = dayExpenses.map(e => ({ ...e, backedUp: true }))
      
      downloadJSON(dataToExport, `GastoHoy-Backup-${dateString}.json`)
      return true
    } catch (error) {
      console.error('Error exporting by date:', error)
      exportError.value = 'Hubo un error al exportar la fecha seleccionada.'
      return false
    } finally {
      isExporting.value = false
    }
  }

  // Exportar a CSV (Excel)
  const exportCSV = async () => {
    isExporting.value = true
    exportError.value = ''
    try {
      const allExpenses = await getAllExpenses()
      if (allExpenses.length === 0) {
        exportError.value = 'No hay datos para exportar.'
        return false
      }

      // Ordenar por fecha
      allExpenses.sort((a, b) => new Date(b.date) - new Date(a.date))
      
      const dateStr = new Date().toISOString().split('T')[0]
      downloadCSV(allExpenses, `GastoHoy-Historial-${dateStr}.csv`)
      return true
    } catch (error) {
      console.error('Error exporting CSV:', error)
      exportError.value = 'Hubo un error al exportar a Excel.'
      return false
    } finally {
      isExporting.value = false
    }
  }

  // Importar desde JSON
  const importBackup = (file) => {
    return new Promise((resolve) => {
      isImporting.value = true
      importError.value = ''
      importSuccess.value = ''

      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          const content = e.target.result
          const data = JSON.parse(content)

          if (!Array.isArray(data)) {
            throw new Error('El archivo no tiene el formato correcto (debe ser un array).')
          }

          const existingExpenses = await getAllExpenses()
          const existingIds = new Set(existingExpenses.map(exp => exp.id))
          
          let importedCount = 0
          let skippedCount = 0

          for (const item of data) {
            // Validar estructura básica
            if (item.id && item.amount !== undefined && item.date) {
              if (!existingIds.has(item.id)) {
                await dbAddExpense(item)
                importedCount++
              } else {
                skippedCount++
              }
            } else {
              console.warn('Skipping invalid item in backup:', item)
            }
          }

          importSuccess.value = `Importación exitosa. ${importedCount} añadidos, ${skippedCount} omitidos (ya existían).`
          resolve(true)
        } catch (error) {
          console.error('Error importing JSON:', error)
          importError.value = 'Error al leer el archivo. Asegúrate de que sea un respaldo válido de GastoHoy.'
          resolve(false)
        } finally {
          isImporting.value = false
        }
      }

      reader.onerror = () => {
        importError.value = 'Error de lectura del archivo.'
        isImporting.value = false
        resolve(false)
      }

      reader.readAsText(file)
    })
  }

  // Lógica para estado de calendario / días
  const daysStatus = computed(() => {
    // Devolver una función o promesa si queremos actualizaciones en tiempo real, 
    // pero típicamente expondremos una función de obtención.
    return []
  })

  return {
    isExporting,
    isImporting,
    exportError,
    importError,
    importSuccess,
    exportAll,
    exportByDate,
    exportCSV,
    importBackup
  }
}
