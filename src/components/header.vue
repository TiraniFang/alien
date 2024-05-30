<template>
  <div>
    <div class="nav-header">
      <div class="min" @click="minimizeWindow('min')"></div>
      <div class="close" @click="dialogVisible = true"></div>
      <div class="container" style="height: auto">
        <div class="flex space-between align-center">
          <div class="logo flex align-center">
            <img class="logo" src="../assets/logo.png" alt="">
            <img class="slogon" src="../assets/slogon.png" alt="">
          </div>
          <div class="menu flex align-center">
            <router-link v-for="(item,index) in menus" :key="item.text" :class="{'on': currentIndex == index}" :to="item.path" v-on:click.prevent>
              <div class="flex align-center">
                <img class="icon" v-if="currentIndex == index" :src="item.activeIcon" alt="">
                <img class="icon" v-else :src="item.icon" alt="">
                <span>{{ item.text }}</span>
              </div>
              <!-- <div class="ewm" v-if="index == menus.length -1">
                <img src="../assets/login-ewm.png" alt="">
              </div> -->
            </router-link>
            <a href="javascript:;">
              <div class="flex align-center">
                <!-- <img class="icon" v-if="currentIndex == index" src="../assets/shop-on.png" alt=""> -->
                <img class="icon" src="../assets/shop.png" alt="">
                <span>商城</span>
              </div>
              <div class="ewm" >
                <img src="../assets/login-ewm.png" alt="">
              </div>
            </a>

          </div>

          <div class="personal-center">
            <div class="flex align-center">
              <div class="avatar"><img src="../assets/avatar.png" alt=""></div>
              <div>
                <h5>默认昵称</h5>
                <p>当前积分：<span>{{ myIntergral }}</span></p>
              </div>
            </div>
            <div class="drop-menu">
              <router-link to="/user">个人中心</router-link>
              <router-link to="/user#cash" >游戏记录</router-link>
              <a href="javascript:;" @click="toQuit">退出登录</a>
            </div>
          </div>
        </div>
      </div>
  <!-- <div v-if="info" style="background: #fff;">
        <h2>Received Information:</h2>
        <ul>
         <li v-for="(value, key) in info" :key="key">{{ key }}: {{ value }}</li>
          <li>sign: {{sign}}</li>
          <li>sign2: {{sign2}}</li>
          <li>cookie: {{cookie}}</li>
          <li>number: {{number}}</li>
          <li>info: {{info}}</li>
        </ul>
      </div>   -->
    </div>
     <el-dialog
      v-model="dialogVisible"
      title="关闭窗口"
      width="500"
    >
      <span>确认关闭程序吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="minimizeWindow('exit')">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
 
</template>
<script setup>
import  { ref , watch , onMounted} from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus'
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

import api from '../api/request'
// import { getIntergral } from '../utils/base.js'
const dialogVisible = ref(false)
const currentIndex = ref(0)
const myIntergral = ref(0)
const info = ref(null)
const sign = ref('')
const sign2 = ref('')
const number = ref(localStorage.getItem('numberToken'))
const cookie = document.cookie.replace(/(?:(?:^|.*;\s*)LOL_MATCH_SERVER\s*\=\s*([^;]*).*$)|^.*$/, "$1");
const menus = ref(
  [
    {
      text: '主页',
      path: '/home',
      icon: require('../assets/home.png'),
      activeIcon: require('../assets/home-on.png')
    },
    {
      text: '闯关',
      path: '/match',
      icon: require('../assets/match-icon.png'),
      activeIcon: require('../assets/match-on.png')
    },
    {
      text: '福利',
      path: '/gift',
      icon: require('../assets/gift.png'),
      activeIcon: require('../assets/gift-on.png')
    }
  ]
)
const router = useRouter();
const route = useRoute();

onMounted (() => {
  isCurrentPath(route.path)

  if (window.client) {
   window.handleMatchData = handleMatchData;
   window.minimizeWindow = minimizeWindow
   window.gameLogin = gameLogin
   window.gameLogout = gameLogout
  } else {
   console.log("Java bridge not found");
  }

})
watch(
  () => route.path,
  (path) => {
    isCurrentPath(path)
    console.log(path);
  }
);

const isCurrentPath = (path) => {
  switch (path) {
    case '/': 
    currentIndex.value = 0
    break;

    case '/home':
      currentIndex.value = 0
      break;
    case '/match':
      currentIndex.value = 1
      break;
    case '/gift':
      currentIndex.value = 2
      break;
    case '/shop':
      currentIndex.value = 3
      break;
    default: 
    currentIndex.value = -1

  }
}

