<template>
      <div class="xui-flowchart__wrapper" :class="statusClass">
        <div class="xui-flowchart__header">
          <div class="xui-flowchart__startTime">
            {{data.startDate}}
          </div>
          <div class="xui-flowchart__endTime">
            {{data.nodeDate}}
          </div>
        </div>
        <div class="xui-flowchart__body">
          <div class="xui-flowchart__label" v-if="!notHave" :class="{'xui-flowchart--small': isSmall}">
            {{data.text}}
          </div>
        </div>
        <div class="xui-flowchart__footer">
          <div class="xui-flowchart__startTime">
            {{data.actualStartDate}}
          </div>
          <div class="xui-flowchart__actualTime">
            {{data.difDay}}
          </div>
          <div class="xui-flowchart__endTime">
            {{data.finishDate}}
          </div>
        </div>
      </div>
</template>

<script>
import {getFontWidth} from '@/utils'

export default {
  name: "components",
  inject: ["getGraph", "getNode"],
  data(){
    return {
      backData: {},
      data: '',
      notHave: false,
      isSmall: false,
      selected: false,
      statusClass: ''
    }
  },

  mounted() {
    const self = this;
    const node = this.getNode();
    let data = node.getData();
    this.backData = data;
    this.notHave = !!data.notHave;
    if(this.notHave){
      this.data = {};
    }else{
      this.data = data;
    }
    this.status = data.status;
    this.selected = data.selected;
    let statusClass = [];
    if(data.timeStatus){
      statusClass.push(data.timeStatus);
    }
    if(data.typeStatus){
      statusClass.push(data.typeStatus);
    }
    this.statusClass = statusClass.join(' ');
    let fontWidth = getFontWidth(this.backData.text);
    if(fontWidth > 78){
      this.isSmall = true;
    }
    // 监听数据改变事件
    node.on("change:data", ({ current }) => {
      self.status = current.status;
      self.selected = current.selected;
    });
  },
}
</script>

<style scoped lang="scss">
.xui-flowchart__body {
  .xui-flowchart__label.xui-flowchart--large {
    font-size: 16px;
    text-align: center;
    line-height: 1;
  }
}

.alarm{
  background: yellow;
}

.error{
  background: red;
}

.normal{
  background: #00b050;
}

.selected {
  border-color: #52c41a;
  border-radius: 2px;
  box-shadow: 0 0 0 4px #ccecc0;
}
</style>
