import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/views/Dashboard.vue"),
  },
  {
    path: "/campaigns",
    component: () => import("@/views/CampaignList.vue"),
  },
  {
    path: "/campaigns/new",
    component: () => import("@/views/CampaignForm.vue"),
  },
  {
    path: "/campaigns/:id/edit",
    component: () => import("@/views/CampaignForm.vue"),
  },
  {
    path: "/campaigns/:id",
    component: () => import("@/views/CampaignDetail.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
