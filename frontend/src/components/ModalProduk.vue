<template>
  <!-- Modal Tambah Produk -->
  <div
    v-if="appStore.isProductModalOpen"
    class="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
  >
    <div class="bg-white rounded-xl p-0 w-[400px] shadow-lg overflow-hidden">
      <div
        class="font-semibold text-lg px-6 py-4 bg-gray-100 border-b border-gray-200"
      >
        Tambah Produk
      </div>
      <div class="px-6 py-6">
        <!-- Drag & Drop Upload Area -->
        <div
          class="mb-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl py-8 cursor-pointer transition hover:border-blue-400"
          @click="$refs.fileInput.click()"
          @dragover.prevent
          @drop.prevent="onDropFile"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileChange"
          />
          <div class="flex flex-col items-center">
            <div
              class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 mb-2"
            >
              <svg
                class="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <span class="text-gray-500 text-sm">
              Seret & Letakkan atau
              <span class="text-blue-600 underline cursor-pointer"
                >Pilih File</span
              >
              untuk diunggah
            </span>
            <span class="text-gray-400 text-xs mt-1">
              Format yang didukung: Jpg, Png
            </span>
            <span v-if="imgFile" class="text-green-600 text-xs mt-2">
              File: {{ imgFile.name }}
            </span>
          </div>
        </div>

        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium">Produk</label>
          <input
            v-model="newProduct.name"
            type="text"
            placeholder="Produk"
            :class="[
              'w-full border rounded px-3 py-2 outline-none transition bg-gray-50',
              hasFieldError('Nama produk')
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300',
            ]"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium">Harga</label>
          <input
            v-model="newProduct.price"
            type="number"
            placeholder="Harga"
            :class="[
              'w-full border rounded px-3 py-2 outline-none transition bg-gray-50',
              hasFieldError('Harga')
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300',
            ]"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium">Pilih Kategori</label>
          <select
            v-model="newProduct.category_id"
            :class="[
              'w-full border rounded px-3 py-2 outline-none transition bg-gray-50',
              hasFieldError('Kategori')
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300',
            ]"
          >
            <option value="" disabled>Pilih kategori</option>
            <option
              v-for="cat in categoryStore.categories"
              :key="cat.id"
              :value="cat.id"
            >
              {{ cat.name }}
            </option>
          </select>
        </div>
        <div
          v-if="productValidation.errors && productValidation.errors.length"
          class="mt-2 text-red-500 text-xs"
        >
          <ul class="mt-0 mb-0">
            <li v-for="(error, index) in productValidation.errors" :key="index">
              {{ (error && (error.msg || error.message)) || error }}
            </li>
          </ul>
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
          @click="handleCreateProduct"
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
import { useProductStore } from "@/stores/productStore";
import { useCategoryStore } from "@/stores/categoryStore";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const appStore = useAppStore();
const productStore = useProductStore();
const categoryStore = useCategoryStore();

const newProduct = ref({
  name: "",
  price: "",
  category_id: "",
});
const imgFile = ref(null);
const productValidation = ref({ errors: [] });

const handleFileChange = (e) => {
  imgFile.value = e.target.files[0] || null;
};
const onDropFile = (e) => {
  const files = e.dataTransfer.files;
  if (files && files[0]) {
    imgFile.value = files[0];
  }
};

const hasFieldError = (keyword) => {
  try {
    return (
      productValidation.value &&
      Array.isArray(productValidation.value.errors) &&
      productValidation.value.errors.some((e) => {
        const msg = e && (e.msg || e.message);
        return msg && msg.includes && msg.includes(keyword);
      })
    );
  } catch (e) {
    return false;
  }
};

const resetForm = () => {
  appStore.isProductModalOpen = false;
  newProduct.value.name = "";
  newProduct.value.price = "";
  newProduct.value.category_id = "";
  imgFile.value = null;
  productValidation.value.errors = [];
};

const handleCreateProduct = async () => {
  productValidation.value.errors = [];
  try {
    const result = await productStore.createProduct(
      newProduct.value,
      imgFile.value
    );

    if (result.success) {
      // Reset form jika sukses
      resetForm();
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      productValidation.value.errors = error.response.data.errors;
    } else {
      productValidation.value.errors = [{ msg: "Gagal menambah produk." }];
    }
    console.error("Create product error:", error);
  }
};
// onMounted(() => {
//   categoryStore.fetchCategories();
// });
</script>

