<template>
  <div class="campaign-form">
    <div class="container">
      <PageHeader :title="pageTitle">
        <template #actions>
          <button
            @click="handleCancel"
            class="btn btn-secondary"
            type="button"
            :aria-label="isEditMode ? 'Cancel and return to campaign detail' : 'Cancel and return to campaigns list'"
          >
            Cancel
          </button>
        </template>
      </PageHeader>

      <div
        id="main-content"
        aria-live="polite"
      >
        <LoadingSpinner
          v-if="loadingCampaign"
          message="Loading campaign data..."
          size="md"
        />

        <template v-else>
          <!-- Show error alert above form if there's a loading/initial error and form is not visible -->
          <ErrorAlert
            v-if="error && !formVisible"
            :message="error"
            :retryable="false"
          />

          <!-- Always show form when not loading, even if there are submission errors -->
          <form
            v-if="formVisible || !error"
            @submit.prevent="submitForm"
            class="campaign-form-content"
            :aria-label="formAriaLabel"
            novalidate
          >
            <!-- Show submission errors at top of form -->
            <ErrorAlert
              v-if="error && formVisible"
              :message="error"
              :retryable="false"
              class="form-error-alert"
            />
        <FormInput
          id="name"
          v-model="formData.name"
          label="Campaign Name"
          type="text"
          placeholder="Enter campaign name"
          :error="errors.name"
          :required="true"
          @blur="handleFieldBlur('name', formData.name)"
        />

        <FormSelect
          id="status"
          v-model="formData.status"
          label="Status"
          :options="statusOptions"
          :error="errors.status"
          :required="true"
          @blur="handleFieldBlur('status', formData.status)"
        />

        <FormInput
          id="budget"
          v-model.number="formData.budget"
          label="Budget (USD)"
          type="number"
          placeholder="Enter budget amount"
          :min="1"
          :step="1"
          :error="errors.budget"
          :required="true"
          @blur="handleFieldBlur('budget', formData.budget)"
        />

        <div class="form-row">
          <FormInput
            id="startDate"
            v-model="formData.startDate"
            label="Start Date"
            type="date"
            :error="errors.startDate"
            :required="true"
            @change="handleFieldBlur('startDate', formData.startDate)"
            @blur="handleFieldBlur('endDate', formData.endDate, formData.startDate)"
          />

          <FormInput
            id="endDate"
            v-model="formData.endDate"
            label="End Date"
            type="date"
            :min="getMinEndDate"
            :error="errors.endDate"
            :required="true"
            @change="handleFieldBlur('endDate', formData.endDate, formData.startDate)"
            @blur="handleFieldBlur('endDate', formData.endDate, formData.startDate)"
          />
        </div>

        <FormTextarea
          id="description"
          v-model="formData.description"
          label="Description"
          :rows="4"
          placeholder="Enter campaign description (optional)"
        />

        <FormInput
          id="targetAudience"
          v-model="formData.targetAudience"
          label="Target Audience"
          type="text"
          placeholder="e.g., 18-45, US, Canada (optional)"
        />

        <div class="form-actions">
          <button
            type="button"
            @click="handleCancel"
            class="btn btn-secondary"
            :disabled="isSubmitting"
            :aria-label="isEditMode ? 'Cancel and return to campaign detail' : 'Cancel and return to campaigns list'"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isSubmitting"
            :aria-busy="isSubmitting"
            aria-label="Submit campaign form"
          >
            <span v-if="isSubmitting" aria-hidden="true">{{ isEditMode ? 'Updating...' : 'Creating...' }}</span>
            <span v-else>{{ isEditMode ? 'Update Campaign' : 'Create Campaign' }}</span>
          </button>
        </div>
      </form>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCampaignsStore } from '@/stores/campaigns'
import { storeToRefs } from 'pinia'
import { useFormValidation, useStatusClass } from '@/composables'
import { FORM_DEFAULTS } from '@/constants'
import { getErrorMessage, getValidationErrors } from '@/utils/errorMessages'
import PageHeader from '@/components/layout/PageHeader.vue'
import ErrorAlert from '@/components/common/ErrorAlert.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import FormInput from '@/components/campaign/FormInput.vue'
import FormSelect from '@/components/campaign/FormSelect.vue'
import FormTextarea from '@/components/campaign/FormTextarea.vue'

const route = useRoute()
const router = useRouter()
const store = useCampaignsStore()

// Use store state for error
const { error: storeError } = storeToRefs(store)

// Form data
const formData = ref({
  name: '',
  status: FORM_DEFAULTS.status,
  budget: '',
  startDate: '',
  endDate: '',
  description: '',
  targetAudience: ''
})

// Form state
const isSubmitting = ref(false)
const localError = ref(null)
const loadingCampaign = ref(false)

// Check if we're in edit mode
const isEditMode = computed(() => !!route.params.id && route.name === 'campaign-edit')

// Page title based on mode
const pageTitle = computed(() => {
  return isEditMode.value ? 'Edit Campaign' : 'Create Campaign'
})

