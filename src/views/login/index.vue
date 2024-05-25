<template>
  <div class="login">
    <div class="title">
      <img src="../../assets/login-title.png" />
    </div>
    <div class="login-panel">
      <img class="s-title" src="../../assets/login-st.png" alt="">
      <img src="../../assets/s-line.png" alt="" class="line">
      <img :src="loginEwm" alt="" class="ewm">
      <img src="../../assets/s-line.png" alt="" class="line">
      <p>微信扫一扫立即参与</p>
    </div>
  </div>
</template>
<script setup>

import { ref , onBeforeUnmount} from 'vue'
import axios from 'axios'
import api from '../../api/request'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router';
const router = useRouter();

const loginEwm = ref('')
const timer = ref(null)
const netBarName = ref('')

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
  }).then(res => {
    console.log(res)
    if (res.data.code = 10000) {
      getStatus()
    }
  })
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

// 退出登录
const logout = (n) => {
  api.post('/method/account/', {
    method: 'GAME_USER_LOGOUT',
    number: n
  }).then(res => {
    console.log(res)
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
  console.log(2222+'33333')
  clearInterval(timer.value)
  console.log(timer.value)

})
getClientInfo()
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
</style>