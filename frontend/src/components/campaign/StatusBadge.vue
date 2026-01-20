<template>
  <span
    class="status-badge"
    :class="badgeClass"
    :aria-label="`Status: ${statusLabel}`"
  >
    {{ statusLabel }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { useStatusClass } from '@/composables'

const props = defineProps({
  /**
   * Campaign status value
   * @type {'active' | 'paused' | 'completed' | 'draft'}
   */
  status: {
    type: String,
    required: true,
    validator: (value) => ['active', 'paused', 'completed', 'draft'].includes(value)
  },
  /**
   * Size variant
   * @type {'sm' | 'md' | 'lg'}
   */
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const { getStatusClass, getStatusLabel } = useStatusClass()

const badgeClass = computed(() => {
  return [
    getStatusClass(props.status),
    `status-badge-${props.size}`
  ]
})

const statusLabel = computed(() => {
  return getStatusLabel(props.status)
})
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  white-space: nowrap;
  letter-spacing: 0.5px;
}

.status-badge-sm {
  padding: var(--spacing-1) var(--spacing-3);
  font-size: var(--font-size-xs);
}

.status-badge-md {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
}

.status-badge-lg {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-base);
}

/* Status-specific colors */
.status-active {
  background: var(--color-status-active-bg);
  color: var(--color-status-active-text);
}

.status-paused {
  background: var(--color-status-paused-bg);
  color: var(--color-status-paused-text);
}

.status-completed {
  background: var(--color-status-completed-bg);
  color: var(--color-status-completed-text);
}

.status-draft {
  background: var(--color-status-draft-bg);
  color: var(--color-status-draft-text);
}
</style>
