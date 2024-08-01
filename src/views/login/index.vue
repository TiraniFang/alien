<template>
  <div class="login" v-drag>
    <video
      loop
      autoplay
      ref="video"
      @loadedmetadata="playVideo"
      muted="true"
      v-show="isConfirm"
    >
      <source src="../../assets/yjwj.mp4" type="video/mp4" />
    </video>
    <div class="min" @click="minimizeWindow('min')"></div>
    <div class="close" @click="minimizeWindow('min')"></div>
    <div class="title flex align-center">
      <img src="../../assets/login-title.png" />
      <span style="color: #666">{{ info2 + ".1" }}</span>
    </div>
    <div class="login-panel" v-if="isConfirm && loginEwm != ''">
      <img class="s-title" src="../../assets/login-st.png" alt="" />
      <img src="../../assets/s-line.png" alt="" class="line" />

      <img :src="loginEwm" alt="" class="ewm" />
      <img src="../../assets/s-line.png" alt="" class="line" />
      <p style="margin-top: 20px">微信扫一扫<br /><span>登陆可获得积分奖励</span></p>
      <!-- <el-button type="primary"  @click="callJavaMethod">获取</el-button> -->
      <!-- <div v-if="info2 != null">
        <h2>Received Information:</h2>
        <ul>
          <li>{{ info2 + ".2" }}</li>
           <li v-for="(value, key) in info2" :key="key">{{ key }}: {{ value }}</li> 
        </ul>
      </div>-->
    </div>
    <div class="swiper" v-if="!isConfirm && loginEwm == ''">
      <!-- :autoplay="swiper_options.autoplay" -->

      <swiper
        slides-per-view="1"
        :speed="swiper_options.speed"
        :loop="swiper_options.loop"
        :autoplay="swiper_options.autoplay"
      >
        <swiper-slide>
          <img class="bg" src="../../assets/reward.jpg" alt="" />
        </swiper-slide>
        <swiper-slide>
          <img class="bg" src="../../assets/reward2.jpg" alt="" />
        </swiper-slide>
        <swiper-slide style="background: url(../../assets/match_bj.jpg) no-repeat">
          <img class="bg" src="../../assets/match_bj.jpg" alt="" />
          <div class="containers" ref="containers">
            <!--  -->
            <!-- 这里放置你的超长内容 -->
            <div class="content" v-for="(item, index) in maxNumber" :key="item">
              <div class="box">
                <div
                  class="current"
                  v-if="
                    currentIndex == passList[passList.length - 1] &&
                    passList.includes(item)
                  "
                ></div>
                <div class="line" v-if="passList.includes(item)"></div>
                <div
                  class="item"
                  :class="{
                    pass: passList.includes(item),
                    ani: currentIndex == item,
                  }"
                >
                  <!-- 'current': item.currentGuan && currentIndex == index -->
                  <div class="redbag" @click="confirm">
                    <img src="../../assets/rebbag3.png" alt="" />
                    <span>969.6</span>
                    <img class="arrow" src="../../assets/arrow.png" alt="" />
                  </div>
                  <h3>关卡</h3>
                  <h2>{{ item }}</h2>
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <div class="confirm" :class="{ hide: isConfirm }" @click="confirm">
      <p>点击去获取奖励</p>
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
    <el-dialog v-model="dialogCzVisible" title="提示" width="500">
      <span>网吧积分消耗完毕，请联系店长充值！</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dialogCzVisible = false"> 关闭 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onBeforeUnmount, onMounted, reactive } from "vue";
