<template>
  <div class="item" :style="{ color: isActive ? activeColor : defaultColor }">
    <div class="middle">
      <div
        :class="['circle', isActive ? '' : 'default-border']"
        :style="{
          backgroundColor: defaultColor,
          borderColor: isActive ? activeColor : defaultColor,
        }"
      >
        <!-- <el-icon v-if="isActive"><Check /></el-icon> -->
      </div>
      <div class="content" :style="contentStyle">{{ content }}</div>
      <div
        class="line"
        v-if="isShowLine"
        :style="{ backgroundColor: isActive ? activeColor : defaultColor }"
      ></div>
    </div>
    <div
      v-if="otherInfo"
      class="timestamp"
      :title="otherInfo"
      :style="timestampStyle"
    >
      {{ otherInfo }}
    </div>
    <div
      class="timestamp"
      :style="timestampStyle"
      :title="timestamp"
      v-if="timestamp"
    >
      {{ timestamp }}
    </div>
  </div>
</template>
  
<script>
export default {
  data() {
    return {};
  },
  props: {
    isShowLine: {
      type: Boolean,
      default: true,
    },
    otherInfo: {
      type: String,
      default: "",
    },
    // 文字
    content: {
      type: String,
    },
    // 时间节点
    timestamp: {
      type: String,
    },
    contentStyle: {
      type: String,
      default: "color:black;fontWeight:600",
    },
    timestampStyle: {
      type: String,
      default: "color:#9aa7b8",
    },
    // 是否为激活状态
    isActive: {
      type: Boolean,
      default: false,
    },
    // 激活状态文字颜色
    activeColor: {
      type: String,
      default: "#3a62d7",
    },
    // 未激活状态文字颜色
    defaultColor: {
      type: String,
      default: "#e4e7ed",
    },
  },
  mounted() {},
};
</script>
  
<style scoped lang="scss">
$circle-width: 20px;
.item {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  /* min-width: 100px; */
  width: fit-content;
  .middle {
    display: inline-flex;
    align-items: center;
    padding: 8px 0;
  }
  .content {
    margin-left: 5px;
    margin-right: 10px;
    font-size: 16px;
  }
  .circle {
    width: $circle-width;
    height: $circle-width;
    line-height: $circle-width;
    text-align: center;
    border-radius: 50%;
    border: 2px solid;
    color: #fff;
    flex-shrink: 0;
    font-size: 16px;
    i {
      font-weight: 700;
      font-size: 18px;
      vertical-align: middle;
    }
  }

  .line {
    height: 2px;
    width: calc(100% - 95px);
  }
}
.default-border {
  border: 2px solid #3a62d7;
}
.item,
.timestamp {
  word-break: keep-all;
  text-align: left;
  font-size: 14px;
  padding-right: 15px;
}
.timestamp {
  word-break: break-all;
  margin-left: 35px;
  max-width: 180px;
  max-height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient:vertical;
  display: -webkit-box;
  white-space: normal;
}
</style>