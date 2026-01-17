<template>
  <div class="campaign-detail">
    <div class="container">
      <!-- Back Button -->
      <button @click="goBack" class="back-btn">
        ← Back to Campaigns
      </button>

      <!-- Loading State -->
      <LoadingSpinner v-if="loading" message="Loading campaign details..." />

      <!-- Error State -->
      <ErrorMessage
        v-else-if="error"
        :title="notFound ? 'Campaign Not Found' : 'Error Loading Campaign'"
        :message="error"
        :retry="!notFound"
        @retry="fetchCampaign"
      />

      <!-- Campaign Detail -->
      <div v-else-if="campaign" class="detail-content">
        <!-- Header -->
        <div class="detail-header">
          <div class="header-main">
            <h1 class="campaign-name">{{ campaign.name }}</h1>
            <p v-if="campaign.description" class="campaign-description">
              {{ campaign.description }}
            </p>
          </div>
          <div class="header-actions">
            <div class="primary-actions">
              <router-link :to="`/campaigns/${campaign.id}/edit`" class="edit-btn">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg> Edit
              </router-link>
              <button @click="showDeleteModal = true" class="delete-btn">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> Delete
              </button>
            </div>
            <div class="status-wrapper" v-click-outside="() => showDropdown = false">
              <button 
                @click="showDropdown = !showDropdown"
                class="status-pill-btn"
                :class="`status-${campaign.status}`"
                :disabled="updatingStatus"
              >
                <span v-if="!updatingStatus">{{ campaign.status }}</span>
                <span v-else>Updating...</span>
                <span v-if="!updatingStatus" class="chevron" :class="{ 'rotate': showDropdown }">▾</span>
              </button>

              <transition name="dropdown">
                <div v-if="showDropdown" class="status-dropdown-menu">
                  <div 
                    v-for="opt in ['active', 'paused', 'completed', 'draft']" 
                    :key="opt"
                    class="dropdown-item"
                    :class="{ 'active-opt': campaign.status === opt }"
                    role="menuitem"
                    tabindex="0"
                    @click="handleStatusUpdate(opt)"
                    @keydown.enter="handleStatusUpdate(opt)"
                    @keydown.space.prevent="handleStatusUpdate(opt)"
                  >
                    <span class="status-dot" :class="`dot-${opt}`"></span>
                    {{ opt }}
                  </div>
                </div>
              </transition>
              <span v-if="updatingStatus" class="status-loader"></span>
            </div>
          </div>
        </div>

        <!-- Confirmation Modal -->
        <ConfirmationModal
          :show="showDeleteModal"
          title="Delete Campaign"
          :message="`Are you sure you want to delete '${campaign.name}'? This action cannot be undone.`"
          confirm-text="Delete"
          :loading="deleting"
          @confirm="handleDelete"
          @cancel="showDeleteModal = false"
        />

        <!-- Main Info Cards -->
        <div class="info-grid">
          <div class="info-card">
            <div class="info-icon budget-icon"><svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
            <div class="info-content">
              <p class="info-label">Budget</p>
              <p class="info-value">${{ formatNumber(campaign.budget) }}</p>
              <p class="info-secondary">
                Spent: ${{ formatNumber(campaign.spent) }} 
                ({{ spentPercentage }}%)
              </p>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: spentPercentage + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon calendar-icon"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>
            <div class="info-content">
              <p class="info-label">Campaign Period</p>
              <p class="info-value">{{ formatDateRange() }}</p>
              <p class="info-secondary">
                {{ calculateDuration() }} days
              </p>
            </div>
          </div>

          <div v-if="campaign.targetAudience" class="info-card">
            <div class="info-icon target-icon">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <div class="info-content">
              <p class="info-label">Target Audience</p>
              <p class="info-value">{{ campaign.targetAudience }}</p>
            </div>
          </div>
        </div>

        <!-- Metrics Section -->
        <div v-if="campaign.metrics" class="metrics-section">
          <h2 class="section-title-dark">Performance Metrics</h2>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-icon"><svg class="w-8 h-8 mx-auto mb-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></div>
              <p class="metric-label">Impressions</p>
              <p class="metric-value">{{ formatNumber(campaign.metrics.impressions) }}</p>
            </div>

            <div class="metric-card">
              <div class="metric-icon"><svg class="w-8 h-8 mx-auto mb-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg></div>
              <p class="metric-label">Clicks</p>
              <p class="metric-value">{{ formatNumber(campaign.metrics.clicks) }}</p>
            </div>

            <div class="metric-card">
              <div class="metric-icon"><svg class="w-8 h-8 mx-auto mb-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
              <p class="metric-label">Conversions</p>
              <p class="metric-value">{{ formatNumber(campaign.metrics.conversions) }}</p>
            </div>

            <div class="metric-card">
              <div class="metric-icon"><svg class="w-8 h-8 mx-auto mb-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg></div>
              <p class="metric-label">CTR</p>
              <p class="metric-value">{{ campaign.metrics.ctr }}%</p>
            </div>

            <div class="metric-card">
              <div class="metric-icon"><svg class="w-8 h-8 mx-auto mb-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
              <p class="metric-label">CPC</p>
              <p class="metric-value">${{ campaign.metrics.cpc }}</p>
            </div>

            <div class="metric-card">
              <div class="metric-icon"><svg class="w-8 h-8 mx-auto mb-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>
              <p class="metric-label">Conversion Rate</p>
              <p class="metric-value">
                {{ calculateConversionRate() }}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCampaign } from '@/composables/useCampaign';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import { useCampaignStore } from '@/stores/campaignStore';
import { storeToRefs } from 'pinia';


const store = useCampaignStore();
const router = useRouter();
const route = useRoute();
const notFound = ref(false);
const showDeleteModal = ref(false);
const showDropdown = ref(false);
const { currentCampaign: campaign, loading, error, updatingStatus } = storeToRefs(store);


// Use the composable
const { 
  deleting, 
  spentPercentage, 
  removeCampaign 
} = useCampaign();



//  Restored Helper Functions

const goBack = () => router.push('/campaigns');

const fetchCampaign = async () => {
  notFound.value = false;
  try {
    await store.fetchCampaignDetail(route.params.id);
  } catch (err) {
    if (err.response?.status === 404 || err.error?.code === 'NOT_FOUND') {
      notFound.value = true;
    }
  }
};

const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

const formatDateRange = () => {
  if (!campaign.value) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const start = new Date(campaign.value.startDate).toLocaleDateString('en-US', options);
  const end = new Date(campaign.value.endDate).toLocaleDateString('en-US', options);
  return `${start} - ${end}`;
};

const calculateDuration = () => {
  if (!campaign.value) return 0;
  const start = new Date(campaign.value.startDate);
  const end = new Date(campaign.value.endDate);
  return Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
};

const calculateConversionRate = () => {
  if (!campaign.value?.metrics || !campaign.value.metrics.clicks) return '0.00';
  return ((campaign.value.metrics.conversions / campaign.value.metrics.clicks) * 100).toFixed(2);
};

// Actions

const handleDelete = async () => {
  await removeCampaign(campaign.value.id);
  showDeleteModal.value = false;
  router.push('/campaigns');
};
const handleStatusUpdate = async (newStatus) => {
  if (newStatus === campaign.value.status) return;
  showDropdown.value = false;
  await handleStatusChange(newStatus);
};
// Simple directive to close when clicking outside
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};

const handleStatusChange = (newStatus) => {
  store.updateStatus(campaign.value.id, newStatus);
};

onMounted(fetchCampaign);
</script>

<style scoped>
@import "@/assets/css/detail.css";
</style>
