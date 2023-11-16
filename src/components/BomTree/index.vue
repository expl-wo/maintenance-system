<template>
  <div class="bom-tree-container">
    <div class="bom-tree-search">
      <el-input
        size="small"
        placeholder="输入关键字进行过滤"
        v-model="searchKey"
      >
      </el-input>
    </div>
    <div class="bom-tree-box">
      <el-tree
        ref="bomTreeRef"
        :data="data"
        :node-key="nodeKey"
        default-expand-all
        :expand-on-click-node="false"
        :props="defaultProps"
        highlight-current
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
      >
        <template #default="{ node, data }">
          <span class="bom-tree-node">
            <span
              :title="node.label"
              :style="{ width: labelWidth }"
              class="text-ellipsis"
              >{{ node.label }}</span
            >
            <span
              :class="[
                'bom-tree-node-show',
                currentNode && data.$treeNodeId === currentNode.$treeNodeId
                  ? 'force-show'
                  : '',
              ]"
            >
              <el-icon
                class="mgr5"
                title="添加"
                @click="$emit('addNode', node, data)"
                ><Plus
              /></el-icon>
              <el-icon
                class="mgr5"
                title="修改"
                @click="$emit('updateNode', node, data)"
                ><Edit
              /></el-icon>
              <el-icon
                class="mgr5"
                 v-if="treeNodeId && data.$treeNodeId !== treeNodeId"
                title="删除"
                @click="$emit('removeNode', node, data)"
                ><Delete
              /></el-icon>
            </span>
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script>
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
export default {
  components: {
    Delete,
    Edit,
    Plus,
  },
  props: {
    labelWidth: {
      type: String,
      default: "120px",
    },
    nodeKey: {
      type: String,
      default: "treeId",
    },
    treeData: {
      type: Array,
      default() {
        return [
          {
            id: 1,
            label: "根节点",
            children: [
              {
                id: 2,
                label: "测试节点",
              },
            ],
          },
        ];
      },
    },
    defaultProps: {
      type: Object,
      default() {
        return {
          children: "childList",
          label: "treeName",
        };
      },
    },
  },
  data() {
    return {
      data: [],
      searchKey: "",
      currentNode: null, //当前选中的节点
      treeNodeId: 0,
    };
  },
  watch: {
    searchKey(val) {
      this.$refs["bomTreeRef"].filter(val);
      if (!val) {
        //目前过滤是纯前端过滤，当过滤条件为空时发送refresh事件出去
        this.$emit("refreshTree");
      }
    },
    treeData: {
      handler(val) {
        this.data = JSON.parse(JSON.stringify(val));
        if (!this.currentNode && val.length) {
          this.currentNode = this.treeData[0];
          this.$emit("nodeClick", this.currentNode);
        }
        this.$nextTick(() => {
          //回显选中节点
          if (this.currentNode && this.$refs["bomTreeRef"]) {
            let treeNodeId =
              val && this.$refs["bomTreeRef"].getNode(this.treeData[0]);
            this.treeNodeId = treeNodeId ? treeNodeId.id : 0;
            let node = this.$refs["bomTreeRef"].getNode(this.currentNode);
            node && this.$refs["bomTreeRef"].setCurrentNode(this.currentNode);
          }
        });
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    /**
     * 树节点过滤
     */
    filterNode(value, data) {
      if (!value) return true;
      return data[this.defaultProps.label].indexOf(value) !== -1;
    },
    handleNodeClick(node) {
      this.currentNode = node;
      this.$emit("nodeClick", node);
    },
  },
};
</script>

<style lang="scss" scoped>
$search-height: 36px;
.mgr5 {
  margin-right: 5px;
}
.bom-tree-container {
  height: 100%;
}
.bom-tree-search {
  height: $search-height;
  line-height: $search-height;
  padding: 0 10px;
}
::v-deep(.el-input) {
  width: 100%;
}
.bom-tree-box {
  overflow: auto;
  height: calc(100% - #{$search-height} - 20px); //20为上下margin的高度
  margin: 10px;
  // width: fit-content;
}
.bom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
  padding-right: 8px;
  &-show {
    display: none;
    i {
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
  }
  &:hover &-show {
    display: inline-block;
  }
}
.force-show {
  display: inline-block;
}
</style>