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
                  <img :src="currentAvatar" alt="" />
                </div>
                <div>
                  <div class="flex align-center">
                    <h5>{{ nickName }}</h5>
                    <EditPen
                      @click="dialogUpdateInfo = true"
                      style="
                        width: 15px;
                        margin-left: 10px;
                        margin-top: -5px;
                        cursor: pointer;
                      "
                    />
                  </div>
                  <!-- <div class="flex align-center" v-if="showIpt" style="width: 120px">
                    <el-input
                      v-model="nickName"
                      maxlength="8"
                      @blur="confirmNickName"
                    ></el-input>
                    <FolderChecked
                      @click="confirmNickName"
                      style="
                        width: 20px;
                        margin-left: 10px;
                        margin-top: -5px;
                        cursor: pointer;
                      "
                    />
                  </div> -->
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
                    当前积分：<span>{{ intergral }}</span>
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

    <!-- <div class="redbag" v-if="show">
      <div class="layouts"></div>
      <img src="../assets/rebbag2.png" alt="">
      <el-button type="primary" @click="rewardVisible = true"> 领取 </el-button>
    </div> -->
    <el-dialog
      v-model="rewardVisible"
      title="奖励领取提示"
      width="500"
      center
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div class="text-center">
        <img
          style="max-width: 50%; display: inline-block; margin-top: 30px"
          src="../assets/ewm.png"
          alt=""
        />
        <p style="margin-top: 20px; margin-bottom: 20px">
          您的奖励已发放至小程序，微信扫一扫查看奖励详情
        </p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="toRankLog"> 查看奖励发放记录 </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogUpdateInfo" title="修改个人资料" width="1200">
      <el-form :model="form" label-width="auto" style="max-width: 100%">
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" maxlength="6" />
        </el-form-item>
        <el-form-item label="头像">
          <el-image
            style="width: 100px; border: 1px solid rgb(228, 228, 228); border-radius: 4px"
            :src="form.avatar"
          ></el-image>
        </el-form-item>
        <el-form-item label="请选择">
          <div class="flex imgFlex flex-wrap">
            <el-image
              v-for="item in 30"
              :key="item"
              @click="chooseAvatar(item)"
              :src="'http://cs.itytl.com/img/head/' + item + '.jpg'"
            ></el-image>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogUpdateInfo = false">取消 </el-button>
          <el-button type="primary" @click="updateInfo"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, onBeforeUnmount, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { EditPen, FolderChecked } from "@element-plus/icons-vue";

import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

import api from "../api/request";
const dialogUpdateInfo = ref(false);
const showIpt = ref(false);
const nickName = ref(localStorage.getItem("nickName"));
const props = defineProps(["intergral"]);
const emits = defineEmits(["childEvent"]);
const percentage = ref(0);
const dialogGameVisible = ref(false);
const message = ref("");
const dialogVisible = ref(false);
const currentIndex = ref(0);
const myIntergral = ref(Number(localStorage.getItem("myIntergral")));
const wid = ref(localStorage.getItem("wid"));
const statusReward = ref(0);
const showAddInter = ref(false);
const rewardVisible = ref(false);
const info = ref(null);
const sign = ref("");
const sign2 = ref("");
const netBarName = ref(localStorage.getItem("netBarName"));
const timer3 = ref(null);
const avatar = ref("");
const currentAvatar = ref(
  localStorage.getItem("avatar") == ""
    ? require("../assets/logo.jpg")
    : localStorage.getItem("avatar")
);
const form = ref({
  nickname: localStorage.getItem("nickName"),
  avatar:
    localStorage.getItem("avatar") == ""
      ? require("../assets/logo.jpg")
      : localStorage.getItem("avatar"),
});
const localCount = ref(localStorage.getItem("timeCount"));
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
    text: "闯关",
    path: "/match",
    icon: require("../assets/chuangguan.png"),
    activeIcon: require("../assets/chuangguan-on.png"),
  },
  {
    text: "比赛",
    path: "/competition",
    icon: require("../assets/rankSai.png"),
    activeIcon: require("../assets/rankSai-on.png"),
  },
  {
    text: "网吧对战",
    path: "/leagueMatch",
    icon: require("../assets/match-icon.png"),
    activeIcon: require("../assets/match-on.png"),
  },
  {
    text: "赚积分",
    path: "/gift",
    icon: require("../assets/shop.png"),
    activeIcon: require("../assets/shop-on.png"),
  },
  {
    text: "福利",
    path: "/shop",
    icon: require("../assets/gift.png"),
    activeIcon: require("../assets/gift-on.png"),
  },
]);
const router = useRouter();
const route = useRoute();
watch(
  route,
  (newValue, oldValue) => {
    if (newValue.path == "/match") {
      getIntegral();
    }
  },
  { deep: true }
);
onMounted(async () => {
  isCurrentPath(route.path);
  getIntegral();
  // 与客户端交互
  if (window.client) {
    window.minimizeWindow = minimizeWindow;
    window.showGamePopupTip = showGamePopupTip;
    window.handleMatchData = handleMatchData;
  } else {
    console.log("Java bridge not found");
  }
});
const blurNickName = () => {
  showIpt.value = false;
  nickName.value = localStorage.getItem("nickName");
};
// 修改头像
const chooseAvatar = (item) => {
  avatar.value = item;
  form.value.avatar = "http://cs.itytl.com/img/head/" + item + ".jpg";
};
// 修改昵称
const updateInfo = () => {
  if (form.value.nickname.length > 6) {
    ElMessage.warning("最多输入6个字");
    return false;
  }
  if (form.value.nickname == "") {
    ElMessage.warning("请输入昵称");
    return false;
  }
  api
    .post("/method/account/", {
      method: "CHANGE_NICKNAME",
      nickname: form.value.nickname,
    })
    .then((res) => {
      if (res.data.code == 10000) {
        nickName.value = form.value.nickname;
        localStorage.setItem("nickName", nickName.value);
        emits("childEvent");

        dialogUpdateInfo.value = false;
      }
    });
  if (avatar.value != "") {
    api
      .post("/method/account/", {
        method: "CHANGE_HEADIMG",
        name: avatar.value,
      })
      .then((res) => {
        if (res.data.code == 10000) {
          localStorage.setItem("avatar", form.value.avatar);
          currentAvatar.value =
            "http://bs.itytl.com/images/head/" + avatar.value + ".jpg";
          emits("childEvent");

          dialogUpdateInfo.value = false;
        }
      });
  }
};

