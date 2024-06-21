<template>
  <Header v-drag />
  <div class="match">
    <div class="match-title" v-drag>
      <!-- <img src="../../assets/match-title.png" alt=""> -->
      <div class="flex align-center" v-if="timeCount != null">
        <span>闯关倒计时：</span>
        <el-countdown class="count2" :value="timeCount" />
      </div>
    </div>
    <div class="container" @mousedown="startDrag" @mousemove="doDrag" @mouseup="endDrag">
      <!-- <div class="layout"></div> -->
      <!--  -->
      <div class="containers" ref="containers">
        <!-- 这里放置你的超长内容 -->
        <div class="content" v-for="(item, index) in matchData.max_number" :key="item">
          <div class="box">
            <div
              class="current"
              v-if="
                currentIndex == passList[passList.length - 1] && passList.includes(index)
              "
            ></div>
            <div class="line" v-if="passList.includes(index + 1)"></div>
            <div
              @click="choose(item, index)"
              class="item"
              :class="{
                pass: passList.includes(index),
                ani: currentIndex == index,
                grayAni: aniIndex == index,
              }"
            >
              <!-- 'current': item.currentGuan && currentIndex == index -->
              <div class="redbag">
                <img src="../../assets/rebbag2.png" alt="" />
                <span>{{ allNumArray[index] / 100 }}</span>
                <img class="arrow" src="../../assets/arrow.png" alt="" />
              </div>
              <h3>关卡</h3>
              <h2>{{ index + 1 }}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="arrow2" :class="{ show: showArrowTip }">
      <img src="../../assets/arrow1.png" alt="" />
      <img src="../../assets/arrow2.png" alt="" />
      <p class="text-center">左右可拖动</p>
    </div>
    <div class="currentInfo" v-drag>
      <span class="matchIng">{{ matchData.matchingNumber }}人正处于当前关卡</span>
      <!-- 回到当前关卡 -->
      <el-tooltip
        class="box-item"
        effect="dark"
        content="点击回到当前关卡"
        placement="top"
      >
        <p class="returnCurrent" @click="getMatchData">
          <el-icon size="22"><RefreshLeft /></el-icon>
        </p>
      </el-tooltip>
      <div>
        <p>通过条件</p>
        <p
          class="orange flex align-center"
          style="cursor: pointer"
          @click="showRuleDialog = true"
        >
          <span style="display: inline-block; margin-right: 5px"
            >点击查看任务要求详情({{ matchData.Number }}/{{ totalNumber }} ) </span
          ><el-icon color="#fff" :size="18"><QuestionFilled /></el-icon>
        </p>
      </div>
      <div>
        <p>
          您的积分： <span class="orange">{{ myIntergral }}</span>
        </p>
        <p>
          关卡需消耗积分： <span class="blue">{{ needIntergral }}</span>
        </p>
      </div>
      <div>
        <p>通过奖励</p>
        <p class="flex align-center">
          <img src="../../assets/rebbag2.png" alt="" /><span
            >{{ rewardMoney / 100 }}元</span
          >
        </p>
      </div>
      <div>
        <el-button
          class="btn"
          @click="dialogVisible = true"
          :disabled="matchData.InLevel != 0 || totalNumber != currentIndex + 1"
        >
          {{
            matchData.InLevel == 0
              ? "开始闯关"
              : totalNumber == matchData.Number
              ? "已通关"
              : "闯关中..."
          }}
        </el-button>
      </div>
    </div>
    <!-- <div class="rank">
      <img class="arrow" src="../../assets/up_arrow.png"/>
    </div> -->

    <el-dialog v-model="dialogVisible" title="闯关提示" width="500" center>
      <p style="text-align: center; height: 50px; light-height: 50px">
        确定消耗<span style="color: #ffd44a">{{ needIntergral }}</span
        >积分开始闯关吗?
      </p>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="getStart"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
    <Rules v-if="showRuleDialog" @closeRules="showRuleDialog = false" />
  </div>
</template>
<script setup>
import { ref, onBeforeUnmount, onMounted, nextTick } from "vue";
import Header from "@/components/header.vue";

import { ElMessage } from "element-plus";
import api from "../../api/request";
import Rules from "../home/components/rules.vue";

import { QuestionFilled, RefreshLeft } from "@element-plus/icons-vue";

const timer = ref(null);
const showRuleDialog = ref(false);
const allNumArray = ref([]);
const timeCount = ref(null);
const myIntergral = ref(localStorage.getItem("myIntergral"));
const needIntergral = ref(0);
const rewardMoney = ref(0);
const dialogVisible = ref(false);
const showArrowTip = ref(false);
const passList = ref([]);
const currentIndex = ref(-1);
const aniIndex = ref(-1);

