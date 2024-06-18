<template>
  <router-view></router-view>

</template>
<script setup>
import { ref , onMounted} from 'vue'
import { useRoute } from 'vue-router';
import Header from './components/header.vue';
const dialogVisible = ref(false)
const message = ref('')
const loginStatus = ref('')
loginStatus.value = localStorage.getItem('loginStatus')

onMounted (async() => {


})

const route = useRoute()
// 在网页中添加一个拖拽区域 
// const dragArea = document.createElement('div'); dragArea.style.position = 'absolute'; dragArea.style.top = '0'; dragArea.style.left = '0'; dragArea.style.width = '100%'; dragArea.style.height = '30px';
//  // 可以调整拖拽区域的高度 
//  dragArea.style.backgroundColor = 'transparent'; document.body.appendChild(dragArea); 
//  // 添加拖拽事件监听 
//  const isDragging = ref(false); 
//  const currentX = ref(0)
//  const currentY = ref(0)
//  const initialX = ref(0)
//  const initialY = ref(0)
//  const xOffset = ref(0)
//  const yOffset = ref(0)

//  const dragStart = (e) => { 
//   initialX = e.clientX - xOffset; 
//   initialY = e.clientY - yOffset; 
//   if (e.target === dragArea) { 
//     isDragging.value = true;
//    } } 
//    const dragEnd = (e) => {
//      initialX.value = currentX.value; 
//      initialY.value = currentY.value; 
//      isDragging.value = false; 
//     }
//      const drag = (e) => { 
//       if (isDragging) { 
//         e.preventDefault();
//          currentX.value = e.clientX - initialX.value;
//           currentY.value = e.clientY - initialY.value; 
//           xOffset.value = currentX.value; 
//           yOffset.value = currentY.value; 
//           setTranslate(currentX.value, currentY.value, window.client.stage); 
//         } 
//     } 
//   const setTranslate = (xPos, yPos, el) => { 
//     el.setX(xPos); el.setY(yPos); 
//   }
//   dragArea.addEventListener('mousedown', dragStart); 
//  dragArea.addEventListener('mouseup', dragEnd); 
//  dragArea.addEventListener('mousemove', drag); 
</script>

<style>
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  padding: 0;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
img {
  display: inline-block;
  margin: 0;
}
.card {
  padding: 2em;
}

.flex {
  display: flex;
}
.flex-wrap {
  flex-wrap: wrap;
}
.space-between {
  justify-content: space-between;
}
.space-around {
  justify-content: space-around;
}
.space-center {
  justify-content: center;
}
.align-center {
  align-items: center;
}
.text-center {
  text-align: center;
}
#app {
  background: #222;
  height: 100vh;
}

/* #app > div >div {
  width: 100%;
  height: 100%;
} */
p {
  margin: 0;
}
.min {
  width: 10px;
  height: 10px;
  background: url(./assets/min.png) no-repeat center;
  background-size: contain;
  position: fixed;
  right: 60px;
  top: 20px;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 10;

}
.close {
  width: 10px;
  height: 10px;
  background: url(./assets/close.png) no-repeat center;
  background-size: contain;
  position: fixed;
  right: 20px;
  top: 15px;

  cursor: pointer;
  z-index: 10;
}
.container {
  width: 1440px;
  padding: 0 20px;
  height: 100%;
  box-sizing: border-box ;
  margin: 0 auto;
  position: relative;
}
img {
  margin-right: 10px;
}
@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}
.el-dialog {
  background: rgb(36, 36, 36);
}
.el-dialog__title, 
.el-dialog__body {
  color: #f5f5f5;
}
.el-button--primary {
  background: #eb6b35;
  border-color: #eb6b35;
}
.el-button--primary:hover {
  background: #eb6b35;
  border-color: #eb6b35;
}
</style>
