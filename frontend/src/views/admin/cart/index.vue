<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import HeaderSetengah from "../../../components/Header.vue";
import { useCartStore } from "@/stores/cartStore";

// Dummy user data
const userName = "Aldean";
const userImg = "https://randomuser.me/api/portraits/men/32.jpg";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const router = useRouter();

const cartStore = useCartStore();

function handleRemove(productId) {
  cartStore.removeFromCart(productId);
  if (cartStore.cart.length === 0) {
    router.push("/admin/dashboard");
  }
}

onMounted(() => {
  cartStore.restoreCart();
  window.addEventListener("cart-updated", cartStore.restoreCart);
});
onBeforeUnmount(() => {
  window.removeEventListener("cart-updated", cartStore.restoreCart);
});
</script>

<template>
  <div class="bg-gray-100 min-h-screen py-4">
    <!-- Table Cart -->
    <div class="bg-white rounded-xl shadow">
      <table class="w-full text-left">
        <thead>
          <tr class="border-gray-100 border-b-2">
            <th class="py-2 px-4 font-medium text-gray-700">Produk</th>
            <th class="px-4 font-medium text-gray-700">Harga</th>
            <th class="px-4 font-medium text-gray-700">Jumlah</th>
            <th class="px-4 font-medium text-gray-700">Sub Total</th>
            <th class="px-4"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in cartStore.cart"
            :key="item.id"
            class="last:border-b-0"
          >
            <td class="py-3 flex items-center gap-4 px-4">
              <img
                :src="
                  item.img.startsWith('http') ? item.img : baseURL + item.img
                "
                class="w-24 h-24 rounded-lg object-cover"
              />
              <span class="text-lg font-medium">{{ item.name }}</span>
            </td>
            <td class="text-lg">Rp {{ item.price.toLocaleString("id-ID") }}</td>
            <td>
              <div class="flex items-center gap-2">
                <button
                  @click="cartStore.updateQty(item.id, -1)"
                  class="w-7 h-7 rounded bg-gray-100 text-xl text-gray-500 flex items-center justify-center hover:bg-gray-200"
                >
                  -
                </button>
                <span class="text-lg font-medium w-6 text-center">{{
                  item.qty
                }}</span>
                <button
                  @click="cartStore.updateQty(item.id, 1)"
                  class="w-7 h-7 rounded bg-gray-100 text-xl text-gray-500 flex items-center justify-center hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </td>
            <td class="font-semibold text-lg text-black">
              Rp {{ (item.price * item.qty).toLocaleString("id-ID") }}
            </td>
            <td>
              <button
                @click="handleRemove(item.id)"
                class="text-red-500 font-medium hover:underline"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Tombol bawah -->
    <div class="flex justify-end gap-4 mt-8">
      <button
        @click="router.push('/admin/dashboard')"
        class="px-8 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium bg-white hover:bg-blue-50"
      >
        Kembali
      </button>
      <button
        class="px-8 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
      >
        Bayar
      </button>
    </div>
  </div>
</template>