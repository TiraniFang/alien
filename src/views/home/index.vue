<template>
  <Header v-drag @childEvent="getTaskList" :intergral="myIntergral" />
  <div v-drag class="home">
    <div class="layout"></div>
    <div class="container">
      <div class="swiper">
        <swiper
          slides-per-view="1"
          :autoplay="swiper_options.autoplay"
          :speed="swiper_options.speed"
          :loop="swiper_options.loop"
        >
          <swiper-slide
            v-for="(item, index) in advertiseList"
            :key="index"
            :style="{ 'background-image': `url(${item.banner})` }"
          ></swiper-slide>
        </swiper>
      </div>
      <div class="pagination">
        <div
          class="game-btn"
          @click="switchGame(index)"
          :class="{ on: gameIndex == index }"
          v-for="(item, index) in gameList"
          :key="item.name"
          :style="{ 'background-image': `url(${gameList[index].icon})` }"
        >
          <div class="flex align-center gameIcon">
            <img :src="item.gameIcon" alt="" />
            <p>{{ item.name }}</p>
          </div>
          <div class="bg"></div>
        </div>
      </div>
      <div class="theme">
        <img src="../../assets/theme.png" alt="" />
        <p>完成比赛任务可以获得相应的现金奖励</p>
        <p style="font-size: 14px; color: #e5e5e5">累计在线可获得积分奖励</p>
        <!-- 
        <el-button class="start-game" @click="launchLOL" :disabled="isDisabled">{{
          btnMsg
        }}</el-button> -->
      </div>
      <div class="task">
        <div class="container">
          <div class="flex space-between">
            <div class="title flex align-center">
              <img src="../../assets/task.png" alt="" />
              <span
                >福利进度<span style="font-size: 12px">
                  (积分可用于闯关和商城兑换奖品)
                </span></span
              >
              <!-- <span class="rule" @click="showRuleDialog = true">[活动规则]</span> -->
            </div>
            <router-link class="toGift" to="/gift">查看全部</router-link>
          </div>
          <div class="flex space-between">
            <div class="item">
              <img class="icon" src="../../assets/coin.png" alt="" />
              <div class="title" v-if="taskList.length > 0">
                奖励{{ taskList[0].rewardIntegral }}{{ taskList[0].type }}
              </div>
              <div class="bottom">
                <div class="flex align-center">
                  <p>任务要求：</p>
                  <div
                    class="flex align-center"
                    style="cursor: pointer"
                    @click="showRuleDialog = true"
                  >
                    点击查看任务要求详情<el-icon color="#6b3c11" :size="18"
                      ><QuestionFilled
                    /></el-icon>
                  </div>
                </div>
                <p v-if="taskList.length > 0">
                  当前进度：{{ taskList[0].finish }}/{{ taskList[0].total }}
                </p>
                <!-- <div class="btn none" v-if="item.status == 0">未完成</div> -->
                <div class="btn" v-if="taskList.length > 0 && taskList[0].status == 1">
                  已发放
                </div>
              </div>
            </div>
            <div class="item">
              <img class="icon" src="../../assets/coin.png" alt="" />
              <div class="title" v-if="taskList.length > 0">
                奖励{{ taskList[1].rewardIntegral }}{{ taskList[1].type }}
              </div>
              <div class="bottom">
                <div class="flex align-center">
                  <p>任务要求：</p>
                  <div
                    class="flex align-center"
                    style="cursor: pointer"
                    @click="showRuleDialog = true"
                  >
                    点击查看任务要求详情<el-icon color="#6b3c11" :size="18"
                      ><QuestionFilled
                    /></el-icon>
                  </div>
                </div>
                <p v-if="taskList.length > 0">
                  当前进度：{{ taskList[1].finish }}/{{ taskList[1].total }}
                </p>
                <!-- <div class="btn none" v-if="item.status == 0">未完成</div> -->
                <div class="btn" v-if="taskList.length > 0 && taskList[1].status == 1">
                  已发放
                </div>
              </div>
            </div>
            <div class="item">
              <img class="icon" src="../../assets/coin.png" alt="" />
              <!-- <img class="icon" src="../../assets/rebbag.png" alt="" /> -->

              <div class="title" v-if="taskList.length > 0">
                奖励{{ lastReward.rewardIntegral }}{{ lastReward.type }}
              </div>
              <div class="bottom">
                <div class="flex align-center">
                  <p>任务要求：</p>
                  <div
                    class="flex align-center"
                    style="cursor: pointer"
                    @click="showRuleDialog = true"
                  >
                    点击查看任务要求详情<el-icon color="#6b3c11" :size="18"
                      ><QuestionFilled
                    /></el-icon>
                  </div>
                </div>
                <p v-if="taskList.length > 0">
                  当前进度：{{ lastReward.finish }}/{{ lastReward.total }}
                </p>
                <!-- <div class="btn none" v-if="item.status == 0">未完成</div> -->
                <div class="btn" v-if="taskList.length > 0 && lastReward.status == 1">
                  已发放
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <GiftDialog
      :detail="currentGift"
      v-if="showGiftDialog"
      @continueTasks="showGiftDialog = false"
    />
    <Rules v-if="showRuleDialog" @closeRules="showRuleDialog = false" />

    <el-dialog v-model="dialogGameVisible" title="提示" width="500">
      <span>请去菜单启动游戏</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="dialogGameVisible = false"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Home",
};
</script>
<script setup>
import { ref, onBeforeUnmount, reactive } from "vue";
import Header from "@/components/header.vue";
import { QuestionFilled } from "@element-plus/icons-vue";
import GiftDialog from "../gift/components/gift-dialog.vue";
import Rules from "./components/rules.vue";
import { ElMessage } from "element-plus";
import api from "../../api/request";
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper.min.css";
import SwiperCore, { Autoplay, EffectFade } from "swiper";
SwiperCore.use([Autoplay, EffectFade]);
// Import Swiper styles
const router = useRouter();
// 当前游戏索引
const currentIndex = ref(0);
const gameIndex = ref(0);
const myIntergral = ref(localStorage.getItem("myIntergral"));
const btnMsg = ref("开始游戏");
const dialogGameVisible = ref(false);
const info = ref(null);
const gameType = ref("LOL");
const isDisabled = ref(false);
const taskList = ref([]);
// 点击的当前任务奖励
const currentGift = ref(0);
const showGiftDialog = ref(false);
const showRuleDialog = ref(false);
const timer = ref(null);
const timer2 = ref(null);
const lastReward = ref({});

