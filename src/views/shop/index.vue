<template>
  <Header v-drag :intergral="myIntergral" />
  <div v-drag class="gift">
    <div class="flex flex-wrap space-between">
      <div class="item">
        <div class="img"><img src="../../assets/shop04.png" alt="" /></div>
        <div class="text">
          <p>10元网费</p>
          <div class="flex space-between align-center">
            <div>1000 <span>积分</span></div>
            <div>
              <div class="btn" @click="rewardVisible = true">抽奖</div>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="img"><img src="../../assets/shop03.png" alt="" /></div>
        <div class="text">
          <p>50元网费</p>
          <div class="flex space-between align-center">
            <div>1000 <span>积分</span></div>
            <div>
              <div class="btn" @click="rewardVisible = true">抽奖</div>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="img"><img src="../../assets/shop06.png" alt="" /></div>
        <div class="text">
          <p>100元网费</p>
          <div class="flex space-between align-center">
            <div>1000 <span>积分</span></div>
            <div>
              <div class="btn" @click="rewardVisible = true">抽奖</div>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="img"><img src="../../assets/shop07.jpg" alt="" /></div>
        <div class="text">
          <p>高级降噪无线蓝牙耳机</p>
          <div class="flex space-between align-center">
            <div>1000 <span>积分</span></div>
            <div>
              <div class="btn" @click="rewardVisible = true">抽奖</div>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="img"><img src="../../assets/shop08.png" alt="" /></div>
        <div class="text">
          <p>外星人27英寸显示器2K180Hz游戏电脑高刷AW2724DM</p>
          <div class="flex space-between align-center">
            <div>1000 <span>积分</span></div>
            <div>
              <div class="btn" @click="rewardVisible = true">抽奖</div>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="img"><img src="../../assets/shop09.jpg" alt="" /></div>
        <div class="text">
          <p>外星人27英寸 电竞显示器 Fast IPS 360Hz 游戏电脑高刷屏 AW2724HF</p>
          <div class="flex space-between align-center">
            <div>1000 <span>积分</span></div>
            <div>
              <div class="btn" @click="rewardVisible = true">抽奖</div>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="img"><img src="../../assets/shop10.png" alt="" /></div>
        <div class="text">
          <p>外星人AW2524H 24.5英寸500Hz刷新率IPS电竞游戏电脑显示器</p>
          <div class="flex space-between align-center">
            <div>1000 <span>积分</span></div>
            <div class="flex">
              <div class="btn" @click="rewardVisible = true">抽奖</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap space-between">
      <div class="item">
        <div class="img"><img src="../../assets/shop01.png" alt="" /></div>
        <div class="text">
          <p>9元网费</p>
          <div class="flex space-between align-center">
            <div>1000 <span>积分</span></div>
            <div>
              <div class="btn" @click="rewardVisible = true">兑换</div>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="img"><img src="../../assets/shop02.png" alt="" /></div>
        <div class="text">
          <p>19元网费</p>
          <div class="flex space-between align-center">
            <div>2000 <span>积分</span></div>
            <div>
              <div class="btn" @click="rewardVisible = true">兑换</div>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="img"><img src="../../assets/shop03.png" alt="" /></div>
        <div class="text">
          <p>50元网费</p>
          <div class="flex space-between align-center">
            <div>5000 <span>积分</span></div>
            <div>
              <div class="btn" @click="rewardVisible = true">兑换</div>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="img"><img src="../../assets/shop07.jpg" alt="" /></div>
        <div class="text">
          <p>高级降噪无线蓝牙耳机</p>
          <div class="flex space-between align-center">
            <div>1.78万 <span>积分</span></div>
            <div>
              <div class="btn" @click="rewardVisible = true">兑换</div>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="img"><img src="../../assets/shop08.png" alt="" /></div>
        <div class="text">
          <p>外星人27英寸显示器2K180Hz游戏电脑高刷AW2724DM</p>
          <div class="flex space-between align-center">
            <div>49.80万 <span>积分</span></div>
            <div>
              <div class="btn" @click="rewardVisible = true">兑换</div>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="img"><img src="../../assets/shop09.jpg" alt="" /></div>
        <div class="text">
          <p>外星人27英寸 电竞显示器 Fast IPS 360Hz 游戏电脑高刷屏 AW2724HF</p>
          <div class="flex space-between align-center">
            <div>69.80万 <span>积分</span></div>
            <div>
              <div class="btn" @click="rewardVisible = true">兑换</div>
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="img"><img src="../../assets/shop10.png" alt="" /></div>
        <div class="text">
          <p>外星人AW2524H 24.5英寸500Hz刷新率IPS电竞游戏电脑显示器</p>
          <div class="flex space-between align-center">
            <div>99.80万 <span>积分</span></div>
            <div class="flex">
              <div class="btn" @click="rewardVisible = true">兑换</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-model="rewardVisible"
      title="兑换抽奖提示"
      width="500"
      center
      :close-on-click-modal="false"
    >
      <div style="text-align: center">
        <img style="width: 70%" src="../../assets/login-ewm.png" alt="" />
        <p>微信扫一扫打开积分商城</p>
        <p style="color: #e1e1e1; font-size: 12px">
          (任何有关 领奖 / 兑换 的问题可咨询客服)
        </p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="rewardVisible = false"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
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

const rewardVisible = ref(false);

const myIntergral = ref(localStorage.getItem("myIntergral"));
window.addEventListener("storage", (event) => {
  if (event.key === "myIntergral") {
    myIntergral.value = event.newValue;
  }
});
</script>
<style lang="scss" scoped>
.gift {
  width: 100%;
  height: 100%;
  background: url(../../assets/user-bj.jpg) no-repeat;
  background-size: cover;
  box-sizing: border-box;
  padding: 20px;
  box-sizing: border-box;
  padding-top: 120px;
  // img {
  //   max-width: 200px;
  //   margin-right: 0;
  // }
  h3 {
    margin: 0;
    margin-bottom: 20px;
    color: #fff;
    text-align: center;
  }
  p {
    color: #e5e5e5;
    margin-top: 20px;
    font-size: 16px;
  }
  .item {
    width: 13%;
    background: #fff;
    margin-bottom: 20px;
    margin-top: 20px;
    .img {
      background: #fff;
      border-bottom: 1px solid rgb(230, 230, 230);
      height: 182px;
      overflow: hidden;
      img {
        width: 100%;
        display: block;
      }
    }
    .text {
      padding: 20px;
      p {
        color: #333;
        margin-top: 0;
        height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        margin-bottom: 10px;
        font-size: 14px;
      }
    }
    .flex {
      color: #ff7316;
      font-size: 20px;
      span {
        font-size: 12px;
        font-weight: bold;
      }
      .btn {
        padding: 5px;
        background: #ff7316;
        color: #fff;
        font-size: 12px;
        cursor: pointer;
      }
      .btn2 {
        background: none;
        border: 1px solid #ff7316;
        color: #ff7316;
      }
    }
    img {
      width: 100%;
    }
  }
}
</style>
