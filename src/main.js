import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import pinia from './stores'
import router from './router'

createApp(App).use(pinia).use(router).use(ElementPlus).mount('#app')
 