// 查询登录状态时间

const checkLoginStatus = () => {
  api
    .post("/method/account/", {
      method: "CHECK_LOGIN_LIFE",
    })
    .then((res) => {
      localStorage.setItem("timeCount", res.data.result.LoginTickCount);
      if (localStorage.getItem("timeCount") <= 3600) {
        percentage.value = Number(
          ((Number(localStorage.getItem("timeCount")) / 60 / 60) * 100).toFixed(2)
        );
      } else {
        percentage.value = Number(
          (((Number(localStorage.getItem("timeCount")) % 3600) / 60 / 60) * 100).toFixed(
            2
          )
        );
      }
      getIntegral();
      if (res.data.result.NewRewardMessage == 1) {
        rewardVisible.value = true;
      }
    });
};

// 一分钟检测一次登录状态
timer3.value = setInterval(() => {
  checkLoginStatus();
  emits("childEvent");
}, 60000);
checkLoginStatus();
window.addEventListener("storage", (event) => {
  if (event.key === "myIntergral") {
    myIntergral.value = event.newValue;
    getIntegral();
    emits("childEvent");
  }
});

const toRankLog = () => {
  rewardVisible.value = false;
  router.push("/user#rank");
};
onBeforeUnmount(() => {
  clearInterval(timer3.value);
  timer3.value = null;
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
      getIntegral();
      break;
    case "/competition":
      currentIndex.value = 2;
      break;
    case "/rankInfo":
      currentIndex.value = 2;
      break;
    case "/leagueMatch":
      currentIndex.value = 3;
      break;
    case "/gift":
      currentIndex.value = 4;
      break;
    case "/shop":
      currentIndex.value = 5;
      break;
    default:
      rewardVisible.value = false;

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
        NetcafePlaySn: info.value.NetcafePlaySn,
        Win: info.value.win,
        Rank: info.value.rank,
        Sign: sign.value,
      })
      .then((res) => {
        if (res.data.code == 10000) {
          emits("childEvent");
          getIntegral();
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
        localStorage.setItem("wid", res.data.result.wid);
        myIntergral.value = Number(res.data.result.number);
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
        let i = setTimeout(() => {
          window.location.reload();
          clearTimeout(i);
        }, 1000);
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
  margin-right: 60px;
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
  width: 150px;
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
:deep(.el-input__wrapper) {
  background: none;
  line-height: 16px;
  height: 24px;
  margin-bottom: 3px;
}
:deep(.el-input__inner) {
  color: #fff;
}
.imgFlex .el-image {
  width: 100px;
  margin: 5px;
}
</style>
