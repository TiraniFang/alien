<template>
  <div class="match" v-if="list.length > 0">
    <div class="match-title" >
      <img src="../../assets/match-title.png" alt="">
    </div>

    <div class="containers" ref="containers" @mousedown="startDrag" @mousemove="doDrag" @mouseup="endDrag" >
    <!-- 这里放置你的超长内容 -->
      <div class="content" v-for="(item,index) in list" :key="item.id" >
        <div class="box">
          <div class="current" v-if="(currentIndex == index && item.currentGuan) || (item.status != 0 && currentIndex == index)  "></div>
          <div class="line" v-if="item.status != 0 && !item.currentGuan"></div>
          <div class="item" @click="choose(item, index)" :class="{
            'pass': item.status == 2 || item.currentGuan,
            'ani': (item.status != 0 && currentIndex == index) || (currentIndex == index && item.currentGuan) 
            }">
            <!-- 'current': item.currentGuan && currentIndex == index -->

            <h3>关卡</h3>
            <h2>{{item.name}}</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="currentInfo">
      <div>
        <p>通过条件</p>
        <p class="orange">任意模式取得胜利（0/3）</p>
      </div>
      <div>
        <p>您的积分： <span class="orange">1200</span></p>
        <p>关卡需消耗积分： <span class="blue">1000</span></p>
      </div>
      <div>
        <p>通过奖励</p>
        <p class="flex align-center"><img src="../../assets/rebbag2.png" alt=""><span>10元</span></p>
      </div>
      <div>
        <p class="btn">开始闯关</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const currentIndex = ref(-1)
const choose = (item, index) => {
  if (item.status == 0 && !item.currentGuan) {
    ElMessage.warning('请先完成前面的关卡~')
    return 
  }
  currentIndex.value = index

}

const list = ref([
      { 
        id: 1, 
        name: '1' ,  // 关卡名  第几关
        status: 1,   // 状态   0 未通关， 1已通过
        currentGuan: false, //  是否是当前正在闯的关数
        intergraph: 1000, // 需消耗积分
        money: 2   // 奖励现金金额
      },
      { 
        id: 2, 
        name: '2' ,
        status: 0,
        currentGuan: true,
        intergraph: 1000,
        money: 4
      },
      { 
        id: 3, 
        name: '3' ,
        status: 0,
        currentGuan: false,
        intergraph: 1000,
        money: 6

      },
      { 
        id: 4, 
        name: '4' ,
        status: 0,
        currentGuan: false,
        intergraph: 1000,
        money: 8

      },
      { 
        id: 5, 
        name: '5' ,
        status: 0,
        currentGuan: false,
        intergraph: 1000,
        money: 10
      },
      { 
        id: 6, 
        name: '6' ,
        status: 0,
        currentGuan: false,
        intergraph: 1000,
        money: 8

      },
      { 
        id: 7, 
        name: '7' ,
        status: 0,
        currentGuan: false,
        intergraph: 1000,
        money: 8

      },
      { 
        id: 8, 
        name: '8' ,
        status: 0,
        currentGuan: false,
        intergraph: 1000,
        money: 8
      },

      // ...
    ]);


list.value.map((item,index) => {
  if (item.currentGuan) currentIndex.value = index

})

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
    containers.value.scrollLeft += delta;
    startX.value = currentX;
  }
};
 
const endDrag = () => {
  dragging.value = false;
};
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
    transform: translate(-50%,-50%);
  }
}
.match-title {
  position: absolute;
  top: 150px;
  left: 50%;
  transform: translateX(-50%);
}
.currentInfo {
  position: fixed;
  width: 60%;
  padding: 20px;
  box-sizing: border-box;
  background: rgba(0,0,0,.6);
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 3;
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
    line-height: 38px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #573303;
    display: inline-block;
    margin-bottom: 0!important;
    cursor: pointer;
  }
}
.containers {
  overflow-x: hidden;
  overflow-y: auto;
  white-space: nowrap;
  padding: 0 100px;
  padding-top: 250px;
  padding-bottom: 20px;
  cursor: move;
  position: relative;
}
.content {
  display: inline-block;
  white-space: normal;
  height: 280px;
  width: 220px;
  .box {
    height: 100%;
    width: 100%;
    position: relative;
  }
  &:nth-child(odd) {
    .box {
      .item ,.current{
        right: 0;
        top: 0;
      }
      .line {
        content: '';
        width: 1px;
        height: 66%;
        position: absolute;
        right: -77px;
        top: 33px;
        transform: rotate(-56deg);
        background: #a9d5fb;
      }
    }
  }
  &:nth-child(even) {
    .box {
      .line {
        content: '';
        width: 1px;
        height: 65%;
        position: absolute;
        right: -77px;
        top: 34px;
        transform: rotate(56deg);
        background: #a9d5fb;
        opacity: .6;
      }
      .item  ,.current{
        right: 0;
        bottom: 0;
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
    cursor: pointer;
    z-index: 1;
   
    h3 {
      margin: 0;
      margin-top: 5px;
    }
    h2 {
      margin: 0;
      margin-top: 3px;
      font-size: 30px;
    }
    &.pass {
      background: url(../../assets/gq-finished.png) no-repeat;
      color: #cce7ff;
      opacity: .6;
      &::before {
        content: '';
        width: 25px;
        height: 10px;
        background: #a9d5fb;
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 50%;
      }
      &::after {
        content: '';
        width: 35px;
        height: 17px;
        border: 1px solid #a9d5fb;
        position: absolute;
        bottom: -25px;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 50%;
      }
    }
    &.ani {
      opacity: 1;

      &::before {
        animation: beforeAni 1.5s infinite;
      }
      &::after {
        animation: afterAni 1.5s .1s infinite;
      }
    }
   
  }
  .current {
    width: 67px;
    height: 104px;
    position: absolute;
    background: url(../../assets/gq-finished.png) no-repeat;
    filter: blur(50px);
    color: #d8edff;
    z-index: 0;
  }
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
</style>