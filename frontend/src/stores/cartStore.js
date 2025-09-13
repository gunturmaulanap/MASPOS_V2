import { defineStore } from "pinia";
import { ref, computed } from "vue";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

export const useCartStore = defineStore("cart", () => {
  // --- CART STATE & FUNCTIONS (GLOBAL) ---
  const cart = ref([]);

  // Restore cart from localStorage
  const restoreCart = () => {
    const stored = localStorage.getItem("cart");
    cart.value = stored ? JSON.parse(stored) : [];
  };

  // Sync cart to localStorage
  const syncCart = () => {
    localStorage.setItem("cart", JSON.stringify(cart.value));
  };

  // Add to cart
  function addToCart(product) {
    const found = cart.value.find((item) => item.id === product.id);
    if (found) {
      found.qty += 1;
    } else {
      cart.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img, // atau baseURL + product.img jika perlu
        qty: 1,
      });
    }
    syncCart();
    iziToast.warning({
      title: "tambah",
      message: `${product.name} telah ditambahkan ke keranjang.`,
      icon: "🛒",
      position: "topCenter",
      timeout: 3000,
      transitionIn: "fadeInDown",
      transitionOut: "fadeOutUp",
      transitionInMobile: "fadeInDown",
      transitionOutMobile: "fadeOutUp",
      close: true,
      upsetOnEscape: true,
      closeOnClick: true,
      progressBar: true,
      progressBarColor: "#ffc107",
      backgroundColor: "#fff3cd",
      messageColor: "#856404",
      titleColor: "#856404",
      iconColor: "#856404",
      class: "iziToast-warning",
      onClosing: () => {
        window.dispatchEvent(new Event("cart-updated"));
      },
      onClosed: () => {
        window.dispatchEvent(new Event("cart-updated"));
      },
    });
    window.dispatchEvent(new Event("cart-updated"));
  }

  // Remove from cart
  function removeFromCart(productId) {
    cart.value = cart.value.filter((item) => item.id !== productId);
    syncCart();
    window.dispatchEvent(new Event("cart-updated"));
  }

  // Update qty
  function updateQty(productId, delta) {
    const found = cart.value.find((item) => item.id === productId);
    if (found) {
      found.qty += delta;
      if (found.qty < 1) found.qty = 1;
      syncCart();
      window.dispatchEvent(new Event("cart-updated"));
    }
  }

  // Total tagihan
  const totalTagihan = computed(() =>
    cart.value.reduce((sum, item) => sum + item.price * item.qty, 0)
  );

  return {
    // cart global
    cart,
    addToCart,
    removeFromCart,
    updateQty,
    totalTagihan,
    restoreCart,
  };
});
