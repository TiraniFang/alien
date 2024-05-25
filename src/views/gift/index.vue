<template>
  <div class="gift">
    <div class="layout"></div>
    <div class="gray"></div>
    <div class="container">
      <div class="title flex align-center">
        <img src="../../assets/task.png" alt="">
        <span>所有福利</span>
        <span class="rule" @click="showRuleDialog = true">[活动规则]</span>
      </div>
      <div class="all-gift">
        <div class="flex space-between flex-wrap">
            <div class="item" v-for="(item, index) in 9" :key="item">
              <img class="icon" v-if="index != 0" :src="require('../../assets/coin.png')" alt="">
              <img class="icon" v-if="index == 0" :src="require('../../assets/rebbag.png')" alt="">
              <div class="title">奖励10积分</div>
              <div class="bottom">
                <div>任务要求：任意模式获胜</div>
                <p>当前进度：1/3</p>
                <div class="btn" v-if="index == 0" @click="giftDialogShow(item)">领</div>
                <div class="btn none" v-else>已领</div>
              </div>
            </div>
          </div>
      </div>
    </div>
    <GiftDialog :detail="currentGift" v-if="showGiftDialog"  @continueTasks="showGiftDialog = false"/>
    <Rules  v-if="showRuleDialog" @closeRules="showRuleDialog = false"/>
    
  </div>
</template>
<script setup>
import { ref } from 'vue'
import GiftDialog from '../gift/components/gift-dialog.vue';
import Rules from '../home/components/rules.vue';

const showGiftDialog = ref(false)
const showRuleDialog = ref(false)

const currentGift = ref({})
const giftDialogShow = (item) => {
  showGiftDialog.value = true
  currentGift.value = item
}
</script>
<style lang="scss">
.gift {
  width: 100%;
  height: 100%;
  padding-top: 99px;
  box-sizing: border-box;
  .layout ,.gray{
    width: 100%;
    height: 100%;
    background: url(../../assets/gift-bj.png) no-repeat;
    background-size: cover;
    background-position: center top;
    background-repeat: no-repeat;
    filter: blur(50px);
    position: absolute;
    left: 0;
    top: 0;
    z-index: -2;
  }
  .gray {
    background: rgba(0,0,0,.8);
    z-index: -1;
  }
  .title {
    color: #fff;
    padding-top:30px;
    span {
      color: #fff;
    }
    .rule {
      color: rgb(228, 228, 228);
      display: inline-block;
      margin-left: 20px;
      font-size: 12px;
      cursor: pointer;
    }
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
          cursor: pointer;
          font-size: 20px;
          &.none {
            background: #999;
          }
        }
      }
    }
}
</style>