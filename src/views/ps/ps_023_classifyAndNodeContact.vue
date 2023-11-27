<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
        <el-form-item label="节点名称">
          <el-input v-model="listQuery.name" placeholder="节点名称" style="width: 180px;" class="filter-item" clearable />
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
          <el-table stripe  highlight-current-row  :data="props.row.dicts" :stripe=true style="font-size:0.7rem;">
            <el-table-column prop="materialCode" align="center" width="250" label="分类编号" />
            <el-table-column prop="materialName" align="center" label="分类名称·" />
            <!-- 子表格操作列 -->
            <el-table-column header-align="center" align="center" width="120" label="操作">
              <template v-slot="scope">
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
          </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="160" label="操作">
        <template v-slot="scope">
          <el-button-group>
            <el-button title="分类关系" type="primary" icon="Plus"
              @click="handleItemAddDict(scope.row)">
              添加分类关系
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <xui-pagination :total="total" :page="listQuery.pg_pagenum" :limit="listQuery.pg_pagesize" @pagination="handlePagination" class="searchCon wp"/>


    <el-dialog draggable  :close-on-click-modal="false" title="选择" v-model="dialogConfigCaiGouFormVisible">
      <div class="filter-container searchCon">
        <el-form :inline="true" :model="listQueryClazz" class="demo-form-inline demo-form-zdy">
          <el-form-item label="分类编号">
            <el-input v-model="listQueryClazz.clazzCode" placeholder="分类编号" style="width: 110px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item label="分类名称">
            <el-input v-model="listQueryClazz.clazzName" placeholder="分类名称" style="width: 110px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="onRuleConfigQuery">查询
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="tableRuleConfigData"
        :border="true"
        header-cell-class-name="bgblue"
        style="width: 100%"
        stripe
        height="300px"
      >
        <el-table-column
          prop="materialCode"
          label="物料分类的编号"
          align="center"
          min-width="15%"
        />
        <el-table-column
          prop="materialName"
          label="物料分类名称"
          align="center"
          min-width="15%"
        />
        <el-table-column header-align="center" align="center" width="160" label="操作">
          <template v-slot="scope">
            <el-button-group>
              <el-button type="primary"
                         @click="chooseItemData(scope.row)">
                选择
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-tag v-for="x in checkboxRuleConfigList" :key="x.materialCode" style="margin-right:10px;">{{x.materialName}}</el-tag>
      </div>
      <template #footer>
        <div class="dialog-footer">
        <el-button @click="dialogConfigCaiGouFormVisible = false">取 消</el-button>
      </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import QRCode from 'qrcodejs2'
  import {findAllNode, queryListMaterialNode,insertMaterialNode,deleteMaterNode,queryMaterialNotNode} from '@/api/plan'
  // 浏览器获取访问文件的根路径
  import {getRooturl} from '@/api/endpoint'
  import {getEqCateList} from '@/api/eqpLedger'
  import { Vue } from 'vue';
  export default {
    name: 'Table',
    data() {
      return {
        total: 0, // 总个数
        clazzTotal: 0,
        listQuery: {
          pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
          pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
          name: '', // 节点名称
          workshopName: '', // 车间名称
          workshopId: '', //车间id
          type: 1, // 节点类型
        },
        listQueryClazz: { // 查询条件
          clazzCode: '', // 分类编号，模糊匹配
          clazzName: '', // 分类名称，模糊匹配
        },
        tableData: [], // 节点数据集合
        listItemUpdate: { // 分类数据
          id: '',
          createDt: '',
          editDt: '',
          isDeleted: '',
          ztBm: '',
          createId: '',
          editorId: '',
          nodeId: '',
          materialCode: '',
          materialName: '',
          deleteDt: '',
          creatorId: '',
          creatorName: '',
          deleterId: '',
          deleterName: '',
          editorName: '',
          dversion: ''
        },
        tableRuleConfigData: [], //分类数据表格
        checkboxRuleConfigList: [],
        listConfigUpdate: {
          ruleConfig: '',
          id: ''
        },
        heightTable: '300px', // 弹窗表格高度
        dialogConfigCaiGouFormVisible: false,
        expands: [], // 控制表格左侧伸缩箭头打开关闭
        expandedRowData: [], // 控制点击向下箭头,展开时有数据，不展开没有数据
        //equipRowSelected: [], // 选中哪条数据
        nowChooseData:null,
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
        console.log(JSON.stringify(this.listQuery))
        findAllNode(this.listQuery).then(response => {
          response.data.forEach(item=>{
            item.dicts = []
          })
          this.tableData = response.data

          this.total = response.total_count
          this.isDropItem() // 判断有没有展开的下拉项，有的话重新查找
          this.expands = []
        })
      },
      // 分页数据发生变化
      handlePagination({ page, limit }) {
        this.pageNum = page
        this.pageSize = limit
        this.onQuery()
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
      //根据节点id查询分类数据
      queryDictData(row, labelType, identifier) {
        queryListMaterialNode(row.id).then(response => {
            const index = this.tableData.findIndex(data => data.id === row.id) // 首先pageData.results绑定的是父表格的数据，那么我们要把子表格数据塞到对应的父分组，那我们要知道是哪一个分组，这里的findIndex就是通过id去查找对应的父分组在数据数组里的下标
            if (!identifier) {
              this.tableData[index].dicts = response.data// 这里就是给父表格数据数组self.pageData.results第index个对象加上dicts这个属性，然后把rspData.data我们从后台拿到的数据绑定到dicts这个key里
              //console.log(response.data)
            }
        })
      },
      // 查询所有物料分类
      onRuleConfigQuery() {
        // var oldes = [];
        // if (this.listConfigUpdate.ruleConfig && this.listConfigUpdate.ruleConfig.length > 3) {
        //   oldes = JSON.parse(this.listConfigUpdate.ruleConfig);
        // }
        this.tableRuleConfigData = [];
        queryMaterialNotNode(this.listQueryClazz).then(response => {
          this.tableRuleConfigData = response.data
          this.clazzTotal = response.total_count
          // this.tableRuleConfigData.forEach(element => {
          //   // element.checked = false
          //   for (let oes in oldes) {
          //     if (oldes[oes].id === element.id) {
          //       // element.checked = true
          //       self.checkboxRuleConfigList.push(element)
          //       break
          //     }
          //   }
          // })
        })
        this.dialogConfigCaiGouFormVisible = true;
      },
      chooseItemData(row){
        this.dialogConfigCaiGouFormVisible = false;
        this.createItemData(row);
      },
      // 点击添加分类关系
      createItemData(classzzItem) {
        this.saveItemData(classzzItem)
      },
      // 保存
      saveItemData(classzzItem) {
        console.log('ssdasdasd',classzzItem)
        let params = {
          nodeId:this.nowChooseData.id,
          materialCode:classzzItem.materialCode,
          materialName:classzzItem.materialName,
        }
        insertMaterialNode(params).then(response => {
              this.$message({
                message: "新增成功",
                type: 'success'
              })
              this.nowChooseData = null;
              this.isDropItem() // 判断有没有展开的下拉项，有的话重新查找
        })
      },
      // 删除分类关系
      handleItemDeleteDict(row) {
        this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMaterNode({
            id: row.id
          }).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.isDropItem() // 判断有没有展开的下拉项，有的话重新查找
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
        this.onRuleConfigQuery(); // 查询所有物料分类
      },
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
