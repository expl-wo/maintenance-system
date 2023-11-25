<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="节点名称">
          <el-input v-model="listQuery.name" placeholder="节点名称" style="width: 180px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item label="节点类型">
          <el-select v-model="listQuery.type" placeholder="节点类型" style="width: 120px;" filterable
                     default-first-option>
            <el-option v-for="items in nodeType" :key="items.id" :label="items.name" :value="items.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="onBtnQuery">查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table stripe  highlight-current-row  :data="tableData" class="otherCon wp" style="width: 100%;font-size:0.7rem;" row-key="id"
      border :expand-row-keys="expands" :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @expand-change="handleExpendRow">
      <el-table-column type="expand" prop="name" width="60" align="center" label="">
        <template v-slot="props">
          <!--第二层表格-->
          <el-table stripe  highlight-current-row  :data="props.row.dicts" style="font-size:0.7rem;">
            <el-table-column prop="drawingFeature" align="center" width="250" label="图纸特征号" />
            <el-table-column prop="drawingName" align="center" label="图纸名称·" />
            <!-- 子表格操作列 -->
            <el-table-column header-align="center" align="center" width="120" label="操作">
              <template v-slot="scope">
                <el-button-group>
                  <el-button title="修改" type="primary" icon="Edit"
                    @click="updateItemData(scope.row)" />
                </el-button-group>
                <el-button-group>
                  <el-button title="删除" type="danger" icon="Delete"
                    @click="handleItemDeleteDict(scope.row)" />
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="name" align="center" width="450" label="节点名称" />
      <el-table-column prop="type" align="center" width="100" label="节点类型">
        <template v-slot="{row}">
          <div v-if="row.type == 0">设计</div>
          <div v-if="row.type == 1">采购</div>
          <div v-if="row.type == 2">生产</div>
          <div v-if="row.type == 3">BOM</div>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="160" label="操作">
        <template v-slot="scope">
          <el-button-group>
            <el-button title="" type="primary" icon="Plus" @click="handleItemAddDict(scope.row)">
              添加图纸
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" class="searchCon"
      @pagination="getList" />


    <el-dialog draggable  :close-on-click-modal="false" :title="'(新增/修改)'" v-model="dialogConfigCaiGouFormVisible"
      class="roleDialog" @close="clearnDialog()">
      <el-form ref="listItemUpdate" label-position="right" label-width="100px" :model="listItemUpdate" :rules="rules">

        <el-form-item label="图纸特征号:" prop="drawingFeature">
          <el-input v-model="listItemUpdate.drawingFeature" placeholder="图纸特征号" style="width: 350px;"
            class="filter-item" />
        </el-form-item>

        <el-form-item label=" 图纸名称:" prop="drawingName">
          <el-input v-model="listItemUpdate.drawingName" placeholder="图纸名称" style="width: 350px;" class="filter-item" />
        </el-form-item>


      </el-form>
      <template #footer>
        <div class="dialog-footer">
        <el-button @click="dialogConfigCaiGouFormVisible = false;clearnDialog()">取 消</el-button>
        <!-- <el-button type="primary" @click="dialogStatus==='create'?createItemData('listItemUpdate', '添加成功'):updateItemData('listItemUpdate', '修改成功')"> -->
        <el-button type="primary" @click="createItemData">
          保存
        </el-button>
      </div>
      </template>
    </el-dialog>

  </div>

</template>