import axios from "axios";
import api from "../../api/request";
import { ElMessage , ElMessageBox} from "element-plus";
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper.min.css";
import SwiperCore, { Autoplay, EffectFade } from "swiper";
SwiperCore.use([Autoplay, EffectFade]);
const video = ref(null);
const dialogGameVisible = ref(false);
const message = ref("");
const isConfirm = ref(false);
const dialogVisible = ref(false);
const router = useRouter();
const loginEwm = ref("");
const timer = ref(null);
const info = ref(null);
const info2 = ref(null);
const dialogCzVisible = ref(false)
const banner1 = ref(require("../../assets/match_bj.jpg"));
// const timer2 = ref(null);
const maxNumber = ref([603, 604, 605, 606, 607, 608, 609]);
const passList = ref([603, 604, 605, 606]);
const currentIndex = ref(606);
const allNumArray = ref([100, 200, 300, 400, 500, 600, 700]);
const hideLogin = ref(false);
onMounted(async () => {
  if (window.client) {
    window.handleMatchData = handleMatchData;
    window.minimizeWindow = minimizeWindow;
    window.showGamePopupTip = showGamePopupTip;
  } else {
    console.log("Java bridge not found");
  }
});
const showGamePopupTip = (str) => {
  dialogGameVisible.value = true;
  hideLogin.value = true;
  message.value = str;
};
//指定swiper的设置
let swiper_options = reactive({
  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },
  effect: "fade",
  loop: true,
  speed: 1000,
});
// const playVideo = () => {
//   timer2.value = setTimeout(() => {
//     video.value && video.value.play();
//   }, 500);
// };
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

// 一：客户端信息获取
const getClientInfo = () => {
  localStorage.setItem("netbarId", info.value.id);
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
      } else if (res.data.code = 40000) {
        dialogCzVisible.value = true
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
      if (res.data.message == "未登陆") {
        localStorage.setItem("numberToken", res.data.result.number);
        loginEwm.value = res.data.result.url;
        // 轮询登录状态
        timer.value = setInterval(() => {
          if (localStorage.getItem("numberToken")) {
            checkLoginStatus(localStorage.getItem("numberToken"));
          }
        }, 2000);
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
      if (res.data.code == 10000) {
        ElMessage.success("登录成功！");
        getIntegral();
        localStorage.setItem("loginStatus", true);
        localStorage.setItem("fistLogin", true);
        localStorage.setItem("timeCount", 0);
        if (res.data.result.nickname != "") {
          localStorage.setItem("nickName", res.data.result.nickname);
          localStorage.setItem("avatar", res.data.result.headimgurl);
        } else {
          localStorage.setItem("nickName", res.data.result.wid);
          localStorage.setItem("avatar", "");
        }

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
        localStorage.setItem("wid", res.data.result.wid);
      } else {
        ElMessage.error("未登录吗？");
      }
    });
};
onBeforeUnmount(() => {
  clearInterval(timer.value);
  timer.value = null;
});

