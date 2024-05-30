<template>
  <div class="user">
    <div class="container">
      <div class="flex space-between box" >
        <div class="left">
          <div class="menu flex space-between">
            <div class="tab text-center " v-for="(item,index) in tabs" :key="item" :class="{'on': currentIndex == index}" @click="switchTab(index)">{{ item }}</div>
          </div>
          <el-table :data="table" style="width: 100%" align="center">
            <el-table-column label="游戏类型" prop="name" >
              <template #default="scope">
                <div class="flex align-center " v-if="scope.row.Type == 0">
                  <img src="../../assets/lol.png" alt="">
                  <p>英雄联盟</p>
                </div>
                <div v-else> 
                  <img src="../../assets/yjwj.png" alt="">
                  <p>永劫无间</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="召唤师名称" prop="SummonerName"  align="center"/>
            <el-table-column label="所选英雄" prop="condition"  align="center">
              <template #default="scope">
                {{ scope.row.heroName}} - {{ scope.row.heroTitle }}
              </template>

              
            </el-table-column>
            <el-table-column label="击杀/死亡/助攻" prop="condition"  align="center">
              <template #default="scope">
                {{ scope.row.ChampionsKilled }} / {{ scope.row.NumDeaths }} / {{ scope.row.Assists }}
              </template>
            </el-table-column>

            <el-table-column label="游戏结果" prop="condition"  align="center">
              <template #default="scope">
                <span v-if="scope.row.Win == 1" style="color: #58b4da">胜利</span>
                <span v-else style="color: #e15151">失败</span>

              </template>
            </el-table-column>
            <!-- <el-table-column label="领取状态" prop="status"  align="center">
              <template #default="scope">
                <el-tag effect="dark" type="info">已发放</el-tag>
              </template>
            </el-table-column> -->
          </el-table>
          <div class="text-center">
              <el-pagination background  layout="prev, pager, next" :total="4" @size-change="sizeChange"/>
          </div>
        </div>
        <div class="right">
          <div class="top-part">
            <div class="top">
              <div class="count"><span>{{myIntergral}}</span>积分</div>
              <p>当前积分</p>
            </div>
            <div class="bottom">
              <div class="flex space-around">
                <div>
                  <div>比赛总场次</div>
                  <p><span>{{myMatchCount}}</span>场</p>
                </div>
                <div>
                  <div>现金赛总场次</div>
                  <p><span>{{myMatchLevel}}</span>场</p>
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
import heroInfo from './hero.json'

import api from '../../api/request'
const router = useRouter();
const route = useRoute();
const currentIndex = ref(0)
const currentGift = ref({})
const showGiftDialog = ref(false)
const myIntergral = ref(localStorage.getItem('myIntergral'))
const myMatchCount = ref(localStorage.getItem('matchCount'))
const myMatchLevel = ref(localStorage.getItem('matchLevel'))
const championByIdCache = ref({})
const championJson = ref({})
const infos = ref(false)
const total = ref(0)
const pageSize = ref(8)
const currentPage = ref(1)

const tabs = ref(['游戏记录'])
const table = ref([])
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

const sizeChange = (v) => {
  currentPage.value = v
}
// 获取比赛记录
const getMatchLog = () => {
  api.post('/method/account/', {
   method: 'GET_MATCH_LOG',
   page: currentPage.value,
    limit: pageSize.value
 }).then(res => {
   table.value = res.data.result.data
   total.value = res.data.count

   table.value.map(item => {
    heroInfo.map(jtem => {
      if (item.ChampionId == jtem.key) {
        item.heroTitle = jtem.title
        item.heroName = jtem.name
      }
    })
   })
   console.log( table.value)
 })
}

getMatchLog()


const  getLatestChampionDDragon = async (language = "en_US") => {

	if (championJson[language])
		return championJson[language];

	let response;
	let versionIndex = 0;
	do { // I loop over versions because 9.22.1 is broken
		const version = (await fetch("http://ddragon.leagueoflegends.com/api/versions.json").then(async(r) => await r.json()))[versionIndex++];
	
		response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/champion.json`);
	}
	while (!response.ok)
	
	championJson[language] = await response.json();
	return championJson[language];
}

 const  getChampionByKey = async (key, language = "zh_CN") => {

	// Setup cache
	if (!championByIdCache[language]) {
		let json = await getLatestChampionDDragon(language);

		championByIdCache[language] = {};
		for (var championName in json.data) {
			if (!json.data.hasOwnProperty(championName))
				continue;

			const champInfo = json.data[championName];
			championByIdCache[language][champInfo.key] = champInfo;
		}
	}

	return championByIdCache[language][key];
}

// NOTE: IN DDRAGON THE ID IS THE CLEAN NAME!!! It's also super-inconsistent, and broken at times.
// Cho'gath => Chogath, Wukong => Monkeyking, Fiddlesticks => Fiddlesticks/FiddleSticks (depending on what mood DDragon is in this patch)
 const  getChampionByID =  async (name, language = "zh_CN") => {
	return await getLatestChampionDDragon(language)[name];
}

 const main = async (id) => {
	const info = await getChampionByKey(id, "zh_CN");
  console.log(info)
  infos.value = true
	return info
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
        width: 100%;
        background: rgba(243, 231, 255, .5);
        padding: 10px 0;
        cursor: pointer;
        font-weight: bold;
        color: #c4c4c4;
        &.on {
          color: #333;
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
      color: #ffb967;
    }
    :deep(.el-pagination) {
      justify-content: center;
      margin-top: 20px;
    }
    :deep(.el-pagination.is-background .btn-next.is-active, .el-pagination.is-background .el-pager li.is-active) ,
      :deep(.el-pagination.is-background .btn-prev.is-active),
      :deep(.el-pagination.is-background .el-pager li.is-active){

      background: #ffb967;
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
      background:  url(../../assets/personal-bj.png) no-repeat right top;
      padding-bottom: 90px;
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
      padding-bottom: 2vw;
      padding-top: 2vw;
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
      padding: 25px 20px;
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