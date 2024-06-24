<template>
  <Header v-drag @childEvent="getTaskList" :intergral="myIntergral" />
  <div v-drag class="gift">
    <div class="layout"></div>
    <div class="gray"></div>
    <div class="container">
      <div class="title flex align-center space-between">
        <div class="flex align-center">
          <img src="../../assets/task.png" alt="" />
          <span
            >所有任务<span style="font-size: 12px">
              (积分可用于闯关和商城兑换奖品)
            </span></span
          >
        </div>

        <div class="flex align-center">
          <p style="margin-left: 20px; font-size: 14px">
            任务开放时间(<span style="color: rgb(255, 106, 106)">每日8：00 - 23：59</span
            >)
          </p>
          <!-- <el-countdown title="" v-if="timeCount != null" :value="timeCount" /> -->
        </div>

        <!-- <span class="rule">[活动规则]</span> -->
      </div>
      <div class="all-gift">
        <div class="flex space-between flex-wrap">
          <div class="item" v-for="(item, index) in taskList" :key="item">
            <img class="icon" :src="require('../../assets/coin.png')" alt="" />
            <!-- <img class="icon" v-else :src="require('../../assets/rebbag.png')" alt="" /> -->
            <div class="title">奖励{{ item.rewardIntegral }}{{ item.type }}</div>
            <div class="bottom">
              <div class="flex align-center">
                <p>任务要求：</p>
                <div
                  class="flex align-center"
                  style="cursor: pointer"
                  @click="showRuleDialog = true"
                >
                  点击查看任务要求详情<el-icon color="#6b3c11" :size="18" alt="点击"
                    ><el-icon><QuestionFilled /></el-icon
                  ></el-icon>
                </div>
              </div>
              <p>当前进度：{{ item.finish }}/{{ item.total }}</p>
              <!-- <div class="btn" v-if="index == 0" @click="giftDialogShow(item)">领</div> -->
              <div class="btn none" v-if="item.status == 1">已发放</div>
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
<script>
export default {
  name: "Gift",
};
</script>
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import api from "../../api/request";
import GiftDialog from "../gift/components/gift-dialog.vue";
import Rules from "../home/components/rules.vue";
import Header from "@/components/header.vue";

import { ElMessage } from "element-plus";
import { QuestionFilled } from "@element-plus/icons-vue";
const myIntergral = ref(localStorage.getItem("myIntergral"));

const showGiftDialog = ref(false);
const showRuleDialog = ref(false);
const taskList = ref([
  {
    type: "积分",
    rewardIntegral: 0,
    finish: 0,
    total: 0,
    status: 0,
  },
  {
    type: "积分",
    rewardIntegral: 0,
    finish: 0,
    total: 0,
    status: 0,
  },
  {
    type: "积分",
    rewardIntegral: 0,
    finish: 0,
    total: 0,
    status: 0,
  },
  {
    type: "积分",
    rewardIntegral: 0,
    finish: 0,
    total: 0,
    status: 0,
  },
  {
    type: "积分",
    rewardIntegral: 0,
    finish: 0,
    total: 0,
    status: 0,
  },
  {
    type: "积分",
    rewardIntegral: 0,
    finish: 0,
    total: 0,
    status: 0,
  },
  {
    type: "积分",
    rewardIntegral: 0,
    finish: 0,
    total: 0,
    status: 0,
  },
  {
    type: "积分",
    rewardIntegral: 0,
    finish: 0,
    total: 0,
    status: 0,
  },
  {
    type: "积分",
    rewardIntegral: 0,
    finish: 0,
    total: 0,
    status: 0,
  },
]);
const currentGift = ref({});
const timeCount = ref(null);
const timer2 = ref(null);
const lastReward = ref({});
onMounted(() => {
  // 计算当天剩余时间（毫秒）并赋值给remainingTime
  calculateRemainingTime();
  // clearInterval(timer2.value);
  // timer2.value = null;
});
onBeforeUnmount(() => {
  // clearInterval(timer2.value);
  // timer2.value = null;
});
const giftDialogShow = (item) => {
  showGiftDialog.value = true;
  currentGift.value = item;
  // getReward(item.id)
};
const calculateRemainingTime = () => {
  const now = new Date();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  timeCount.value = Date.now() + Math.floor((endOfDay - now) / 1000) * 1000;
};

// 获取任务数据列表
const getTaskList = () => {
  api
    .post("/method/account/", {
      method: "GET_QUEST_DATA_NEW",
    })
    .then((res) => {
      console.log(res);
      taskList.value = res.data.result;
    });
};
getTaskList();
</script>
<style lang="scss" scoped>
.gift {
  width: 100%;
  height: 100%;
  padding-top: 99px;
  box-sizing: border-box;
  .layout,
  .gray {
    width: 100%;
    height: 100%;
    background: url(../../assets/gift-bj.png) no-repeat;
    background-size: cover;
    background-position: center top;
    background-repeat: no-repeat;
    filter: blur(50px);
    position: absolute;
    left: 0;
    top: 0;
    z-index: -2;
  }
  .gray {
    background: rgba(0, 0, 0, 0.8);
    z-index: -1;
  }
  .title {
    color: #fff;
    padding-top: 30px;
    span {
      color: #fff;
    }

    .rule {
      color: rgb(228, 228, 228);
      display: inline-block;
      margin-left: 20px;
      font-size: 12px;
      cursor: pointer;
    }
  }
  .item {
    width: 32%;
    background: url(../../assets/task-bj.png) no-repeat center;
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
      font-size: 24px;
      color: #6b3c11;
      padding-top: 40px;
      padding-left: 30px;
    }
    .bottom {
      margin-top: 30px;
      padding-left: 30px;
      padding-top: 10px;
      padding-bottom: 20px;
      color: #573303;
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
        cursor: pointer;
        font-size: 12px;
        &.none {
          background: #999;
        }
      }
    }
  }
}
:deep(.el-statistic__number) {
  color: #f76a7e !important;
  text-align: center;
}
</style>
