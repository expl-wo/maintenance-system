<template>
  <div class="tree-wrapper">
    <div class="tree-title">设备组织树</div>
    <el-input
      
      placeholder="搜索"
      suffix-icon="el-icon-search"
      v-model="filterText"
      @keyup.enter="onSearch">
    </el-input>
    <div class="tree-container">
      <el-tree
        class="filter-tree"
        ref="devTree"
        default-expand-all
        highlight-current
        node-key="id"
        :data="data"
        :props="defaultProps"
        :current-node-key="treeNodeId"
        :filter-node-method="filterNode"
        @node-click="nodeClick">
      </el-tree>
    </div>
  </div>
</template>
<script>

import { getDeviceTree } from '@/api/overhaul/deviceListApi';

export default {
  data() {
      return {
        filterText: '',
        data: [],
        treeData: null,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        currentNode: null,
        treeNodeId: 1
      };
    },
  watch: {
      filterText(val) {
        this.$refs.devTree.filter(val);
      },
      'currentNode.id'(newVal, oldVal) {
        this.$emit('nodeChanged', this.currentNode);
      },
      // 组织树数据的变化
      treeData: {
        handler(val) {
          if (val) {
            this.data = JSON.parse(JSON.stringify(val));
            if (!this.currentNode) {
              this.currentNode = this.data[0];
              this.$nextTick(() => {
                this.$refs.devTree.setCurrentKey(this.currentNode.id)
              })
            }
          }
        },
        immediate: true,
        deep: true
      },
    },
    mounted() {
      let params = {
        checkStat: 1
      }
      if (this.filterText) {
        params.searchKey = this.filterText;
      }
      getDeviceTree(params)
      .then(res => {
        debugger;
      })
  },
    methods: {
      // 搜索
      onSearch() {
        let params = {
          searchKey: this.filterText
        }
      console.log(params);
        this.treeData = [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }]
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 单击树节点
      nodeClick(nodeInfo, currentNode, treeObj) {
        this.currentNode = nodeInfo;
      },

  }
}
</script>
<style lang="scss" scoped>
.tree-wrapper {
  width: 100%;
  height: 100%;
  padding: 0 15px;
  .tree-title {
    height: 50px;
    line-height: 50px;
    font-weight: 700;
    font-size: 16px;
  }
  .tree-container {
    width: 100%;
    max-height: calc(100% - 82px);
    overflow: auto;
    padding: 20px 0;
  }
}
</style>