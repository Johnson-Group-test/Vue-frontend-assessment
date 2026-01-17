<template>
  <div id="app">
    <AppHeader />
    
    <main class="app-main">
      <router-view />
    </main>
    
    <AppFooter />
    <transition name="toast">
      <div v-if="toast" class="toast-notification" :class="toast.type">
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import AppHeader from '@/components/global/AppHeader.vue';
import AppFooter from '@/components/global/AppFooter.vue';
import { useCampaignStore } from '@/stores/campaignStore';
import { storeToRefs } from 'pinia';
const store = useCampaignStore();
const { toast } = storeToRefs(store); 
</script>

<style scoped>
@import "./assets/css/detail.css";
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.app-main {
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
}
.toast-notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 9999;
}

.success { background: #10b981 !important; }
.error { background: #ef4444 !important; }

.toast-enter-active, .toast-leave-active { transition: all 0.4s ease; }
.toast-enter-from { opacity: 0; transform: translateY(20px); }
.toast-leave-to { opacity: 0; transform: translateX(20px); }
</style>
