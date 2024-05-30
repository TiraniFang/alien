<template>
  <div>
    <div class="layouts"></div>
    <div class="gift-result">
      <img class="icon" v-if="props.detail.type == '积分'"  src="../../../assets/coin.png" alt="">
      <img class="icon" v-else src="../../../assets/rebbag.png" alt="">
      <h2>恭喜您，获得{{props.detail.rewardIntegral}}{{ props.detail.type }}</h2>
      <p>完成更多任务领取积分兑换奖品~</p>
      <div class="btn" @click="continueTask">去做任务</div>
    </div>
  </div>
  
</template>
<script setup>
const props = defineProps(['detail'])

const emit = defineEmits(['continueTasks'])
 
const continueTask = () => {
  emit('continueTasks')
}
console.log(props.detail)
</script>
<style lang="scss" scoped>
.layouts {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
}
.gift-result {
  padding: 0 50px;
  box-sizing: border-box;
  width: 380px;
  height: 350px;
  border-radius: 30px;
  background: url(../../../assets/get.png) no-repeat;
  background-size: contain;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  box-shadow: 0 0 20px rgba(0,0,0,.5);
  text-align: center;
  z-index: 15;
  .btn {
    background: linear-gradient(to right, #fd8b44, #fc3f31);
    margin-top: 50px;
    padding: 10px 0;
    border-radius: 30px;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
  }

  h2 {
    padding-top:100px;
  }
  .icon {
    position: absolute;
    left: 50%;
    top: -30px;
    transform: translateX(-50%);
    &:last-child {
      width: 70px;
    }
  }
}
</style>
