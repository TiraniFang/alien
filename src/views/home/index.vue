<template>
  <div class="home" :style="{'background-image': `url(${gameList[currentIndex].banner})`}">
    <div class="layout"></div>
    <div class="container">
      <div class="pagination">
        <div class="game-btn" 
          @click="switchGame(index)"
          :class="{'on': currentIndex == index}"
          v-for="(item,index) in gameList" 
          :key="item.name"  
          :style="{'background-image': `url(${gameList[index].icon})`}">
          <div class="bg"></div>
        </div>
      </div>
      <div class="theme">
        <img src="../../assets/theme.png" alt="">
        <p>完成下方每日任务即可免费领取对应的奖励</p>
        <el-button class="start-game" @click="launchLOL" :disabled="isDisabled">{{ btnMsg }}</el-button>
      </div>
      <div class="task">
        <div class="container">
          <div class=" flex space-between">
            <div class="title flex align-center">
              <img src="../../assets/task.png" alt="">
              <span>福利进度</span>
              <span class="rule" @click="showRuleDialog = true">[活动规则]</span>
            </div>
            <router-link class="toGift" to="/gift">查看全部</router-link>
          </div>
          <div class="flex space-between">
            <div class="item" v-for="(item, index) in taskList" :key="item">
              <img class="icon" v-if="item.type == '积分'" src="../../assets/coin.png" alt="">
              <img class="icon" v-else src="../../assets/rebbag.png" alt="">

              <div class="title">奖励{{item.rewardIntegral}}{{ item.type }}</div>
              <div class="bottom">
                <div>任务要求：任意模式获胜</div>
                <p>当前进度：{{item.finish}}/{{item.total}}</p>
                <!-- <div class="btn none" v-if="item.status == 0">未完成</div> -->
                <div class="btn" v-if="item.status == 1">已发放</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <GiftDialog :detail="currentGift" v-if="showGiftDialog" @continueTasks="showGiftDialog = false"/>
    <Rules  v-if="showRuleDialog" @closeRules="showRuleDialog = false"/>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import GiftDialog from '../gift/components/gift-dialog.vue';
import Rules from './components/rules.vue';
import { ElMessage } from 'element-plus'
import api from '../../api/request'
import { useRouter } from 'vue-router';
const router = useRouter();
// 当前游戏索引
const currentIndex = ref(0)
const btnMsg = ref('开始游戏')
const info = ref(null)
const gameType = ref('LOL')
const isDisabled = ref(false)
const taskList = ref([])
// 点击的当前任务奖励
const currentGift = ref(0)
const showGiftDialog = ref(false)
const showRuleDialog = ref(false)
const timer = ref(null)


const gameList = ref([
  {
    name: '英雄联盟',
    icon: require('../../assets/lol-btn2.jpg'),
    banner: require('../../assets/banner03.jpg')
  },
  {
    name: '永劫无间',
    icon: require('../../assets/yjwj-btn.jpg'),
    banner: require('../../assets/banner01.jpg')
  }
])


const launchLOL = () => {
  btnMsg.value = '启动游戏中...'
  if (window.client) {
    try {
     isDisabled.value = true
     const jsonString = window.client.launchGame(gameType.value);
     const data = JSON.parse(jsonString);
     info.value = data;
     let timer = setTimeout(() => {
      btnMsg.value = '开始游戏'
      isDisabled.value = false
      clearTimeout(timer)
     },18000)
    } catch (error) {
      ElMessage.error(error)
    }
   } else {
   }
  }


// 切换游戏
const switchGame = (index) => {
        currentIndex.value = index

  if (index == 1 ) {
    gameType.value = 'Naraka'

  } else {
    gameType.value = 'LOL'
  }
  clearInterval(timer.value)
  timer.value = null
  getCaro()

};
// 获取奖励
const giftDialogShow = (item) => {
  showGiftDialog.value = true
  currentGift.value = item
}

// 获取任务数据列表
const getTaskList = () => {
  api.post('/method/account/', {
    method: 'GET_QUEST_DATA_NEW',
  }).then(res => {
    console.log(res)
    taskList.value = res.data.result.slice(0,2)
    const last = res.data.result[res.data.result.length - 1]
    taskList.value.push(last)
  })
}
if (!localStorage.getItem('loginStatus')) {
  router.replace('/login')
} else {
  getTaskList()
}

const getCaro  = () => {
  timer.value = setInterval(() => {
    if (currentIndex.value == 0 ) {
      currentIndex.value = 1
      gameType.value = 'Naraka'

    } else {
      currentIndex.value = 0
      gameType.value = 'LOL'

    }
  },5000)
}
getCaro()
</script>
<style lang="scss">
.home {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  position: relative;
  transition: all .2s;
  .layout {
    width: 100%;
    height: 100%;
    background: url(../../assets/home-gray.png) no-repeat;
    background-size: cover;
    position: absolute;
    top: -0;
    left: 50%;
    transform: translateX(-50%);
  }
  .pagination {
    position: absolute;
    left: 2vw;
    top: 50%;
    transform: translateY(-50%);
    .game-btn {
      width: 270px;
      height: 82px;
      margin-bottom: 10px;
      border: 2px solid rgb(173, 163, 123);
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      position: relative;
      cursor: pointer;
      transition: all .2s;
      .bg {
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.5);
        position: absolute;
        top: 0;
        left: 0;
        transition: all .2s;
        opacity: 1;
      }
      &.on , &:hover{
        border-color:  #ffd249;
        .bg {
          opacity: 0;
        }
      }
    }
  }
  .theme {
    position: absolute;
    top: 50%;
    text-align: right;
    right: 20px;
    transform: translateY(-50%);
    img {
      width: 421px;
    }
    p {
      color: #fff;
      font-size: 16px;
      text-align: right;
      margin-top: 20px;

    }
    .start-game {
      width: 248px;
      height: 68px;
      border-color: transparent;
      background: linear-gradient(to right, #ffd44a, #ff8a0a);
      border-radius: 4px;
      text-align: center;
      font-size: 30px;
      font-weight: bold;
      color: #573303;
      display: inline-block;
      margin-top: 50px;
    }
  }
  .task {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    color: #fff;
    padding-bottom: 20px;
    .rule {
      color: rgb(228, 228, 228);
      display: inline-block;
      margin-left: 20px;
      font-size: 12px;
      cursor: pointer;
    }
    .toGift {
      color: rgb(228, 228, 228);
      font-size: 14px;
    }
    .item {
      width: 32%;
      background: url(../../assets/task-bj.png) no-repeat;
      background-size: cover;
      border-radius: 30px;
      overflow: hidden;
      margin-top: 20px;
      position: relative;
      .icon {
        position: absolute;
        right: 30px;
        top: 20px;
      }
      .title {
        font-size: 30px;
        color: #6b3c11;
        padding-top:30px;
        padding-left: 30px;
      }
      .bottom {
        margin-top: 50px;
        padding-left: 30px;
        color: #573303;
        padding-bottom: 20px;
        p {
          margin-top: 10px;
        }
        .btn {
          width: 60px;
          height: 60px;
          background: linear-gradient(to bottom, #9e9e9e, #838383);
          border-radius: 50%;
          position: absolute;
          right: 20px;
          bottom: 20px;
          line-height: 60px;
          text-align: center;
          color: #fff;
          font-weight: bold;
          font-size: 12px;
          cursor: pointer;
          &.none {
            background: #999;
          }
        }
      }
    }
  }
}

</style>