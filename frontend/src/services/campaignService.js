import api from "./api";

// Get all campaigns with optional filters
export const getCampaigns = (params = {}) => {
  return api.get("/campaigns", { params });
};

// Get a single campaign by ID
export const getCampaignById = (id) => {
  return api.get(`/campaigns/${id}`);
};

// Create a new campaign
export const createCampaign = (campaignData) => {
  return api.post("/campaigns", campaignData);
};

// Update an existing campaign
export const updateCampaign = (id, campaignData) => {
  return api.put(`/campaigns/${id}`, campaignData);
};

// Delete a campaign
export const deleteCampaign = (id) => {
  return api.delete(`/campaigns/${id}`);
};

// Get aggregated dashboard statistics
export const getStats = () => {
  return api.get("/stats");
};

// Update campaign status
export const updateCampaignStatus = (id, status) => {
  return api.patch(`/campaigns/${id}/status`, { status });
};
