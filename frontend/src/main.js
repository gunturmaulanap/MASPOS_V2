//import createApp from Vue
import { createApp } from "vue";
import { createPinia } from "pinia";

//import component App
import App from "./App.vue";

//import config router
import router from "./routes";

// Import iziToast global CSS
import "izitoast/dist/css/iziToast.min.css";

const baseURL = import.meta.env.VITE_API_BASE_URL;

//create App Vue
const app = createApp(App);
app.use(createPinia());
app.use(router);

app.mount("#app");

import "./assets/css/main.css";
