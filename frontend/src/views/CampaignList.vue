<template>
  <div class="campaign-list">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">Marketing Campaigns</h1>
        <router-link to="/campaigns/new" class="btn btn-primary">
          + New Campaign
        </router-link>
      </div>

      <!-- Search Bar -->
      <div class="search-section">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search campaigns by name..."
          class="search-input"
          aria-label="Search campaigns by name"
        />
        <span v-if="searchQuery" class="search-clear" @click="clearSearch">×</span>
      </div>

      <!-- Loading State -->
      <LoadingSpinner v-if="loading" message="Loading campaigns..." />

      <!-- Error State -->
      <ErrorMessage
        v-else-if="error"
        title="Failed to load campaigns"
        :message="error"
        :retry="true"
        @retry="fetchCampaigns"
      />

      <!-- Empty State -->
      <div v-else-if="filteredCampaigns.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>{{ searchQuery ? 'No campaigns found' : 'No campaigns yet' }}</h3>
        <p>
          {{ searchQuery 
            ? 'Try adjusting your search query' 
            : 'Create your first campaign to get started' 
          }}
        </p>
        <router-link v-if="!searchQuery" to="/campaigns/new" class="btn btn-primary">
          Create Campaign
        </router-link>
      </div>

      <!-- Campaign List -->
      <div v-else class="campaigns-grid">
        <CampaignCard
          v-for="campaign in filteredCampaigns"
          :key="campaign.id"
          :campaign="campaign"
          @click="navigateToCampaign"
        />
      </div>

      <!-- Results Info -->
      <div v-if="!loading && !error && filteredCampaigns.length > 0" class="results-info">
        Showing {{ filteredCampaigns.length }} of {{ pagination.total }} campaigns
      </div>

      <!-- Pagination -->
      <Pagination
        v-if="!loading && !error && pagination.totalPages > 1"
        :current-page="pagination.page"
        :total-pages="pagination.totalPages"
        @update:current-page="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { getCampaigns } from '@/services/campaignService';
import CampaignCard from '@/components/CampaignCard.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import Pagination from '@/components/Pagination.vue';

const router = useRouter();
const campaigns = ref([]);
const loading = ref(false);
const error = ref(null);
const searchQuery = ref('');

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
});

const filteredCampaigns = computed(() => {
  if (!searchQuery.value) return campaigns.value;
  
  const query = searchQuery.value.toLowerCase();
  return campaigns.value.filter(campaign => 
    campaign.name.toLowerCase().includes(query)
  );
});

const fetchCampaigns = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await getCampaigns({
      page: pagination.page,
      limit: pagination.limit
    });
    campaigns.value = response.data || [];
    
    if (response.pagination) {
      pagination.page = response.pagination.page;
      pagination.limit = response.pagination.limit;
      pagination.total = response.pagination.total;
      pagination.totalPages = response.pagination.totalPages;
    }
  } catch (err) {
    error.value = err.error?.message || 'Failed to load campaigns. Please try again.';
    console.error('Error fetching campaigns:', err);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (newPage) => {
  pagination.page = newPage;
  fetchCampaigns();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const clearSearch = () => {
  searchQuery.value = '';
};

const navigateToCampaign = (campaignId) => {
  router.push(`/campaigns/${campaignId}`);
};

onMounted(() => {
  fetchCampaigns();
});
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.page-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background: #0066cc;
  color: white;
}

.btn-primary:hover {
  background: #0052a3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
}

.search-section {
  position: relative;
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1.25rem;
  font-size: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.search-clear {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  line-height: 1;
}

.search-clear:hover {
  color: #374151;
}

.campaigns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: #111827;
}

.empty-state p {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.results-info {
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
  padding: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .campaigns-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .btn {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 400px) {
  .campaigns-grid {
    grid-template-columns: 1fr;
  }
}
</style>
