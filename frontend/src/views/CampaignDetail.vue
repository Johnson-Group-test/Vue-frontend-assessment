<template>
  <div class="campaign-detail">
    <div class="container">
      <BackButton to="/" label="Back to Campaigns" />

      <div
        aria-live="polite"
        :aria-busy="loading"
      >
        <LoadingSpinner
          v-if="loading"
          message="Loading campaign details..."
          size="md"
        />

        <div v-else-if="notFound" class="not-found-container" role="alert">
          <div class="not-found-message">
            <h2>Campaign Not Found</h2>
            <p>The campaign you're looking for doesn't exist or has been removed.</p>
            <button
              @click="router.push('/')"
              class="btn btn-primary"
              aria-label="Return to campaigns list"
            >
              Back to Campaigns
            </button>
          </div>
        </div>

        <ErrorAlert
          v-else-if="error"
          :message="error"
          :retryable="true"
          retry-label="Try Again"
          @retry="fetchCampaign"
        />

        <article v-else-if="campaign" class="campaign-detail-content" :aria-labelledby="`campaign-${campaign.id}`">
          <PageHeader :title="campaign.name">
            <template #actions>
              <router-link
                :to="`/campaigns/${campaign.id}/edit`"
                class="btn btn-primary"
                aria-label="Edit campaign"
              >
                Edit Campaign
              </router-link>
            </template>
          </PageHeader>

        <div class="campaign-sections">
          <section class="info-section" aria-labelledby="campaign-information">
            <h2 id="campaign-information" class="section-title">Campaign Information</h2>
            <dl class="info-grid">
              <div class="info-item">
                <dt class="info-label">Campaign ID</dt>
                <dd class="info-value">{{ campaign.id }}</dd>
              </div>
              <div class="info-item">
                <dt class="info-label">Status</dt>
                <dd class="info-value">
                  <StatusBadge :status="campaign.status" size="sm" />
                </dd>
              </div>
              <div class="info-item">
                <dt class="info-label">Start Date</dt>
                <dd class="info-value">{{ formatDate(campaign.startDate) }}</dd>
              </div>
              <div class="info-item">
                <dt class="info-label">End Date</dt>
                <dd class="info-value">{{ formatDate(campaign.endDate) }}</dd>
              </div>
              <div class="info-item">
                <dt class="info-label">Description</dt>
                <dd class="info-value">{{ campaign.description || 'No description' }}</dd>
              </div>
              <div class="info-item">
                <dt class="info-label">Target Audience</dt>
                <dd class="info-value">{{ campaign.targetAudience || 'Not specified' }}</dd>
              </div>
            </dl>
          </section>

          <section class="info-section" aria-labelledby="budget-spending">
            <h2 id="budget-spending" class="section-title">Budget & Spending</h2>
            <div class="budget-info">
              <div class="budget-item">
                <span class="budget-label">Total Budget</span>
                <span class="budget-value budget-total">{{ formatCurrency(campaign.budget) }}</span>
              </div>
              <div class="budget-item">
                <span class="budget-label">Amount Spent</span>
                <span class="budget-value budget-spent">{{ formatCurrency(campaign.spent) }}</span>
              </div>
              <div class="budget-item">
                <span class="budget-label">Remaining</span>
                <span class="budget-value budget-remaining">
                  {{ formatCurrency(campaign.budget - campaign.spent) }}
                </span>
              </div>
            </div>
            <div class="budget-progress">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: `${getBudgetUsage}%` }"
                ></div>
              </div>
              <span class="progress-text">
                {{ formatPercentage(getBudgetUsage) }} of budget used
              </span>
            </div>
          </section>

          <section
            v-if="campaign.metrics"
            class="info-section"
            aria-labelledby="performance-metrics"
          >
            <h2 id="performance-metrics" class="section-title">Performance Metrics</h2>
            <div class="metrics-grid" role="list" aria-label="Campaign performance metrics">
              <MetricCard
                v-memo="[campaign.metrics?.impressions]"
                label="Impressions"
                :value="campaign.metrics?.impressions || 0"
                format="number"
                role="listitem"
              />
              <MetricCard
                v-memo="[campaign.metrics?.clicks]"
                label="Clicks"
                :value="campaign.metrics?.clicks || 0"
                format="number"
                role="listitem"
              />
              <MetricCard
                v-memo="[campaign.metrics?.conversions]"
                label="Conversions"
                :value="campaign.metrics?.conversions || 0"
                format="number"
                role="listitem"
              />
              <MetricCard
                v-memo="[campaign.metrics?.ctr]"
                label="CTR (Click-Through Rate)"
                :value="campaign.metrics?.ctr || 0"
                format="percentage"
                role="listitem"
              />
              <MetricCard
                v-memo="[campaign.metrics?.cpc]"
                label="CPC (Cost Per Click)"
                :value="campaign.metrics?.cpc || 0"
                format="currency"
                role="listitem"
              />
            </div>
          </section>
        </div>
      </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCampaignsStore } from '@/stores/campaigns'
