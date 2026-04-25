import { createApp } from "vue";
import App from "./App.vue";
import router from "@router";
import { createPinia } from "pinia";
import "./style.css";
import "leaflet/dist/leaflet.css";

// Initialize dark mode on startup: respect saved preference, fallback to OS
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
}

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
