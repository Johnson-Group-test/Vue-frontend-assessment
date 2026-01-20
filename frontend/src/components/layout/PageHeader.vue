<template>
  <div class="page-header">
    <h1 class="page-title">{{ title }}</h1>
    <div v-if="$slots.actions || actions" class="page-actions">
      <slot name="actions">
        <component
          v-if="actions"
          :is="action.type === 'button' ? 'button' : 'router-link'"
          v-for="(action, index) in actions"
          :key="index"
          :to="action.to"
          :class="['btn', `btn-${action.variant || 'primary'}`]"
          @click="action.onClick"
        >
          {{ action.label }}
        </component>
      </slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  /**
   * Page title
   */
  title: {
    type: String,
    required: true
  },
  /**
   * Array of action buttons (optional, can use slot instead)
   * @type {Array<{type: 'button' | 'link', label: string, variant?: string, to?: string, onClick?: Function}>}
   */
  actions: {
    type: Array,
    default: null
  }
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-8);
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.page-title {
  margin: 0;
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  flex: 1;
}

.page-actions {
  display: flex;
  gap: var(--spacing-3);
  align-items: center;
}

.btn {
  padding: var(--spacing-3) var(--spacing-6);
  border: none;
  border-radius: var(--radius-base);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all var(--transition-base);
  font-family: inherit;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-white);
}

.btn-primary:hover {
  background: var(--color-primary-dark);
}

.btn-secondary {
  background: var(--color-gray-100);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-gray-200);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .page-title {
    font-size: var(--font-size-3xl);
  }

  .page-actions {
    width: 100%;
  }

  .btn {
    flex: 1;
    text-align: center;
  }
}
</style>
