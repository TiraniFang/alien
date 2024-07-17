<template>
  <Header v-drag :intergral="myIntergral" />
  <div v-drag class="competition">
    <div class="container">
      <div class="flex flex-wrap space-between">
        <div class="item">
          <h1>日赛奖励</h1>
          <h2>
            每日最高可获得<span>150元现金</span
            ><img src="../../assets/rebbag2.png" alt="" />
          </h2>
          <p>时长/积分/游戏完成度排名，全服前三名获得奖励，每日凌晨00:00更新</p>
          <router-link to="/rankInfo?type=day" class="checkMore"
            >查看奖励详情</router-link
          >
        </div>
        <div class="item">
          <h1>日赛奖励</h1>
          <h2>每日最高可获得<span>90元网费</span></h2>
          <p>时长/积分/游戏完成度排名，本网吧前三名获得奖励，每日凌晨00:00更新</p>
          <router-link to="/rankInfo?type=netBarDay" class="checkMore"
            >查看奖励详情</router-link
          >
        </div>
        <div class="item">
          <h1>周赛奖励</h1>
          <h2>
            每周最高可获得<span>900元现金</span
            ><img src="../../assets/rebbag2.png" alt="" />
          </h2>
          <p>时长/积分/游戏完成度排名，全服前三名获得奖励，每周一凌晨00:00更新</p>
          <router-link to="/rankInfo?type=week" class="checkMore"
            >查看奖励详情</router-link
          >
        </div>
        <div class="item">
          <h1>月赛奖励</h1>
          <h2>
            每月最高可获得<span>1500元现金</span
            ><img src="../../assets/rebbag2.png" alt="" />
          </h2>
          <p>时长/积分/游戏完成度排名，全服前三名获得奖励，每月1号凌晨00:00更新</p>
          <router-link to="/rankInfo?type=month" class="checkMore"
            >查看奖励详情</router-link
          >
        </div>
      </div>
      <p class="checkMore rules" @click="dialogGameVisible = true">查看奖励规则</p>
      <el-dialog v-model="dialogGameVisible" title="游戏规则" width="99%" align="center">
        <span><img style="width: 100%" src="../../assets/rules.jpg" alt="" /></span>
        <template #footer>
          <div class="dialog-footer flex space-center">
            <el-button type="primary" @click="dialogGameVisible = false">
              确定
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  name: "Competition",
};
</script>
<script setup>
import { ref } from "vue";
import Header from "@/components/header.vue";
import api from "../../api/request";
const myIntergral = ref(localStorage.getItem("myIntergral"));
const dialogGameVisible = ref(false);
window.addEventListener("storage", (event) => {
  if (event.key === "myIntergral") {
    myIntergral.value = event.newValue;
  }
});
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
  .item {
    width: 48%;
    height: 269px;
    background: url(../../assets/competition_bj2.png) no-repeat;
    background-size: contain;
    margin-top: 40px;
  }
  h1 {
    color: #fff;
    text-align: center;
    font-size: 24px;
    margin: 9px 0;
  }
  h2 {
    text-align: center;
    font-size: 18px;
    font-weight: normal;
    color: #fff;
    margin-top: 50px;
    span {
      color: #ffc452;
      font-size: 30px;
    }
    img {
      width: 25px;
      vertical-align: text-bottom;
      display: inline-block;
      margin-left: 10px;
    }
  }
  p {
    margin-top: 20px;
    color: #d1d1d1;
    text-align: center;
  }
}
.checkMore {
  width: 123px;
  height: 36px;
  display: block;
  border-radius: 4px;
  background: #ff4553;
  color: #fff;
  text-align: center;
  line-height: 36px;
  margin: 0 auto;
  margin-top: 30px;
  transition: all 0.2s;
  &:hover {
    background: #e13442;
  }
  &.rules {
    margin-top: 40px;
    background: none;
    color: #ffc452;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
