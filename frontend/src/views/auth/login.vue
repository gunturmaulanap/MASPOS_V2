<template>
  <div class="min-h-screen flex justify-center bg-gray-100">
    <div class="absolute right-15 top-10 z-10">
      <span class="text-3xl font-bold text-blue-600 tracking-wide">MASPOS</span>
    </div>
    <div class="flex w-full h-screen bg-transparent p-10 gap-8">
      <!-- Kiri: Carousel/Preview -->
      <div
        class="hidden md:flex flex-col w-[60%] h-full bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1E3A8A] rounded-3xl relative shadow-xl pt-12 items-start"
      >
        <!-- Gambar menempel kiri atas dan lebarnya dikurangi -->
        <div class="bg-white rounded-r-3xl shadow-lg w-[90%] overflow-hidden">
          <img
            :src="carouselImages[carouselIndex]"
            alt="Preview"
            class="w-[100%] h-[100%] object-contain rounded-r-3xl max-w-none max-h-none"
          />
        </div>

        <!-- Deskripsi teks multi-baris -->
        <div
          class="p-8 text-white text-[28px] font-medium leading-snug tracking-normal"
        >
          Desain yang user-friendly membuat<br />
          navigasi cepat dan mudah, bahkan bagi pemula.
        </div>

        <!-- Bullets -->
        <div class="flex justify-center mt-2 mb-1 w-full">
          <span
            v-for="(img, idx) in carouselImages"
            :key="idx"
            :class="[
              'swiper-pagination-bullet',
              carouselIndex === idx ? 'swiper-pagination-bullet-active' : '',
            ]"
            @click="carouselIndex = idx"
            style="cursor: pointer"
          ></span>
        </div>
      </div>
      <!-- Kanan: Form Login -->
      <div
        class="w-full md:w-[45%] flex flex-col justify-center px-10 py-12shadow-xl h-full"
      >
        <div>
          <h2 class="text-2xl font-bold mb-2">Selamat Datang di MASPOS</h2>
          <p class="text-gray-600 mb-8">
            Masuk untuk mengelola bisnis Anda dengan mudah dan efisien. MASPOS
            menghadirkan solusi point-of-sale terbaik untuk kemudahan
            operasional sehari-hari.
          </p>
          <form @submit.prevent="login">
            <div class="mb-4">
              <label class="label" for="username">Username</label>
              <input
                class="input"
                id="username"
                v-model="user.username"
                type="text"
                placeholder="Username"
                autocomplete="username"
              />
            </div>
            <div class="mb-6">
              <label class="label" for="password">Password</label>
              <div class="relative">
                <input
                  class="input pr-10"
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="user.password"
                  placeholder="Password"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="absolute right-2 top-2 text-gray-400"
                  @click="showPassword = !showPassword"
                  tabindex="-1"
                >
                  <svg
                    v-if="showPassword"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.233.938-4.675M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.121-2.121A9.969 9.969 0 0121 12c0 5.523-4.477 10-10 10a9.969 9.969 0 01-6.364-2.121M4.222 4.222l15.556 15.556"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <button class="btn btn-primary w-full text-base py-3" type="submit">
              Masuk
            </button>
            <div
              v-if="validation.errors"
              class="mt-4 alert alert-danger text-red-600 bg-red-100 rounded p-2"
            >
              <ul class="mt-0 mb-0">
                <li v-for="(error, index) in validation.errors" :key="index">
                  {{ `${error.path} : ${error.msg}` }}
                </li>
              </ul>
            </div>
            <div
              v-if="loginFailed.message"
              class="mt-2 alert alert-danger text-red-600 bg-red-100 rounded p-2"
            >
              {{ loginFailed.message }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../../services/api";
import Cookies from "js-cookie";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const router = useRouter();
const user = reactive({
  username: "",
  password: "",
});
const validation = ref([]);
const loginFailed = ref([]);
const showPassword = ref(false);

// Dummy carousel images
import carousel1 from "@/assets/2.png";
import carousel2 from "@/assets/burger.avif";
import carousel3 from "@/assets/pizza.webp";
const carouselImages = [carousel1, carousel2, carousel3];
const carouselIndex = ref(0);
// method login
const login = async () => {
  await api
    .post("/auth/login", {
      username: user.username,
      password: user.password,
    })
    .then((response) => {
      Cookies.set("token", response.data.data.token);
      Cookies.set("user", JSON.stringify(response.data.data.user));
      if (Cookies.get("token")) {
        localStorage.setItem("showLoginToast", "1");
        iziToast.success({
          title: "Sukses",
          message: "Login berhasil!",
          icon: "🔑",
          position: "topRight",
          timeout: 3000,
          transitionIn: "fadeInDown",
          transitionOut: "fadeOutUp",
          onClose: () => {
            localStorage.removeItem("showLoginToast");
          },
        });
        router.push({ name: "dashboard" });
      }
    })
    .catch((error) => {
      validation.value = error.response.data;
      loginFailed.value = error.response.data;
    });
};
</script>