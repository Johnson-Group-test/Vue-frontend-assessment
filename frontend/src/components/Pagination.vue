<template>
  <nav v-if="totalPages > 1" class="pagination" aria-label="Pagination">
    <!-- Previous Button -->
    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="pagination-btn"
      aria-label="Previous page"
    >
      &larr; Prev
    </button>

    <!-- Page Numbers -->
    <div class="page-numbers">
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="changePage(page)"
        :class="['page-number', { active: currentPage === page }]"
        :aria-current="currentPage === page ? 'page' : undefined"
      >
        {{ page }}
      </button>
      
      <span v-if="showEllipsis" class="ellipsis">...</span>
      
      <button
        v-if="showLastPage"
        @click="changePage(totalPages)"
        :class="['page-number', { active: currentPage === totalPages }]"
      >
        {{ totalPages }}
      </button>
    </div>

    <!-- Next Button -->
    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="pagination-btn"
      aria-label="Next page"
    >
      Next &rarr;
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  maxVisible: {
    type: Number,
    default: 5
  }
});

const emit = defineEmits(['update:currentPage']);

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, props.currentPage - Math.floor(props.maxVisible / 2));
  const end = Math.min(props.totalPages, start + props.maxVisible - 1);
  
  // Adjust start if end is at totalPages
  const finalStart = Math.max(1, end - props.maxVisible + 1);
  
  for (let i = finalStart; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const showEllipsis = computed(() => {
  if (visiblePages.value.length === 0) return false;
  return visiblePages.value[visiblePages.value.length - 1] < props.totalPages - 1;
});

const showLastPage = computed(() => {
  if (visiblePages.value.length === 0) return false;
  return visiblePages.value[visiblePages.value.length - 1] < props.totalPages;
});

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('update:currentPage', page);
  }
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem 0;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  color: #374151;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #0066cc;
  color: #0066cc;
  background-color: #f9fafb;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.page-number {
  min-width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  color: #374151;
  font-weight: 500;
}

.page-number:hover {
  border-color: #0066cc;
  color: #0066cc;
}

.page-number.active {
  background: #0066cc;
  color: white;
  border-color: #0066cc;
}

.ellipsis {
  color: #9ca3af;
  padding: 0 0.5rem;
  font-weight: 600;
}

@media (max-width: 640px) {
  .pagination {
    gap: 0.5rem;
  }
  
  .pagination-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
  
  .page-number {
    min-width: 2rem;
    height: 2rem;
    font-size: 0.875rem;
  }
}
</style>
