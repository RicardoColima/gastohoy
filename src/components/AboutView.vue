<template>
  <div class="container-fluid pb-5 mb-5 mt-4 px-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4 mt-2">
      <div>
        <h3 class="mb-0 fw-bold">Acerca de</h3>
        <span class="text-muted small fw-medium">Información de la aplicación</span>
      </div>
      <button class="btn btn-outline-secondary btn-sm rounded-pill" @click="$emit('back')">Volver</button>
    </div>

    <div class="card card-theme border-0 shadow-sm rounded-4 mb-4">
      <div class="card-body p-4 text-center">
        <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm" style="width: 80px; height: 80px;">
          <i class="bi bi-wallet2" style="font-size: 2.5rem;"></i>
        </div>
        <h4 class="fw-bold mb-1">GastoHoy</h4>
        <p class="text-muted small mb-4">Versión 1.0.0</p>
        
        <p class="text-start text-body-secondary mb-4">
          GastoHoy es una aplicación web progresiva (PWA) diseñada para registrar y controlar tus gastos diarios de forma rápida, segura y completamente privada. 
          Toda la información se almacena localmente en tu dispositivo utilizando IndexedDB, lo que significa que no necesitas internet para usarla y tus datos nunca salen de tu teléfono a menos que decidas exportarlos en la sección de Respaldo.
        </p>

        <hr class="text-muted opacity-25 mb-4">

        <h6 class="fw-bold mb-3 text-start">¿Cómo funciona?</h6>
        <ul class="list-unstyled text-start small text-body-secondary space-y-3">
          <li class="d-flex align-items-start mb-3">
            <i class="bi bi-check-circle-fill text-primary me-3 mt-1"></i>
            <div>
              <strong class="d-block text-body">Registro Rápido</strong>
              Agrega gastos con un solo botón, categorízalos y visualiza tu balance diario y mensual al instante.
            </div>
          </li>
          <li class="d-flex align-items-start mb-3">
            <i class="bi bi-check-circle-fill text-primary me-3 mt-1"></i>
            <div>
              <strong class="d-block text-body">Estadísticas Visuales</strong>
              Revisa en qué estás gastando tu dinero mediante gráficos interactivos y un historial completo.
            </div>
          </li>
          <li class="d-flex align-items-start">
            <i class="bi bi-check-circle-fill text-primary me-3 mt-1"></i>
            <div>
              <strong class="d-block text-body">Respaldo Manual</strong>
              Exporta tus datos en formato JSON para guardarlos o transferirlos a otro dispositivo.
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Créditos -->
    <div class="card bg-primary bg-gradient text-white border-0 shadow-sm rounded-4 text-center">
      <div class="card-body p-4">
        <i class="bi bi-code-slash fs-1 mb-2 d-block opacity-75"></i>
        <h6 class="fw-bold mb-2">Creado por MTZLabs</h6>
        <p class="small text-white-50 mb-3">Desarrollo de software y soluciones digitales</p>
        <a href="https://mtzlabs.net" target="_blank" rel="noopener noreferrer" class="btn btn-light btn-sm rounded-pill fw-bold text-primary px-4 shadow-sm">
          Visitar mtzlabs.net
        </a>
      </div>
    </div>

  </div>
</template>

<script setup>
defineEmits(['back'])
</script>

<style scoped>
[data-bs-theme="dark"] .card-theme {
  background-color: #212529 !important;
  color: #f8f9fa !important;
}
[data-bs-theme="light"] .card-theme {
  background-color: #ffffff !important;
  color: #212529 !important;
}
</style>
