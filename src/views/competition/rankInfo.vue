<template>
  <Header v-drag :intergral="myIntergral" @childEvent="getRankList" />
  <div v-drag class="competition">
    <div class="container">
      <div class="type flex space-center align-center">
        <span> {{ typeTitle }}</span
        ><el-icon size="24" @click="getRankList"><RefreshLeft /></el-icon>
      </div>
      <!-- <div class="tips text-center">{{ tips }}</div> -->

      <div class="flex space-between">
        <div class="item" v-for="(item, index) in rankList" :key="index">
          <div class="tips text-center">{{ titleTips[index] }}</div>
          <div class="title">
            <span>{{ titleList[index] }}</span>
          </div>
          <div class="rank" v-for="(jtem, jndex) in item.data" :key="jtem">
            <div class="flex align-center space-between">
              <div class="flex align-center">
                <span>{{ jndex + 1 }}</span>
                <div class="avatar">
                  <div class="img">
                    <el-image
                      :src="
                        jtem.headimgurl == ''
                          ? require('../../assets/logo.jpg')
                          : jtem.headimgurl
                      "
                    ></el-image>
                  </div>
                  <img v-if="jndex == 0" src="../../assets/one.png" alt="" />
                  <img
                    v-if="jndex == 1 || jndex == 2"
                    src="../../assets/two.png"
                    alt=""
                  />
                  <img
                    v-if="jndex == 3 || jndex == 4 || jndex == 5"
                    src="../../assets/three.png"
                    alt=""
                  />
                </div>
                <div class="info">
                  <h4>{{ jtem.nickname || jtem.wid }}</h4>
                  <p>
                    {{ index == 0 ? "时长" : index == 1 ? "积分" : "完成数" }}：{{
                      index == 0 ? convertSecondsToHMS(jtem.number) : jtem.number
                    }}
                  </p>
                </div>
              </div>
              <div class="redbag">
                <p v-if="type == 'day'">
                  <b>{{ dayReward[jndex] }}</b>
                </p>
                <p v-if="type == 'week'">
                  <b>{{ weekReward[jndex] }}</b>
                </p>
                <p v-if="type == 'month'">
                  <b>{{ monthReward[jndex] }}</b>
                </p>
                <p v-if="type == 'netBarDay'">
                  <b>{{ netbarReward[jndex] }}</b>
                </p>
                <img src="../../assets/rebbag2.png" alt="" />
              </div>
            </div>
          </div>
          <div class="self">
            <div class="flex align-center space-between">
              <div class="flex align-center">
                <span>{{ item.self.RankNumber || "-" }}</span>
                <div class="avatar">
                  <div class="img">
                    <el-image :src="currentAvatar"></el-image>
                  </div>
                  <img
                    v-if="item.self.RankNumber == 0"
                    src="../../assets/one.png"
                    alt=""
                  />
                  <img
                    v-if="item.self.RankNumber == 1 || item.self.RankNumber == 2"
                    src="../../assets/two.png"
                    alt=""
                  />
                  <img
                    v-if="
                      item.self.RankNumber == 3 ||
                      item.self.RankNumber == 4 ||
                      item.self.RankNumber == 5
                    "
                    src="../../assets/three.png"
                    alt=""
                  />
                </div>
                <div class="info">
                  <h4>{{ nickname }}</h4>
                  <p v-if="item.self != '{}'">
                    {{ index == 0 ? "时长" : index == 1 ? "积分" : "完成数" }}：{{
                      index == 0
                        ? convertSecondsToHMS(item.self.number)
                        : item.self.number || 0
                    }}
                  </p>
                </div>
              </div>
              <div class="redbag" v-if="item.self.RankNumber <= 5 && item.self != '{}'">
                <p v-if="type == 'day'">
                  <b>{{ dayReward[Number(item.self.RankNumber) - 1] }}</b>
                </p>
                <p v-if="type == 'week'">
                  <b>{{ weekReward[Number(item.self.RankNumber) - 1] }}</b>
                </p>
                <p v-if="type == 'month'">
                  <b>{{ monthReward[Number(item.self.RankNumber) - 1] }}</b>
                </p>
                <p v-if="type == 'netBarDay'">
                  <b>{{ netbarReward[Number(item.self.RankNumber) - 1] }}</b>
                </p>
                <img src="../../assets/rebbag2.png" alt="" />
              </div>
              <div class="redbag" v-else>
                {{ item.self.RankNumber ? "暂未上榜" : "暂无排名" }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "RankInfo",
};
</script>
<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import Header from "@/components/header.vue";
import api from "../../api/request";
import { RefreshLeft } from "@element-plus/icons-vue";

const nickname = ref(localStorage.getItem("nickName"));
const myIntergral = ref(localStorage.getItem("myIntergral"));
const router = useRouter();
const route = useRoute();
const type = ref("");
const wid = ref(localStorage.getItem("wid"));
const currentAvatar = ref(
  localStorage.getItem("avatar") == ""
    ? require("../../assets/logo.jpg")
    : localStorage.getItem("avatar")
);
type.value = route.query.type;
const typeTitle = ref(
  type.value == "week"
    ? "周赛排行"
    : type.value == "month"
    ? "月赛排行"
    : type.value == "netBarDay"
    ? "网吧日赛排行"
    : "日赛排行"
);
const tips = ref(type.value == "week" ? "本周" : type.value == "month" ? "本月" : "当天");
const titleList = ref(["游戏时长排行", "积分排行", "游戏完成度排行"]);
const titleTips = ref([
  `统计${tips.value}游戏在线时长`,
  `统计${tips.value}获得积分`,
  `统计${tips.value}完成度`,
]);
const dayReward = ref(["50", "30", "30", "20", "20", "20"]);
const weekReward = ref(["300", "200", "200", "100", "100", "100"]);
const monthReward = ref(["500", "300", "300", "200", "200", "200"]);
const netbarReward = ref(["30", "20", "20", "10", "10", "10"]);