import { storeToRefs } from 'pinia'
import { useFormatters } from '@/composables'
import BackButton from '@/components/common/BackButton.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorAlert from '@/components/common/ErrorAlert.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import StatusBadge from '@/components/campaign/StatusBadge.vue'
import MetricCard from '@/components/campaign/MetricCard.vue'

const route = useRoute()
const router = useRouter()
const store = useCampaignsStore()

// Use store state
const { loading, error, notFound, currentCampaign } = storeToRefs(store)

// Campaign from store
const campaign = computed(() => currentCampaign.value)

// Formatters
const { formatCurrency, formatDate, formatPercentage } = useFormatters()

// Calculate budget usage percentage
const getBudgetUsage = computed(() => {
  if (!campaign.value) return 0
  return (campaign.value.spent / campaign.value.budget) * 100
})

// Fetch campaign
const fetchCampaign = () => {
  const campaignId = route.params.id
  if (campaignId) {
    store.fetchCampaignById(campaignId)
  } else {
    // If no ID, clear current campaign which will trigger notFound
    store.clearCurrentCampaign()
  }
}

// Fetch campaign on component mount
onMounted(() => {
  fetchCampaign()
})

// Watch for route parameter changes
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchCampaign()
    }
  }
)

// Watch for route changes to handle navigation from edit back to detail
// This ensures we fetch fresh data when navigating back even if the ID hasn't changed
watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    const campaignId = route.params.id
    
    // If we have a campaign ID and we're navigating from edit route back to detail route
    if (campaignId && oldPath && oldPath.includes('/edit') && newPath.includes(`/campaigns/${campaignId}`) && !newPath.includes('/edit')) {
      // Clear current campaign and force fresh fetch when coming back from edit
      store.clearCurrentCampaign()
      fetchCampaign()
    }
  }
)
</script>

<style scoped>
.campaign-detail {
  width: 100%;
  position: relative;
}

.not-found-container {
  padding: var(--spacing-16) var(--spacing-8);
  text-align: center;
}

.not-found-message {
  max-width: 500px;
  margin: 0 auto;
}

.not-found-message h2 {
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-4);
}

.not-found-message p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-8);
}

.btn {
  padding: var(--spacing-3) var(--spacing-6);
  border: none;
  border-radius: var(--radius-base);
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  font-size: var(--font-size-base);
  transition: all var(--transition-base);
  font-weight: var(--font-weight-medium);
  font-family: inherit;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-white);
}

.btn-primary:hover {
  background: var(--color-primary-dark);
}

.campaign-detail-content {
  margin-top: var(--spacing-8);
}

.campaign-sections {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
}

.info-section {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-sm);
}

.section-title {
  margin: 0 0 var(--spacing-6) 0;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-3);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-6);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.info-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-normal);
}

.budget-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-6);
}

.budget-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.budget-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.budget-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
}

.budget-total {
  color: var(--color-primary);
}

.budget-spent {
  color: var(--color-danger);
}

.budget-remaining {
  color: var(--color-success);
}

.budget-progress {
  margin-top: var(--spacing-4);
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: var(--color-gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--spacing-2);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark));
  transition: width var(--transition-slow);
  border-radius: var(--radius-lg);
}

.progress-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-4);
}

/* Responsive Design */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .budget-info {
    grid-template-columns: 1fr;
  }

  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .info-section {
    padding: var(--spacing-4);
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
