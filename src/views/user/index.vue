<template>
  <div class="user">
    <div class="container">
      <div class="flex space-between box" >
        <div class="left">
          <div class="menu flex space-between">
            <div class="tab text-center " v-for="(item,index) in tabs" :key="item" :class="{'on': currentIndex == index}" @click="switchTab(index)">{{ item }}</div>
          </div>
          <el-table :data="table" style="width: 100%" align="center">
            <el-table-column label="奖励名称" prop="name"  align="center" />
            <el-table-column label="获得条件" prop="condition"  align="center"/>
            <el-table-column label="获得时间" prop="date"  align="center"/>
            <el-table-column label="领取状态" prop="status"  align="center">
              <template #default="scope">
                <el-tag effect="dark" v-if="scope.row.status == 0" type="success">待领取</el-tag>
                <el-tag effect="dark" v-else type="info">已领取</el-tag>

              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" >
              <template #default="scope">
                <el-button
                  size="small"
                  link
                  @click="giftDialogShow"
                  v-if="scope.row.status == 0"
                >
                  领取
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="text-center">
              <el-pagination background  :hide-on-single-page="true" layout="prev, pager, next" :total="4" />
          </div>
        </div>
        <div class="right">
          <div class="top-part">
            <div class="top">
              <div class="count"><span>1220</span>积分</div>
              <p>当前积分</p>
            </div>
            <div class="bottom">
              <div class="flex space-around">
                <div>
                  <div>比赛总场次</div>
                  <p><span>108</span>场</p>
                </div>
                <div>
                  <div>现金赛总场次</div>
                  <p><span>108</span>场</p>
                </div>
              </div>
            </div>
          </div>
          <div class="service">
            <img src="../../assets/login-ewm.png" alt="">
            <p>扫一扫联系客服</p>
          </div>
        </div>
      </div>
    </div>
    <GiftDialog :detail="currentGift" v-if="showGiftDialog"  @continueTasks="showGiftDialog = false"/>

  </div>
</template>
<script setup>
import { onMounted, ref ,  watch } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import GiftDialog from '../gift/components/gift-dialog.vue';

const router = useRouter();
const route = useRoute();
const currentIndex = ref(0)
const currentGift = ref({})
const showGiftDialog = ref(false)

const tabs = ref(['比赛记录', '现金赛记录', '奖励记录', '兑换记录'])
const table = ref([
  {
    name: '10积分',
    condition: '任意模式取得3场胜利',
    date: '2024/2/22 14:00:00',
    status: '0'
  },{
    name: '20积分',
    condition: '任意模式取得5场胜利',
    date: '2024/2/22 14:00:00',
    status: '0'
  },{
    name: '30积分',
    condition: '任意模式取得7场胜利',
    date: '2024/2/22 14:00:00',
    status: '1'
  },{
    name: '30网费',
    condition: '任意模式取得11场胜利',
    date: '2024/2/22 14:00:00',
    status: '1'
  },

])
onMounted (() => {
  console.log(route, ' route')
})
watch(
  () => route.hash,
  (hash) => {
    console.log(hash);

    isCurrentPath(hash)
  }
);
const giftDialogShow = (item) => {
  showGiftDialog.value = true
  currentGift.value = item
}
const isCurrentPath = (path) => {
  switch (path) {
    case '#match':
      currentIndex.value = 0
      break;
    case '#cash':
      currentIndex.value = 1
      break;
    case '#gift':
      currentIndex.value = 2
      break;
    default: 
    currentIndex.value = 3

  }
}
const switchTab = (index) => {
  currentIndex.value = index
}
</script>
<style lang="scss" scoped>
.user {
  width: 100%;
  height: 100%;
  background: url(../../assets/user-bj.jpg) no-repeat;
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  padding-top: 99px;
  box-sizing: border-box;
  .box {
    height: 100%;
  }
  .left {
    width: 74%;
    .menu {
      padding-top: 20px;
      padding-bottom: 5px;
      .tab {
        width: 24.9%;
        background: rgba(243, 231, 255, .5);
        padding: 10px 0;
        cursor: pointer;
        font-weight: bold;
        color: #c4c4c4;
        &.on {
          color: #ffc107;
        }
      }
    }
    :deep(.el-table tr),
    :deep(.el-table) {
      background: transparent;
    }
    :deep(.el-table th.el-table__cell) {
      background: rgba(0,0,0,.4);
      border-bottom-color: rgba(255,255,255,.2);
    }
    :deep(.el-table td.el-table__cell) {
      background: rgba(0,0,0,.2);
      border-bottom-color: rgba(255,255,255,.3);
      color: #fff;
    }
    :deep(.el-table__inner-wrapper:before) {
      height: 0;
    }
    :deep(.el-table .td .cell) {
      color: #fff;
    }
    :deep(.el-table .el-table__cell) {
      padding: 15px 0;
    }
    :deep(.el-button.is-link) {
      color: #ffc107;
    }
    :deep(.el-pagination) {
      justify-content: center;
      margin-top: 20px;
    }
    :deep(.el-pagination.is-background .btn-next.is-active, .el-pagination.is-background .el-pager li.is-active) ,
      :deep(.el-pagination.is-background .btn-prev.is-active),
      :deep(.el-pagination.is-background .el-pager li.is-active){

      background: #ffc107;
    }
    :deep(.el-tag--dark.el-tag--success) {
      background: #2dca6f;
    }
  }
  .right {
    width: 25%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 20px;
    .top-part {
      background: rgba(0,0,0,.2);
    }
    .top {
      background:  url(../../assets/personal-bj.png) no-repeat;
      padding-bottom: 60px;
      background-size: cover;
      .count {
        font-size: 12px;
        color: #e07e00;
        padding-left: 30px;
        padding-top: 30px;
        span {
          font-size: 36px;
          font-weight: bold;
          margin-right: 5px;
        }
      }
      p {
        padding-left: 30px;
        font-weight: bold;
        font-size: 12px;
        color: #666;
      }
    }
    .bottom {
      color: #fff;
      text-align: center;
      padding-bottom: 60px;
      padding-top: 60px;
      span {
        font-size: 30px;
        font-weight: bold;
      }
      p {
        margin-top: 20px;
      }
    }
    .service {
      background: rgba(0,0,0,.2);
      padding: 60px 20px;
      margin-top: 20px;
      text-align: center;
      margin-bottom: 20px;
      img {
        max-width: 80%;
      }
      p {
        font-size: 14px;
        color: #fff;
        margin-top: 20px;
        text-align: center;
      }
    }
  }
}
</style>