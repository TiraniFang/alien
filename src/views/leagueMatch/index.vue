<template>
  <Header v-drag :intergral="myIntergral" @childEvent="refreshData" />
  <div v-drag class="competition">
    <div class="tips">正在努力开发中......</div>
  </div>
</template>
<script>
export default {
  name: "LeagueMatch",
};
</script>
<script setup>
import { ref } from "vue";
import Header from "@/components/header.vue";
const myIntergral = ref(localStorage.getItem("myIntergral"));
const refreshData = () => {
  myIntergral.value = localStorage.getItem("myIntergral");
};
</script>
<style lang="scss" scoped>
.competition {
  width: 100%;
  height: 100%;
  background: url(../../assets/lenguaMatch.jpg) no-repeat;
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  padding-top: 99px;
  box-sizing: border-box;
  position: relative;
  .tips {
    font-size: 28px;
    color: #b2c0cf;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
