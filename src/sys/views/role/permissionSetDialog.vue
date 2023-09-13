<template>
  <el-dialog draggable :close-on-click-modal="false" title="权限编辑" width="800px" top="5vh"
  v-model="dialogFormVisible" class="roleDialog xui-dialog__limit">
    <el-form label-position="right" label-width="120px" :model="model">
      <el-form-item label="角色名称" style="line-height: 36px !important;">
        {{ model.rName }}
      </el-form-item>
      <el-form-item label="包含权限">
        <el-tree
            ref="Treetransfer"
            :data="dataTreetransfer"
            show-checkbox
            node-key="id"
            :props="props"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="defaultCheckedKey"
            :render-content="renderContent"
            highlight-current
            size="mini"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePermissionData()">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="jsx">

import {getPermissionList, getRolePermids, insertPermRoleInfo} from "@/sys/api/permission";

export default {
  name: "permissionSetDialog",
  data(){
    return {
      dialogFormVisible: false,
      initModel: {

      },
      listUpdate: {
        roleId: '',
        roleName: '',
        ownerId: '',
        ownerName: ''
      },
      model: {},
      parmEntity:{},
      insertList: [],
      departmentTree: [],
      defaultCheckedKey: [], // 当前选中的权限
      dataTreetransfer: [], // 已分配权限tree
      dataTreetransferList: [],
      dataHistorySelectedId: [],
      props: {
        value: 'id', // ID字段名
        label: 'pName', // 显示名称
        children: 'sub' // 子级字段名
      },
    }
  },
  methods: {
    init(selectData) {
      const self = this;
      this.dialogFormVisible = true;
      // this.$nextTick(() => {
      //   this.$refs.formRef.clearValidate();
      // })
      this.model.rName = selectData.rName
      this.model.roleId = selectData.id
      this.defaultCheckedKey = []
      this.dataTreetransfer = [] // 所有菜单tree
      this.dataTreetransferList = [] // 所有菜单List
      this.dataHistorySelectedId = [] // 原有权限id集合
      getRolePermids(this.model).then(response => {
        this.dataHistorySelectedId = response.data
        this.defaultCheckedKey = JSON.parse(JSON.stringify([...this.dataHistorySelectedId]))
        // console.log(this.defaultCheckedKey)
      })

      getPermissionList().then(response => {
        this.dataTreetransfer = response.data
        const data = response.data
        if (data && data.length > 0) {
          data.forEach(element => {
            this.dataTreetransferList.push(element)
            if (element.sub && element.sub.length > 0) {
              select(element.sub)
            }
          })
        }
      })

      function select(elementFather) {
        elementFather.forEach(element => {
          self.dataTreetransferList.push(element)
          if (element.sub && element.sub.length > 0) {
            select(element.sub)
          }
        })
      }
    },

    updatePermissionData() {
      this.insertList = []
      const getCheckedNodes = this.$refs.Treetransfer.getCheckedNodes()
      console.log(this.dataTreetransferList)
      console.log(getCheckedNodes)
      const fatherArray = [] // 父节点
      this.dataTreetransferList.forEach(element => {
        getCheckedNodes.forEach(element2 => {
          if (element.id == element2.fid) {
            fatherArray.push(element)
            if (element.fid) {
              select(element.fid, this.dataTreetransferList)
            }
          }
        })
      })

      function select(fid, dataTreetransferList) {
        dataTreetransferList.forEach(element => {
          if (element.id == fid) {
            fatherArray.push(element)
            if (element.fid) {
              select(element.fid, dataTreetransferList)
            }
          }
        })
      }

      // 去除数组中重复的
      function unique(arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
          for (var j = i + 1, len = arr.length; j < len; j++) {
            if (arr[i].id === arr[j].id) {
              arr.splice(j, 1)
              j-- // 每删除一个数j的值就减1
              len-- // j值减小时len也要相应减1（减少循环次数，节省性能）
            }
          }
        }
        return arr
      }

      fatherArray.forEach(element => {
        getCheckedNodes.push(element)
      })

      unique(getCheckedNodes)

      getCheckedNodes.forEach(entity => {
       let paramEntity = {}
        paramEntity.permId = entity.id
        paramEntity.roleId = this.model.roleId
        this.insertList.push(paramEntity)
      })

      console.log(this.insertList)
      insertPermRoleInfo(this.insertList).then(response => {
        this.dialogPermissionVisible = false
        this.$message({ message: '修改成功', type: 'success' })
        this.onQuery() // 查询
      })
      this.dialogFormVisible = false
    },
    // 权限编辑 控制树的字体颜色
    renderContent(h, { node, data, store }) {
      var col = ''
      // // 判断当前节点是否是当前所拥有的的权限，是字体为蓝色，不是字体默认为黑
      return (
          <span class='custom-tree-node'>
          <span class={col}>{node.label}</span>
        </span>
      )
    }
  }
}
</script>

<style scoped>

</style>
