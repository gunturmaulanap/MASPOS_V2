<template>
  <!-- Modal Tambah Kategori -->
  <div
    v-if="appStore.isModalOpen"
    class="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
  >
    <div class="bg-white rounded-xl p-0 w-[350px] shadow-lg overflow-hidden">
      <div
        class="font-semibold text-lg px-6 py-4 bg-gray-100 border-b border-gray-200"
      >
        Tambah Kategori
      </div>
      <div class="px-6 py-4">
        <label class="block mb-1 text-sm font-medium">Kategori</label>
        <input
          v-model="newCategory"
          type="text"
          placeholder="Kategori"
          :class="[
            'w-full border rounded px-3 py-2 outline-none transition',
            errorMsg ? 'border-red-500 bg-red-50' : 'border-gray-300',
          ]"
        />
        <div v-if="errorMsg" class="text-red-500 text-xs mt-2">
          {{ errorMsg }}
        </div>
      </div>
      <div
        class="flex gap-2 justify-end border-t border-gray-200 px-6 py-4 bg-white"
      >
        <button
          @click="resetForm"
          class="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50 font-medium"
        >
          Batal
        </button>
        <button
          @click="handleCreateCategory"
          class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium"
        >
          Tambah
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAppStore } from "@/stores/appStore";
import { useCategoryStore } from "@/stores/categoryStore";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const appStore = useAppStore();
const categoryStore = useCategoryStore();
const newCategory = ref("");
const errorMsg = ref("");

const resetForm = () => {
  appStore.isModalOpen = false;
  newCategory.value = "";
  errorMsg.value = "";
  categoryStore.fetchCategories();
};

const handleCreateCategory = async () => {
  errorMsg.value = "";
  if (!newCategory.value) {
    errorMsg.value = "Nama kategori wajib diisi.";
    return;
  }
  // Cek duplikasi kategori (case-insensitive)
  const isDuplicate = categoryStore.categories.some(
    (cat) => cat.name.toLowerCase() === newCategory.value.trim().toLowerCase()
  );
  if (isDuplicate) {
    errorMsg.value = "Kategori sudah ada.";
    return;
  }
  try {
    const result = await categoryStore.createCategory(newCategory.value);

    if (result.success) {
      iziToast.info({
        title: "Info",
        message: "Kategori berhasil ditambahkan!",
        icon: "📁",
        position: "topRight",
        timeout: 3000,
        transitionIn: "fadeInDown",
        transitionOut: "fadeOutUp",
        offset: 60,
      });
      resetForm();
    }
  } catch (err) {
    console.error("Create category error:", err);
    errorMsg.value = err.response?.data?.message || "Gagal menambah kategori.";
  }
};
</script>

