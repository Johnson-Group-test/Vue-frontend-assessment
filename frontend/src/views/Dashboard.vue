<template>
  <div class="dashboard-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Analytics Dashboard</h1>
        <p class="page-subtitle">Real-time performance across all campaigns</p>
      </div>

      <!-- Loading State -->
      <LoadingSpinner v-if="loading" message="Calculating statistics..." />

      <!-- Error State -->
      <ErrorMessage
        v-else-if="error"
        title="Failed to load dashboard"
        :message="error"
        :retry="true"
        @retry="fetchStats"
      />

      <!-- Dashboard Content -->
      <div v-else-if="stats" class="dashboard-content">
        <!-- Summary Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon campaigns-icon"><svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg></div>
            <div class="stat-info">
              <p class="stat-label">Total Campaigns</p>
              <p class="stat-value">{{ stats.totalCampaigns }}</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon budget-icon"><svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
            <div class="stat-info">
              <p class="stat-label">Total Budget</p>
              <p class="stat-value">${{ formatNumber(stats.totalBudget) }}</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon investment-icon">📈</div>
            <div class="stat-info">
              <p class="stat-label">Total Spent</p>
              <p class="stat-value">${{ formatNumber(stats.totalSpent) }}</p>
              <p class="stat-hint">{{ calculateUtilization() }}% of budget</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon performance-icon">🎯</div>
            <div class="stat-info">
              <p class="stat-label">Total Conversions</p>
              <p class="stat-value">{{ formatNumber(stats.totalConversions) }}</p>
            </div>
          </div>
        </div>

        <!-- Metric Details -->
        <div class="metrics-container">
          <h2 class="section-title-light">Aggregated Performance</h2>
          <div class="metrics-grid">
            <div class="metric-item">
              <span class="metric-label">Avg CTR</span>
              <span class="metric-value">{{ stats.averageCTR }}%</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Avg CPC</span>
              <span class="metric-value">${{ calculateAvgCPC() }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Total Impressions</span>
              <span class="metric-value">{{ formatNumber(stats.totalImpressions) }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Total Clicks</span>
              <span class="metric-value">{{ formatNumber(stats.totalClicks) }}</span>
            </div>
          </div>
        </div>

      <div class="status-section">
        <h2 class="section-title-dark">Campaign Statuses</h2>
        
        <div v-if="statusBreakdown" class="status-grid">
          <div 
            v-for="(count, status) in statusBreakdown" 
            :key="status"
            class="status-card"
            :class="`status-${status}`"
          >
            <span class="status-name">{{ status }}</span>
            <span class="status-count">{{ count }}</span>
          </div>
        </div>

        <div v-else class="empty-stats-message">
          <p>No campaign status data available at the moment.</p>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useCampaignStore } from '@/stores/campaignStore';
import { storeToRefs } from 'pinia';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';


const store = useCampaignStore();
const { stats, loading, error } = storeToRefs(store);

const statusBreakdown = computed(() => {
  if (!stats.value) return {};
  const breakdown = {
    active: stats.value.activeCampaigns || 0,
    paused: stats.value.pausedCampaigns || 0,
    completed: stats.value.completedCampaigns || 0,
    draft: stats.value.draftCampaigns || 0
  };
  const hasData = Object.values(breakdown).some(count => count > 0);
  return hasData ? breakdown : null;
});

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

const calculateUtilization = () => {
  if (!stats.value?.totalBudget) return 0;
  return Math.round((stats.value.totalSpent / stats.value.totalBudget) * 100);
};

const calculateAvgCPC = () => {
  if (!stats.value?.totalClicks || !stats.value?.totalSpent) return '0.00';
  const cpc = stats.value.totalSpent / stats.value.totalClicks;
  return cpc.toFixed(2);
};

onMounted(() => {
  store.fetchStats();
});
</script>

<style scoped>
@import "@/assets/css/detail.css";
</style>
