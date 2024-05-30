<template>
  <div class="login">
    <div class="min"></div>
      <div class="close" @click="dialogVisible = true"></div>
    <div class="title">
      <img src="../../assets/login-title.png" />
    </div>
    <div class="login-panel">
      <img class="s-title" src="../../assets/login-st.png" alt="">
      <img src="../../assets/s-line.png" alt="" class="line">
      
      <img v-if="loginEwm != ''" :src="loginEwm" alt="" class="ewm">
      <img src="../../assets/s-line.png" alt="" class="line">
      <p style="margin-top: 20px">微信扫一扫立即参与</p>
      <!-- <el-button type="primary"  @click="callJavaMethod">获取</el-button> -->
       <!-- <div v-if="info">
      <h2>Received Information:</h2>
      <ul>
        <li v-for="(value, key) in info" :key="key">{{ key }}: {{ value }}</li>
      </ul>
    </div> -->
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="关闭窗口"
      width="500"
    >
      <span>确认关闭程序吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="minimizeWindow('exit')">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>

import { ref , onBeforeUnmount} from 'vue'
import axios from 'axios'
import api from '../../api/request'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router';

const dialogVisible = ref(false)
const router = useRouter();
const sign = ref('');
const loginEwm = ref('')
const timer = ref(null)
const info = ref(null)

const callJavaMethod = () => {
  if (window.client) {
    try {
      const jsonString = window.client.getClientInfo();
      console.log("Received JSON from Java:", jsonString);
      const data = JSON.parse(jsonString);
      console.log("Parsed JSON Data:", data);
      info.value = data;
      Object.keys(info).length > 0  && getClientInfo()

    } catch (error) {
      console.error("Failed to call Java method or parse JSON:", error);
    }
  } else {
    info.value = {
      id: '0'
    }
    console.log("Java bridge not found");
  }
}

// 获取我的网吧id 和名称

// const getMyNetInfo = async () => {
//   try {
//     const response = await axios.get('/api');
//     let responseData = response.data;
//     // 修复不合法的 JSON 字符串，将 result 字段中的内容进行转义
//     responseData = responseData.replace('"{', '{').replace('}"', '}');

//     let data;
//     try {
//       // 解析修复后的数据
//       data = JSON.parse(responseData);
//       console.log(data)
//     } catch (e) {
//       return;
//     }

//   } catch (error) {
//     console.error('Axios Error:', error);
//   }
// };

// 一：客户端信息获取
const getClientInfo = () => {

  api.post('/method/client/', {
    method: 'GET_CLIENT_INFO',
    id: 20,
    name: 'kamisama',
    mac: '08-97-98-96-50-A0',
    sign: 'bef741776facbdc1d2004567d624fd95'
    // id: info.value.id,
    // name: info.value.name,
    // mac: info.value.mac,
    // sign: info.value.sign
  }).then(res => {
    console.log(res)
    // getStatus()
    if (res.data.code == 10000) {
      getStatus()
    }
  })
}
const gameLogout = (obj) => {
  ElMessage.success('登出')
  // const data = JSON.parse(obj);
  api.post('/method/account/', {
    method: 'GAME_USER_LOGOUT'
  }).then(res => {})
}

// 获取登录二维码
const getStatus = () => {
  api.post('/method/account/', {
    method: 'CHECK_LOGIN',
  }).then(res => {
    // 如果未登录则返回二维码扫码和number
    console.log(res)

    if (res.data.message == "未登陆") {
      localStorage.setItem('numberToken', res.data.result.number)
      loginEwm.value = res.data.result.url
      // 轮询登录状态
      timer.value = setInterval(() => {
        if (localStorage.getItem('numberToken')) {
          checkLoginStatus(localStorage.getItem('numberToken'))
        }
      }, 1000)
    }
  })
}

// checkLoginStatus  查询登录状态
const checkLoginStatus = (n) => {
  api.post('/method/account/', {
    method: 'QUERY_LOGIN_STATUS',
    number: n
  }).then(res => {
    console.log(res)
    if (res.data.code == 10000) {
      ElMessage.success('登录成功！')
      localStorage.setItem('loginStatus', true)
      let timer = setTimeout(() => {
        router.replace('/home')
        clearTimeout(timer)
      },1000)
      // 编码失效
    } else if (res.data.code == 10008){
      clearInterval(timer.value)
      getStatus()
    }
  })
}




onBeforeUnmount (() => {
  clearInterval(timer.value)

})
gameLogout()
getClientInfo()
// callJavaMethod()
</script>
<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background: url(../../assets/login-bj.jpg) no-repeat center;
  background-size: cover;
  position: relative;
  .title {
    padding: 10px 20px;
    background: rgba(0,0,0, .4);
    color: #fff;
    img {
      width: 417px;
    }
  } 
  .login-panel {
    position: absolute;
    right: 10vw;
    top: 50%;
    transform: translateY(-50%);
    width: 340px;
    height: 443px;
    background: url(../../assets/login-sbj.png) no-repeat center;
    text-align: center;
    .s-title {
      width: 184px;
      height: 28px;
      padding-top: 50px;
    }
    .ewm {
      width: 175px;
      height: 175px;
      margin: 20px 0;
      margin-bottom: 10px;
    }
    p {
      color: #fff;
    }
  }
}
:deep(.el-dialog) {
  background: rgb(36, 36, 36);
}
:deep(.el-dialog__title), 
:deep(.el-dialog__body) {
  color: #f5f5f5;
}
:deep(.el-button--primary) {
  background: #eb6b35;
  border-color: #eb6b35;
}
</style>