// Form aria label based on mode
const formAriaLabel = computed(() => {
  return isEditMode.value ? 'Edit campaign form' : 'Create new campaign form'
})

// Form validation
const {
  errors,
  validateCampaignForm,
  validateField,
  validateFieldName,
  validateFieldBudget,
  validateFieldStartDate,
  validateFieldEndDate,
  validateFieldStatus
} = useFormValidation()

// Status options
const { getStatusOptions } = useStatusClass()
const statusOptions = getStatusOptions()

// Get minimum date for end date input
const getMinEndDate = computed(() => {
  if (formData.value.startDate) {
    return formData.value.startDate
  }
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Combined error from store or local
const error = computed(() => {
  return storeError.value || localError.value
})

// Determine if form should be visible
// Form is visible if we have campaign data (edit mode) or we're in create mode
const formVisible = computed(() => {
  // In edit mode, form is visible if we have campaign data or if there's no loading error
  if (isEditMode.value) {
    return !loadingCampaign.value && (store.currentCampaign || !error.value)
  }
  // In create mode, form is always visible when not loading
  return !loadingCampaign.value
})

// Handle field blur validation
const handleFieldBlur = (fieldName, value, additionalValue = null) => {
  validateField(fieldName, value, additionalValue)
}

// Handle cancel button
const handleCancel = () => {
  if (isEditMode.value && route.params.id) {
    router.push(`/campaigns/${route.params.id}`)
  } else {
    router.push('/')
  }
}

// Load campaign data for edit mode
const loadCampaignData = async (id) => {
  loadingCampaign.value = true
  localError.value = null
  store.clearError()

  try {
    await store.fetchCampaignById(id, false) // Don't use cache, fetch fresh data
    
    const campaign = store.currentCampaign
    
    if (campaign) {
      // Populate form with existing campaign data
      formData.value = {
        name: campaign.name || '',
        status: campaign.status || FORM_DEFAULTS.status,
        budget: campaign.budget || '',
        startDate: campaign.startDate || '',
        endDate: campaign.endDate || '',
        description: campaign.description || '',
        targetAudience: campaign.targetAudience || ''
      }
    } else {
      localError.value = 'Campaign not found'
      // Redirect to list after a delay
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
  } catch (err) {
    localError.value = getErrorMessage(err, 'Failed to load campaign. Please try again.')
    console.error('Error loading campaign:', err)
  } finally {
    loadingCampaign.value = false
  }
}

// Watch route params to load campaign data in edit mode
watch(
  () => route.params.id,
  async (campaignId) => {
    if (campaignId && route.name === 'campaign-edit') {
      await loadCampaignData(campaignId)
    }
  },
  { immediate: true }
)

// Submit form
const submitForm = async () => {
  // Clear previous errors
  localError.value = null
  store.clearError()

  // Validate form
  if (!validateCampaignForm(formData.value)) {
    return
  }

  isSubmitting.value = true

  try {
    const campaignData = {
      name: formData.value.name.trim(),
      status: formData.value.status,
      budget: Number(formData.value.budget),
      startDate: formData.value.startDate,
      endDate: formData.value.endDate,
      description: formData.value.description.trim() || undefined,
      targetAudience: formData.value.targetAudience.trim() || undefined
    }

    if (isEditMode.value) {
      // Update existing campaign
      await store.updateCampaign(route.params.id, campaignData)

      // Redirect to campaign detail page with success query parameter
      router.push({
        path: `/campaigns/${route.params.id}`,
        query: { success: 'updated' }
      })
    } else {
      // Create new campaign
      await store.createCampaign(campaignData)

      // Redirect to campaign list with success query parameter
      router.push({
        path: '/',
        query: { success: 'created' }
      })
    }
  } catch (err) {
    // Handle API errors
    const validationErrors = getValidationErrors(err)
    
    if (Object.keys(validationErrors).length > 0) {
      // Set validation errors from server
      Object.keys(validationErrors).forEach((field) => {
        errors.value[field] = validationErrors[field]
      })
    } else {
      // Use error message utility for consistent error messages
      const fallbackMessage = isEditMode.value 
        ? 'Failed to update campaign. Please try again.' 
        : 'Failed to create campaign. Please try again.'
      localError.value = getErrorMessage(err, fallbackMessage)
    }
    console.error(`Error ${isEditMode.value ? 'updating' : 'creating'} campaign:`, err)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.campaign-form {
  width: 100%;
  position: relative;
}

.campaign-form-content {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-8);
  box-shadow: var(--shadow-sm);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-4);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-4);
  margin-top: var(--spacing-8);
  padding-top: var(--spacing-6);
  border-top: 1px solid var(--color-border);
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

.btn:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-white);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.btn-secondary {
  background: var(--color-gray-100);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-gray-200);
}

.form-error-alert {
  margin-bottom: var(--spacing-6);
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .campaign-form-content {
    padding: var(--spacing-6);
  }
}
</style>
