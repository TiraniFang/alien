<template>
  <div>
    <div class="nav-header">
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
                <h5>被风吹过的夏天</h5>
                <p>当前积分：<span>1200</span></p>
              </div>
            </div>
            <div class="drop-menu">
              <router-link to="/user#match">比赛记录</router-link>
              <router-link to="/user#cash" >现金赛记录</router-link>
              <router-link to="/user#gift">奖励记录</router-link>
              <router-link to="/user#exchange">兑换记录</router-link>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
 
</template>
<script setup>
import  { ref , watch , onMounted} from 'vue'
import { useRouter, useRoute } from 'vue-router';
const currentIndex = ref(0)
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
</style>