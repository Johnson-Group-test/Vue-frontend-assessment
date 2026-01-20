<template>
  <div class="skeleton-loader" :class="loaderClass">
    <template v-if="type === 'card'">
      <div
        v-for="i in count"
        :key="i"
        class="skeleton-card"
      >
        <div class="skeleton-header">
          <div class="skeleton-line skeleton-title"></div>
          <div class="skeleton-badge"></div>
        </div>
        <div class="skeleton-body">
          <div
            v-for="j in 4"
            :key="j"
            class="skeleton-line"
            :class="{ 'skeleton-short': j === 4 }"
          ></div>
        </div>
      </div>
    </template>

    <template v-else-if="type === 'text'">
      <div
        v-for="i in count"
        :key="i"
        class="skeleton-text"
      >
        <div
          v-for="j in lines"
          :key="j"
          class="skeleton-line"
          :class="{ 'skeleton-short': j === lines && shortLast }"
        ></div>
      </div>
    </template>

    <template v-else-if="type === 'avatar'">
      <div
        v-for="i in count"
        :key="i"
        class="skeleton-avatar"
      >
        <div class="skeleton-circle"></div>
        <div class="skeleton-text">
          <div class="skeleton-line skeleton-short"></div>
          <div class="skeleton-line skeleton-short"></div>
        </div>
      </div>
    </template>

    <template v-else>
      <div
        v-for="i in count"
        :key="i"
        class="skeleton-line"
      ></div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /**
   * Type of skeleton loader
   * @type {'card' | 'text' | 'avatar'}
   */
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['card', 'text', 'avatar'].includes(value)
  },
  /**
   * Number of skeleton items to show
   */
  count: {
    type: Number,
    default: 1,
    validator: (value) => value > 0
  },
  /**
   * Number of lines for text type
   */
  lines: {
    type: Number,
    default: 3,
    validator: (value) => value > 0
  },
  /**
   * Whether last line should be shorter (text type)
   */
  shortLast: {
    type: Boolean,
    default: true
  },
  /**
   * Additional CSS classes
   */
  class: {
    type: String,
    default: ''
  }
})

const loaderClass = computed(() => {
  return {
    [`skeleton-${props.type}`]: true,
    [props.class]: !!props.class
  }
})
</script>

<style scoped>
.skeleton-loader {
  width: 100%;
}

/* Base skeleton animation */
@keyframes skeleton-loading {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton-line {
  height: 12px;
  background: linear-gradient(
    90deg,
    var(--color-gray-200) 0px,
    var(--color-gray-100) 40px,
    var(--color-gray-200) 80px
  );
  background-size: 200px 100%;
  border-radius: var(--radius-base);
  animation: skeleton-loading 1.5s ease-in-out infinite;
  margin-bottom: var(--spacing-2);
}

.skeleton-line:last-child {
  margin-bottom: 0;
}

.skeleton-short {
  width: 60%;
}

/* Card Skeleton */
.skeleton-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-4);
}

.skeleton-card:last-child {
  margin-bottom: 0;
}

.skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-4);
  gap: var(--spacing-2);
}

.skeleton-title {
  height: 20px;
  width: 70%;
}

.skeleton-badge {
  width: 60px;
  height: 24px;
  border-radius: var(--radius-xl);
  background: linear-gradient(
    90deg,
    var(--color-gray-200) 0px,
    var(--color-gray-100) 40px,
    var(--color-gray-200) 80px
  );
  background-size: 200px 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

/* Text Skeleton */
.skeleton-text {
  margin-bottom: var(--spacing-4);
}

.skeleton-text:last-child {
  margin-bottom: 0;
}

/* Avatar Skeleton */
.skeleton-avatar {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
}

.skeleton-avatar:last-child {
  margin-bottom: 0;
}

.skeleton-circle {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: linear-gradient(
    90deg,
    var(--color-gray-200) 0px,
    var(--color-gray-100) 40px,
    var(--color-gray-200) 80px
  );
  background-size: 200px 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  flex-shrink: 0;
}

.skeleton-avatar .skeleton-text {
  flex: 1;
  margin: 0;
}
</style>