onBeforeUnmount(() => {
  // clearInterval(timer2.value);
  clearInterval(timer.value);
  timer.value = null;
  // timer2.value = null;
});
//指定swiper的设置
let swiper_options = reactive({
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  effect: "fade",
  loop: true,
  speed: 1000,
});
const gameList = ref([
  {
    name: "英雄联盟",
    icon: require("../../assets/lol-btn2.jpg"),
    banner: require("../../assets/banner03.jpg"),
    gameIcon: require("../../assets/lol.png"),
  },
  {
    name: "永劫无间",
    icon: require("../../assets/yjwj-btn.jpg"),
    banner: require("../../assets/banner01.jpg"),
    gameIcon: require("../../assets/yjwj.png"),
  },
]);

const advertiseList = ref([
  {
    banner: require("../../assets/banner03.jpg"),
  },
  {
    banner: require("../../assets/banner01.jpg"),
  },
]);

const onSwiper = (swiper) => {
  console.log(swiper);
};
const launchLOL = () => {
  btnMsg.value = "启动游戏中...";
  if (window.client) {
    try {
      isDisabled.value = true;
      const jsonString = window.client.launchGame(gameType.value);
      const data = JSON.parse(jsonString);
      info.value = data;
      let timer = setTimeout(() => {
        btnMsg.value = "开始游戏";
        isDisabled.value = false;
        clearTimeout(timer);
      }, 18000);
    } catch (error) {
      ElMessage.error(error);
    }
  } else {
    ElMessage.error("no window.client");
    btnMsg.value = "开始游戏";
    isDisabled.value = false;
    clearTimeout(timer);
  }
};

