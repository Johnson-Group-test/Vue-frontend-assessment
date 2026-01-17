<template>
  <div class="campaign-form-page">
    <div class="container">
      <!-- Back Button -->
      <button @click="goBack" class="back-btn">
        ← Back to Campaigns
      </button>

      <!-- Form Header -->
      <div v-show="!loading" class="form-header">
        <h1 class="form-title">{{ isEditMode ? 'Edit' : 'Create New' }} Campaign</h1>
        <p class="form-subtitle">
          {{ isEditMode ? 'Modify campaign details below' : 'Fill in the details to create a new marketing campaign' }}
        </p>
      </div>

      <!-- Loading Spinner for Data Fetching -->
      <LoadingSpinner v-if="loading" message="Loading campaign data..." />

      <!-- Error Message for Data Fetching -->
      <ErrorMessage
        v-else-if="fetchError"
        title="Failed to Load Campaign"
        :message="fetchError"
        :retry="true"
        @retry="loadCampaignData"
      />

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="campaign-form">
        <!-- Campaign Name -->
        <div class="form-group">
          <label for="name" class="form-label">
            Campaign Name <span class="required">*</span>
          </label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            class="form-input"
            :class="{ 'error': errors.name }"
            placeholder="e.g., Summer Sale 2024"
            @blur="validateField('name')"
          />
          <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
        </div>

        <!-- Status -->
        <div class="form-group">
          <label for="status" class="form-label">
            Status <span class="required">*</span>
          </label>
          <select
            id="status"
            v-model="formData.status"
            class="form-input"
            :class="{ 'error': errors.status }"
            @blur="validateField('status')"
          >
            <option value="">Select status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
          </select>
          <span v-if="errors.status" class="error-text">{{ errors.status }}</span>
        </div>

        <!-- Budget -->
        <div class="form-group">
          <label for="budget" class="form-label">
            Budget ($) <span class="required">*</span>
          </label>
          <input
            id="budget"
            v-model.number="formData.budget"
            type="number"
            min="0"
            step="100"
            class="form-input"
            :class="{ 'error': errors.budget }"
            placeholder="e.g., 50000"
            @blur="validateField('budget')"
          />
          <span v-if="errors.budget" class="error-text">{{ errors.budget }}</span>
        </div>

        <!-- Date Range -->
        <div class="form-row">
          <div class="form-group">
            <label for="startDate" class="form-label">
              Start Date <span class="required">*</span>
            </label>
            <input
              id="startDate"
              v-model="formData.startDate"
              type="date"
              class="form-input"
              :class="{ 'error': errors.startDate }"
              @blur="validateField('startDate')"
              @change="validateDateRange"
            />
            <span v-if="errors.startDate" class="error-text">{{ errors.startDate }}</span>
          </div>

          <div class="form-group">
            <label for="endDate" class="form-label">
              End Date <span class="required">*</span>
            </label>
            <input
              id="endDate"
              v-model="formData.endDate"
              type="date"
              class="form-input"
              :class="{ 'error': errors.endDate }"
              :min="formData.startDate"
              @blur="validateField('endDate')"
              @change="validateDateRange"
            />
            <span v-if="errors.endDate" class="error-text">{{ errors.endDate }}</span>
          </div>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="description" class="form-label">
            Description <span class="required">*</span>
          </label>
          <textarea
            id="description"
            v-model="formData.description"
            class="form-input form-textarea"
            :class="{ 'error': errors.description }"
            placeholder="Describe your campaign goals and strategy..."
            rows="4"
            @blur="validateField('description')"
          ></textarea>
          <span v-if="errors.description" class="error-text">{{ errors.description }}</span>
        </div>

        <!-- Target Audience -->
        <div class="form-group">
          <label for="targetAudience" class="form-label">
            Target Audience <span class="required">*</span>
          </label>
          <input
            id="targetAudience"
            v-model="formData.targetAudience"
            type="text"
            class="form-input"
            :class="{ 'error': errors.targetAudience }"
            placeholder="e.g., 18-45, US, Canada"
            @blur="validateField('targetAudience')"
          />
          <span v-if="errors.targetAudience" class="error-text">{{ errors.targetAudience }}</span>
        </div>

        <!-- Submit Error -->
        <ErrorMessage
          v-if="submitError"
          title="Submission Failed"
          :message="submitError"
          type="error"
        />

        <!-- Form Actions -->
        <div class="form-actions">
          <button
            type="button"
            @click="goBack"
            class="btn btn-secondary"
            :disabled="submitting"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="submitting"
          >
            <span v-if="submitting">{{ isEditMode ? 'Updating...' : 'Creating...' }}</span>
            <span v-else>{{ isEditMode ? 'Update' : 'Create' }} Campaign</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import { useCampaignStore } from '@/stores/campaignStore';
