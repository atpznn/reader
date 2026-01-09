import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap";
import router from "./router";

const app = createApp(App);
app.use(router);
app.mount("#app");
