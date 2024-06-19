<template>
  <div>
    <keep-alive>
      <div class="nav-header">
        <div class="min" @click="minimizeWindow('min')"></div>
        <div class="close" @click="minimizeWindow('min')"></div>
        <div class="container" style="height: auto">
          <div class="flex space-between align-center">
            <div class="logo flex align-center">
              <img class="logo" src="../assets/logo.png" alt="" />
              <div>
                <img class="slogon" src="../assets/slogon.png" alt="" />
                <span>{{ netBarName }}欢迎您~</span>
              </div>
            </div>
            <div class="menu flex align-center">
              <router-link
                v-for="(item, index) in menus"
                :key="item.text"
                :class="{ on: currentIndex == index }"
                :to="item.path"
                v-on:click.prevent
              >
                <div class="flex align-center">
                  <img
                    class="icon"
                    v-if="currentIndex == index"
                    :src="item.activeIcon"
                    alt=""
                  />
                  <img class="icon" v-else :src="item.icon" alt="" />
                  <span>{{ item.text }}</span>
                </div>
                <!-- <div class="ewm" v-if="index == menus.length -1">
                  <img src="../assets/login-ewm.png" alt="">
                </div> -->
              </router-link>
            </div>

            <div class="personal-center">
              <div class="flex align-center">
                <div class="avatar">
                  <el-progress
                    type="circle"
                    :percentage="percentage"
                    status="exception"
                    :stroke-width="10"
                  ></el-progress>
                  <p class="inter" :class="{ show: showAddInter }"><span>+10</span></p>
                  <img src="../assets/logo.jpg" alt="" />
                </div>
                <div>
                  <h5>外星人用户</h5>
                  <!-- <p style="margin-bottom: 5px">
                    <el-tooltip
                      class="box-item"
                      effect="light"
                      :content="'在线满一小时加10积分，当前进度' + percentage + '%'"
                      placement="top"
                    >
                      <el-progress
                        :percentage="percentage"
                        :stroke-width="5"
                        status="warning"
                        striped
                        striped-flow
                      />
                    </el-tooltip>
                  </p> -->
                  <p>
                    当前积分：<span>{{ myIntergral }}</span>
                  </p>
                </div>
              </div>
              <div class="drop-menu">
                <router-link to="/user">个人中心</router-link>
                <!-- <router-link to="/user#cash" >游戏记录</router-link> -->
                <a href="javascript:;" @click="dialogVisible = true">退出登录</a>
              </div>
            </div>
          </div>
        </div>
        <!-- <div v-if="info" style="background: #fff;">
          <h2>Received Information:</h2>
          <ul>
          <li v-for="(value, key) in info" :key="key">{{ key }}: {{ value }}</li>
            <li>sign: {{sign}}</li>
            <li>sign2: {{sign2}}</li>
            <li>cookie: {{cookie}}</li>
            <li>number: {{number}}</li>
            <li>info: {{info}}</li>
          </ul>
        </div>   -->
      </div>
    </keep-alive>

    <el-dialog v-model="dialogVisible" title="退出登录" width="500">
      <span>确认退出吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="toQuit"> 确定 </el-button>
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
import { ref, watch, onMounted, onBeforeUnmount, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

import api from "../api/request";
// import { getIntergral } from '../utils/base.js'

const emits = defineEmits(["childEvent"]);
const percentage = ref(0);
const dialogGameVisible = ref(false);
const message = ref("");
const dialogVisible = ref(false);
const currentIndex = ref(0);
const myIntergral = ref(localStorage.getItem("myIntergral"));
const showAddInter = ref(false);
const info = ref(null);
const sign = ref("");
const sign2 = ref("");
const netBarName = ref(localStorage.getItem("netBarName"));
const timer3 = ref(null);
const timeCount = ref(null);
const localCount = ref(localStorage.getItem("timeCount"));
const seconds = ref(0);
const number = ref(localStorage.getItem("numberToken"));
const cookie = document.cookie.replace(
  /(?:(?:^|.*;\s*)LOL_MATCH_SERVER\s*\=\s*([^;]*).*$)|^.*$/,
  "$1"
);

const menus = ref([
  {
    text: "主页",
    path: "/home",
    icon: require("../assets/home.png"),
    activeIcon: require("../assets/home-on.png"),
  },
  {
    text: "比赛",
    path: "/match",
    icon: require("../assets/match-icon.png"),
    activeIcon: require("../assets/match-on.png"),
  },
  {
    text: "福利",
    path: "/gift",
    icon: require("../assets/gift.png"),
    activeIcon: require("../assets/gift-on.png"),
  },
  {
    text: "商城",
    path: "/shop",
    icon: require("../assets/shop.png"),
    activeIcon: require("../assets/shop-on.png"),
  },
]);
const router = useRouter();
const route = useRoute();

// 一小时倒计时
timeCount.value = setInterval(() => {
  localCount.value++;
  localStorage.setItem("timeCount", localCount.value);
  localCount.value = localStorage.getItem("timeCount");
  percentage.value = Number(((localCount.value / 60 / 60) * 100).toFixed(2));
  if (localCount.value == 3600) {
    showAddInter.value = true;
    localCount.value = 0;
    percentage.value = 0;
    localStorage.setItem("timeCount", 0);
    getIntegral();
  } else {
    showAddInter.value = false;
  }
}, 1000);

onMounted(async () => {
  isCurrentPath(route.path);

  if (window.client) {
    window.minimizeWindow = minimizeWindow;
    window.showGamePopupTip = showGamePopupTip;
    window.handleMatchData = handleMatchData;
    //  window.gameLogin = gameLogin
    //  window.gameLogout = gameLogout
  } else {
    console.log("Java bridge not found");
  }
  // try {
  //   const result = await window.handleMatchData();
  //   console.log("Result from handleMatchData", result);
  // } catch (error) {
  //   console.log("Error", error);
  // }
});

// 查询登录状态时间

const checkLoginStatus = () => {
  api
    .post("/method/account/", {
      method: "CHECK_LOGIN_LIFE",
    })
    .then((res) => {});
};

timer3.value = setInterval(() => {
  checkLoginStatus();
}, 60000);
checkLoginStatus();

watch(
  () => route.path,
  (path) => {
    isCurrentPath(path);
  }
);
onBeforeMount(() => {
  percentage.value = Number(
    ((localStorage.getItem("timeCount") / 60 / 60) * 100).toFixed(2)
  );
});
onBeforeUnmount(() => {
  clearInterval(timer3.value);
  timer3.value = null;
  clearInterval(timeCount.value);
  timeCount.value = null;
});
const showGamePopupTip = (str) => {
  dialogGameVisible.value = true;
  message.value = str;
};
const isCurrentPath = (path) => {
  switch (path) {
    case "/":
      currentIndex.value = 0;
      break;

    case "/home":
      currentIndex.value = 0;
      break;
    case "/match":
      currentIndex.value = 1;
      break;
    case "/gift":
      currentIndex.value = 2;
      break;
    case "/shop":
      currentIndex.value = 3;
      break;
    default:
      currentIndex.value = -1;
  }
};

const handleMatchData = async function (str, callback) {
  try {
    const data = JSON.stringify(str);
    info.value = JSON.parse(data);

    sign.value = "";
    sign2.value = "";
    sign.value =
      localStorage.getItem("numberToken") +
      info.value.summonerId +
      info.value.server +
      info.value.tier +
      info.value.queueId +
      info.value.gameLength +
      info.value.championId +
      info.value.championsKill +
      info.value.assists +
      info.value.numDeaths +
      info.value.goldEarned +
      info.value.minionsKilled +
      info.value.level +
      info.value.visionScore +
      info.value.win +
      info.value.rank +
      "LOLUID1FE7111E9FB0FBF7B13E338923FC2C32FG";
    sign2.value = sign.value;

    // MD5加密cons
    sign.value = CryptoJS.MD5(sign.value).toString();

    const response = await api
      .post("/method/account/", {
        method: "SUBMIT_MATCH_DATA",
        Type: info.value.gameType,
        Tier: info.value.tier,
        Server: info.value.server,
        SummonerName: info.value.summonerName,
        QueueId: info.value.queueId,
        SummonerId: info.value.summonerId,
        GameLength: info.value.gameLength,
        ChampionId: info.value.championId,
        ChampionsKilled: info.value.championsKill,
        Assists: info.value.assists,
        NumDeaths: info.value.numDeaths,
        GoldEarned: info.value.goldEarned,
        MinionsKilled: info.value.minionsKilled,
        Level: info.value.level,
        VisionScore: info.value.visionScore,
        Win: info.value.win,
        Rank: info.value.rank,
        Sign: sign.value,
      })
      .then((res) => {
        if (res.data.code == 10000) {
          // getIntegral();
          callback("true");
        } else {
          callback(res.data.message);
        }
      });
  } catch (error) {
    callback("error2");
  } finally {
    emits("childEvent");
  }
};

// 最小化、关闭窗口
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
        myIntergral.value = localStorage.getItem("myIntergral");
      } else {
        ElMessage.error("未登录吗？");
      }
    });
};

