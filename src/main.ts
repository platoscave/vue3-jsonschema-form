import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from 'element-plus'
import locale from 'element-plus/dist/locale/en.min.js'
import JsonschemaForm from "./JsonschemaFormPlugin.ts";
import './style.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App);
app.use(ElementPlus, { locale })
app.use(JsonschemaForm);
app.mount("#app");
