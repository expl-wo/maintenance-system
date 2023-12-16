<template>

  <el-dialog draggable appendToBody :title="'修改'+this.productNo +'计划节点数据'" v-model="dialogVisible" modal>
    <div class="app-container app-containerC">
      <div class="filter-container searchCon">
        <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
          <el-form-item label="节点名称">
            <el-input v-model="listQuery.name" placeholder="输入节点名称" style="width: 180px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item label="节点类型">
            <el-select v-model="listQuery.type" placeholder="节点类型" style="width: 120px;" filterable
                       default-first-option>
              <el-option v-for="items in nodeType" :key="items.id" :label="items.name" :value="items.id" />
            </el-select>
          </el-form-item>
          <el-button icon="Search" size="small" @click="getDataList">查询</el-button>
          <el-button type="default" icon="SuccessFilled" size="small" @click="modifyPlanNode('rollback')">恢复节点</el-button>
          <el-button type="default" icon="CircleCloseFilled" size="small"  @click="modifyPlanNode('delete')">删除节点</el-button>
        </el-form>
      </div>
    </div>
    <div class="app-container app-containerC">
      <div class="tableCase" id="paMainPlan">
        <el-table stripe ref="tableRef" height="400" highlight-current-row border :data="dataList"
                  style="font-size: 0.7rem"
        >
          <el-table-column header-align="center" align="center" type="selection" fixed width="40" property="selection"
          ></el-table-column>
          <el-table-column
            align="center"
            label="节点类型"
            property="pnType"
          >
            <template v-slot:default="scope">
              <el-tag v-if="scope.row.pnType ==0 ">设计</el-tag>
              <el-tag v-else-if="scope.row.pnType ==1 ">采购</el-tag>
              <el-tag v-else-if="scope.row.pnType ==2 ">生产</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="节点名称"
            property="pnName"
          ></el-table-column>
          <el-table-column
            align="center"
            label="计划开始时间"
            property="startDate"
          ></el-table-column>
          <el-table-column
            align="center"
            label="节点进度状态"
            property="status"
          >
            <template #default="scope">
              <xui-dictionary itemCode="nodeWeekDeStatus" :code="scope.row.status"></xui-dictionary>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="listQuery.pg_pagenum"
          :page-sizes="[100, 200, 500]"
          :page-size="listQuery.pg_pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import planWeek from '@/api/plan/planWeek'
import XuiDictionary from '@/components/xui/dictionary/dictionary.vue'
export default {
  name: "modifyNodeDialog",
  components: { XuiDictionary },
  data() {
    return {
      dialogVisible: false,
      productNo: "",
      proPlanId: "",
      dataList: [],
      total: 0,
      listQuery: {
        name: '',
        type: null,
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        planId: ''
      },
      nodeType: [{
        'id': null,
        'name': '全部'
      }, {
        'id': 0,
        'name': '设计'
      }, {
        'id': 1,
        'name': '采购'
      }, {
        'id': 2,
        'name': '生产'
      }],
    };
  },

  methods: {
    init(selectedData) {
      console.log("选择的数据", selectedData);
      debugger
      this.productNo = selectedData.productNo;
      this.proPlanId = selectedData.id;
      this.getDataList();
      this.dialogVisible = true;
    },
    getDataList() {
      this.listQuery.planId = this.proPlanId
      planWeek.findAllPlanNode(this.listQuery).then(response => {
        this.dataList = response.data;
        this.total = response.total_count;
      });
    },
    // 分页数据发生变化
    handleSizeChange(val) {
      this.listQuery.pg_pagesize = val;
      this.getDataList(); // 查询
    },
    handleCurrentChange(val) {
      this.listQuery.pg_pagenum = val;
      this.getDataList(); // 查询
    },
    //修改节点
    modifyPlanNode(opType) {
      let selectedData = this.$refs.tableRef.getSelectionRows();
      if(!selectedData || selectedData.length === 0){
        this.$message({ message: '请选择要处理的数据', type: 'warning' })
        return;
      }
      let nodeIds = [];
      selectedData.forEach(item=>{
        nodeIds.push(item.nodeId)
      })
      planWeek.modifyPlanNodes({
        opType: opType,
        nodeIds: nodeIds,
        proPlanId: this.proPlanId
      }).then(response=>{
        if(response.err_code === this.$constants.statusCode.success){
          this.$message.success('恢复成功');
          this.dialogVisible = false;
        }else{
          this.$message.warning(response.err_msg);
        }
      })
      this.$emit("refresh", {});
    },
  }
};

</script>

<style scoped>

</style>
