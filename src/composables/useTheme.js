import { ref, watch } from 'vue'

const THEME_KEY = 'gastohoy_theme'

export function useTheme() {
  const isDark = ref(localStorage.getItem(THEME_KEY) === 'dark')

  const applyTheme = (dark) => {
    if (dark) {
      document.documentElement.setAttribute('data-bs-theme', 'dark')
      document.body.classList.add('bg-dark', 'text-light')
      document.body.classList.remove('bg-light', 'text-dark')
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light')
      document.body.classList.add('bg-light', 'text-dark')
      document.body.classList.remove('bg-dark', 'text-light')
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light')
    applyTheme(isDark.value)
  }

  // Inicializar tema
  applyTheme(isDark.value)

  return {
    isDark,
    toggleTheme,
    applyTheme
  }
}
