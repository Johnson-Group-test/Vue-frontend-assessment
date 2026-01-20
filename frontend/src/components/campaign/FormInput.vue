<template>
  <div class="form-group">
    <label
      v-if="label"
      :for="inputId"
      class="form-label"
    >
      {{ label }}
      <span v-if="required" class="required" aria-label="required">*</span>
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :min="min"
      :max="max"
      :step="step"
      class="form-input"
      :class="{ 'input-error': hasError, 'input-disabled': disabled }"
      :aria-invalid="hasError"
      :aria-describedby="hasError ? `${inputId}-error` : undefined"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />
    <span
      v-if="error"
      :id="`${inputId}-error`"
      class="error-message"
      role="alert"
      aria-live="polite"
    >
      {{ error }}
    </span>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  /**
   * v-model value
   */
  modelValue: {
    type: [String, Number],
    default: ''
  },
  /**
   * Input label
   */
  label: {
    type: String,
    default: ''
  },
  /**
   * Input type
   * @type {'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'url'}
   */
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'email', 'password', 'number', 'date', 'tel', 'url'].includes(value)
  },
  /**
   * Placeholder text
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
   * Input ID (auto-generated if not provided)
   */
  id: {
    type: String,
    default: null
  },
  /**
   * Minimum value (for number/date inputs)
   */
  min: {
    type: [String, Number],
    default: null
  },
  /**
   * Maximum value (for number/date inputs)
   */
  max: {
    type: [String, Number],
    default: null
  },
  /**
   * Step value (for number inputs)
   */
  step: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const inputId = computed(() => {
  return props.id || `form-input-${Math.random().toString(36).substr(2, 9)}`
})

const hasError = computed(() => {
  return !!props.error
})

const handleInput = (event) => {
  const value = props.type === 'number' ? Number(event.target.value) : event.target.value
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

.form-input {
  width: 100%;
  padding: var(--spacing-3);
  font-size: var(--font-size-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
  font-family: inherit;
  line-height: var(--line-height-normal);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}

.form-input.input-error {
  border-color: var(--color-danger);
}

.form-input.input-error:focus {
  border-color: var(--color-danger);
  box-shadow: var(--shadow-focus-error);
}

.form-input.input-disabled {
  background: var(--color-gray-100);
  color: var(--color-text-secondary);
  cursor: not-allowed;
  opacity: var(--opacity-disabled);
}

.error-message {
  display: block;
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-1);
  line-height: var(--line-height-normal);
}
</style>
