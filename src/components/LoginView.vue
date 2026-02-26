<template>
  <div class="login-container d-flex justify-content-center align-items-center min-vh-100" :class="isDark ? 'bg-dark' : 'bg-light'">
    <div class="card p-5 shadow-lg border-0 rounded-4 card-theme" style="max-width: 400px; width: 90%;">
      
      <!-- Primera vez: Registro -->
      <div v-if="isFirstTime">
        <div class="text-center mb-4">
          <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
            <i class="bi bi-wallet2 fs-2"></i>
          </div>
          <h2 class="fw-bold">GastoHoy</h2>
          <p class="text-muted">Configura tu perfil para empezar</p>
        </div>
        
        <form @submit.prevent="handleRegister">
          <div class="mb-4">
            <label for="name" class="form-label text-muted small fw-bold text-uppercase">Tu Nombre</label>
            <input 
              type="text" 
              class="form-control form-control-lg border-0 bg-opacity-10" 
              :class="isDark ? 'bg-light text-light' : 'bg-secondary text-dark'"
              id="name" 
              v-model="name" 
              required
              placeholder="Ej. Juan"
            >
          </div>
          
          <div class="mb-4">
            <label for="pin-register" class="form-label text-muted small fw-bold text-uppercase">Crea un PIN (4 dígitos)</label>
            <input 
              type="password" 
              class="form-control form-control-lg text-center fs-3 letter-spacing-2 border-0 bg-opacity-10" 
              :class="isDark ? 'bg-light text-light' : 'bg-secondary text-dark'"
              id="pin-register" 
              v-model="pin" 
              maxlength="4" 
              pattern="\d{4}"
              required
              placeholder="••••"
            >
          </div>

          <div class="alert alert-warning py-3 small border-0 rounded-3 d-flex" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
            <div>
              <strong>Aviso:</strong> Tus datos se guardan únicamente en este navegador. Si borras los datos, se perderán.
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-lg w-100 mt-2 fw-bold rounded-pill shadow-sm">Crear Perfil</button>
        </form>
      </div>

      <!-- Login habitual -->
      <div v-else>
        <div class="text-center mb-4">
          <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
            <i class="bi bi-person-fill fs-2"></i>
          </div>
          <h2 class="fw-bold mb-1">Hola, {{ user?.name }}</h2>
          <p class="text-muted">Ingresa tu PIN para continuar</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <input 
              type="password" 
              class="form-control form-control-lg text-center fs-2 letter-spacing-2 border-0 bg-opacity-10" 
              :class="isDark ? 'bg-light text-light' : 'bg-secondary text-dark'"
              v-model="pin" 
              maxlength="4" 
              pattern="\d{4}"
              required
              placeholder="••••"
              autofocus
            >
          </div>

          <div v-if="error" class="alert alert-danger py-2 small border-0 rounded-3 text-center" role="alert">
            {{ error }}
          </div>

          <button type="submit" class="btn btn-primary btn-lg w-100 mt-2 fw-bold rounded-pill shadow-sm">Entrar</button>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useTheme } from '../composables/useTheme'

const { isFirstTime, user, error, register, login } = useAuth()
const { isDark } = useTheme()

const name = ref('')
const pin = ref('')

const emit = defineEmits(['authenticated'])

const handleRegister = async () => {
  if (pin.value.length !== 4) return
  const success = await register(name.value, pin.value)
  if (success) {
    emit('authenticated')
  }
}

const handleLogin = async () => {
  if (pin.value.length !== 4) return
  const success = await login(pin.value)
  if (success) {
    emit('authenticated')
  }
}
</script>

<style scoped>
.letter-spacing-2 {
  letter-spacing: 0.5em;
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

.form-control:focus {
  box-shadow: none;
  border: 2px solid var(--bs-primary) !important;
}

[data-bs-theme="dark"] .form-control:focus {
  background-color: rgba(255,255,255,0.15) !important;
}
</style>