// 上传游戏数据
//  const handleMatchData = (data) => {
//    console.log("handleMatchData method called with data: " + JSON.stringify(data));
//    info.value = "Match data received: " + JSON.stringify(data);
//    return "Match data processed";
//   }
const handleMatchData = (str) => {
  const data = JSON.stringify(str);
  info.value = JSON.parse(data)

  sign.value = ''
  sign2.value = ''
  sign.value = localStorage.getItem('numberToken') + info.value.summonerId + info.value.server  + info.value.tier + info.value.queueId + info.value.gameLength +  info.value.championId + info.value.championsKill  + info.value.assists  + info.value.numDeaths + info.value.goldEarned  + info.value.minionsKilled  + info.value.level   + info.value.visionScore   +  info.value.win   + info.value.rank +  'LOLUID1FE7111E9FB0FBF7B13E338923FC2C32FG'
  sign2.value = sign.value
  // MD5加密
  sign.value = CryptoJS.MD5(sign.value).toString()
  api.post('/method/account/',{
    method: 'SUBMIT_MATCH_DATA',
    Type: info.value.gameType,
    Tier: info.value.tier,
    Server: info.value.server,
    SummonerName:info.value.summonerName,
    QueueId: info.value.queueId,
    SummonerId: info.value.summonerId,
    GameLength: info.value.gameLength ,
    ChampionId: info.value.championId ,
    ChampionsKilled: info.value.championsKill ,
    Assists: info.value.assists ,
    NumDeaths: info.value.numDeaths ,
    GoldEarned: info.value.goldEarned ,
    MinionsKilled: info.value.minionsKilled ,
    Level: info.value.level ,
    VisionScore: info.value.visionScore,
    Win: info.value.win ,
    Rank: info.value.rank ,
    Sign: sign.value ,
  }).then((res) => {
      if (res.data.code == 10000) {
        getIntegral()
        return true
    } else {
        return res.data.message
    }
  })
}
// 游戏登录
const gameLogin = (obj) => {
  const data = JSON.stringify(obj);
  info.value = JSON.parse(data)
  sign.value = ''
  sign.value = info.value.server + info.value.accountID + info.value.summonerId + 'LOLUID1FE7111E9FB0FBF7B13E338923FC2C32FG'
  // MD5加密

  sign.value = CryptoJS.MD5(sign.value).toString()

  api.post('/method/account/',{
    method: 'GAME_USER_LOGIN',
    Server: data.server,
    AccountID: data.accountID,
    SummonerId: data.summonerId,
    SummonerName: data.summonerName,
    Sign: sign.value
  }).then(res => {
    info.value = res
 //   if(res.data.code == 10000) {
 //     return true
  //  } else {
  //    return res.data.message
  //  }
  })
}

// 游戏登出
const gameLogout = (obj) => {
  // const data = JSON.parse(obj);
  api.post('/method/account/').then(res => {
//if(res.data.code == 10000) {
 //     return true
 //   } else {
 //     return res.data.message
 //   }
  })
}

// 最小化、关闭窗口
const minimizeWindow  = (str) => {
  console.log("mini button clicked");
 
  if (window.client) {
    try {
      window.client.minimizeWindow(str);
       if (str == 'exit') {
          dialogVisible.value = false
        }
    } catch (error) {
      console.error("Failed to call Java method or parse JSON:", error);
    }
  } else {
    console.log("Java bridge not found");
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
      myIntergral.value = localStorage.getItem('myIntergral')
    }
  })
}

// 退出登录
const toQuit = () => {
  // 退出登录
  api.post('/method/account/', {
    method: 'GAME_USER_LOGOUT',
  }).then(res => {
    if (res.data.code == 10000) {
      ElMessage.success('退出成功')
      Object.keys(Cookies.get()).forEach(name => {
        Cookies.remove(name);
      });
      localStorage.clear()
      router.replace('/login')
    }
  })
}
// getIntergral()
localStorage.getItem('loginStatus') && getIntegral()
</script>
<style lang="scss" scoped>
.nav-header {
  box-sizing: border-box;
  width: 100%;
  padding: 10px 0;
  background: rgba(0,0,0, .7);
  position: fixed;
  height: 99px;
  top: 0;
  left: 0;
  z-index: 5;
  transition: all .2s;
}
.menu {
  position: relative;
  .ewm {
    background: rgba(0,0,0,.4);
    padding: 30px;
      position: absolute;
      left: 100%;
      transform: translateX(-50%);
      top: 61px;
      display: none;
    }
  a {
    color: #c5c5c5;
    margin: 0 20px;
    font-weight: bold;
    position: relative;
    &:last-child:hover {
      .ewm {
        display: block;
      }
    }
  
    &.on {
      color: #ffb967;
      &:after {
        content: '';
        width: 175px;
        height: 102px;
        background: url(@/assets/currentIndex.png) no-repeat;
        position: absolute;
        position: absolute;
        left: 60%;
        bottom: -37px;
        transform: translateX(-50%);
      }
    }
  }
}
.icon {
  width: 25px;
  height: 25px;
  margin-right: 10px;
}
.logo {
  width: 73px;
  height: 79px;
  margin-right: 20px;
}
.slogon {
  width: 269px;
  height: 29px;
  
}
.personal-center {
  color: #fff;
  position: relative;
  height: 100%;
  height: 79px;
  display: flex;
  padding: 20px 0;
  box-sizing: border-box;
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid rgb(255, 164, 35);
    overflow: hidden;
    background: #fff;
    margin-right: 10px;
    img {
      max-width: 100%;
    }
  }
  h5 {
    margin: 0;
    margin-bottom: 5px;
  }
  p {
    font-size: 12px;
    span{
      color:#ffb967;
    }
  }
  .drop-menu{
    padding: 10px 0;
    width: 100%;
    box-sizing: border-box;
    background: #36363a;
    position: absolute;
    top: 90%;
    left: 0;
    display: none;
    a {
      display: block;
      color: #d0d0d1;
      text-align: center;
      font-size: 12px;
      padding: 10px 0;
      &:hover {
        background: rgb(74, 74, 74);
      }
    }
  }
  &:hover .drop-menu {
    display: block;
  }
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