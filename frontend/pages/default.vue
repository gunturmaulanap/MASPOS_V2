<template>
  <div class="bg-gray-100 min-h-screen relative">
    <div class="mx-auto my-auto py-6 px-12">
      <Header
        :categories="appStore.categories"
        :selectedCategory="appStore.selectedCategory"
        :searchQuery="appStore.searchQuery"
        @update:searchQuery="(val) => (appStore.searchQuery = val)"
        @filterCategory="(cat) => (appStore.selectedCategory = cat)"
        @openModal="appStore.isModalOpen = true"
        @openProductModal="appStore.isProductModalOpen = true"
      />
      <!-- Main Content Slot -->
      <main class="py-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import Header from "../src/components/Header.vue";
import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();
// akses: appStore.products, appStore.categories, dst
</script>