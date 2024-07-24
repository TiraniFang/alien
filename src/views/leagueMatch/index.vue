<template>
  <Header v-drag :intergral="myIntergral" @childEvent="refreshData" />
  <div class="competition">
    <div class="container">
      <div class="filter flex">
        <el-form ref="forms" :model="form" inline label-width="90px">
          <el-form-item label="游戏：">
            <el-select v-model="form.game" clearable placeholder="请选择">
              <el-option
                v-for="item in gameList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="对战大区：">
            <el-select v-model="form.area" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="对战模式：">
            <el-select v-model="form.model" clearable placeholder="请选择">
              <el-option
                v-for="item in modelList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="createBtn">创建对战</div>
      </div>
      <div class="box">
        <div class="flex flex-wrap">
          <div class="item" v-for="(item, index) in 8">
            <div class="area">
              <img src="../../assets/heisemeigui.png" alt="" />
              <p><i></i><span>等待中</span></p>
              <div class="layout">
                <div class="joinBtn"><i class="iconfont icon-mima"></i>加入对战</div>
              </div>
            </div>
            <div class="info">
              <div class="team flex space-center">
                <i class="iconfont icon-qizi"></i>
                <p>一起战斗！</p>
              </div>
              <div class="bottom flex align-center">
                <i class="iconfont icon-game"></i>
                <p>英雄联盟 - 常规自定义</p>
              </div>
              <div class="bottom flex align-center">
                <i class="iconfont icon-address"></i>
                <p>湖北省武汉市天源电竞馆</p>
              </div>
              <div class="bottom flex align-center">
                <i class="iconfont icon-people"></i>
                <p>5人组</p>
              </div>
              <div class="award flex space-center">
                <div>
                  <img src="../../assets/rebbag.png" alt="" />
                </div>
              </div>
              <p
                class="text-center"
                style="color: #f8ae00; font-size: 14px; margin-top: 8px"
              >
                奖励：100现金
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "LeagueMatch",
};
</script>
<script setup>
import { ref } from "vue";
import Header from "@/components/header.vue";
const myIntergral = ref(localStorage.getItem("myIntergral"));
const form = ref({
  game: "",
  area: "",
  model: "",
});

const options = ref([
  {
    label: "黑色玫瑰",
    value: "heisemeigui",
  },
  {
    label: "艾欧尼亚",
    value: "aiouniya",
  },
]);
const gameList = ref([
  {
    label: "英雄联盟",
    value: "lol",
  },
  {
    label: "永劫无间",
    value: "anix",
  },
]);
const modelList = ref([
  {
    label: "云顶自定义",
    value: "lol",
  },
  {
    label: "常规自定义",
    value: "anix",
  },
]);
const refreshData = () => {
  myIntergral.value = localStorage.getItem("myIntergral");
};
</script>
<style lang="scss" scoped>
.competition {
  width: 100%;
  height: 100%;
  background: url(../../assets/lenguaMatch.jpg) no-repeat;
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  padding-top: 99px;
  box-sizing: border-box;
  position: relative;
  .tips {
    font-size: 28px;
    color: #b2c0cf;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .joinBtn,
  .createBtn {
    border-radius: 4px;
    padding: 8px 20px;
    background: #ffb645;
    color: #512c01;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    font-weight: bold;
    cursor: pointer;
  }

  .filter {
    font-size: 14px;
    color: #fff;
    padding-top: 20px;
    border-bottom: 1px solid rgb(47, 102, 136);
    position: relative;

    span {
      display: block;
    }
    .gameBtn {
      width: 100px;
      height: 30px;
      cursor: pointer;
      text-align: center;
      line-height: 30px;
      background: #434a63;
      &.on {
        background: #f8ae00;
      }
    }
  }
  .box {
    margin-top: 20px;
    height: calc(100% - 115px);
    overflow-y: auto;
    .item {
      width: 239px;
      height: 478px;
      margin: 0 20px;
      background: url(../../assets/duizhan-bj.png) no-repeat;
      background-size: contain;
      overflow: hidden;
      position: relative;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      margin-bottom: 30px;
      &:hover {
        .layout {
          display: block;
        }
      }
      .layout {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        position: absolute;
        left: 0;
        top: 0;
        display: none;
        border-radius: 50%;
        .joinBtn {
          right: 50%;
          transform: translate(50%, -50%);
        }
      }
      .area {
        position: absolute;
        top: -100px;
        left: 50%;
        transform: translateX(-50%);

        p {
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          color: #15cb1e;
          font-size: 12px;
          i {
            display: inline-block;
            margin-right: 10px;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #15cb1e;
            vertical-align: middle;
            margin-bottom: 4px;
          }
        }
      }
      .info {
        padding-top: 220px;
        margin: 0 30px;

        .team {
          color: #f9e1b5;
          padding-bottom: 10px;
          border-bottom: 1px solid #a97c45;
          p {
            margin-left: 10px;
          }
        }
        .bottom {
          font-size: 12px;
          color: #f9e1b5;
          margin: 2px 0;
          i {
            margin-right: 10px;
          }
        }
        .award {
          > div {
            padding: 5px;
            border-radius: 3px;
            background: #a97c45;
            border: 1px solid #ffb645;
            img {
              margin-right: 0;
              width: 25px;
              display: block;
            }
          }
        }
      }
    }
  }
}
:deep(.el-select) {
  width: 130px !important;
  margin-left: 0 !important;
}
:deep(.el-form-item__label) {
  color: #fff;
}
</style>
