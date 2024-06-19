import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import pinia from './stores'
import router from './router'


// 创建自定义指令
const customDirective = {
  // 当被绑定的元素挂载到 DOM 上时调用
  mounted(el) {
    let isDragging = false;
    let startX, startY;

    el.addEventListener('mousedown', (event) => {
      isDragging = true;
      startX = event.screenX;
      startY = event.screenY;
      window.client.invoke(JSON.stringify({type: 'start', x: startX, y: startY}));
    });

    el.addEventListener('mousemove', (event) => {
      if (isDragging) {
        event.preventDefault();
        window.client.invoke(JSON.stringify({type: 'move', x: event.screenX, y: event.screenY}));
      }
    });

    el.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        window.client.invoke(JSON.stringify({type: 'end'}));
      }
    });

    // el.addEventListener('mouseleave', () => {
    //   if (isDragging) {
    //     isDragging = false;
    //     window.client.invoke(JSON.stringify({type: 'end'}));
    //   }
    // });
  }
};


createApp(App).use(pinia).use(router).use(ElementPlus, {
  locale: zhCn,
}).directive('drag', customDirective).mount('#app')
 