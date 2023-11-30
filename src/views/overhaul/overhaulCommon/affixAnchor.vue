<template>
  <!-- 固定锚点 -->
  <div
    class="affix-box"
    :style="{ top, left }"
    @mousedown.stop="moveTo"
    @mouseup.stop="moveEnd"
  >
    <div class="affix-anchor-box">
      <div class="affix-anchor" v-if="isOpen">
        <el-tree
          :data="affixTreeData"
          @node-click="toViewMenu"
          highlight-current
          default-expand-all
        />
      </div>
      <el-button @click="isOpen = !isOpen" :style="{ cursor }"
        ><el-icon v-if="!isOpen" size="22"><Expand /></el-icon>
        <el-icon v-else size="22"> <Fold /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    affixTreeData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      dragFlag: false,
      cursor: "pointer",
      isOpen: true, //是否展开
      top: "300px",
      left: "1740px",
      abortContance: null,
    };
  },
  methods: {
    moveTo(e) {
      e.preventDefault();
      if (this.abortContance) {
        this.abortContance.abort();
        this.abortContance = null;
      }
      setTimeout(() => {
        this.abortContance = new AbortController();
        this.cursor = "move"; //更改鼠标样式
        document.addEventListener(
          "mousemove",
          (e) => {
            if (e.buttons !== 1) return;
            this.left = e.clientX - 23 + "px"; //其中23时按钮的宽的一半 12为高的一半
            this.top = e.clientY - 12 + "px";
          },
          { signal: this.abortContance.signal }
        );
        document.addEventListener(
          "mouseup",
          () => {
            if (this.abortContance) {
              this.abortContance.abort();
              this.abortContance = null;
            }
            this.cursor = "pointer";
          },
          { signal: this.abortContance.signal }
        );
      }, 100);
    },
    moveEnd() {
      if (this.abortContance) {
        this.abortContance.abort();
        this.abortContance = null;
      }
      this.cursor = "pointer";
    },
    /**
     * 锚点定位
     */
    toViewMenu(node) {
      let dom = document.querySelector(`#${node.anchorId}`);
      if (dom) {
        dom.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
        if (node.tabName) {
          this.$emit("update:activeName", node.tabName);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.affix-box {
  height: 0;
  text-align: right;
  position: fixed;
  z-index: 1000;
  .affix-anchor-box {
    display: inline-block;
    position: relative;
  }
  .affix-anchor {
    display: inline-block;
    position: absolute;
    width: 170px;
    height: fit-content;
    top: 25px;
    right: 0px;
    background-color: #ffffff;
    box-shadow: 0px 6px 15px 0px rgba(0, 0, 0, 0.32);
    border-radius: 4px;
  }
}
</style>