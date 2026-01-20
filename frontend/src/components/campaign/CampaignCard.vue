<template>
  <div
    class="campaign-card"
    :class="{ 'campaign-card-clickable': clickable }"
    @click="handleClick"
    @keydown.enter.prevent="handleClick"
    @keydown.space.prevent="handleClick"
    :tabindex="clickable ? 0 : -1"
    role="article"
    :aria-label="`Campaign: ${campaign.name}, Status: ${campaign.status}, Budget: ${formatCurrency(campaign.budget)}`"
    :aria-describedby="`campaign-${campaign.id}-details`"
  >
    <div class="campaign-header">
      <h3 class="campaign-name" :id="`campaign-${campaign.id}-title`">{{ campaign.name }}</h3>
      <StatusBadge :status="campaign.status" size="sm" />
    </div>

    <div
      :id="`campaign-${campaign.id}-details`"
      class="campaign-info"
      :aria-labelledby="`campaign-${campaign.id}-title`"
    >
      <div class="info-row">
        <span class="info-label">Budget:</span>
        <span class="info-value">{{ formatCurrency(campaign.budget) }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Spent:</span>
        <span class="info-value">{{ formatCurrency(campaign.spent) }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Start Date:</span>
        <span class="info-value">{{ formatDate(campaign.startDate) }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">End Date:</span>
        <span class="info-value">{{ formatDate(campaign.endDate) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StatusBadge from './StatusBadge.vue'
import { useFormatters } from '@/composables'

const props = defineProps({
  /**
   * Campaign data object
   */
  campaign: {
    type: Object,
    required: true
  },
  /**
   * Whether the card is clickable
   */
  clickable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click'])

const { formatCurrency, formatDate } = useFormatters()

const handleClick = () => {
  if (props.clickable) {
    emit('click', props.campaign)
  }
}
</script>

<style scoped>
.campaign-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.campaign-card-clickable {
  cursor: pointer;
}

.campaign-card-clickable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.campaign-card-clickable:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.campaign-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-4);
  gap: var(--spacing-3);
}

.campaign-name {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  flex: 1;
  line-height: var(--line-height-tight);
}

.campaign-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.info-value {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
}

@media (max-width: 768px) {
  .campaign-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
  }

  .campaign-name {
    font-size: var(--font-size-lg);
  }
}
</style>
