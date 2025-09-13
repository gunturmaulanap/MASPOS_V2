import { defineStore } from "pinia";
import api from "@/services/api";
import Cookies from "js-cookie";
import { useCategoryStore } from "./categoryStore";
import { ref, computed } from "vue";
import "izitoast/dist/css/iziToast.min.css";
import iziToast from "izitoast";

export const useProductStore = defineStore("product", () => {
  const products = ref([]);
  const searchQuery = ref("");
  const selectedCategory = ref("Semua");
  const isLoading = ref(false); // State untuk menunjukkan proses loading

  /**
   * Mengambil semua produk dari API dengan otentikasi.
   * Menggunakan fallback data lokal jika API gagal.
   */
  async function fetchProducts() {
    isLoading.value = true;
    const token = Cookies.get("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    try {
      const res = await api.get("/products");
      products.value = res.data.data || res.data;
      console.log("Products loaded:", products.value);
    } catch (error) {
      console.error("Failed to fetch products, using local data:", error);
      products.value = [
        {
          id: 1,
          name: "Nasi Goreng Spesial",
          price: 25000,
          category_id: 1,
          img: "https://via.placeholder.com/300x240/f0f0f0/666666?text=Nasi+Goreng",
        },
        {
          id: 2,
          name: "Es Teh Manis",
          price: 8000,
          category_id: 2,
          img: "https://via.placeholder.com/300x240/f0f0f0/666666?text=Es+Teh",
        },
        {
          id: 3,
          name: "Mie Ayam",
          price: 20000,
          category_id: 1,
          img: "https://via.placeholder.com/300x240/f0f0f0/666666?text=Mie+Ayam",
        },
        {
          id: 4,
          name: "Keripik Singkong",
          price: 15000,
          category_id: 3,
          img: "https://via.placeholder.com/300x240/f0f0f0/666666?text=Keripik",
        },
        {
          id: 5,
          name: "Es Krim Vanilla",
          price: 12000,
          category_id: 4,
          img: "https://via.placeholder.com/300x240/f0f0f0/666666?text=Es+Krim",
        },
      ];
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Menghapus produk berdasarkan ID.
   * @param {number} productId - ID produk yang akan dihapus.
   */
  async function deleteProduct(productId) {
    const token = Cookies.get("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    try {
      await api.delete(`/products/${productId}`);
      // Perbarui daftar produk secara reaktif tanpa perlu fetch ulang semua data
      products.value = products.value.filter((p) => p.id !== productId);
      iziToast.error({
        title: "Dihapus",
        message: "Produk berhasil dihapus.",
        position: "topRight",
      });
    } catch (error) {
      console.error("Delete product failed:", error);
      iziToast.error({
        title: "Gagal",
        message: "Gagal menghapus produk. Silakan coba lagi.",
        position: "topRight",
      });
      throw error;
    }
  }

  /**
   * Menambahkan produk baru.
   * @param {object} newProduct - Objek data produk baru.
   * @param {File} imgFile - File gambar produk.
   */
  async function createProduct(newProduct, imgFile) {
    const errors = [];
    if (!newProduct.name) {
      errors.push({ msg: "Nama produk wajib diisi." });
    }

    const priceNum = Number(newProduct.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      errors.push({ msg: "Harga produk harus berupa angka positif." });
    }

    const catIdNum = Number(newProduct.category_id);
    if (!catIdNum || catIdNum <= 0) {
      errors.push({ msg: "Kategori produk wajib dipilih." });
    }

    if (!imgFile) {
      errors.push({ msg: "Gambar produk wajib diupload." });
    }

    if (errors.length) {
      return { errors };
    }

    const token = Cookies.get("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", priceNum);
    formData.append("category_id", catIdNum);
    formData.append("image", imgFile);

    try {
      const res = await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Gunakan data dari respons API untuk menambah produk baru ke dalam state
      products.value.push(res.data.data);
      iziToast.success({
        title: "Berhasil",
        message: "Produk berhasil ditambahkan.",
        position: "topRight",
      });
      return { success: true };
    } catch (err) {
      console.error("Create product failed:", err.response || err);
      if (err.response?.data?.errors) {
        return { errors: err.response.data.errors };
      }
      return { errors: [{ msg: "Terjadi kesalahan. Silakan coba lagi." }] };
    }
  }

  const filteredProducts = computed(() => {
    const categoryStore = useCategoryStore();
    let result = products.value;

    if (selectedCategory.value !== "Semua") {
      const cat = categoryStore.categories.find(
        (c) => c.name === selectedCategory.value
      );
      if (cat) {
        result = result.filter(
          (p) =>
            p.category_id === cat.id || (p.category && p.category.id === cat.id)
        );
      }
    }

    if (searchQuery.value) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }
    return result;
  });

  return {
    products,
    searchQuery,
    selectedCategory,
    isLoading, // Export state loading
    filteredProducts,
    fetchProducts,
    deleteProduct,
    createProduct,
  };
});
