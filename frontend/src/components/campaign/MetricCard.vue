<template>
  <div
    class="metric-card"
    :role="role"
    :aria-label="`Metric: ${label}, Value: ${displayValue}`"
  >
    <div class="metric-label">{{ label }}</div>
    <div class="metric-value">{{ displayValue }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFormatters } from '@/composables'

const props = defineProps({
  /**
   * Metric label
   */
  label: {
    type: String,
    required: true
  },
  /**
   * Metric value
   */
  value: {
    type: [Number, String],
    required: true
  },
  /**
   * Format type for the value
   * @type {'currency' | 'number' | 'percentage' | 'raw'}
   */
  format: {
    type: String,
    default: 'raw',
    validator: (value) => ['currency', 'number', 'percentage', 'raw'].includes(value)
  },
  /**
   * Decimal places for percentage format
   */
  decimals: {
    type: Number,
    default: 2
  },
  /**
   * ARIA role attribute
   */
  role: {
    type: String,
    default: 'article'
  }
})

const { formatCurrency, formatNumber, formatPercentage } = useFormatters()

const displayValue = computed(() => {
  const val = props.value

  if (val === null || val === undefined || val === '') {
    return format === 'currency' ? '$0.00' : format === 'percentage' ? '0%' : '0'
  }

  switch (props.format) {
    case 'currency':
      return formatCurrency(val)
    case 'number':
      return formatNumber(val)
    case 'percentage':
      return formatPercentage(val, props.decimals)
    case 'raw':
    default:
      return typeof val === 'number' ? val.toLocaleString() : val
  }
})
</script>

<style scoped>
.metric-card {
  background: var(--color-gray-50);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-5);
  text-align: center;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.metric-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-2);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
}

.metric-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  line-height: var(--line-height-tight);
}

@media (max-width: 768px) {
  .metric-card {
    padding: var(--spacing-4);
  }

  .metric-value {
    font-size: var(--font-size-2xl);
  }
}
</style>