// 退出登录
const toQuit = () => {
  // 退出登录
  api
    .post("/method/account/", {
      method: "GAME_USER_LOGOUT",
    })
    .then((res) => {
      if (res.data.code == 10000) {
        ElMessage.success("退出成功");
        clearInterval(timer3.value);
        Object.keys(Cookies.get()).forEach((name) => {
          Cookies.remove(name);
        });
        localStorage.clear();
        router.replace("/login");
      }
    });
};
// getIntergral()
// localStorage.getItem("loginStatus") && getIntegral();
</script>
<style lang="scss" scoped>
.nav-header {
  box-sizing: border-box;
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  height: 99px;
  top: 0;
  left: 0;
  z-index: 5;
  transition: all 0.2s;
}
.menu {
  position: relative;
  margin-left: 60px;
  .ewm {
    background: rgba(0, 0, 0, 0.4);
    padding: 30px;
    position: absolute;
    left: 100%;
    transform: translateX(-50%);
    top: 61px;
    display: none;
  }
  a {
    color: #c5c5c5;
    margin: 0 20px;
    font-weight: bold;
    position: relative;
    &:last-child:hover {
      .ewm {
        display: block;
      }
    }

    &.on,
    &:hover {
      color: #ffb967;
      &:after {
        content: "";
        width: 175px;
        height: 102px;
        background: url(@/assets/currentIndex.png) no-repeat;
        position: absolute;
        position: absolute;
        left: 60%;
        bottom: -37px;
        transform: translateX(-50%);
      }
    }
  }
}
.icon {
  width: 25px;
  height: 25px;
  margin-right: 10px;
}
.logo {
  width: 73px;
  height: 79px;
  margin-right: 20px;
  position: relative;
  span {
    color: #e2edff;
    display: block;
    width: 200px;
    font-size: 12px;
    margin-top: 5px;
  }
}
.slogon {
  width: 269px;
  height: 29px;
}
.personal-center {
  color: #fff;
  position: relative;
  height: 100%;
  height: 99px;
  display: flex;
  padding: 20px 0;
  margin-right: 60px;
  box-sizing: border-box;
  .avatar {
    width: 70px;
    height: 70px;
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;
    z-index: 6;
    .inter {
      width: 50px;
      height: 50px;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
      border-radius: 50%;
      text-align: center;
      line-height: 50px;
      display: none;
      span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: toTop 1s;
      }
      &.show {
        display: block;
      }
    }
    img {
      max-width: 100%;
      width: 50px;
      height: 50px;
      position: absolute;
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
    }
  }
  h5 {
    margin: 0;
    margin-bottom: 5px;
  }
  p {
    font-size: 12px;
    span {
      color: #ffb967;
    }
  }
  .drop-menu {
    padding: 10px 0;
    width: 100%;
    box-sizing: border-box;
    background: #36363a;
    position: absolute;
    top: 99%;
    left: 0;
    display: none;
    a {
      display: block;
      color: #d0d0d1;
      text-align: center;
      font-size: 12px;
      padding: 10px 0;
      &:hover {
        background: rgb(74, 74, 74);
      }
    }
  }
  &:hover .drop-menu {
    display: block;
  }
}

@keyframes toTop {
  0% {
    top: 50%;
    opacity: 1;
  }

  100% {
    top: 20%;
    opacity: 0;
  }
}
:deep(.el-dialog),
:deep(.el-message-box) {
  background: rgb(36, 36, 36) !important;
  background-color: rgb(36, 36, 36) !important;
}
:deep(.el-dialog__title),
:deep(.el-dialog__body) {
  color: #f5f5f5;
}
:deep(.el-button--primary),
:deep(.el-message-box__btns .el-button--primary) {
  background: #eb6b35;
  border-color: #eb6b35;
}
:deep(.el-progress__text) {
  display: none;
}
:deep(.el-progress) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
:deep(.el-progress-circle) {
  width: 58px !important;
  height: 58px !important;
}
</style>
