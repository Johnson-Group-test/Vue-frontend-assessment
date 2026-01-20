<template>
  <button
    @click="handleClick"
    class="back-button"
    :aria-label="ariaLabel"
    type="button"
  >
    <svg
      class="back-icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 12L6 8L10 4"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <span class="back-text">{{ label }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  /**
   * Route path to navigate to
   */
  to: {
    type: String,
    default: '/'
  },
  /**
   * Button label
   */
  label: {
    type: String,
    default: 'Back'
  },
  /**
   * Custom click handler (optional, will use router.push if not provided)
   */
  onClick: {
    type: Function,
    default: null
  }
})

const router = useRouter()

const ariaLabel = computed(() => {
  return props.label ? `${props.label} (navigate back)` : 'Navigate back'
})

const handleClick = () => {
  if (props.onClick && typeof props.onClick === 'function') {
    props.onClick()
  } else {
    router.push(props.to)
  }
}
</script>

<style scoped>
.back-button {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  background: transparent;
  border: none;
  color: var(--color-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  padding: var(--spacing-2) 0;
  transition: color var(--transition-base);
  font-family: inherit;
}

.back-button:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

.back-button:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.back-icon {
  flex-shrink: 0;
  transition: transform var(--transition-base);
}

.back-button:hover .back-icon {
  transform: translateX(-2px);
}

.back-text {
  line-height: 1;
}
</style>
