import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore("app", () => {
  // State global lain (bukan produk/kategori)
  const isModalOpen = ref(false);
  const isProductModalOpen = ref(false);

  const openModal = () => {
    isModalOpen.value = true;
  };
  const openProductModal = () => {
    isProductModalOpen.value = true;
  };

  return {
    isModalOpen,
    isProductModalOpen,
    openModal,
    openProductModal,
  };
});
