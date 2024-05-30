<template>
  <div class="match">
    <div class="match-title" >
      <img src="../../assets/match-title.png" alt="">
      <el-countdown title="闯关倒计时" v-if="timeCount != null" :value="timeCount" />
    </div>

    <div class="containers" ref="containers" @mousedown="startDrag" @mousemove="doDrag" @mouseup="endDrag" >
    <!-- 这里放置你的超长内容 -->
      <div class="content" v-for="(item,index) in matchData.max_number" :key="item" >
        <div class="box">
          <div class="current" v-if="currentIndex == passList[passList.length - 1] && passList.includes(index)"></div>
          <div class="line" v-if="matchData.InLevel != 0"></div>
          <div class="item" :class="{
            'pass': passList.includes(index),
            'ani': currentIndex == index
            }">
            <!-- 'current': item.currentGuan && currentIndex == index -->

            <h3>关卡</h3>
            <h2>{{index + 1}}</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="currentInfo">
      <div>
        <p>通过条件</p>
        <p class="orange">任意模式取得胜利（{{matchData.Number}}/{{currentIndex+1}}）</p>
      </div>
      <div>
        <p>您的积分： <span class="orange">{{myIntergral}}</span></p>
        <p>关卡需消耗积分： <span class="blue">{{needIntergral}}</span></p>
      </div>
      <div>
        <p>通过奖励</p>
        <p class="flex align-center"><img src="../../assets/rebbag2.png" alt=""><span>{{rewardMoney}}元</span></p>
      </div>
      <div>
        <el-button 
          class="btn" 
          @click="dialogVisible = true"
          :disabled="currentIndex + 1 == matchData.Number">
          {{matchData.InLevel == 0 ?  '开始闯关' : (currentIndex + 1 == matchData.Number ? '已通关': '闯关中...' )}}
        </el-button>
      </div>
    </div>
     <el-dialog
      v-model="dialogVisible"
      title="闯关提示"
      width="500"
      center
    >
      <p style="text-align: center;height: 50px;light-height: 50px;">确定消耗<span style="color: #ffd44a">{{needIntergral}}</span>积分开始闯关吗?</p>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="getStart">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../../api/request'
import dayjs from 'dayjs'

const timeCount = ref(null)
const myIntergral = localStorage.getItem('myIntergral')
const needIntergral = ref(0)
const rewardMoney = ref(0)
const dialogVisible = ref(false)
const passList = ref([])
const currentIndex = ref(-1)
const choose = (item, index) => {
  if (!index == matchData.value.Level && !passList.value.includes(index)) {
    ElMessage.warning('请先完成前面的关卡~')
    return 
  }
  currentIndex.value = index
  needIntergral.value = (currentIndex.value+1) * 200

}



// list.value.map((item,index) => {
//   if (item.currentGuan) currentIndex.value = index

// })

const matchData = ref({})

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
    console.log(containers.value.scrollLeft)
  }
};
 
const endDrag = () => {
  dragging.value = false;
};
// 获取关卡数据
const getMatchData = () => {
 
 api.post('/method/stage/', {
   method: 'GET_STAGE_INFO',
 }).then(res => {
   console.log(res)
   matchData.value = res.data.result
   currentIndex.value = matchData.value.Level
   needIntergral.value = (matchData.value.Level + 1) * 200
   rewardMoney.value = currentIndex.value+1


   if (matchData.value.expires != 0) {
    timeCount.value = Date.now() + matchData.value.expires * 1000
   }

   for(let i = 0; i <= matchData.value.Level; i++) {
    passList.value.push(i)
   }
 })
}

// 开始闯关
const getStart = () => {
  if (matchData.value.InLevel == 0) {
    api.post('/method/stage/', {
      method: 'STAGE_REGISTER',
      level: currentIndex.value + 1
    }).then(res => {
      dialogVisible.value = false
      console.log(res)
      if (res.data.code == 10000) {
          ElMessage.success('报名成功！')
          window.location.reload()
          getIntegral()
      } else {
          ElMessage.error(res.data.message)
      }
    })
  }
}
// 获取当前用户积分
const getIntegral = () => {
  api.post('/method/account/', {
    method: 'GET_USER_INTEGRAL'
  }).then(res => {
    if (res.data.code = 10000) {
      localStorage.setItem('myIntergral', res.data.result.number)
      localStorage.setItem('matchCount', res.data.result.match_count)
      localStorage.setItem('matchLevel', res.data.result.match_level)
    }
  })
}
getMatchData()
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
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: #573303;
    display: inline-block;
    margin-bottom: 0!important;
    cursor: pointer;
    border-color: transparent;
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
    filter: blur(20px);
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
:deep(.el-statistic__head) {
  text-align: center;
  color: #b1d7ff;
}
:deep(.el-statistic__content) {
  color: #f76a7e;
  text-align: center;
}
:deep(.el-dialog) {
  background: rgb(36, 36, 36);
}
:deep(.el-dialog__title), 
:deep(.el-dialog__body) {
  color: #f5f5f5;
}
:deep(.el-button--primary) {
  background: #eb6b35;
  border-color: #eb6b35;
}
</style>