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
      top: "40%",
      left: "90%",
      controlTime: null, //定时器
    };
  },
  beforeUnmount(){
    this.removeMouseEvent();
  },
  methods: {
    //鼠标移动事件
    mouseMove(e){
      if (e.buttons !== 1) return;
      this.left = e.clientX - 23 + "px"; //其中23时按钮的宽的一半 12为高的一半
      this.top = e.clientY - 12 + "px";
    },
    //鼠标抬起事件
    mouseUp(){
      document.removeEventListener( "mousemove", this.mouseMove)
      this.cursor = "pointer";
    },
    moveTo(e) {
      e.preventDefault();
      clearTimeout(this.controlTime)
      //设置一个定时器，点击500ms之后才能移动
      this.controlTime = setTimeout(() => {
        this.cursor = "move"; //更改鼠标样式
        document.addEventListener("mousemove",this.mouseMove);
        document.addEventListener("mouseup",this.mouseUp);
      }, 200);
    },
    removeMouseEvent(){
      document.removeEventListener( "mousemove", this.mouseMove)
      document.removeEventListener( "mouseup", this.mouseUp)
    },
    moveEnd() {
      this.removeMouseEvent();
      //如果在moveup事件之前cursor不是move则仅是点击事件，不能move
      if (this.cursor !== "move") {
        clearTimeout(this.controlTime);
        this.controlTime = null;
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