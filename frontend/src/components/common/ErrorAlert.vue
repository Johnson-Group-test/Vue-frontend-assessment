<template>
  <div class="error-alert" role="alert" :aria-live="ariaLive">
    <div class="error-content">
      <div class="error-icon" aria-hidden="true">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10 6V10"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10 14H10.01"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <div class="error-text">
        <p class="error-title"><strong>Error:</strong></p>
        <p class="error-message">{{ message }}</p>
      </div>
    </div>
    <button
      v-if="retryable"
      @click="handleRetry"
      class="btn-retry"
      type="button"
      :aria-label="`Retry: ${retryLabel}`"
    >
      {{ retryLabel }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /**
   * Error message to display
   */
  message: {
    type: String,
    required: true
  },
  /**
   * Whether to show retry button
   */
  retryable: {
    type: Boolean,
    default: false
  },
  /**
   * Label for retry button
   */
  retryLabel: {
    type: String,
    default: 'Try Again'
  },
  /**
   * ARIA live region politeness
   */
  ariaLive: {
    type: String,
    default: 'polite',
    validator: (value) => ['off', 'polite', 'assertive'].includes(value)
  }
})

const emit = defineEmits(['retry'])

const handleRetry = () => {
  emit('retry')
}
</script>

<style scoped>
.error-alert {
  background: var(--color-danger-bg);
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-base);
  padding: var(--spacing-4) var(--spacing-6);
  color: var(--color-danger-text);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-4);
}

.error-content {
  display: flex;
  gap: var(--spacing-3);
  flex: 1;
}

.error-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.error-icon svg {
  color: var(--color-danger);
}

.error-text {
  flex: 1;
}

.error-title {
  margin: 0 0 var(--spacing-1) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.error-message {
  margin: 0;
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
}

.btn-retry {
  flex-shrink: 0;
  padding: var(--spacing-2) var(--spacing-4);
  background: var(--color-danger);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-base);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-retry:hover {
  background: #c82333;
}

.btn-retry:focus {
  outline: 2px solid var(--color-danger);
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .error-alert {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-retry {
    width: 100%;
    margin-top: var(--spacing-2);
  }
}
</style>
