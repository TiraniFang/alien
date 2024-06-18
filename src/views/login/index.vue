<template>
  <div class="login" v-drag>
    <video loop autoplay ref="video" @loadedmetadata="playVideo" muted="true">
      <source src="../../assets/yjwj.mp4" type="video/mp4" />
    </video>
    <div class="min" @click="minimizeWindow('min')"></div>
    <div class="close" @click="minimizeWindow('min')"></div>
    <div class="title flex align-center">
      <img src="../../assets/login-title.png" />
      <span style="color: #666">{{ info2 + ".1" }}</span>
    </div>
    <div class="login-panel">
      <img class="s-title" src="../../assets/login-st.png" alt="" />
      <img src="../../assets/s-line.png" alt="" class="line" />

      <img v-if="loginEwm != ''" :src="loginEwm" alt="" class="ewm" />
      <img src="../../assets/s-line.png" alt="" class="line" />
      <p style="margin-top: 20px">微信扫一扫立即参与</p>
      <!-- <el-button type="primary"  @click="callJavaMethod">获取</el-button> -->
      <!-- <div v-if="info2 != null">
        <h2>Received Information:</h2>
        <ul>
          <li>{{ info2 + ".2" }}</li>
           <li v-for="(value, key) in info2" :key="key">{{ key }}: {{ value }}</li> 
        </ul>
      </div>-->
    </div>
    <el-dialog v-model="dialogVisible" title="关闭窗口" width="500">
      <span>确认关闭程序吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="minimizeWindow('exit')"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogGameVisible" title="提示" width="500">
      <span>{{ message }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dialogGameVisible = false"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onBeforeUnmount, onMounted } from "vue";
import axios from "axios";
import api from "../../api/request";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const video = ref(null);
const dialogGameVisible = ref(false);
const message = ref("");

const dialogVisible = ref(false);
const router = useRouter();
const sign = ref("");
const sign2 = ref("");

const loginEwm = ref("");
const timer = ref(null);
const info = ref(null);
const info2 = ref(null);

const timer2 = ref(null);
onMounted(async () => {
  if (window.client) {
    window.handleMatchData = handleMatchData;
    window.minimizeWindow = minimizeWindow;
    window.showGamePopupTip = showGamePopupTip;
    // try {
    //   const result = await window.handleMatchData();
    //   console.log("Result from handleMatchData", result);
    // } catch (error) {
    //   console.log("Error", error);
    // }
  } else {
    console.log("Java bridge not found");
  }
});
const showGamePopupTip = (str) => {
  dialogGameVisible.value = true;
  message.value = str;
};
const playVideo = () => {
  timer2.value = setTimeout(() => {
    video.value && video.value.play();
  }, 500);
};
if (localStorage.getItem("loginStatus")) {
  router.replace("/home");
}
const getClientVersion = () => {
  if (window.client) {
    try {
      const jsonString = window.client.getClientVersion();
      const data = jsonString;
      console.log("Parsed JSON Data:", data);
      info2.value = data;
    } catch (error) {
      console.error("Failed to call Java method or parse JSON:", error);
    }
  } else {
    console.log("Java bridge not found");
  }
};
const callJavaMethod = () => {
  if (window.client) {
    try {
      const jsonString = window.client.getClientInfo();
      console.log("Received JSON from Java:", jsonString);
      const data = JSON.parse(jsonString);
      console.log("Parsed JSON Data:", data);
      info.value = data;
      localStorage.setItem("netBarName", info.value.barName);
      Object.keys(info).length > 0 && getClientInfo();
    } catch (error) {
      console.error("Failed to call Java method or parse JSON:", error);
    }
  } else {
    info.value = {
      id: "0",
    };
    console.log("Java bridge not found");
  }
};
const minimizeWindow = (str) => {
  if (window.client) {
    try {
      window.client.minimizeWindow(str);
      if (str == "exit") {
        dialogVisible.value = false;
      }
    } catch (error) {
      console.error("Failed to call Java method or parse JSON:", error);
    }
  } else {
    console.log("Java bridge not found");
  }
};
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
//       localStorage.setItem('netBarName', data.result.name)
//     } catch (e) {
//       return;
//     }

//   } catch (error) {
//     console.error('Axios Error:', error);
//   }
// };

// 一：客户端信息获取
const getClientInfo = () => {
  api
    .post("/method/client/", {
      method: "GET_CLIENT_INFO",
      // id: 23,
      // name: "kamisama",
      // mac: "08-97-98-96-50-A0",
      // sign: "f0214886c1c4604f6d96c0c9719de233",
      id: info.value.id,
      name: info.value.name,
      mac: info.value.mac,
      sign: info.value.sign,
    })
    .then((res) => {
      console.log(res);
      // getStatus()
      if (res.data.code == 10000) {
        getStatus();
      }
    });
};
const gameLogout = (obj) => {
  ElMessage.success("登出");
  // const data = JSON.parse(obj);
  api
    .post("/method/account/", {
      method: "GAME_USER_LOGOUT",
    })
    .then((res) => {
      localStorage.clear();
    });
};

// 获取登录二维码
const getStatus = () => {
  api
    .post("/method/account/", {
      method: "CHECK_LOGIN",
    })
    .then((res) => {
      // 如果未登录则返回二维码扫码和number
      console.log(res);

      if (res.data.message == "未登陆") {
        localStorage.setItem("numberToken", res.data.result.number);
        loginEwm.value = res.data.result.url;
        // 轮询登录状态
        timer.value = setInterval(() => {
          if (localStorage.getItem("numberToken")) {
            checkLoginStatus(localStorage.getItem("numberToken"));
          }
        }, 1000);
      }
    });
};

// checkLoginStatus  查询登录状态
const checkLoginStatus = (n) => {
  api
    .post("/method/account/", {
      method: "QUERY_LOGIN_STATUS",
      number: n,
    })
    .then((res) => {
      console.log(res);
      if (res.data.code == 10000) {
        ElMessage.success("登录成功！");
        getIntegral();
        localStorage.setItem("loginStatus", true);
        localStorage.setItem("fistLogin", true);
        let timer = setTimeout(() => {
          router.replace("/home");
          clearTimeout(timer);
        }, 1000);
        // 编码失效
      } else if (res.data.code == 10008) {
        clearInterval(timer.value);
        getStatus();
      }
    });
};

const handleMatchData = async function (str, callback) {
  try {
    callback("wrong msg");
  } catch (error) {
    console.log(error);
    callback("error");
  }
};
// if (localStorage.getItem("loginStatus")) handleMatchData({});

// 获取当前用户积分
const getIntegral = () => {
  api
    .post("/method/account/", {
      method: "GET_USER_INTEGRAL",
    })
    .then((res) => {
      if ((res.data.code = 10000)) {
        localStorage.setItem("myIntergral", res.data.result.number);
        localStorage.setItem("matchCount", res.data.result.match_count);
        localStorage.setItem("matchLevel", res.data.result.match_level);
        // myIntergral.value = localStorage.getItem("myIntergral");
      } else {
        ElMessage.error("未登录吗？");
      }
    });
};
onBeforeUnmount(() => {
  clearInterval(timer.value);
  clearTimeout(timer2.value);
  timer.value = null;
  timer2.value = null;
});
// getMyNetInfo()
// gameLogout();
// getClientInfo();
callJavaMethod();
getClientVersion();
</script>
<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  // background: url(../../assets/login-bj.jpg) no-repeat center;
  // background-size: cover;
  // position: relative;
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }
  .title {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 20px;
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
    z-index: 2;
    position: absolute;
    top: 0;
    left: 0;
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
