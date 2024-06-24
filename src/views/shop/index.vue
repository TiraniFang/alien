<template>
  <Header v-drag :intergral="myIntergral" />
  <div class="gift" v-drag>
    <div>
      <img src="../../assets/login-ewm.png" alt="" />
      <p>微信扫一扫打开积分商城</p>
      <p style="color: #e1e1e1; font-size: 12px">
        (任何有关 领奖 / 兑换 的问题可咨询客服)
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: "Shop",
};
</script>
<script setup>
import { ref } from "vue";
import Header from "@/components/header.vue";
const myIntergral = ref(localStorage.getItem("myIntergral"));
</script>
<style lang="scss" scoped>
.gift {
  width: 100%;
  height: 100%;
  background: url(../../assets/user-bj.jpg) no-repeat;
  background-size: cover;
  padding-top: 99px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  img {
    max-width: 200px;
    margin-right: 0;
  }
  p {
    color: #e5e5e5;
    margin-top: 20px;
    font-size: 16px;
  }
}
</style>
