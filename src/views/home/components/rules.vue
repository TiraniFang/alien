<template>
  <div>
    <div class="layouts"></div>
    <div class="rule">
      <div class="bg"></div>
      <h3>玩法规则</h3>
      <div class="content">
        <p>1.登录后，请按规定使用电子裁判当前绑定的ID账号完成LOL普通排位赛，如发现信息不一致的，视为作弊并取消比赛奖励所得。</p>
        <p>2.积分判定规则：积分计算公式：【本局胜利+10失败+0】+【击杀×1】+【助攻×1】-【死亡×2】-【游戏时长/分钟×1】+【本局游戏英雄等级×1】+【黑铁+1、青铜+2、白银+3、黄金+4、铂金+5、翡翠+6、钻石+7、大师+8、宗师+9、王者+10】=本局最终获得积分数。</p>
        <p>3.完成比赛后可在比赛记录查看本次比赛结果和获得积分详情。</p>
        <p>4.如有发现刷战绩和开外挂行为，视为作弊并取消比赛奖励所得。</p>
        <p>5.比赛必须在2小时内完成，过期视为弃赛。</p>
        <p>6.最终解释权归电子裁判所有。</p>
      </div>
      <div class="btn" @click="closeRule">了解</div>
    </div>
  </div>
</template>
<script setup>
const emit = defineEmits(['closeRule'])
 
 const closeRule = () => {
   emit('closeRules')
 }
</script>
<style scoped lang="scss">
.layouts {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
}
.rule {
  width: 60%;
  background: linear-gradient(to right, #ffd44a, #ff8a0a);
  padding: 20px;
  box-sizing: border-box;
  border-radius: 30px;
  background-size: contain;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  box-shadow: 0 0 20px rgba(0,0,0,.5);
  text-align: center;
  z-index: 15;
  color: #333;
  .bg {
    border-radius: 30px;
    background: #fff;
    position: absolute;
    left: 5px;
    top: 5px;
    right: 5px;
    bottom: 5px;
    z-index: -1;
  }
  p {
    text-align: left;
    line-height: 26px;
    font-size: 12px;
    margin-bottom: 10px;
    color: #333;
  }
  .btn {
    width: 200px;
    display: inline-block;
    background: linear-gradient(to right, #fd8b44, #fc3f31);
    margin-top: 50px;
    padding: 10px 0;
    border-radius: 30px;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    margin-bottom: 20px;
  }
}
</style>