import { storeToRefs } from 'pinia';

const store = useCampaignStore();
const { loading, error: fetchError } = storeToRefs(store);
const router = useRouter();
const route = useRoute();
const isEditMode = computed(() => !!route.params.id);
const submitting = ref(false);
const submitError = ref('');


const formData = reactive({
  name: '',
  status: '',
  budget: null,
  startDate: '',
  endDate: '',
  description: '',
  targetAudience: ''
});

const errors = reactive({
  name: '',
  status: '',
  budget: '',
  startDate: '',
  endDate: '',
  description: '',
  targetAudience: ''
});

const loadCampaignData = async () => {
  if (!isEditMode.value) return;
  try {
    const campaign = await store.fetchCampaignDetail(route.params.id);
    formData.name = campaign.name;
    formData.status = campaign.status;
    formData.budget = campaign.budget;
    formData.startDate = campaign.startDate;
    formData.endDate = campaign.endDate;
    formData.description = campaign.description;
    formData.targetAudience = campaign.targetAudience;
  } catch (err) {
    console.error('Error loading campaign data:', err);
  }
};

const validationRules = {
  name: (value) => {
    if (!value.trim()) return 'Campaign name is required';
    if (value.trim().length < 3) return 'Campaign name must be at least 3 characters';
    return '';
  },
  
  status: (value) => {
    if (!value) return 'Please select a status';
    return '';
  },
  
  budget: (value) => {
    if (value === null || value === undefined || value === '') return 'Budget is required';
    if (value <= 0) return 'Budget must be greater than 0';
    return '';
  },
  
  startDate: (value) => {
    if (!value) return 'Start date is required';
    return '';
  },
  
  endDate: (value) => {
    if (!value) return 'End date is required';
    return '';
  },
  
  description: (value) => {
    if (!value.trim()) return 'Description is required';
    if (value.trim().length < 10) return 'Description must be at least 10 characters';
    return '';
  },
  
  targetAudience: (value) => {
    if (!value.trim()) return 'Target audience is required';
    return '';
  }
};

const validateField = (fieldName) => {
  const validator = validationRules[fieldName];
  if (validator) {
    errors[fieldName] = validator(formData[fieldName]);
  }
};

const validateDateRange = () => {
  if (formData.startDate && formData.endDate) {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end < start) {
      errors.endDate = 'End date must be after start date';
    } else {
      errors.endDate = '';
    }
  }
};

const validateForm = () => {
  Object.keys(validationRules).forEach(field => {
    validateField(field);
  });
  return !Object.values(errors).some(error => error !== '');
};

const handleSubmit = async () => {
  submitError.value = '';
  if (!validateForm()) {
    submitError.value = 'Please fix the errors above before submitting';
    return;
  }
  submitting.value = true;
  try {
    const payload = {
      name: formData.name.trim(),
      status: formData.status,
      budget: formData.budget,
      startDate: formData.startDate,
      endDate: formData.endDate,
      description: formData.description.trim(),
      targetAudience: formData.targetAudience.trim()
    };
    if (isEditMode.value) {
      await store.updateCampaign(route.params.id, payload);
    } else {
      await store.createCampaign(payload);
    }
    router.push(isEditMode.value ? `/campaigns/${route.params.id}` : '/');
  } catch (err) {
    submitError.value = err.error?.message || 'Failed to save campaign. Please try again.';
    console.error('Error saving campaign:', err);
  } finally {
    submitting.value = false;
  }
};

const goBack = () => {
  if (isEditMode.value) {
    router.push(`/campaigns/${route.params.id}`);
  } else {
    router.push('/');
  }
};
onMounted(loadCampaignData);
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.back-btn {
  background: white;
  border: 1px solid #e5e7eb;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #374151;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: all 0.2s;
  font-weight: 500;
}

.back-btn:hover {
  background: #f9fafb;
  border-color: #0066cc;
  color: #0066cc;
}

.form-header {
  margin-bottom: 2.5rem;
  text-align: center;
}

.form-title {
  margin: 0 0 0.5rem 0;
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
}

.form-subtitle {
  margin: 0;
  font-size: 1.125rem;
  color: #6b7280;
}

.campaign-form {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.75rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.required {
  color: #dc2626;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.form-input.error {
  border-color: #dc2626;
}

.form-input.error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.error-text {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #dc2626;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
  padding-top: 2rem;
}

.btn {
  flex: 1;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #0066cc;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0052a3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.btn-secondary:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
}

/* Responsive Design */
@media (max-width: 640px) {
  .container {
    padding: 1rem;
  }

  .campaign-form {
    padding: 1.5rem;
  }

  .form-title {
    font-size: 1.75rem;
  }

  .form-subtitle {
    font-size: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
  }
}
</style>