const totalNumber = ref(1);
const choose = (item, index) => {
  console.log(index);
  aniIndex.value = index;
  console.log(aniIndex.value);
  if (index != matchData.value.Level && !passList.value.includes(index)) {
    needIntergral.value = (index + 1) * matchData.value.BasePoint;
    rewardMoney.value = (index + 1) * matchData.value.BaseAmount;
    totalNumber.value = index + 1;
    if ((index + 1) % 6 == 0) {
      rewardMoney.value =
        (index + 1) * matchData.value.BaseAmount + (index + 1) * 100 * 0.6;
    } else {
      rewardMoney.value = (index + 1) * matchData.value.BaseAmount;
    }
    return;
  } else if (currentIndex.value == index) {
    getMatchData();
  } else {
    ElMessage.success("当前关卡已通过");
  }
};

onMounted(async () => {
  getMatchData();

  await nextTick();
  if (containers.value) {
    containers.value.scrollLeft = 810;
  }
  console.log(localStorage.getItem("fistLogin"));
  if (localStorage.getItem("fistLogin") == "true") {
    console.log(localStorage.getItem("fistLogin"));

    showArrowTip.value = true;
    let t = setTimeout(() => {
      localStorage.setItem("fistLogin", false);
      showArrowTip.value = false;
      clearTimeout(t);
    }, 2500);
  }
});
const matchData = ref({});

const startX = ref(0);
const dragging = ref(false);
const containers = ref(null);

const startDrag = (event) => {
  startX.value = event.clientX;
  dragging.value = true;
};

const doDrag = (event) => {
  if (dragging.value) {
    const currentX = event.clientX;
    const delta = currentX - startX.value;
    containers.value.scrollLeft -= delta;
    startX.value = currentX;
  }
};

const endDrag = () => {
  dragging.value = false;
};
// 获取关卡数据
const getMatchData = () => {
  api
    .post("/method/stage/", {
      method: "GET_STAGE_INFO",
    })
    .then((res) => {
      matchData.value = res.data.result;
      currentIndex.value = matchData.value.Level;
      totalNumber.value = currentIndex.value + 1;
      needIntergral.value = (matchData.value.Level + 1) * matchData.value.BasePoint;
      rewardMoney.value = (currentIndex.value + 1) * matchData.value.BaseAmount;

      if (matchData.value.expires != 0) {
        timeCount.value = Date.now() + matchData.value.expires * 1000;
      }
      // const now = new Date();
      // const endOfDay = new Date(
      //   now.getFullYear(),
      //   now.getMonth(),
      //   now.getDate(),
      //   23,
      //   59,
      //   59
      // );
      // timeCount.value = Date.now() + Math.floor((endOfDay - now) / 1000) * 1000;
      // matchData.value.max_number = 20;
      // matchData.value.Level = 17;
      // matchData.value.InLevel = 17;

      for (let i = 0; i <= matchData.value.Level; i++) {
        passList.value.push(i);
      }
      for (let i = 1; i <= matchData.value.max_number + 1; i++) {
        if (i % 6 == 0 && i != 0) {
          allNumArray.value.push(i * matchData.value.BaseAmount + i * 100 * 0.6);
        } else {
          allNumArray.value.push(i * matchData.value.BaseAmount);
        }
      }
      let t = setTimeout(() => {
        containers.value.scrollLeft = (matchData.value.Level - 6) * 220;
        console.log(containers.value.scrollLeft);
        clearTimeout(t);
      }, 200);
    });
};

