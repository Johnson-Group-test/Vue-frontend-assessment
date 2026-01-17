import { ref, computed } from "vue";
import {
  getCampaignById,
  deleteCampaign as apiDeleteCampaign,
  updateCampaignStatus,
} from "@/services/campaignService";

export function useCampaign() {
  const campaign = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const deleting = ref(false);
  const updatingStatus = ref(false);

  // Computed properties
  const spentPercentage = computed(() => {
    if (!campaign.value || !campaign.value.budget) return 0;
    return Math.min(
      Math.round((campaign.value.spent / campaign.value.budget) * 100),
      100,
    );
  });

  // Actions
  const fetchCampaign = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await getCampaignById(id);
      campaign.value = response.data;
    } catch (err) {
      error.value = err.error?.message || "Failed to load campaign";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const changeStatus = async (id, newStatus) => {
    updatingStatus.value = true;
    try {
      await updateCampaignStatus(id, newStatus);
      if (campaign.value && campaign.value.id === id) {
        campaign.value.status = newStatus;
      }
    } catch (err) {
      console.error("Status update failed:", err);
      throw err;
    } finally {
      updatingStatus.value = false;
    }
  };

  const removeCampaign = async (id) => {
    deleting.value = true;
    try {
      await apiDeleteCampaign(id);
      campaign.value = null;
    } catch (err) {
      console.error("Deletion failed:", err);
      throw err;
    } finally {
      deleting.value = false;
    }
  };

  return {
    campaign,
    loading,
    error,
    deleting,
    updatingStatus,
    spentPercentage,
    fetchCampaign,
    changeStatus,
    removeCampaign,
  };
}
