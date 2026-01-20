<template>
  <div
    class="loading-container"
    :class="containerClass"
    role="status"
    :aria-busy="true"
    :aria-live="message ? 'polite' : 'off'"
  >
    <div class="spinner" :class="spinnerClass" aria-hidden="true">
      <span class="sr-only">Loading...</span>
    </div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /**
   * Size of the spinner
   * @type {'sm' | 'md' | 'lg'}
   */
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  /**
   * Optional message to display below spinner
   */
  message: {
    type: String,
    default: ''
  },
  /**
   * Additional CSS classes for container
   */
  containerClass: {
    type: String,
    default: ''
  }
})

const spinnerClass = computed(() => {
  return `spinner-${props.size}`
})
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-8) var(--spacing-4);
  gap: var(--spacing-4);
}

.spinner {
  border-radius: var(--radius-full);
  border-style: solid;
  border-color: var(--color-gray-200);
  border-top-color: var(--color-primary);
  animation: spin var(--transition-slower) linear infinite;
}

.spinner-sm {
  width: 24px;
  height: 24px;
  border-width: 3px;
}

.spinner-md {
  width: 40px;
  height: 40px;
  border-width: 4px;
}

.spinner-lg {
  width: 56px;
  height: 56px;
  border-width: 5px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-message {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
