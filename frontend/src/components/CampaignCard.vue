<template>
  <div class="campaign-card" @click="handleClick">
    <div class="card-header">
      <h3 class="campaign-name">{{ campaign.name }}</h3>
      <span class="campaign-status" :class="`status-${campaign.status}`">
        {{ campaign.status }}
      </span>
    </div>
    <p v-if="campaign.description" class="campaign-description">
      {{ campaign.description }}
    </p>
    <div class="campaign-details">
      <div class="detail-item flex">
        <span class="detail-label">Budget:</span>
        <span class="detail-value">${{ formatNumber(campaign.budget) }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Spent:</span>
        <span class="detail-value">${{ formatNumber(campaign.spent) }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Period:</span>
        <span class="detail-value">
          {{ formatDate(campaign.startDate) }} - {{ formatDate(campaign.endDate) }}
        </span>
      </div>
      <div v-if="campaign.targetAudience" class="detail-item">
        <span class="detail-label">Target:</span>
        <span class="detail-value">{{ campaign.targetAudience }}</span>
      </div>
    </div>
    
    <div class="budget-progress">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
      <span class="progress-text">{{ progressPercentage }}% spent</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  campaign: {
    type: Object,
    required: true
  },
  clickable: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['click']);

const progressPercentage = computed(() => {
  if (!props.campaign.budget) return 0;
  return Math.min(Math.round((props.campaign.spent / props.campaign.budget) * 100), 100);
});

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const handleClick = () => {
  if (props.clickable) {
    emit('click', props.campaign.id);
  }
};
</script>

<style scoped>
.campaign-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
  cursor: pointer;
}

.campaign-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: #0066cc;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.campaign-name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  flex: 1;
}

.campaign-status {
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

.status-active {
  background: #d1fae5;
  color: #065f46;
}

.status-paused {
  background: #fef3c7;
  color: #92400e;
}

.status-completed {
  background: #dbeafe;
  color: #1e40af;
}

.status-draft {
  background: #f3f4f6;
  color: #4b5563;
}

.campaign-description {
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.campaign-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.detail-item {
  display: flex;
  flex-direction: row;
  align-items: center; 
  gap: 0.5rem;
}

.detail-label {
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 0.95rem;
  color: #374151;
  font-weight: 500;
}

.budget-progress {
  margin-top: 1rem;
}

.progress-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0066cc, #0052a3);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: #6b7280;
}

@media (max-width: 640px) {
  .campaign-details {
    grid-template-columns: 1fr;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .campaign-status {
    align-self: flex-end;
  }
}
</style>
