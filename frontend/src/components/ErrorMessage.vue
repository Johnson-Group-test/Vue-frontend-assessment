<template>
  <div class="error-message" :class="`error-${type}`">
    <div class="error-icon">
  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
  </svg>
</div>
    <div class="error-content">
      <p class="error-title">{{ title }}</p>
      <p class="error-text">{{ message }}</p>
      <button v-if="retry" @click="$emit('retry')" class="retry-btn">
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Error'
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'warning', 'info'].includes(value)
  },
  retry: {
    type: Boolean,
    default: false
  }
});

defineEmits(['retry']);
</script>

<style scoped>
.error-message {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  margin: 1rem 0;
}

.error-warning {
  background-color: #fffbeb;
  border-color: #fde68a;
}

.error-info {
  background-color: #eff6ff;
  border-color: #bfdbfe;
}

.error-icon {
  flex-shrink: 0;
  color: #dc2626;
}

.error-warning .error-icon {
  color: #d97706;
}

.error-info .error-icon {
  color: #2563eb;
}

.error-icon svg {
  width: 1.5rem;
  height: 1.5rem;
}

.error-content {
  flex: 1;
}

.error-title {
  font-weight: 600;
  color: #991b1b;
  margin: 0 0 0.5rem 0;
}

.error-warning .error-title {
  color: #92400e;
}

.error-info .error-title {
  color: #1e40af;
}

.error-text {
  color: #7f1d1d;
  margin: 0;
}

.error-warning .error-text {
  color: #78350f;
}

.error-info .error-text {
  color: #1e3a8a;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #0052a3;
}
</style>
