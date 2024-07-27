<template>
  <Header v-drag @childEvent="switchTab(currentIndex)" :intergral="myIntergral" />
  <div v-drag class="user">
    <div class="container">
      <div class="flex space-between box">
        <div class="left">
          <div class="tab-menu flex space-between">
            <div
              class="tab"
              v-for="(item, index) in tabs"
              :key="item"
              :class="{ on: currentIndex == index }"
              @click="switchTab(index)"
            >
              {{ item }}
              <!-- <span style="font-size:12px;">(总{{ total }}条记录)</span> -->
            </div>
          </div>

          <div class="menu flex space-between" v-if="currentIndex == 0">
            <div class="flex align-center">
              <span class="filter">对局结果</span>
              <el-radio-group v-model="win" @change="getMatchLog">
                <el-radio-button label="全部" :value="-1" />
                <el-radio-button label="胜利" :value="1" />
                <el-radio-button label="失败" :value="0" />
              </el-radio-group>
              <span class="filter">筛选</span>
              <el-date-picker
                v-model="selectDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="getTime"
                format="YYYY/MM/DD hh:mm:ss"
                value-format="YYYY-MM-DD h:m:s"
                clearable
              />
            </div>
          </div>
          <div v-if="currentIndex == 0">
            <div v-if="currentIndex == 0 && table.length > 0">
              <el-table :data="table" style="width: 100%" align="center">
                <el-table-column label="游戏名称" prop="name">
                  <template #default="scope">
                    <div class="flex align-center" v-if="scope.row.Type == 0">
                      <img src="../../assets/lol.png" alt="" />
                      <p>英雄联盟</p>
                    </div>
                    <div class="flex align-center" v-else>
                      <img src="../../assets/yjwj.png" alt="" />
                      <p>永劫无间</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="召唤师名称" prop="SummonerName" align="center" />
                <el-table-column label="游戏模式" prop="condition" align="center">
                  <template #default="scope">
                    <span v-if="scope.row.QueueId == 430">召唤师峡谷自选</span>
                    <span v-if="scope.row.QueueId == 420">召唤师峡谷单双排位</span>
                    <span v-if="scope.row.QueueId == 440">召唤师峡谷灵活排位</span>
                    <span v-if="scope.row.QueueId == 450">极地大乱斗</span>
                    <span v-if="scope.row.QueueId == 1090">云顶匹配</span>
                    <span v-if="scope.row.QueueId == 1100">云顶排位</span>
                    <span v-if="scope.row.QueueId == 1130">云顶狂暴</span>
                    <span v-if="scope.row.QueueId == 1160">云顶双人作战</span>
                    <span v-if="scope.row.QueueId == 1210">云顶恭喜发财</span>
                    <!-- <span v-if="scope.row.QueueId == 1700">斗魂竞技场</span> -->
                    <span v-if="scope.row.QueueId == 5000000">生存天选单排</span>
                    <span v-if="scope.row.QueueId == 5000200">生存天选双排</span>
                    <span v-if="scope.row.QueueId == 5000001">生存天选三排</span>
                    <!-- <span v-if="scope.row.QueueId == 5000004">生存天人单排</span>
                    <span v-if="scope.row.QueueId == 5000202">生存天人双排</span>
                    <span v-if="scope.row.QueueId == 5000005">生存天人三排</span> -->
                    <span v-if="scope.row.QueueId == 5000006">生存快速单排</span>
                    <span v-if="scope.row.QueueId == 5000011">生存快速双排</span>
                    <span v-if="scope.row.QueueId == 5000007">生存快速三排</span>
                    <span v-if="scope.row.QueueId == 5000015">娱乐暗域狂潮</span>
                    <!-- <span v-if="scope.row.QueueId == 5000070">娱乐无间幻境</span> -->
                    <!-- <span v-if="scope.row.QueueId == 5000016">娱乐无尽枪火</span> -->
                    <span v-if="scope.row.QueueId == 5000010">娱乐无尽试炼</span>
                    <span v-if="scope.row.QueueId == 5000060">娱乐武道争锋</span>
                    <!-- <span v-if="scope.row.QueueId == 5000600">娱乐地脉之战</span> -->
                    <!-- <span v-if="scope.row.QueueId == 5000080">娱乐糖豆人</span> -->
                    <!-- <span v-if="scope.row.QueueId == 5000400">娱乐共振联赛</span> -->
                    <span v-if="scope.row.QueueId == 5000700">娱乐武道对决</span>
                  </template>
                </el-table-column>
                <el-table-column label="游戏时长" prop="gameLength" align="center">
                  <template #default="scope">
                    {{ formatDuration(scope.row.GameLength) }}
                  </template>
                </el-table-column>
                <!-- <el-table-column label="击杀/死亡/助攻" prop="condition"  align="center">
                  <template #default="scope">
                    {{ scope.row.ChampionsKilled }} / {{ scope.row.NumDeaths }} / {{ scope.row.Assists }}
                  </template>
                </el-table-column> -->

                <el-table-column label="游戏结果" prop="condition" align="center">
                  <template #default="scope">
                    <span v-if="scope.row.Win == 1" style="color: #58b4da"
                      >完成<span v-if="scope.row.Rank != 0"
                        >(第{{ scope.row.Rank }}名)</span
                      ></span
                    >
                    <span
                      v-if="scope.row.Win == 0 && scope.row.Rank == 0"
                      style="color: #e15151"
                      >未完成</span
                    >
                    <span
                      v-if="scope.row.Win == 0 && scope.row.Rank != 0"
                      style="color: #e15151"
                      >未完成(第{{ scope.row.Rank }}名)</span
                    >
                  </template>
                </el-table-column>
                <el-table-column label="时间" prop="LogDate" align="center" />
                <!-- <el-table-column label="领取状态" prop="status"  align="center">
                  <template #default="scope">
                    <el-tag effect="dark" type="info">已发放</el-tag>
                  </template>
                </el-table-column> -->
              </el-table>
              <div class="text-center flex space-center align-center">
                <el-pagination
                  background
                  layout="prev, pager, next, total"
                  :total="total"
                  :page-size="pageSize"
                  @current-change="currentChange"
                />
                <el-button
                  style="margin-top: 20px; margin-left: 20px"
                  @click="getMatchLog"
                  alt="刷新"
                  ><el-icon><RefreshRight /></el-icon
                ></el-button>
              </div>
            </div>
            <el-empty description="暂无记录" v-else />
          </div>
          <div v-if="currentIndex == 1">
            <div v-if="currentIndex == 1 && table2.length > 0">
              <el-table :data="table2" style="width: 100%" align="center">
                <el-table-column label="变动类型" prop="transDate" align="center">
                  <template #default="scope">
                    <p
                      style="color: #e15151"
                      v-if="
                        scope.row.remark == '外星人高端玩家联盟-关卡挑战' ||
                        scope.row.remark == '外星人高端玩家联盟-重置关卡'
                      "
                    >
                      消耗积分
                    </p>
                    <p style="color: #6ee151" v-else>获得积分</p>
                  </template>
                </el-table-column>

                <el-table-column label="积分" prop="name" align="center">
                  <template #default="scope">
                    <div class="flex align-center space-center">
                      <img style="width: 50px" src="../../assets/coin.png" alt="" />
                      <p><span></span>{{ scope.row.variationRange }}积分</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="剩余积分" prop="amount" align="center" />

                <el-table-column
                  label="完成条件"
                  prop="remark"
                  width="250"
                  align="center"
                  show-overflow-tooltip="true"
                >
                </el-table-column>
                <el-table-column label="获得时间" prop="transDate" align="center" />
              </el-table>
              <div class="text-center flex space-center align-center">
                <el-pagination
                  background
                  :page-size="pageSize2"
                  layout="prev, pager, next, total"
                  :total="total"
                  @current-change="currentChange"
                />
                <el-button
                  style="margin-top: 20px; margin-left: 20px"
                  @click="getInteraLog"
                  alt="刷新"
                  ><el-icon><RefreshRight /></el-icon
                ></el-button>
              </div>
            </div>
            <el-empty description="暂无记录" v-else />
          </div>
          <div v-if="currentIndex == 2">
            <div v-if="currentIndex == 2 && table3.length > 0">
              <el-table :data="table3" style="width: 100%" align="center">
                <el-table-column label="获得现金" prop="name" align="center">
                  <template #default="scope">
                    <div class="flex align-center space-center">
                      <img style="width: 30px" src="../../assets/rebbag.png" alt="" />
                      <p>{{ scope.row.Number / 100 }}元</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="完成条件" prop="condition" align="center">
                  <template #default="scope">
                    <p>完成第{{ scope.row.Level }}关获得</p>
                  </template>
                </el-table-column>
                <el-table-column label="获得时间" prop="LogDate" align="center" />
              </el-table>
              <div class="text-center flex space-center align-center">
                <el-pagination
                  background
                  :page-size="pageSize3"
                  layout="prev, pager, next, total"
                  :total="total"
                  @current-change="currentChange"
                />
                <el-button
                  style="margin-top: 20px; margin-left: 20px"
                  @click="getCashLog"
                  alt="刷新"
                  ><el-icon><RefreshRight /></el-icon
                ></el-button>
              </div>
            </div>
            <el-empty description="暂无记录" v-else />
          </div>
          <div v-if="currentIndex == 3">
            <div v-if="currentIndex == 3 && table4.length > 0">
              <el-table :data="table4" style="width: 100%" align="center">
                <el-table-column label="奖励类型" prop="Type" align="center">
                  <template #default="scope">
                    {{ scope.row.Type == 1 ? "平台排名奖励" : "网吧排名奖励" }}
                  </template>
                </el-table-column>
                <el-table-column label="奖励排行类型" prop="RankType" align="center">
                  <template #default="scope">
                    {{
                      scope.row.RankType == 1
                        ? "日赛排行"
                        : scope.row.RankType == 2
                        ? "周赛排行"
                        : "月赛排行"
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="排行类型" prop="SubRankType" align="center">
                  <template #default="scope">
                    {{
                      scope.row.SubRankType == 1
                        ? "在线时长排行"
                        : scope.row.SubRankType == 2
                        ? "积分排行"
                        : "完成度排行"
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="排名" prop="Rank" align="center" />
                <el-table-column label="奖励类型" prop="PrizeType" align="center">
                  <template #default="scope">
                    {{ scope.row.Type == 1 ? "现金" : "网费" }}
                  </template>
                </el-table-column>

                <el-table-column label="获得额度" prop="Number" align="center">
                  <template #default="scope">
                    <div class="flex align-center space-center">
                      <img style="width: 30px" src="../../assets/rebbag.png" alt="" />
                      <p>{{ scope.row.Number }}元</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="卷码发放状态" prop="Status" align="center">
                  <template #default="scope">
                    <el-tag type="error" v-if="scope.row.Status == 0">发放失败</el-tag>
                    <el-tag type="success" v-if="scope.row.Status == 1">发放成功</el-tag>
                    <el-tag type="info" v-if="scope.row.Status == 2">未发放</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="获得时间" prop="LogDate" align="center" />
              </el-table>
              <div class="text-center flex space-center align-center">
                <el-pagination
                  background
                  :page-size="pageSize4"
                  layout="prev, pager, next, total"
                  :total="total"
                  @current-change="currentChange"
                />
                <el-button
                  style="margin-top: 20px; margin-left: 20px"
                  @click="getRankLog"
                  alt="刷新"
                  ><el-icon><RefreshRight /></el-icon
                ></el-button>
              </div>
            </div>
            <el-empty description="暂无记录" v-else />
          </div>
        </div>
        <div class="right">
          <div class="top-part">
            <div class="top">
              <div class="count">
                <span>{{ myIntergral }}</span
                >积分
              </div>
              <p>当前积分</p>
            </div>
            <div class="bottom">
              <div class="flex space-around">
                <div>
                  <div>比赛总场次</div>
                  <p>
                    <span>{{ myMatchCount }}</span
                    >场
                  </p>
                </div>
                <div>
                  <div>现金赛总场次</div>
                  <p>
                    <span>{{ myMatchLevel }}</span
                    >场
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="service">
            <img src="../../assets/login-ewm.png" alt="" />
            <p>扫一扫联系客服</p>
          </div>
        </div>
      </div>
    </div>
    <GiftDialog
      :detail="currentGift"
      v-if="showGiftDialog"
      @continueTasks="showGiftDialog = false"
    />
  </div>
</template>
<script>
export default {
  name: "User",
};
</script>
<script setup>
import { onMounted, ref, watch } from "vue";
import Header from "@/components/header.vue";
import { RefreshRight } from "@element-plus/icons-vue";

import { useRouter, useRoute } from "vue-router";
import GiftDialog from "../gift/components/gift-dialog.vue";
import heroInfo from "./hero.json";

import api from "../../api/request";
const router = useRouter();
const startTime = ref("");
const endTime = ref("");
const win = ref(-1);
const loading = ref(true);
const route = useRoute();
const currentIndex = ref(0);
const currentGift = ref({});
const showGiftDialog = ref(false);
const myIntergral = ref(localStorage.getItem("myIntergral"));
const myMatchCount = ref(localStorage.getItem("matchCount"));
const myMatchLevel = ref(localStorage.getItem("matchLevel"));
const championByIdCache = ref({});
const championJson = ref({});
const infos = ref(false);
const selectDate = ref([]);
const total = ref(0);
const pageSize = ref(6);
const pageSize2 = ref(8);
const pageSize3 = ref(6);
const pageSize4 = ref(6);

const currentPage = ref(1);
// , "比赛奖励记录"
const tabs = ref(["游戏记录", "积分记录", "闯关奖励记录"]);
const table = ref([]);
const table2 = ref([]);
const table3 = ref([]);
const table4 = ref([]);

onMounted(() => {
  isCurrentPath(route.hash);
});
watch(
  () => route.hash,
  (hash) => {
    isCurrentPath(hash);
  }
);
window.addEventListener("storage", (event) => {
  if (event.key === "myIntergral") {
    myIntergral.value = event.newValue;
  }
});
const formatDuration = (seconds) => {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let remainingSeconds = seconds % 60;

  let duration = "";
  if (hours > 0) {
    duration += hours + "小时 ";
  }
  if (minutes > 0) {
    duration += minutes + "分钟 ";
  }
  if (remainingSeconds > 0) {
    duration += remainingSeconds + "秒";
  }

  return duration.trim();
};

const isCurrentPath = (path) => {
  switch (path) {
    case "#match":
      currentIndex.value = 0;
      break;
    case "#cash":
      currentIndex.value = 1;
      break;
    case "#gift":
      currentIndex.value = 2;
      break;
    case "#rank":
      currentIndex.value = 3;
      getRankLog();
  }
};
const switchTab = (index) => {
  currentIndex.value = index;
  currentPage.value = 1;
  if (index == 0) {
    getMatchLog();
  } else if (index == 1) {
    getInteraLog();
  } else if (index == 2) {
    getCashLog();
  } else {
    getRankLog();
  }
};

const getRankLog = () => {
  api
    .post("/method/account/", {
      method: "GET_RANK_REWARD_INFO",
      page: currentPage.value,
      size: 6,
    })
    .then((res) => {
      table4.value = res.data.result.data;
      total.value = res.data.result.count;
    });
};

const getTime = (v) => {
  if (v != null) {
    startTime.value = v[0] + "00:00:00";
    endTime.value = v[1] + "23:59:59";
  } else {
    startTime.value = "";
    endTime.value = "";
  }
  getMatchLog();
};
const currentChange = (v) => {
  currentPage.value = v;
  if (currentIndex.value == 0) {
    getMatchLog();
  } else if (currentIndex.value == 1) {
    getInteraLog();
  } else if (currentIndex.value == 2) {
    getCashLog();
  } else {
    getRankLog();
  }
};
// 获取比赛记录
const getMatchLog = () => {
  loading.value = true;

  api
    .post("/method/account/", {
      method: "GET_MATCH_LOG",
      page: currentPage.value,
      limit: pageSize.value,
      startTime: startTime.value,
      endTime: endTime.value,
      win: win.value,
    })
    .then((res) => {
      table.value = res.data.result.data;
      total.value = res.data.result.count;
      table.value.map((item) => {
        heroInfo.map((jtem) => {
          if (item.ChampionId == jtem.key) {
            item.heroTitle = jtem.title;
            item.heroName = jtem.name;
          }
        });
      });
      loading.value = false;
    });
};
// 获取积分记录
const getInteraLog = () => {
  loading.value = true;

  api
    .post("/method/account/", {
      method: "GET_POINT_LOG",
      page: currentPage.value,
      size: pageSize2.value,
    })
    .then((res) => {
      table2.value = res.data.result.dataList;
      total.value = res.data.result.totalCount;
      loading.value = false;
    });
};

// 获取现金奖励记录
const getCashLog = () => {
  loading.value = true;
  api
    .post("/method/account/", {
      method: "GET_STAGE_LOG",
      page: currentPage.value,
      size: pageSize3.value,
    })
    .then((res) => {
      table3.value = res.data.result.data;
      total.value = res.data.result.count;
      loading.value = false;
    });
};
getMatchLog();

const getLatestChampionDDragon = async (language = "en_US") => {
  if (championJson[language]) return championJson[language];

  let response;
  let versionIndex = 0;
  do {
    // I loop over versions because 9.22.1 is broken
    const version = (
      await fetch("http://ddragon.leagueoflegends.com/api/versions.json").then(
        async (r) => await r.json()
      )
    )[versionIndex++];

    response = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/champion.json`
    );
  } while (!response.ok);

  championJson[language] = await response.json();
  return championJson[language];
};

const getChampionByKey = async (key, language = "zh_CN") => {
  // Setup cache
  if (!championByIdCache[language]) {
    let json = await getLatestChampionDDragon(language);

    championByIdCache[language] = {};
    for (var championName in json.data) {
      if (!json.data.hasOwnProperty(championName)) continue;

      const champInfo = json.data[championName];
      championByIdCache[language][champInfo.key] = champInfo;
    }
  }

  return championByIdCache[language][key];
};

// NOTE: IN DDRAGON THE ID IS THE CLEAN NAME!!! It's also super-inconsistent, and broken at times.
// Cho'gath => Chogath, Wukong => Monkeyking, Fiddlesticks => Fiddlesticks/FiddleSticks (depending on what mood DDragon is in this patch)
const getChampionByID = async (name, language = "zh_CN") => {
  return await getLatestChampionDDragon(language)[name];
};

const main = async (id) => {
  const info = await getChampionByKey(id, "zh_CN");
  infos.value = true;
  return info;
};
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
  .el-radio-group {
    width: 200px;
  }
  .box {
    height: 100%;
  }
  .left {
    width: 74%;
    margin-top: 20px;
    .tab-menu {
      margin-bottom: 10px;
    }
    .tab {
      width: 33.3%;
      padding: 20px 0;
      font-weight: bold;
      box-sizing: border-box;
      color: #c4c4c4;
      text-align: center;
      background: rgba(0, 0, 0, 0.9);
      cursor: pointer;
      &.on {
        color: #333;
        background: linear-gradient(to right, #ffd44a, #ff8a0a);
      }
    }
    .menu {
      background: rgba(243, 231, 255, 0.5);
      padding: 10px;
      margin-bottom: 10px;
      .filter {
        display: block;
        min-width: 50px;
        color: #e5e5e5;
        margin-right: 5px;
        text-align: right;
        font-size: 12px;
      }
    }
    :deep(.el-table tr),
    :deep(.el-table) {
      background: transparent;
    }
    :deep(.el-table th.el-table__cell) {
      background: rgba(0, 0, 0, 0.4);
      border-bottom-color: rgba(255, 255, 255, 0.2);
    }
    :deep(.el-table td.el-table__cell) {
      background: rgba(0, 0, 0, 0.2);
      border-bottom-color: rgba(255, 255, 255, 0.3);
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
    :deep(.el-pagination.is-background .btn-next.is-active, .el-pagination.is-background
        .el-pager
        li.is-active),
    :deep(.el-pagination.is-background .btn-prev.is-active),
    :deep(.el-pagination.is-background .el-pager li.is-active) {
      background: #e07e00;
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
      background: rgba(0, 0, 0, 0.2);
    }
    .top {
      background: url(../../assets/personal-bj.png) no-repeat right top;
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
      background: rgba(0, 0, 0, 0.2);
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
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: #e07e00;
  border-color: #e07e00;
}
:deep(.el-pagination__total) {
  color: #fff;
}
</style>