const confirm = () => {
  isConfirm.value = true;
  // getClientInfo();
  callJavaMethod();
};
getClientVersion();
</script>
<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  // background: url(../../assets/login-bj2.jpg) no-repeat center;
  // background-size: cover;
  // background: url(../../assets/match_bj.jpg) no-repeat center bottom;
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  position: relative;
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
    z-index: 6;
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
.confirm {
  width: 248px;
  position: fixed;
  left: 50%;
  margin-left: -124px;
  bottom: 100px;
  text-align: center;
  span {
    color: #e5e5e5;
    display: inline-block;
    margin-top: 10px;
  }
  p {
    width: 248px;
    height: 68px;
    line-height: 68px;
    border-color: transparent;
    background: linear-gradient(to right, #ffd44a, #ff8a0a);
    border-radius: 4px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: #573303;
    margin-top: 50px;

    cursor: pointer;
  }

  &.hide {
    display: none;
  }
}
.bg {
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
}
.containers {
  overflow-x: hidden;
  overflow-y: auto;
  white-space: nowrap;
  padding-top: 320px;
  padding-bottom: 20px;
  position: relative;
  margin: 0 auto;
  height: 100%;
  height: 100%;
  box-sizing: border-box;
}
.content {
  display: inline-block;
  white-space: normal;
  height: 280px;
  width: 220px;
  &:nth-child(4n) .item .redbag {
    display: block;
  }
  .box {
    height: 100%;
    width: 100%;
    position: relative;
  }
  &:nth-child(odd) {
    .box {
      .item,
      .current {
        right: 50%;
        top: 0;
        transform: translateX(-50%);
      }
      .line {
        content: "";
        width: 1px;
        height: 66%;
        position: absolute;
        right: 30%;
        top: 33px;
        transform: rotate(-56deg);
        background: #818181;
      }
    }
  }
  &:nth-child(even) {
    .box {
      .line {
        content: "";
        width: 1px;
        height: 65%;
        position: absolute;
        right: 30%;
        top: 34px;
        transform: rotate(56deg);
        background: #818181;
        opacity: 0.6;
      }
      .item,
      .current {
        right: 50%;
        bottom: 0;
        transform: translateX(-50%);
      }
    }
  }

  .item {
    width: 67px;
    height: 104px;
    background: url(../../assets/gq-unfinish.png) no-repeat;
    background-size: contain;
    position: absolute;
    color: #919191;
    text-align: center;
    z-index: 1;

    .redbag {
      position: absolute;
      top: -126px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      display: none;
      animation: toTop2 1s infinite;
      cursor: pointer;
      .arrow {
        width: 20px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 99%;
        animation: toTop 1s infinite;
      }
      img {
        margin-right: 0;
        width: 70px;
      }
      span {
        font-size: 18px;
        font-weight: bold;
        color: #ffdfbc;
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
      }
    }

    h3 {
      margin: 0;
      margin-top: 5px;
    }
    h2 {
      margin: 0;
      margin-top: 3px;
      font-size: 30px;
    }
    &::before {
      content: "";
      width: 25px;
      height: 10px;
      background: #8d9195;
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 50%;
    }
    &::after {
      content: "";
      width: 35px;
      height: 17px;
      border: 1px solid #8d9195;
      position: absolute;
      bottom: -25px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 50%;
    }
    &.pass {
      background: url(../../assets/gq-finished.png) no-repeat;
      color: #cce7ff;
      background-size: contain;
      h3 {
        color: #e9c787;
      }
      h2 {
        color: #fdfff3;
      }
      &::before {
        background: #ffd375;
      }
      &::after {
        border-color: #ffd375;
      }
    }
    &.ani {
      opacity: 1;
      background: url(../../assets/gq-select.png) no-repeat;
      background-size: contain;
      &::after {
        border-width: 2px;
      }
      &::before {
        animation: beforeAni 1.5s infinite;
      }
      &::after {
        animation: afterAni 1.5s 0.1s infinite;
      }
    }
  }
  .current {
    width: 67px;
    height: 104px;
    position: absolute;
    // background: url(../../assets/gq-finished.png) no-repeat;
    // filter: blur(20px);
    color: #d8edff;
    z-index: 0;
  }
}
.swiper {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  .swiper-slide {
    height: 100vh;
    background-size: cover;
    background-position: center top;
    background-repeat: no-repeat;
    position: relative;
  }
}
@keyframes beforeAni {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  50% {
    width: 25px;
    height: 10px;
    opacity: 1;
  }
  100% {
    width: 0;
    height: 0;
    opacity: 0;
  }
}
@keyframes afterAni {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
    bottom: -20px;
  }
  50% {
    width: 35px;
    height: 17px;
    bottom: -25px;
  }
  100% {
    width: 0;
    height: 0;
    opacity: 0;
    bottom: -20px;
  }
}

@keyframes toTop {
  0% {
    top: 100%;
    opacity: 1;
  }
  50% {
    top: 90%;
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 1;
  }
}
@keyframes toTop2 {
  0% {
    top: -126px;
    opacity: 1;
  }
  50% {
    top: -150px;
    opacity: 1;
  }
  100% {
    top: -126px;
    opacity: 1;
  }
}
:deep(.el-message-box) {
  background-color: #222!important;
}
</style>
