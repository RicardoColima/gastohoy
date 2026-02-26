import { ref, computed } from 'vue'

const IS_LOGGED_IN_KEY = 'gastohoy_logged_in'
const USER_DATA_KEY = 'gastohoy_user_data'

// Función básica de hashing para el PIN (MVP local)
async function hashPIN(pin) {
  const msgUint8 = new TextEncoder().encode(pin)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Estado global
const isFirstTime = ref(!localStorage.getItem(USER_DATA_KEY))
const isAuthenticated = ref(sessionStorage.getItem(IS_LOGGED_IN_KEY) === 'true')
const user = ref(JSON.parse(localStorage.getItem(USER_DATA_KEY) || 'null'))
const error = ref('')

export function useAuth() {
  const register = async (name, pin) => {
    if (!name || pin.length !== 4) {
      error.value = 'Nombre requerido y el PIN debe tener 4 dígitos.'
      return false
    }
    const pinHash = await hashPIN(pin)
    const userData = {
      name,
      pinHash,
      createdAt: new Date().toISOString()
    }
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
    user.value = userData
    isFirstTime.value = false
    
    // Auto login después del registro
    sessionStorage.setItem(IS_LOGGED_IN_KEY, 'true')
    isAuthenticated.value = true
    return true
  }

  const login = async (pin) => {
    if (!user.value) return false
    
    const inputHash = await hashPIN(pin)
    if (inputHash === user.value.pinHash) {
      sessionStorage.setItem(IS_LOGGED_IN_KEY, 'true')
      isAuthenticated.value = true
      error.value = ''
      return true
    } else {
      error.value = 'PIN incorrecto'
      return false
    }
  }

  const logout = () => {
    sessionStorage.removeItem(IS_LOGGED_IN_KEY)
    isAuthenticated.value = false
  }

  return {
    isFirstTime,
    isAuthenticated,
    user,
    error,
    register,
    login,
    logout
  }
}
