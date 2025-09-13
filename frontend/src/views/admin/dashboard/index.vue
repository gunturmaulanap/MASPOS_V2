<script setup>
import { ref, onMounted, computed } from "vue";
import Cookies from "js-cookie";
import api from "@/services/api";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/appStore";
import { useCartStore } from "@/stores/cartStore";
import ModalKategori from "@/components/ModalKategori.vue";
import ModalProduk from "@/components/ModalProduk.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import { useProductStore } from "@/stores/productStore";
import { useCategoryStore } from "@/stores/categoryStore";

const router = useRouter();
const appStore = useAppStore();
const cartStore = useCartStore();
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const token = Cookies.get("token");

const filteredProducts = computed(() => productStore.filteredProducts);

const baseURL = import.meta.env.VITE_API_BASE_URL;

// Modal delete state
const showDeleteModal = ref(false);
const productToDelete = ref(null);

function openDeleteModal(productId) {
  productToDelete.value = productId;
  showDeleteModal.value = true;
}
function closeDeleteModal() {
  showDeleteModal.value = false;
  productToDelete.value = null;
}
async function confirmDelete() {
  if (productToDelete.value) {
    await productStore.deleteProduct(productToDelete.value);
    closeDeleteModal();
  }
}

onMounted(async () => {
  if (localStorage.getItem("showLoginToast")) {
    localStorage.removeItem("showLoginToast");
  }

  // Load data dengan error handling
  try {
    await categoryStore.fetchCategories();
  } catch (error) {
    console.warn("Categories not available:", error.message);
  }

  try {
    await productStore.fetchProducts();
  } catch (error) {
    console.warn("Products not available:", error.message);
  }

  cartStore.restoreCart();
});
</script>

<template>
  <!-- Produk -->
  <div class="flex flex-wrap gap-4 items-center justify-center">
    <div
      v-for="(product, index) in filteredProducts"
      :key="product.id || index"
      class="bg-white rounded-xl p-2 shadow flex flex-col items-center w-fit relative"
      style="width: 270px"
    >
      <div class="relative w-full flex justify-center">
        <img
          :src="
            product.img && product.img.startsWith('http')
              ? product.img
              : baseURL + product.img
          "
          alt="product image"
          class="w-66 h-60 object-cover rounded-xl"
        />
        <!-- Tombol delete di kanan bawah gambar -->
        <button
          @click="openDeleteModal(product.id)"
          class="absolute bottom-2 right-2 bg-white rounded-lg p-2 shadow hover:bg-gray-300 transition"
          title="Hapus Produk"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="red"
            class="size-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      </div>
      <h3 class="text-gray-800 font-medium mt-2">{{ product.name }}</h3>
      <p class="text-green-600 font-semibold">
        Rp {{ Number(product.price).toLocaleString("id-ID") }}
      </p>
      <button @click="cartStore.addToCart(product)" class="btn-cart mt-2">
        + Keranjang
      </button>
    </div>
  </div>

  <ModalKategori />
  <ModalProduk />
  <ModalDelete
    :show="showDeleteModal"
    :onCancel="closeDeleteModal"
    :onDelete="confirmDelete"
  />
</template>