// 切换游戏
const switchGame = (index) => {
  gameIndex.value = index;
  dialogGameVisible.value = true;
  if (index == 1) {
    gameType.value = "Naraka";
  } else {
    gameType.value = "LOL";
  }
};

// 获取任务数据列表
const getTaskList = () => {
  api
    .post("/method/account/", {
      method: "GET_QUEST_DATA_NEW",
    })
    .then((res) => {
      taskList.value = res.data.result.slice(0, 2);
      const last = res.data.result[res.data.result.length - 1];
      lastReward.value = last;
      // taskList.value.push(last);
    });
};

// inter();
if (!localStorage.getItem("loginStatus")) {
  router.replace("/login");
} else {
  getTaskList();
}
</script>
<style lang="scss">
.home {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  position: relative;
  transition: all 0.2s;
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
  .layout {
    width: 100%;
    height: 100%;
    background: url(../../assets/home-gray.png) no-repeat;
    background-size: cover;
    position: absolute;
    top: -0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }
  .pagination {
    position: absolute;
    left: 2vw;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    .game-btn {
      width: 270px;
      height: 82px;
      margin-bottom: 10px;
      border: 2px solid rgb(70, 70, 70);
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      position: relative;
      cursor: pointer;
      transition: all 0.2s;
      .bg {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        position: absolute;
        top: 0;
        left: 0;
        transition: all 0.2s;
        opacity: 1;
      }
      .gameIcon {
        position: absolute;
        top: 50%;
        left: 20px;
        transform: translateY(-50%);
        color: #bef2f6;
        font-weight: bold;
        z-index: 2;
        opacity: 0.6;
      }
      &.on,
      &:hover {
        border-color: #fffae9;
        .bg {
          opacity: 1;
        }
        .gameIcon {
          opacity: 1;
        }
      }
    }
  }
  .theme {
    position: absolute;
    top: 50%;
    text-align: right;
    right: 20px;
    transform: translateY(-50%);
    z-index: 2;
    img {
      width: 421px;
    }
    p {
      color: #fff;
      font-size: 16px;
      text-align: right;
      margin-top: 20px;
    }
    .start-game {
      width: 248px;
      height: 68px;
      border-color: transparent;
      background: linear-gradient(to right, #ffd44a, #ff8a0a);
      border-radius: 4px;
      text-align: center;
      font-size: 30px;
      font-weight: bold;
      color: #573303;
      display: inline-block;
      margin-top: 50px;
    }
  }
  .task {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    color: #fff;
    padding-bottom: 20px;
    z-index: 2;
    .rule {
      color: rgb(228, 228, 228);
      display: inline-block;
      margin-left: 20px;
      font-size: 12px;
      cursor: pointer;
    }
    .toGift {
      color: rgb(228, 228, 228);
      font-size: 14px;
    }
    .item {
      width: 32%;
      background: url(../../assets/task-bj.png) no-repeat;
      background-size: cover;
      border-radius: 30px;
      overflow: hidden;
      margin-top: 20px;
      position: relative;
      .icon {
        position: absolute;
        right: 30px;
        top: 20px;
      }
      .title {
        font-size: 30px;
        color: #6b3c11;
        padding-top: 30px;
        padding-left: 30px;
      }
      .bottom {
        margin-top: 50px;
        padding-left: 30px;
        color: #573303;
        padding-bottom: 20px;
        p + p {
          margin-top: 10px;
        }
        .btn {
          width: 60px;
          height: 60px;
          background: linear-gradient(to bottom, #9e9e9e, #838383);
          border-radius: 50%;
          position: absolute;
          right: 20px;
          bottom: 20px;
          line-height: 60px;
          text-align: center;
          color: #fff;
          font-weight: bold;
          font-size: 12px;
          cursor: pointer;
          &.none {
            background: #999;
          }
        }
      }
    }
  }
}
</style>
