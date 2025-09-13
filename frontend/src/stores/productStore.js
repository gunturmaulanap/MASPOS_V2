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

  async function fetchProducts() {
    const token = Cookies.get("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    try {
      console.log("Fetching products from /products/all");
      const res = await api.get("/products/all");
      console.log("Products response:", res.data);

      // Handle different response structures and map fields
      let rawProducts = [];
      if (res.data.data) {
        rawProducts = res.data.data;
      } else if (Array.isArray(res.data)) {
        rawProducts = res.data;
      } else {
        rawProducts = [];
      }

      // Map backend fields to frontend format
      products.value = rawProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.original_price || product.price,
        category_id: product.category_id,
        img: product.image_url, // Use original image_url from backend
        created_at: product.created_at,
        updated_at: product.updated_at,
        category: product.category,
      }));

      console.log("Products loaded:", products.value);
      return products.value;
    } catch (error) {
      console.warn("Products endpoint not available, using local data");

      // Fallback ke data lokal jika endpoint tidak tersedia
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

      console.log("Products loaded from local data:", products.value);
      return products.value;
    }
  }

  // Fungsi hapus produk
  async function deleteProduct(productId) {
    const token = Cookies.get("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    try {
      console.log("Deleting product:", productId);
      await api.delete(`/products/${productId}`);

      // Refresh products after successful deletion
      await fetchProducts();

      iziToast.error({
        title: "delete",
        message: "Produk berhasil dihapus.",
        icon: "❌",
        position: "topRight",
        timeout: 3000,
        transitionIn: "fadeInDown",
        transitionOut: "fadeOutUp",
      });
    } catch (error) {
      console.warn(
        "Delete product endpoint error, using local storage:",
        error.response?.data?.message || error.message
      );

      // Fallback ke local storage
      const index = products.value.findIndex((p) => p.id === productId);
      if (index !== -1) {
        products.value.splice(index, 1);

        // Save to localStorage
        localStorage.setItem("products", JSON.stringify(products.value));

        iziToast.error({
          title: "delete",
          message: "Produk berhasil dihapus (local).",
          icon: "❌",
          position: "topRight",
          timeout: 3000,
          transitionIn: "fadeInDown",
          transitionOut: "fadeOutUp",
        });

        window.dispatchEvent(new Event("product-updated"));
      }
    }
  }

  // Fungsi tambah produk
  async function createProduct(newProduct, imgFile) {
    const errors = [];
    if (!newProduct.name) errors.push({ msg: "Nama produk wajib diisi." });
    if (newProduct.price === undefined || newProduct.price === "")
      errors.push({ msg: "Harga produk wajib diisi." });
    const catIdNum = Number(newProduct.category_id);
    if (!catIdNum || Number.isNaN(catIdNum) || catIdNum <= 0)
      errors.push({ msg: "Kategori produk wajib dipilih." });
    if (!imgFile) errors.push({ msg: "Gambar produk wajib diupload." });

    if (errors.length > 0) {
      throw { response: { data: { errors } } };
    }

    const token = Cookies.get("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const formData = new FormData();
    formData.append("name", newProduct.name);
    // Ensure numeric values are sent for price and category
    formData.append("price", Number(newProduct.price));
    // Backend expects snake_case field for category id
    formData.append("category_id", Number(newProduct.category_id));
    // Backend expects file field named 'image'
    formData.append("image", imgFile);

    try {
      console.log("Creating product:", newProduct);
      const res = await api.post("/products/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Refresh products after successful creation
      await fetchProducts();

      iziToast.success({
        title: "success",
        message: "Produk berhasil ditambahkan.",
        icon: "✅",
        position: "topRight",
        timeout: 3000,
        transitionIn: "fadeInDown",
        transitionOut: "fadeOutUp",
      });

      window.dispatchEvent(new Event("product-updated"));
      return { success: true };
    } catch (err) {
      console.error("Create product error:", err.response?.data || err.message);

      // Jika error validasi atau server error, throw untuk ditangani modal
      if (err.response?.data?.errors || err.response?.data?.message) {
        throw err;
      }

      console.warn(
        "Create product endpoint error, using local storage fallback"
      );

      // Fallback ke local storage
      const newId = Math.max(...products.value.map((p) => p.id), 0) + 1;
      const newProductData = {
        id: newId,
        name: newProduct.name,
        price: newProduct.price,
        category_id: newProduct.category_id,
        img: "", // Empty image for local fallback
      };

      products.value.push(newProductData);

      // Save to localStorage
      localStorage.setItem("products", JSON.stringify(products.value));

      iziToast.success({
        title: "success",
        message: "Produk berhasil ditambahkan (local).",
        icon: "✅",
        position: "topRight",
        timeout: 3000,
      });

      window.dispatchEvent(new Event("product-updated"));
      return { success: true };
    }
  }

  // Computed untuk filter produk
  const filteredProducts = computed(() => {
    let filtered = products.value;

    // Filter berdasarkan kategori
    if (selectedCategory.value !== "Semua") {
      const categoryStore = useCategoryStore();
      const category = categoryStore.categories.find(
        (cat) => cat.name === selectedCategory.value
      );
      if (category) {
        filtered = filtered.filter(
          (product) => product.category_id === category.id
        );
      }
    }

    // Filter berdasarkan search query
    if (searchQuery.value) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    }

    return filtered;
  });

  return {
    products,
    searchQuery,
    selectedCategory,
    filteredProducts,
    fetchProducts,
    deleteProduct,
    createProduct,
  };
});
