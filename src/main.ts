import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from 'element-plus'
import locale from 'element-plus/dist/locale/en.min.js'
import JsonSchemaForm from "./ViewerPlugin";
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App);
app.use( ElementPlus, { locale })
app.use(JsonSchemaForm);
app.mount("#app");