// 开始闯关
const getStart = () => {
  if (matchData.value.InLevel == 0) {
    api
      .post("/method/stage/", {
        method: "STAGE_REGISTER",
        level: currentIndex.value + 1,
      })
      .then((res) => {
        dialogVisible.value = false;
        if (res.data.code == 10000) {
          myIntergral.value = Number(myIntergral.value) - Number(needIntergral.value);
          ElMessage.success("报名成功！");
        } else {
          ElMessage.error(res.data.message);
        }
      });
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

        myIntergral.value = res.data.result.number;
      }
    });
};
onBeforeUnmount(() => {
  // clearInterval(timer.value);
  // timer.value = null;
});
</script>
<style lang="scss" scoped>
.match {
  width: 100%;
  height: 100%;
  background: url(../../assets/match_bj.jpg) no-repeat center bottom;
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  padding-top: 99px;
  box-sizing: border-box;
  position: relative;
  .match-part {
    width: 1920px;
    height: 300px;
    background: #000;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.match-title {
  position: absolute;
  top: 280px;
  left: 50%;
  transform: translateX(-52%);
  z-index: 3;
  span {
    color: #d9bc74;
  }
}
.rank {
  width: 280px;
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  left: 0;
  bottom: -40px;
  padding: 20px;
  box-sizing: border-box;
  .arrow {
    width: 25px;
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
    opacity: 0.8;
    &:hover {
      opacity: 1;
    }
  }
}
.arrow2 {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  bottom: 0;
  left: 0;
  z-index: 5;
  display: none;
  &.show {
    display: block;
  }
  p {
    color: #fff;
    font-size: 40px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  img:nth-child(1) {
    position: absolute;
    left: 100px;
    top: 50%;
    transform: translateY(-50%);
    animation: leftAni 1s infinite;
  }
  img:nth-child(2) {
    position: absolute;
    right: 100px;
    top: 50%;
    transform: translateY(-50%);
    animation: rightAni 1s infinite;
  }
}
@keyframes hideDiv {
  0% {
    display: block;
    opacity: 1;
  }
  100% {
    display: none;
    opacity: 0;
  }
}
@keyframes leftAni {
  0% {
    left: 200px;
    opacity: 1;
  }
  100% {
    left: 100px;
    opacity: 0;
  }
}
@keyframes rightAni {
  0% {
    right: 200px;
    opacity: 1;
  }
  100% {
    right: 100px;
    opacity: 0;
  }
}
.currentInfo {
  position: fixed;
  width: 60%;
  padding: 20px;
  box-sizing: border-box;
  background: rgba(255, 155, 0, 0.3);
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 3;
  .matchIng {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #ffd44a;
    // background: linear-gradient(to right, #ffd44a, #ff8a0a);
    display: inline-block;
    padding: 10px 20px;
    font-weight: bold;
    color: #522705;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .returnCurrent {
    position: absolute;
    right: 0;
    bottom: 100%;
  }
  p {
    font-size: 14px;
    color: #fff;
    &:first-child {
      margin-bottom: 20px;
    }
  }
  img {
    width: 20px;
  }
  .orange {
    color: #ffb453;
  }
  .blue {
    color: #18e6fc;
  }
  .btn {
    width: 148px;
    height: 38px;
    background: linear-gradient(to right, #ffd44a, #ff8a0a);
    border-radius: 4px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #573303;
    display: inline-block;
    margin-bottom: 0 !important;
    border-color: transparent;
    &.is-disabled {
      background: linear-gradient(to bottom, #9e9e9e, #838383);
      color: #000;
    }
  }
}
.containers {
  overflow-x: hidden;
  overflow-y: auto;
  white-space: nowrap;
  padding-top: 220px;
  padding-bottom: 20px;
  cursor: move;
  position: relative;
}
.layout {
  width: 100%;
  height: 280px;
  position: fixed;
  left: 0;
  top: 320px;
  z-index: 3;
}
.content {
  display: inline-block;
  white-space: normal;
  height: 280px;
  width: 220px;
  &:nth-child(6n) .item .redbag {
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
    &.grayAni {
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
.el-icon {
  cursor: pointer;
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
:deep(.el-statistic__head) {
  text-align: center;
  color: #b1d7ff;
}
:deep(.el-statistic__content) {
  color: #f76a7e;
  text-align: center;
  font-size: 30px;
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
// :root {
//         --gold: #ffb338;
//         --light-shadow: #77571d;
//         --dark-shadow: #3e2904;
//       }
//       body {
//         margin: 0;
//       }
//       .wrapper {
//         background: radial-gradient(#272727, #1b1b1b);
//         display: grid;
//         grid-template-areas: 'overlap';
//         place-content: center;
//         text-transform: uppercase;
//         height: 100vh;
//       }
//      :deep(.el-statistic .el-statistic__number) {
//         background-clip: text;
//         -webkit-background-clip: text;
//         color: #363833;
//         font-family: 'PingFang SC', sans-serif;
//         font-weight: 900;
//         font-size:50px;
//         grid-area: overlap;
//         letter-spacing: 1px;
//         -webkit-text-stroke: 4px transparent;
//       }
//       :deep(.el-statistic .el-statistic__content) {
//         display: grid;
//         grid-template-areas: 'overlap';
//         place-content: center;
//         text-transform: uppercase;
//       }
//       :deep(.el-statistic.count1 .el-statistic__content .el-statistic__number) {
//         background-image: repeating-linear-gradient( 105deg,
//           #ffb338 0% ,
//           #3e2904 5%,
//           #ffb338 12%);
//         color: transparent;
//         filter: drop-shadow(5px 12px 5px black);
//         transform: scaleY(1.05);
//         transform-origin: top;
//       }
//       :deep(.el-statistic.count2 .el-statistic__content .el-statistic__number ) {
//         background-image: repeating-linear-gradient( 5deg,
//           #ffb338 0% ,
//          #77571d 23%,
//           #ffb338 31%);
//         color: #1e2127;
//         transform: scale(1);
//       }
</style>
