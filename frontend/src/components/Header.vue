<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
const isMenuOpen = ref(false);
import { useRouter, useRoute } from "vue-router";
import Cookies from "js-cookie";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { useAppStore } from "@/stores/appStore";
import { useCartStore } from "@/stores/cartStore";
import { useProfileStore } from "@/stores/profileStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { useProductStore } from "@/stores/productStore";

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const cartStore = useCartStore();
const profileStore = useProfileStore();

const isDropdownOpen = ref(false);
const cart = ref([]);
const showBadge = ref(false);
const showTagihan = ref(false);

// Ambil dari productStore dan categoryStore
const searchQuery = computed({
  get: () => productStore.searchQuery,
  set: (val) => (productStore.searchQuery = val),
});
const selectedCategory = computed({
  get: () => productStore.selectedCategory,
  set: (val) => (productStore.selectedCategory = val),
});
const categories = computed(() => categoryStore.categories);

const cartCount = computed(() => cartStore.cart.length);
const totalTagihan = computed(() => cartStore.totalTagihan);

const userName = "Aldean";
const userImg = "https://randomuser.me/api/portraits/men/32.jpg"; // ganti sesuai user

const logout = () => {
  Cookies.remove("token");
  Cookies.remove("user");
  router.push({ name: "login" });
};

// Tutup dropdown jika klik di luar
onMounted(() => {
  document.addEventListener("mousedown", profileStore.handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", profileStore.handleClickOutside);
});

// Reset modal state on route change
watch(
  () => route.name,
  (newName) => {
    if (newName === "dashboard") {
      appStore.isModalOpen = false;
      appStore.isProductModalOpen = false;
    }
  }
);
</script>

<template>
  <div class="bg-white shadow rounded-md px-4 py-3">
    <!-- Baris 1: Navbar -->
    <div class="flex justify-between items-center mb-3">
      <!-- Logo -->
      <button
        @click="router.push('/admin/dashboard')"
        class="font-bold text-blue-600 text-lg"
      >
        MASPOS
      </button>

      <!-- Button Group -->
      <div class="flex items-center gap-4">
        <button
          @click="$emit('openModal')"
          class="btn btn-primary flex items-center gap-1"
        >
          <span>+</span> Tambah Kategori
        </button>
        <button
          @click="$emit('openProductModal')"
          class="btn btn-primary items-center gap-1"
        >
          <span>+</span> Tambah Produk
        </button>

        <!-- Icon Keranjang -->
        <div class="flex items-center justify-end gap-1 relative">
          <!-- Keranjang + Total Tagihan -->
          <div class="flex items-center rounded-xl bg-blue-100">
            <!-- Keranjang -->
            <template v-if="cartCount > 0">
              <router-link
                to="/admin/cart"
                class="btn btn-primary flex items-center justify-center relative h-12 w-12 overflow-visible"
                title="Lihat Keranjang"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="absolute inset-0 m-auto w-6 h-6 text-white pointer-events-none"
                  style="z-index: 1"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
                <transition name="badge-pop">
                  <span
                    v-if="cartCount"
                    class="absolute -top-2 -right-2 bg-green-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center z-50"
                    style="z-index: 50"
                  >
                    {{ cartCount }}
                  </span>
                </transition>
              </router-link>
            </template>
            <template v-else>
              <button
                type="button"
                class="btn btn-primary flex items-center justify-center relative h-12 w-12"
                @click="
                  iziToast.warning({
                    title: 'Peringatan',
                    position: 'topCenter',
                    timeout: 3000,
                    close: true,
                    closeOnClick: true,
                    transitionIn: 'fadeInDown',
                    transitionOut: 'fadeOutUp',

                    message: 'Keranjang masih kosong!',
                    icon: '🛒',
                  })
                "
                title="Lihat Keranjang"
                tabindex="-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="absolute inset-0 m-auto w-6 h-6 text-white pointer-events-none"
                  style="z-index: 1"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
                <transition name="badge-pop">
                  <span
                    v-if="showBadge && cartCount"
                    class="absolute -top-2 -right-2 bg-green-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center z-50"
                    style="z-index: 50"
                  >
                    {{ cartCount }}
                  </span>
                </transition>
              </button>
            </template>
            <transition name="slide-tagihan">
              <div
                v-if="cartCount > 0"
                class="flex items-center px-2 h-10"
                key="tagihan"
              >
                <span class="text-blue-700 font-medium text-lg mr-2">
                  Total Tagihan
                </span>
                <span class="font-bold text-[#395AE6] text-lg">
                  Rp {{ totalTagihan.toLocaleString("id-ID") }}
                </span>
              </div>
            </transition>
          </div>

          <!-- Garis vertikal -->
          <div class="h-10 w-px bg-gray-200 mx-2"></div>

          <!-- Profile & Dropdown -->
          <div class="relative flex items-center gap-2" ref="profileRef">
            <button
              @click="isDropdownOpen = !isDropdownOpen"
              class="flex items-center gap-2 focus:outline-none"
            >
              <img
                :src="userImg"
                alt="profile"
                class="w-10 h-10 rounded-full border border-gray-200 object-cover"
              />
              <span class="font-medium text-gray-700 text-base">{{
                userName
              }}</span>
            </button>
            <div
              v-if="isDropdownOpen"
              class="absolute right-0 top-12 w-40 bg-white border border-gray-200 rounded shadow-lg z-50"
            >
              <button
                @click="logout"
                class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Garis bawah biru -->
    <div
      v-if="route.name === 'dashboard'"
      class="border-b-1 border-gray-300 mb-3"
    ></div>

    <!-- Baris 2: Search + Filter Kategori -->
    <div
      v-if="route.name === 'dashboard'"
      class="flex gap-4 flex-wrap items-center"
    >
      <!-- Search bar -->
      <div
        class="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md w-[400px]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama produk ..."
          class="bg-transparent outline-none flex-1 text-sm"
        />
      </div>

      <!-- Filter kategori -->
      <div class="flex gap-2 overflow-x-auto flex-1 py-1">
        <button
          class="filter-btn"
          :class="{ active: selectedCategory === 'Semua' }"
          @click="selectedCategory = 'Semua'"
        >
          Semua
        </button>
        <button
          class="filter-btn"
          :class="{ active: selectedCategory === category.name }"
          v-for="(category, index) in categories"
          :key="category.id || index"
          @click="selectedCategory = category.name"
        >
          {{ category.name }}
        </button>
      </div>
    </div>
  </div>
</template>