import { defineStore } from "pinia";
import { ref, computed } from "vue";
import * as campaignService from "@/services/campaignService";

export const useCampaignStore = defineStore("campaign", () => {
  // State
  const campaigns = ref([]);
  const currentCampaign = ref(null);
  const stats = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const searchQuery = ref("");
  const toast = ref(null);
  const updatingStatus = ref(false);
  const pagination = ref({ total: 0, page: 1, limit: 10 });

  // Getters (Computed Properties)
  const statusBreakdown = computed(() => {
    if (!stats.value) return null;
    return {
      active: stats.value.activeCampaigns || 0,
      paused: stats.value.pausedCampaigns || 0,
      completed: stats.value.completedCampaigns || 0,
      draft: stats.value.draftCampaigns || 0,
    };
  });
  const budgetUtilization = computed(() => {
    if (!stats.value?.totalBudget) return 0;
    return Math.round((stats.value.totalSpent / stats.value.totalBudget) * 100);
  });
  const averageCPC = computed(() => {
    if (!stats.value?.totalClicks || !stats.value?.totalSpent) return "0.00";
    return (stats.value.totalSpent / stats.value.totalClicks).toFixed(2);
  });
  const filteredCampaigns = computed(() => {
    return campaigns.value.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
  });

  // Helpers
  const setLocalStatus = (id, status) => {
    if (currentCampaign.value?.id === id) currentCampaign.value.status = status;
    const campaign = campaigns.value.find((c) => c.id === id);
    if (campaign) campaign.status = status;
  };

  // Start Actions

  // Get Campaigns
  const fetchCampaigns = async (params = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await campaignService.getCampaigns({
        page: pagination.value.page,
        limit: pagination.value.limit,
        ...params,
      });
      campaigns.value = response.data;
      pagination.value.total = response.total;
    } catch (err) {
      error.value = "Failed to load campaigns";
    } finally {
      loading.value = false;
    }
  };

  // Get Campaign Detail
  const fetchCampaignDetail = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await campaignService.getCampaignById(id);
      currentCampaign.value = response.data;
      return response.data;
    } catch (err) {
      error.value = "Campaign not found";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Create Campaign
  const createCampaign = async (payload) => {
    loading.value = true;
    try {
      const response = await campaignService.createCampaign(payload);
      showToast("Campaign created successfully!", "success");
      return response.data;
    } catch (err) {
      showToast("Failed to create campaign", "error");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update Campaign
  const updateCampaign = async (id, payload) => {
    loading.value = true;
    try {
      const response = await campaignService.updateCampaign(id, payload);
      // Update local state if it's the current one
      if (currentCampaign.value?.id === id) {
        currentCampaign.value = { ...currentCampaign.value, ...payload };
      }
      showToast("Campaign updated successfully!", "success");
      return response.data;
    } catch (err) {
      showToast("Failed to update campaign", "error");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update Status
  const updateStatus = async (id, newStatus) => {
    const oldStatus =
      currentCampaign.value?.status ||
      campaigns.value.find((c) => c.id === id)?.status;

    setLocalStatus(id, newStatus);
    updatingStatus.value = true;

    try {
      await campaignService.updateCampaignStatus(id, newStatus);
      showToast("Status updated successfully!", "success");
    } catch (err) {
      setLocalStatus(id, oldStatus);
      showToast("Failed to update status. Reverting change.", "error");
    } finally {
      updatingStatus.value = false;
    }
  };

  // Get Stats
  const fetchStats = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await campaignService.getStats();
      stats.value = response.data;
    } catch (err) {
      error.value =
        err.error?.message || "Failed to load dashboard statistics.";
    } finally {
      loading.value = false;
    }
  };

  // Toast
  const showToast = (message, type = "success") => {
    toast.value = { message, type };
    setTimeout(() => {
      toast.value = null;
    }, 3000);
  };

  return {
    campaigns,
    currentCampaign,
    stats,
    loading,
    error,
    pagination,
    createCampaign,
    updateCampaign,
    fetchCampaigns,
    fetchCampaignDetail,
    updateStatus,
    fetchStats,
    toast,
    showToast,
    updatingStatus,
  };
});