<script>
  import QRCode from 'qrcodejs2'
  import Pagination from '@/components/Pagination'
  import {findAllNode, queryDrawByNode,insertDrawingNode,deleteDrawingNode} from '@/api/plan'
  export default {
    name: 'Table',
    components: {Pagination},
    data() {
      return {
        nodeType: [ {
          'id': 0,
          'name': '设计'
        }, {
          'id': 3,
          'name': 'BOM'
        }],
        tableKey: 0,
        total: 0, // 总个数
        list: null,
        listQuery: {
          pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
          pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
          name: '', // 节点名称
          workshopName: '', // 车间名称
          workshopId: '', //车间id
          type: 0, // 节点类型
        },
        tableData: [], // 节点数据查询（第一层）
        listItemUpdate: { // 分类数据
          id: '',
          createDt: '',
          editDt: '',
          isDeleted: '',
          ztBm: '',
          createId: '',
          editorId: '',
          nodeId: '',
          drawingName: '',
          drawingFeature: '',
          deleteDt: '',
          creatorId: '',
          creatorName: '',
          deleterId: '',
          deleterName: '',
          editorName: '',
          dversion: ''
        },
        dialogConfigCaiGouFormVisible: false,
        expands: [], // 控制表格左侧伸缩箭头打开关闭
        expandedRowData: [], // 控制点击向下箭头,展开时有数据，不展开没有数据
        equipRowSelected: [], // 选中哪条数据
        nowChooseData: {id:null},
        rules: {
          drawingName: [{
            required: true, message: '图纸名称不能为空'
          }],
          drawingFeature: [{
            required: true, message: '图纸特征号不能为空'
          }]
        },
      }
    },
    mounted() {
      this.onQuery();
    },
    methods: {
      //查询按钮响应
      onBtnQuery() {
        this.listQuery.pg_pagenum = 1
        this.onQuery()
      },
      // 查询关键节点数据（第一层）,identifier为delete时，为删除调用。其他时候没有特殊限制
      //onQuery(identifier) {
      onQuery(identifier) {
        // console.log(JSON.stringify(this.listQuery))
        findAllNode(this.listQuery).then(response => {
          response.data.forEach(item=>{
            item.dicts = []
          })
          this.tableData = response.data
          this.total = response.total_count
          //this.isDropItem(identifier) // 判断有没有展开的下拉项，有的话重新查找
          this.isDropItem() // 判断有没有展开的下拉项，有的话重新查找
          this.expands = []
        })
      },
      // 分页数据发生变化
      getList(val) {
        this.listQuery.pg_pagenum = val.page
        if (val.limit) {
          this.listQuery.pg_pagesize = val.limit
        }
        this.onQuery() // 查询
      },
      // 判断有没有展开的下拉项，有的话重新查找
      isDropItem(identifier) {
        if (this.expandedRowData.length > 0) {
          this.handleExpendRow(this.expandedRowData[0], this.expandedRowData, identifier)
        }
      },
      // 点击向下箭头
      handleExpendRow(row, expandedRows, identifier) {
        // 判断有没有展开的分类项
        var checkInt = 0
        expandedRows.forEach(item => {
          if (item.id == row.id) {
            checkInt++
            this.expandedRowData = [item]
          }
        })
        checkInt == 0 ? this.expandedRowData = [] : this.expandedRowData = this.expandedRowData
        if (expandedRows.length) {
          this.expands = []
          if (row) {
            this.expands.push(row.id)
          }
        } else {
          this.expands = []
        }
        this.queryDictData(row, row.labelType, identifier) // 关键就是这个方法，row.id是父分组的id需要传给后台查询该子分组的信息
      },
      //根据节点id查询数据
      queryDictData(row, labelType, identifier) {
        queryDrawByNode(row.id).then(response => {
          const index = this.tableData.findIndex(data => data.id === row
            .id) // 首先pageData.results绑定的是父表格的数据，那么我们要把子表格数据塞到对应的父分组，那我们要知道是哪一个分组，这里的findIndex就是通过id去查找对应的父分组在数据数组里的下标
          if (!identifier) {
            this.tableData[index].dicts = response.data // 这里就是给父表格数据数组self.pageData.results第index个对象加上dicts这个属性，然后把rspData.data我们从后台拿到的数据绑定到dicts这个key里
            //console.log(response.data)
          }
        })
      },
      // 添加图纸
      createItemData() {
        this.saveItemData()
      },
      // 保存
      saveItemData() {
        this.dialogConfigCaiGouFormVisible = false;
        let params = {
          id:this.listItemUpdate.id,
          nodeId: this.nowChooseData.id,
          drawingName: this.listItemUpdate.drawingName,
          drawingFeature: this.listItemUpdate.drawingFeature,
        }
        insertDrawingNode(params).then(response => {
          this.$message({
            message: "新增成功",
            type: 'success'
          })
          // this.nowChooseData = null;
          this.clearnDialog();
          this.isDropItem() // 判断有没有展开的下拉项，有的话重新查找
        })
      },
      // 删除图纸
      handleItemDeleteDict(row) {
        this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDrawingNode({
            id: row.id
          }).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.isDropItem() // 判断有没有展开的下拉项，有的话重新查找
            this.clearnDialog()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleItemAddDict(params) {
        this.nowChooseData = params;
        this.dialogConfigCaiGouFormVisible = true;
      },
      updateItemData(row) {
          this.listItemUpdate.drawingName = row.drawingName;
          this.listItemUpdate.drawingFeature = row.drawingFeature;
          this.listItemUpdate.id = row.id;
          this.nowChooseData.id = row.nodeId;
          this.dialogConfigCaiGouFormVisible = true;
      },
      clearnDialog(){
        this.listItemUpdate.drawingName = '';
        this.listItemUpdate.drawingFeature = '';
        this.listItemUpdate.nodeId = '';
        this.listItemUpdate.id = '';
      }
    }
  }
</script>

<style scoped>
  .imgIcon {
    width: 30px;
    height: 30px;
    border-radius: 3px;
  }

  .fileCls {
    height: 26px;
    width: 30px;
    position: absolute;
    filter: alpha(opacity=0);
    -moz-opacity: 0;
    opacity: 0;
    z-index: 110;
    cursor: pointer;
    float: right;
    margin-top: -26px;
    position: relative;
    left: 0;
  }

  .qrcode {
    height: 320px;
  }
</style>
