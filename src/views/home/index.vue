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
        <div class="start-game" @click="callJavaMethod">开始游戏</div>
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
              <img class="icon" v-if="index != 0" src="../../assets/coin.png" alt="">
              <img class="icon" v-if="index == 0" src="../../assets/rebbag.png" alt="">

              <div class="title">奖励{{item.rewardIntegral}}{{ item.type }}</div>
              <div class="bottom">
                <div>任务要求：任意模式获胜</div>
                <p>当前进度：{{item.finish}}/{{item.total}}</p>
                <div class="btn none" v-if="item.status == 0">未完成</div>
                <div class="btn" v-if="item.status == 1" @click="giftDialogShow(item)">领</div>
                <div class="btn none" v-else>已领</div>
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

// 当前游戏索引
const currentIndex = ref(0)
// 点击的当前任务奖励
const currentGift = ref(0)
const showGiftDialog = ref(false)
const showRuleDialog = ref(false)
const imgList = ref([
  '/banner01.jpg'
])

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

const taskList = ref([
  {
    id: 1,
    type: '网费', // 奖励类型
    rewardIntegral: 30, // 奖励数量
    finish: 1, // 已完成几把游戏
    total: 11, // 共需完成几把头像
    status: 0  // 状态   0 未完成  1 已完成。未领取   2 已领取
  },
  {
    id: 2,
    type: '积分',
    rewardIntegral: 20,
    finish: 3,
    total: 3,
    status: 1
  },{
    id: 3,
    type: '积分',
    rewardIntegral: 10,
    finish: 5,
    total: 5,
    status: 2
  }
])

// 切换游戏
const switchGame = (index) => {
  currentIndex.value = index
};
// 获取奖励
const giftDialogShow = (item) => {
  showGiftDialog.value = true
  currentGift.value = item
}

// 获取任务数据列表
const getTaskList = () => {
  api.post('/method/account/', {
    method: 'GET_QUEST_DATA',
  }).then(res => {
    console.log(res)
  })
}

getTaskList()
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
      border: 2px solid rgb(53, 53, 53);
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      position: relative;
      cursor: pointer;
      .bg {
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.5);
        position: absolute;
        top: 0;
        left: 0;
        opacity: 1;
      }
      &.on {
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
      background: linear-gradient(to right, #ffd44a, #ff8a0a);
      border-radius: 4px;
      line-height: 68px;
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
      width: 430px;
      height: 198px;
      background: url(../../assets/task-bj.png) no-repeat;
      background-size: contain;
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
        margin-top: 40px;
        padding-left: 30px;
        color: #573303;
        p {
          margin-top: 10px;
        }
        .btn {
          width: 60px;
          height: 60px;
          background: linear-gradient(to bottom, #f0a954, #eb6b35);
          border-radius: 50%;
          position: absolute;
          right: 20px;
          bottom: 20px;
          line-height: 60px;
          text-align: center;
          color: #fff;
          font-weight: bold;
          font-size: 20px;
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