const rankList = ref([]);
window.addEventListener("storage", (event) => {
  if (event.key === "myIntergral") {
    myIntergral.value = event.newValue;
  }
});
// 获取日赛类型
const getRankList = () => {
  nickname.value = localStorage.getItem("nickName");
  currentAvatar.value = localStorage.getItem("avatar");

  let method = "";
  let number = "";
  rankList.value = [];
  switch (type.value) {
    case "day":
      method = "GET_LINE_RANK";
      number = "";
      break;
    case "week":
      method = "GET_POINT_RANK";
      number = "";
      break;
    case "month":
      method = "GET_MATCH_RANK";
      number = "";
      break;
    case "netBarDay":
      method = "GET_LINE_RANK";
      number = localStorage.getItem("netbarId");
      break;
  }
  api
    .post("/method/rank/", {
      method: method,
      number: 6,
      id: number,
    })
    .then((res) => {
      let result = res.data.result;
      rankList.value = [];
      for (let i in result) {
        rankList.value.push(result[i]);
      }
      myIntergral.value = localStorage.getItem("myIntergral");
    });
};
const convertSecondsToHMS = (seconds) => {
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds % 3600) / 60);
  var remainingSeconds = seconds % 60;

  return hours + "小时 " + minutes + "分钟 " + remainingSeconds + "秒";
};
getRankList();
</script>
<style lang="scss" scoped>
.competition {
  width: 100%;
  height: 100%;
  background: url(../../assets/competition_bj.jpg) no-repeat;
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  padding-top: 99px;
  box-sizing: border-box;
  .container > .flex {
    padding: 0 20px;
    padding-top: 30px;
  }
  .type {
    font-size: 28px;
    font-weight: bold;
    text-align: center;
    color: #fff;
    letter-spacing: 8px;
    padding-top: 30px;
    margin-bottom: 20px;
  }
  .tips {
    font-size: 12px;
    color: rgb(209, 209, 209);
    margin-top: 10px;
    position: absolute;
    top: -35px;
    left: 50%;
    transform: translateX(-50%);
  }
  .item {
    width: 31%;
    padding: 0 20px;
    box-sizing: border-box;
    background: rgba(36, 39, 61, 0.8);
    border: 1px solid rgb(82, 82, 137);
    position: relative;
    height: 70vh;
    border-radius: 8px;
    padding-top: 50px;

    // &:first-child::after {
    //   content: "";
    //   width: 200%;
    //   height: 200%;
    //   background: url("../../assets/xunzhang.svg");
    //   background-size: 140px 160px;
    //   transform: rotate(-55deg);
    //   position: absolute;
    //   left: -10%;
    //   top: 0;
    //   z-index: 0;
    //   opacity: 0.04;
    // }
    // &:nth-child(2)::after {
    //   content: "";
    //   width: 200%;
    //   height: 200%;
    //   background: url("../../assets/jifen.svg");
    //   background-size: 140px 160px;
    //   transform: rotate(-55deg);
    //   position: absolute;
    //   left: -10%;
    //   top: 0;
    //   opacity: 0.04;
    //   z-index: 0;
    // }
    // &:last-child::after {
    //   content: "";
    //   width: 200%;
    //   height: 200%;
    //   background: url("../../assets/shalou.svg");
    //   background-size: 140px 160px;
    //   transform: rotate(-55deg);
    //   position: absolute;
    //   left: -10%;
    //   top: 0;
    //   opacity: 0.04;
    //   z-index: 0;
    // }
    .title {
      padding: 5px 40px;
      position: absolute;
      color: #fff;
      font-size: 14px;
      left: 50%;
      transform: translateX(-50%);
      top: 0;
      background: #404061;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      &::before {
        content: "";
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid #fff;
        position: absolute;
        left: 20px;
        top: 13px;
        transform: rotate(-90deg);
      }
      &::after {
        content: "";
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid #fff;
        position: absolute;
        right: 20px;
        top: 13px;
        transform: rotate(90deg);
      }
    }
    .rank {
      color: #fff;
      position: relative;
      z-index: 1;
      margin-bottom: 15px;
      span {
        display: inline-block;
        margin-right: 20px;
        font-size: 24px;
        font-weight: bold;
      }
      .info {
        margin-left: 20px;
      }
      h4 {
        margin: 0;
        margin-bottom: 10px;
        font-size: 16px;
      }
      p {
        font-size: 14px;
        color: #b2b3ca;
      }
    }
    .self {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      padding: 8px 20px;
      background: #4a4679;
      box-sizing: border-box;
      span {
        display: inline-block;
        margin-right: 20px;
        font-size: 24px;
        font-weight: bold;
        color: #ffff;
      }
      .info {
        margin-left: 20px;
      }
      h4 {
        margin: 0;
        margin-bottom: 10px;
        color: #fff;
        font-size: 16px;
      }
      p {
        font-size: 14px;
        color: #b2b3ca;
      }
    }
    .redbag {
      position: relative;
      color: #b2b3ca;
      font-size: 13px;
      img {
        width: 40px;
        margin-right: 0;
      }
      b {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 2px;
        color: #fff;
        font-size: 18px;
        font-weight: normal;
      }
      div {
      }
    }
    .avatar {
      width: 61px;
      height: 61px;
      border-radius: 50%;
      position: relative;
      overflow: hidden;
      .img {
        width: 50px;
        height: 50px;
        position: absolute;
        left: 46%;
        border-radius: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        overflow: hidden;
      }
      img {
        display: inline-block;
        position: relative;
        z-index: 2;
        margin-right: 0;
      }
    }
  }
}
</style>
