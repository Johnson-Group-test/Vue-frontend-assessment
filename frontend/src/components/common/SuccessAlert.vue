<template>
  <Transition name="success-fade">
    <div
      v-if="visible"
      class="success-alert"
      role="status"
      :aria-live="ariaLive"
    >
      <div class="success-content">
        <div class="success-icon" aria-hidden="true">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.7071 5.29289C17.0976 5.68342 17.0976 6.31658 16.7071 6.70711L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289C3.68342 8.90237 4.31658 8.90237 4.70711 9.29289L8 12.5858L15.2929 5.29289C15.6834 4.90237 16.3166 4.90237 16.7071 5.29289Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div class="success-text">
          <p class="success-title"><strong>Success:</strong></p>
          <p class="success-message">{{ message }}</p>
        </div>
      </div>
      <button
        v-if="dismissible"
        @click="handleDismiss"
        class="btn-dismiss"
        type="button"
        aria-label="Dismiss success message"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4L4 12M4 4L12 12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  /**
   * Success message to display
   */
  message: {
    type: String,
    required: true
  },
  /**
   * Whether the alert can be manually dismissed
   */
  dismissible: {
    type: Boolean,
    default: false
  },
  /**
   * Auto-dismiss duration in milliseconds (0 = no auto-dismiss)
   */
  autoDismiss: {
    type: Number,
    default: 5000
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

const emit = defineEmits(['dismiss'])

const visible = ref(true)
let dismissTimer = null

const handleDismiss = () => {
  visible.value = false
  if (dismissTimer) {
    clearTimeout(dismissTimer)
    dismissTimer = null
  }
  emit('dismiss')
}

// Auto-dismiss functionality
watch(() => props.autoDismiss, (duration) => {
  if (dismissTimer) {
    clearTimeout(dismissTimer)
  }
  
  if (duration > 0 && visible.value) {
    dismissTimer = setTimeout(() => {
      handleDismiss()
    }, duration)
  }
}, { immediate: true })

onMounted(() => {
  if (props.autoDismiss > 0) {
    dismissTimer = setTimeout(() => {
      handleDismiss()
    }, props.autoDismiss)
  }
})

onBeforeUnmount(() => {
  if (dismissTimer) {
    clearTimeout(dismissTimer)
    dismissTimer = null
  }
})
</script>

<style scoped>
.success-alert {
  background: var(--color-success-bg);
  border: 1px solid var(--color-success);
  border-radius: var(--radius-base);
  padding: var(--spacing-4) var(--spacing-6);
  color: var(--color-success-text);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-4);
}

.success-content {
  display: flex;
  gap: var(--spacing-3);
  flex: 1;
}

.success-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.success-icon svg {
  color: var(--color-success);
}

.success-text {
  flex: 1;
}

.success-title {
  margin: 0 0 var(--spacing-1) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.success-message {
  margin: 0;
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
}

.btn-dismiss {
  flex-shrink: 0;
  padding: var(--spacing-1);
  background: transparent;
  color: var(--color-success-text);
  border: none;
  border-radius: var(--radius-base);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
  opacity: 0.7;
  width: 24px;
  height: 24px;
}

.btn-dismiss:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.05);
}

.btn-dismiss:focus {
  outline: 2px solid var(--color-success);
  outline-offset: 2px;
}

/* Transition animations */
.success-fade-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.success-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.success-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.success-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .success-alert {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-dismiss {
    align-self: flex-end;
    margin-top: var(--spacing-2);
  }
}
</style>
