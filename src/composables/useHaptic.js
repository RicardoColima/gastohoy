export function useHaptic() {
  const vibrate = (pattern = 50) => {
    if (typeof window !== 'undefined' && 'navigator' in window && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(pattern)
      } catch (e) {
        // Ignorar si no está soportado o está bloqueado
      }
    }
  }

  const hapticLight = () => vibrate(10)
  const hapticMedium = () => vibrate(50)
  const hapticHeavy = () => vibrate([100, 50, 100])
  const hapticSuccess = () => vibrate([50, 50, 50])
  const hapticError = () => vibrate([50, 50, 50, 50, 50])

  return {
    vibrate,
    hapticLight,
    hapticMedium,
    hapticHeavy,
    hapticSuccess,
    hapticError
  }
}
