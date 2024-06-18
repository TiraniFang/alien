<template>
  <Header v-drag @childEvent="getTaskList" />
  <div
    v-drag
    class="home"
    :style="{ 'background-image': `url(${advertiseList[currentIndex].banner})` }"
  >
    <div class="layout"></div>
    <div class="container">
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
        <p style="font-size: 14px; color: #e5e5e5">在线满一小时即可赠送积分</p>

        <el-button class="start-game" @click="launchLOL" :disabled="isDisabled">{{
          btnMsg
        }}</el-button>
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
            <div class="item" v-for="(item, index) in taskList" :key="item">
              <img class="icon" src="../../assets/coin.png" alt="" />
              <!-- <img class="icon" v-else src="../../assets/rebbag.png" alt="" /> -->

              <div class="title">奖励{{ item.rewardIntegral }}{{ item.type }}</div>
              <div class="bottom">
                <div class="flex align-center">
                  <p>任务要求：</p>

                  <!-- <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="Top Left prompts info"
                    placement="top"
                  >
                  <template #content ><p v-html="modelStyle"></p> </template> -->
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
                <p>当前进度：{{ item.finish }}/{{ item.total }}</p>
                <!-- <div class="btn none" v-if="item.status == 0">未完成</div> -->
                <div class="btn" v-if="item.status == 1">已发放</div>
              </div>
            </div>
            <div class="item">
              <img class="icon" src="../../assets/coin.png" alt="" />
              <!-- <img class="icon" src="../../assets/rebbag.png" alt="" /> -->

              <div class="title">
                奖励{{ lastReward.rewardIntegral }}{{ lastReward.type }}
              </div>
              <div class="bottom">
                <div class="flex align-center">
                  <p>任务要求：</p>

                  <!-- <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="Top Left prompts info"
                    placement="top"
                  >
                  <template #content ><p v-html="modelStyle"></p> </template> -->
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
                <p>当前进度：{{ lastReward.finish }}/{{ lastReward.total }}</p>
                <!-- <div class="btn none" v-if="item.status == 0">未完成</div> -->
                <div class="btn" v-if="lastReward.status == 1">已发放</div>
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
  </div>
</template>
<script setup>
import { ref, onBeforeUnmount } from "vue";
import Header from "@/components/header.vue";
import { QuestionFilled } from "@element-plus/icons-vue";
import GiftDialog from "../gift/components/gift-dialog.vue";
import Rules from "./components/rules.vue";
import { ElMessage } from "element-plus";
import api from "../../api/request";
import { useRouter } from "vue-router";
const router = useRouter();
// 当前游戏索引
const currentIndex = ref(0);
const gameIndex = ref(0);

const btnMsg = ref("开始游戏");
const modelStyle = ref(
  "召唤师峡谷自选模式获胜<br/>召唤师峡谷单双排位获胜<br/>召唤师峡谷灵活排位获胜<br/>极地大乱斗模式获胜<br/>云顶匹配模式前三名<br/>云顶排位模式前三名<br/>云顶狂暴模式前三名<br/>云顶双人作战前二名<br/>云顶恭喜发财前三名<br/>斗魂竞技场前三名"
);
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

  if (index == 1) {
    gameType.value = "Naraka";
    modelStyle.value =
      "生存天选之人模式前十名<br />生存快速匹配模式前十名<br />生存天人之战模式前十名<br />娱乐无尽试炼模式前六名<br />娱乐武道争锋模式前三名<br />娱乐地脉之战模式胜利";
  } else {
    gameType.value = "LOL";
    modelStyle.value =
      "召唤师峡谷自选模式获胜<br/>召唤师峡谷单双排位获胜<br/>召唤师峡谷灵活排位获胜<br/>极地大乱斗模式获胜<br/>云顶匹配模式前三名<br/>云顶排位模式前三名<br/>云顶狂暴模式前三名<br/>云顶双人作战前二名<br/>云顶恭喜发财前三名<br/>斗魂竞技场前三名";
  }
  clearInterval(timer.value);
  timer.value = null;
  getCaro();
};
// 获取奖励
const giftDialogShow = (item) => {
  showGiftDialog.value = true;
  currentGift.value = item;
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
// const inter = () => {
//   timer2.value = setInterval(() => {
//     getTaskList();
//   }, 1000);
// };
// inter();
if (!localStorage.getItem("loginStatus")) {
  router.replace("/login");
} else {
  getTaskList();
}

const getCaro = () => {
  timer.value = setInterval(() => {
    if (currentIndex.value == 0) {
      currentIndex.value = 1;
      gameType.value = "Naraka";
      modelStyle.value =
        "生存天选之人模式前十名<br />生存快速匹配模式前十名<br />生存天人之战模式前十名<br />娱乐无尽试炼模式前六名<br />娱乐武道争锋模式前三名<br />娱乐地脉之战模式获胜";
    } else {
      currentIndex.value = 0;
      gameType.value = "LOL";
      modelStyle.value =
        "召唤师峡谷自选模式获胜<br/>召唤师峡谷单双排位获胜<br/>召唤师峡谷灵活排位获胜<br/>极地大乱斗模式获胜<br/>云顶匹配模式前三名<br/>云顶排位模式前三名<br/>云顶狂暴模式前三名<br/>云顶双人作战前二名<br/>云顶恭喜发财前三名<br/>斗魂竞技场前三名";
    }
  }, 5000);
};
getCaro();
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
  .layout {
    width: 100%;
    height: 100%;
    background: url(../../assets/home-gray.png) no-repeat;
    background-size: cover;
    position: absolute;
    top: -0;
    left: 50%;
    transform: translateX(-50%);
  }
  .pagination {
    position: absolute;
    left: 2vw;
    top: 50%;
    transform: translateY(-50%);
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
