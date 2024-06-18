<template>
  <div>
    <div class="layouts"></div>
    <div class="rule">
      <div class="bg"></div>
      <h3 style="margin-bottom: 40px">
        模式说明
        <p style="font-size: 12px; color: #999; margin-top: 10px; text-align: center">
          (<span v-if="isHome">未闯关模式下，</span>完成以下任意模式进度即可+1)
        </p>
      </h3>
      <p></p>
      <div class="content flex space-around">
        <div>
          <p class="flex align-center">
            <img src="../../../assets/lol.png" alt="" /> <span>英雄联盟</span>
          </p>
          <p>
            1：召唤师峡谷自选模式获胜<br />2：召唤师峡谷单双排位获胜<br />3：召唤师峡谷灵活排位获胜<br />4：极地大乱斗模式获胜<br />5：云顶匹配模式前三名<br />6：云顶排位模式前三名<br />7：云顶狂暴模式前三名<br />8：云顶双人作战前二名<br />9：云顶恭喜发财前三名<br />
          </p>
        </div>
        <div>
          <p class="flex align-center">
            <img src="../../../assets/yjwj.png" alt="" />
            <span>永劫无间</span>
          </p>
          <p>
            1：生存快速匹配单排模式前十名<br />2：生存快速匹配双排模式前六名<br />3：生存快速匹配三排模式前三名<br />4：生存天人之战单排模式前十名<br />5：生存天人之战双排模式前六名<br />6：生存天人之战三排模式前三名<br />7：生存天选单人模式前十名<br />8：生存天选双人模式前六名<br />
            9：生存天选三人模式前六名<br />10：娱乐无尽试炼模式前五名<br />11：娱乐武道争锋模式前四名
            <!-- <br />8：娱乐地脉之战模式前六名 -->
            <br />12：娱乐暗域狂潮模式前三名
            <!-- <br />10：娱乐无尽枪火模式前六名 -->
            <!-- <br /> -->
            <!-- 11：娱乐共振联赛模式前六名<br />12：娱乐糖豆人模式前六名<br />13：娱乐武道对决模式前六名<br />14：娱乐无间幻境模式前六名 -->
          </p>
          <br /><span style="font-size: 12px"
            ><b style="color: red">注意：</b>永劫无间使用网易账号登录才可参与任务和闯关
          </span>
        </div>
      </div>
      <div class="btn" @click="closeRule">了解</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
const route = useRoute();

const emit = defineEmits(["closeRule"]);
const isHome = ref(true);

if (route.path == "/home" || route.path == "/gift") {
  isHome.value = true;
} else {
  isHome.value = false;
}
const closeRule = () => {
  emit("closeRules");
};
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
  width: 40%;
  background: linear-gradient(to right, #ffd44a, #ff8a0a);
  padding: 20px;
  box-sizing: border-box;
  border-radius: 30px;
  background-size: contain;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
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
