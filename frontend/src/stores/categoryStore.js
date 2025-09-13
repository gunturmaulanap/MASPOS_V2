import { defineStore } from "pinia";
import api from "@/services/api";
import Cookies from "js-cookie";
import "izitoast/dist/css/iziToast.min.css";
import iziToast from "izitoast";

export const useCategoryStore = defineStore("category", {
  state: () => ({
    categories: [],
  }),
  actions: {
    async fetchCategories() {
      const token = Cookies.get("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      try {
        console.log("Fetching categories from /categories/all");
        const res = await api.get("/categories/all");
        console.log("Categories response:", res.data);

        // Handle different response structures
        if (res.data.data) {
          this.categories = res.data.data;
        } else if (Array.isArray(res.data)) {
          this.categories = res.data;
        } else {
          this.categories = [];
        }

        console.log("Categories loaded:", this.categories);
        // Persist to localStorage for offline fallback
        try {
          localStorage.setItem("categories", JSON.stringify(this.categories));
        } catch (e) {
          console.warn("Failed to save categories to localStorage", e);
        }
        return this.categories;
      } catch (error) {
        console.warn("Categories endpoint not available, using local data");

        // Try to load from localStorage first
        try {
          const saved = localStorage.getItem("categories");
          if (saved) {
            this.categories = JSON.parse(saved);
            console.log(
              "Categories loaded from localStorage:",
              this.categories
            );
            return this.categories;
          }
        } catch (e) {
          console.warn("Failed to read categories from localStorage", e);
        }

        // Default fallback data
        this.categories = [
          { id: 1, name: "Makanan" },
          { id: 2, name: "Minuman" },
          { id: 3, name: "Snack" },
          { id: 4, name: "Dessert" },
        ];

        console.log("Categories loaded from local data:", this.categories);
        return this.categories;
      }
    },

    async createCategory(name) {
      const token = Cookies.get("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      try {
        console.log("Creating category:", name);
        const res = await api.post("/categories/create", { name });
        console.log("Create category response:", res.data);

        // Refresh categories after successful creation
        await this.fetchCategories();

        iziToast.success({
          title: "success",
          message: "Kategori berhasil ditambahkan.",
          icon: "✅",
          position: "topRight",
          timeout: 3000,
        });

        // Notify other components
        window.dispatchEvent(new Event("category-updated"));

        // Return success result
        return { success: true, data: res.data.data || res.data };
      } catch (error) {
        console.error(
          "Create category error:",
          error.response?.data || error.message
        );

        // Jika error dari server, throw error untuk ditangani oleh modal
        if (error.response?.data) {
          // If backend returned validation errors or message, throw the full response
          throw error;
        }

        console.warn(
          "Create category endpoint error, using local storage fallback"
        );

        // Fallback ke local storage
        const newId = Math.max(...this.categories.map((c) => c.id), 0) + 1;
        const newCategory = { id: newId, name };
        this.categories.push(newCategory);

        // Save to localStorage
        try {
          localStorage.setItem("categories", JSON.stringify(this.categories));
        } catch (e) {
          console.warn("Failed to save categories to localStorage", e);
        }

        iziToast.success({
          title: "success",
          message: "Kategori berhasil ditambahkan (local).",
          icon: "✅",
          position: "topRight",
          timeout: 3000,
        });

        window.dispatchEvent(new Event("category-updated"));

        // Return success result for local storage
        return { success: true, data: newCategory };
      }
    },

    async updateCategory(id, name) {
      const token = Cookies.get("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      try {
        console.log("Updating category:", id, name);
        const res = await api.put(`/categories/${id}`, { name });
        console.log("Update category response:", res.data);

        const updatedCategory = res.data.data || res.data;
        const index = this.categories.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.categories[index] = updatedCategory;
          // persist
          try {
            localStorage.setItem("categories", JSON.stringify(this.categories));
          } catch (e) {
            console.warn("Failed to save categories to localStorage", e);
          }
          iziToast.success({
            title: "success",
            message: "Kategori berhasil diupdate.",
            icon: "✅",
            position: "topRight",
            timeout: 3000,
          });

          window.dispatchEvent(new Event("category-updated"));
        }
        return updatedCategory;
      } catch (error) {
        console.warn(
          "Update category endpoint not available, using local storage"
        );

        // Fallback ke local storage
        const index = this.categories.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.categories[index].name = name;
          try {
            localStorage.setItem("categories", JSON.stringify(this.categories));
          } catch (e) {
            console.warn("Failed to save categories to localStorage", e);
          }
          iziToast.success({
            title: "success",
            message: "Kategori berhasil diupdate (local).",
            icon: "✅",
            position: "topRight",
            timeout: 3000,
          });

          window.dispatchEvent(new Event("category-updated"));
          console.log("Category updated locally:", this.categories[index]);
          return this.categories[index];
        }
        throw new Error("Category not found");
      }
    },

    async deleteCategory(id) {
      const token = Cookies.get("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      try {
        console.log("Deleting category:", id);
        await api.delete(`/categories/${id}`);

        const index = this.categories.findIndex((c) => c.id === id);
        if (index !== -1) {
          const deleted = this.categories.splice(index, 1)[0];
          try {
            localStorage.setItem("categories", JSON.stringify(this.categories));
          } catch (e) {
            console.warn("Failed to save categories to localStorage", e);
          }
          iziToast.error({
            title: "delete",
            message: "Kategori berhasil dihapus.",
            icon: "❌",
            position: "topRight",
            timeout: 3000,
          });

          window.dispatchEvent(new Event("category-updated"));
          console.log("Category deleted:", deleted);
          return deleted;
        }
      } catch (error) {
        console.warn(
          "Delete category endpoint not available, using local storage"
        );

        // Fallback ke local storage
        const index = this.categories.findIndex((c) => c.id === id);
        if (index !== -1) {
          const deleted = this.categories.splice(index, 1)[0];
          try {
            localStorage.setItem("categories", JSON.stringify(this.categories));
          } catch (e) {
            console.warn("Failed to save categories to localStorage", e);
          }
          iziToast.error({
            title: "delete",
            message: "Kategori berhasil dihapus (local).",
            icon: "❌",
            position: "topRight",
            timeout: 3000,
          });

          window.dispatchEvent(new Event("category-updated"));
          console.log("Category deleted locally:", deleted);
          return deleted;
        }
        throw new Error("Category not found");
      }
    },
  },
});
