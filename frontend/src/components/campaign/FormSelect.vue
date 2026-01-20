<template>
  <div class="form-group">
    <label
      v-if="label"
      :for="selectId"
      class="form-label"
    >
      {{ label }}
      <span v-if="required" class="required" aria-label="required">*</span>
    </label>
    <select
      :id="selectId"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      class="form-input form-select"
      :class="{ 'input-error': hasError, 'input-disabled': disabled }"
      :aria-invalid="hasError"
      :aria-describedby="hasError ? `${selectId}-error` : undefined"
      @change="handleChange"
      @blur="handleBlur"
      @focus="handleFocus"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <span
      v-if="error"
      :id="`${selectId}-error`"
      class="error-message"
      role="alert"
      aria-live="polite"
    >
      {{ error }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /**
   * v-model value
   */
  modelValue: {
    type: [String, Number],
    default: ''
  },
  /**
   * Select label
   */
  label: {
    type: String,
    default: ''
  },
  /**
   * Select options array
   * @type {Array<{value: string|number, label: string}>}
   */
  options: {
    type: Array,
    required: true
  },
  /**
   * Placeholder text (shows as disabled first option)
   */
  placeholder: {
    type: String,
    default: ''
  },
  /**
   * Error message
   */
  error: {
    type: String,
    default: null
  },
  /**
   * Whether field is required
   */
  required: {
    type: Boolean,
    default: false
  },
  /**
   * Whether field is disabled
   */
  disabled: {
    type: Boolean,
    default: false
  },
  /**
   * Select ID (auto-generated if not provided)
   */
  id: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const selectId = computed(() => {
  return props.id || `form-select-${Math.random().toString(36).substr(2, 9)}`
})

const hasError = computed(() => {
  return !!props.error
})

const handleChange = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
}

const handleBlur = (event) => {
  emit('blur', event)
}

const handleFocus = (event) => {
  emit('focus', event)
}
</script>

<style scoped>
.form-group {
  margin-bottom: var(--spacing-6);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-2);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.required {
  color: var(--color-danger);
  margin-left: var(--spacing-1);
}

.form-select {
  width: 100%;
  padding: var(--spacing-3);
  font-size: var(--font-size-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
  font-family: inherit;
  line-height: var(--line-height-normal);
  background-color: var(--color-white);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--spacing-3) center;
  padding-right: var(--spacing-10);
}

.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}

.form-select.input-error {
  border-color: var(--color-danger);
}

.form-select.input-error:focus {
  border-color: var(--color-danger);
  box-shadow: var(--shadow-focus-error);
}

.form-select.input-disabled {
  background-color: var(--color-gray-100);
  color: var(--color-text-secondary);
  cursor: not-allowed;
  opacity: var(--opacity-disabled);
}

.form-select option {
  padding: var(--spacing-2);
}

.error-message {
  display: block;
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-1);
  line-height: var(--line-height-normal);
}
</style>
