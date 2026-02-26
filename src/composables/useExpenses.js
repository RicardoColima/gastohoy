import { ref, computed, watch } from 'vue'
import { addExpense as dbAddExpense, getAllExpenses, deleteExpense as dbDeleteExpense, clearAllExpenses } from '../utils/db'

// Estado Global
const expenses = ref([])
const isLoading = ref(false)
const monthlyBudget = ref(Number(localStorage.getItem('gastohoy_budget')) || 0)

watch(monthlyBudget, (newVal) => {
  localStorage.setItem('gastohoy_budget', newVal)
})

// Lista de categorías
export const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Comida', icon: 'bi-cup-hot', color: 'text-warning', bg: 'bg-warning' },
  { id: 'transport', name: 'Transporte', icon: 'bi-car-front', color: 'text-info', bg: 'bg-info' },
  { id: 'shopping', name: 'Compras', icon: 'bi-bag', color: 'text-primary', bg: 'bg-primary' },
  { id: 'bills', name: 'Servicios', icon: 'bi-lightning', color: 'text-danger', bg: 'bg-danger' },
  { id: 'entertainment', name: 'Ocio', icon: 'bi-controller', color: 'text-success', bg: 'bg-success' },
  { id: 'health', name: 'Salud', icon: 'bi-heart-pulse', color: 'text-danger', bg: 'bg-danger' },
  { id: 'other', name: 'Otros', icon: 'bi-three-dots', color: 'text-secondary', bg: 'bg-secondary' }
]

export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salario', icon: 'bi-cash-stack', color: 'text-success', bg: 'bg-success' },
  { id: 'sales', name: 'Ventas', icon: 'bi-shop', color: 'text-primary', bg: 'bg-primary' },
  { id: 'other_income', name: 'Otros Ingresos', icon: 'bi-plus-circle', color: 'text-info', bg: 'bg-info' }
]

export function useExpenses() {
  const loadExpenses = async () => {
    isLoading.value = true
    try {
      const data = await getAllExpenses()
      // Ordenar por fecha descendente (más reciente primero)
      expenses.value = data.sort((a, b) => new Date(b.date) - new Date(a.date))
    } catch (error) {
      console.error('Error loading expenses:', error)
    } finally {
      isLoading.value = false
    }
  }

  const addExpense = async (amount, note, categoryId = 'other', type = 'expense') => {
    const expense = {
      id: Date.now(),
      amount: Number(amount),
      note: note.trim(),
      categoryId: categoryId,
      type: type, // 'gasto' o 'ingreso'
      date: new Date().toISOString(),
      backedUp: false
    }
    
    try {
      await dbAddExpense(expense)
      expenses.value.unshift(expense)
      // Reordenar después de agregar para asegurar el orden correcto
      expenses.value.sort((a, b) => new Date(b.date) - new Date(a.date))
      return true
    } catch (error) {
      console.error('Error adding transaction:', error)
      return false
    }
  }

  const updateExpense = async (id, updatedData) => {
    try {
      const expenseIndex = expenses.value.findIndex(e => e.id === id)
      if (expenseIndex !== -1) {
        const updatedExpense = { 
          ...expenses.value[expenseIndex], 
          ...updatedData,
          amount: Number(updatedData.amount) || Number(expenses.value[expenseIndex].amount)
        }
        
        updatedExpense.backedUp = false 
        
        await dbAddExpense(updatedExpense) // put actúa como actualización si el ID existe
        expenses.value.splice(expenseIndex, 1, updatedExpense)
        return true
      }
      return false
    } catch (error) {
      console.error('Error updating transaction:', error)
      return false
    }
  }

  const deleteExpense = async (id) => {
    try {
      await dbDeleteExpense(id)
      expenses.value = expenses.value.filter(e => e.id !== id)
      return true
    } catch (error) {
      console.error('Error deleting transaction:', error)
      return false
    }
  }

  const todayTotal = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return expenses.value
      .filter(e => e.date.startsWith(today) && (e.type === 'expense' || !e.type))
      .reduce((sum, e) => sum + Number(e.amount), 0)
  })

  const monthTotal = computed(() => {
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    return expenses.value
      .filter(e => e.date.startsWith(currentMonth) && (e.type === 'expense' || !e.type))
      .reduce((sum, e) => sum + Number(e.amount), 0)
  })

  const monthIncome = computed(() => {
    const currentMonth = new Date().toISOString().slice(0, 7)
    return expenses.value
      .filter(e => e.date.startsWith(currentMonth) && e.type === 'income')
      .reduce((sum, e) => sum + Number(e.amount), 0)
  })

  const currentBalance = computed(() => {
    let balance = 0
    expenses.value.forEach(e => {
      if (e.type === 'income') {
        balance += Number(e.amount)
      } else {
        balance -= Number(e.amount)
      }
    })
    return balance
  })

  const recentExpenses = computed(() => {
    return expenses.value.slice(0, 5)
  })

  const getCategoryDetails = (categoryId, type = 'expense') => {
    if (type === 'income') {
      return INCOME_CATEGORIES.find(c => c.id === categoryId) || INCOME_CATEGORIES[INCOME_CATEGORIES.length - 1]
    }
    return EXPENSE_CATEGORIES.find(c => c.id === categoryId) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1]
  }

  const setBudget = (amount) => {
    monthlyBudget.value = Number(amount)
  }

  // Funciones de reset
  const resetBalance = async () => {
    try {
      // Eliminar todos los gastos de la base de datos
      await clearAllExpenses()
      // Limpiar el array local
      expenses.value = []
      // Reiniciar presupuesto a 0
      monthlyBudget.value = 0
      return true
    } catch (error) {
      console.error('Error resetting balance:', error)
      return false
    }
  }

  const resetAllData = async () => {
    try {
      // Limpiar todos los gastos
      await clearAllExpenses()
      expenses.value = []
      
      // Reiniciar presupuesto
      monthlyBudget.value = 0
      
      // Limpiar todos los datos de localStorage
      localStorage.removeItem('gastohoy_budget')
      localStorage.removeItem('gastohoy_user')
      localStorage.removeItem('gastohoy_theme')
      
      return true
    } catch (error) {
      console.error('Error resetting all data:', error)
      return false
    }
  }

  return {
    expenses,
    isLoading,
    monthlyBudget,
    loadExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    todayTotal,
    monthTotal,
    monthIncome,
    currentBalance,
    recentExpenses,
    getCategoryDetails,
    setBudget,
    resetBalance,
    resetAllData
  }
}
