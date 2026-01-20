<template>
  <div class="form-group">
    <label
      v-if="label"
      :for="textareaId"
      class="form-label"
    >
      {{ label }}
      <span v-if="required" class="required" aria-label="required">*</span>
    </label>
    <textarea
      :id="textareaId"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      class="form-input form-textarea"
      :class="{ 'input-error': hasError, 'input-disabled': disabled }"
      :aria-invalid="hasError"
      :aria-describedby="hasError ? `${textareaId}-error` : undefined"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    ></textarea>
    <span
      v-if="error"
      :id="`${textareaId}-error`"
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
    type: String,
    default: ''
  },
  /**
   * Textarea label
   */
  label: {
    type: String,
    default: ''
  },
  /**
   * Number of rows
   */
  rows: {
    type: Number,
    default: 4
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
   * Textarea ID (auto-generated if not provided)
   */
  id: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const textareaId = computed(() => {
  return props.id || `form-textarea-${Math.random().toString(36).substr(2, 9)}`
})

const hasError = computed(() => {
  return !!props.error
})

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
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

.form-textarea {
  width: 100%;
  padding: var(--spacing-3);
  font-size: var(--font-size-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
  font-family: inherit;
  line-height: var(--line-height-normal);
  resize: vertical;
  min-height: 100px;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}

.form-textarea.input-error {
  border-color: var(--color-danger);
}

.form-textarea.input-error:focus {
  border-color: var(--color-danger);
  box-shadow: var(--shadow-focus-error);
}

.form-textarea.input-disabled {
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
