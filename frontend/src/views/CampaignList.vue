<template>
  <div class="campaign-list">
    <div class="container">
      <PageHeader title="Campaigns">
        <template #actions>
          <router-link
            to="/campaigns/new"
            class="btn btn-primary"
            aria-label="Create a new campaign"
          >
            + New Campaign
          </router-link>
        </template>
      </PageHeader>

      <div class="search-container">
        <label for="campaign-search" class="sr-only">Search campaigns</label>
        <input
          id="campaign-search"
          v-model="localSearchQuery"
          type="text"
          placeholder="Search campaigns by name..."
          class="search-input"
          aria-label="Search campaigns by name"
          aria-describedby="search-hint"
          @input="handleSearchInput"
        />
        <span id="search-hint" class="sr-only">Type to filter campaigns by name</span>
      </div>

      <div
        aria-live="polite"
        :aria-busy="loading"
      >
        <LoadingSpinner
          v-if="loading"
          message="Loading campaigns..."
          size="md"
        />

        <ErrorAlert
          v-else-if="error"
          :message="error"
          :retryable="true"
          retry-label="Try Again"
          @retry="fetchCampaigns"
        />

        <div
          v-else-if="filteredCampaigns.length > 0"
          class="campaigns-grid"
          role="list"
          aria-label="Campaigns list"
        >
          <CampaignCard
            v-for="campaign in filteredCampaigns"
            v-memo="[campaign.id, campaign.name, campaign.status, campaign.budget, campaign.spent, campaign.startDate, campaign.endDate]"
            :key="campaign.id"
            :campaign="campaign"
            role="listitem"
            @click="handleCampaignClick"
          />
        </div>

        <div v-else class="empty-state" role="status" aria-live="polite">
          <p v-if="localSearchQuery">
            No campaigns found matching "{{ localSearchQuery }}"
          </p>
          <p v-else>
            No campaigns available. <router-link to="/campaigns/new">Create your first campaign</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCampaignsStore } from '@/stores/campaigns'
import { storeToRefs } from 'pinia'
import { useDebounce } from '@/composables'
import PageHeader from '@/components/layout/PageHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorAlert from '@/components/common/ErrorAlert.vue'
import CampaignCard from '@/components/campaign/CampaignCard.vue'
import { FORM_DEFAULTS } from '@/constants'

const router = useRouter()
const store = useCampaignsStore()

// Use store state
const { loading, error, searchQuery, filteredCampaigns } = storeToRefs(store)

// Local search query for immediate UI update
const localSearchQuery = ref(store.searchQuery)

// Sync local query with store
watch(() => store.searchQuery, (newQuery) => {
  localSearchQuery.value = newQuery
})

// Fetch campaigns
const fetchCampaigns = () => {
  store.fetchCampaigns()
}

// Debounced search handler
const debouncedSearch = useDebounce((query) => {
  store.setSearchQuery(query)
}, FORM_DEFAULTS.debounceDelay)

// Handle search input
const handleSearchInput = (event) => {
  const query = event.target.value
  localSearchQuery.value = query
  debouncedSearch(query)
}

// Handle campaign card click
const handleCampaignClick = (campaign) => {
  router.push(`/campaigns/${campaign.id}`)
}

// Fetch campaigns on mount
onMounted(() => {
  fetchCampaigns()
})

// Cleanup debounce on unmount
onBeforeUnmount(() => {
  debouncedSearch.cancel()
})
</script>

<style scoped>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: var(--color-white);
  padding: var(--spacing-2) var(--spacing-4);
  text-decoration: none;
  z-index: 1000;
  border-radius: 0 0 var(--radius-base) 0;
}

.skip-link:focus {
  top: 0;
  outline: 3px solid var(--color-primary-dark);
}

.campaign-list {
  width: 100%;
  position: relative;
}

.search-container {
  margin-bottom: var(--spacing-8);
  position: relative;
}

.search-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
  font-family: inherit;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}

.campaigns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-8);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-16) var(--spacing-8);
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

.empty-state a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
}

.empty-state a:hover {
  text-decoration: underline;
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

/* Responsive Design */
@media (max-width: 768px) {
  .campaigns-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .campaigns-grid {
    gap: var(--spacing-4);
  }
}
</style>
