<template>
  <div  class="wp hp app-containerC">
    <div class="panel-menu-search filter-container searchCon">
      <el-button @click="handleAdd"  type="primary">新增</el-button>
    </div>
      <el-table :data="tableData" :border="true" header-cell-class-name="bgblue" style="width: 100%" stripe row-key="id" height="700">
                  style="font-size: 0.7rem">
        <el-table-column prop="craftsDeCode" align="center"  width="120"   label="工步编码" />
        <el-table-column prop="craftsDeName" align="center" width="120" label="工步名称" />
        <el-table-column label="前置条件" align="center" min-width="200">
          <template v-slot="scope">
            <el-select multiple value-key="k" v-model="scope.row.preCraftsDe" style="width: 270px">
              <el-option v-for="item in scope.row.allCraftsDe" :key="item.k" :value="item" :label="item.v"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="standardWorkingHour" align="center"  width="120"   label="标准工时" />
        <el-table-column header-align="center" align="center" width="160" label="操作">
          <template v-slot="scope">
            <el-button-group>
              <el-button  title="操作" type="primary" icon="Cellphone"
                         @click="saveItemDataCondition(scope.row)">
                保存
              </el-button>
              <el-button  title="删除" type="danger" icon="Delete"
                         @click="handleDelete(scope.row)" />
            </el-button-group>
          </template>
        </el-table-column>
        </el-table>
      <pagination :total="total" :page ="listItemUpdate.pg_pagenum" :limit="listItemUpdate.pg_pagesize" class="searchCon"
                  @pagination="getList"/>

      <el-dialog draggable  appendToBody :title="listItemUpdate.id? '编辑': '新增'"
               v-model="dialogVisible" modal width="600"
    >
      <el-form :model="listItemUpdate" ref="formRef" :rules="rules" label-width="160px">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="craftsDeCode" label="工步编码" >
              <el-input v-model="listItemUpdate.craftsDeCode" placeholder="请输入工步编码" style="width: 350px;"
                        class="filter-item" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label=" 工步名称:" prop="craftsDeCode" >
              <el-input v-model="listItemUpdate.craftsDeName" placeholder="请输入工步名称" style="width: 350px;"
                        class="filter-item" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="标准工时:" prop="standardWorkingHour" >
              <el-input v-model="listItemUpdate.standardWorkingHour" placeholder="请输入标准工时" style="width: 350px;"
                        class="filter-item" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label=" 是否最后一个工步:" prop="isEnd" >
              <el-switch v-model="listItemUpdate.isEnd" active-value='1' inactive-value='0' active-color="#13ce66"
                         inactive-color="#808080" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
            <el-form-item label=" 是否可见:" prop="isVisible" >
              <el-switch v-model="listItemUpdate.isVisible" active-value='1' inactive-value='0' active-color="#13ce66"
                         inactive-color="#808080" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div  >
        <el-button size="small" @click="dialogVisible=false">取消</el-button>
        <el-button size="small" type="primary" @click="saveItemData">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import Constants from "../../../../utils/constants";
import {
  insertPLMProcessCrafts,
  findAllCraftsDes,
  insertCraftsDeOrder,
  deleteProcessCraftsDe,
  insertCraftsDe, deleteProcessCrafts
} from "@/api/plan";
import Pagination from "@/components/Pagination/index";


export default {
  name: 'ps31ChildHeadRuleItem',
  components: {Pagination},
  data() {
    return {
      dataList: [],
      total: 0,
      dialogVisible: false,
      listItemUpdate: { // 子工艺模板行数据
        id:'',
        craftsDeName: '',
        craftsDeCode: '',
        // isVisible: '',
        // craftsId: '',
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        standardWorkingHour: '', //标准工时
        isVisible: '1', //是否可见
        needRate:'',//是否需要打等级
        isEnd:'0',//是否最后一道工序
      },
      rules:{
        craftsDeCode: [{
          required: true,trigger: 'blur', message: '子工艺模板行编码不能为空'
        }],
        craftsDeName: [{
          required: true, trigger: 'blur',message: '子工艺模板行编码不能为空'
        }],
      },
     tableData:[]
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    handleAdd(){
      this.$nextTick(()=>{
        this.$refs.formRef && this.$refs.formRef.clearValidate();
      })
      this.dialogVisible  = true;
    },
    //获取
    getDataList() {
        this.tableData = []
      findAllCraftsDes(this.listItemUpdate).then(response => {
          this.tableData = response.data
          this.total = response.total_count
        })

    },
    getList(val) {
      this.listItemUpdate.pg_pagenum = val.page
      if (val.limit) {
        this.listItemUpdate.pg_pagesize = val.limit
      }
      this.getDataList() // 查询
    },

    // 保存
    saveItemData() {
      this.dialogVisible = false;
      let params = {
        craftsDeName: this.listItemUpdate.craftsDeName,
        craftsDeCode: this.listItemUpdate.craftsDeCode,
        isVisible: this.listItemUpdate.isVisible,
        needRate:this.listItemUpdate.needRate,
        isEnd:this.listItemUpdate.isEnd,
        standardWorkingHour: this.listItemUpdate.standardWorkingHour,
      }
      insertCraftsDe(params).then(response => {
        this.$message({
          message: "新增成功",
          type: 'success'
        })
      })
    },
    saveItemDataCondition(params) {
      insertCraftsDeOrder(params).then(response => {
        this.$message({
          message: "保存成功",
          type: 'success'
        })
      })
    },
    handleDelete(rowData) {
      this.$confirm(Constants.deleteTip).then(() => {
        deleteProcessCraftsDe({
          id: rowData.id
        }).then(response => {
          if (response.err_code === Constants.respCode.success) {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          } else {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          }
          this.getDataList()
        })
      })
    },
    initData() {
      // this.timeLimitId = data.id;
     findAllCraftsDes({
        craftsDeCode: '',
        craftsDeName: '',
        pageNum: 1,
        pageSize: 10
      }).then(response => {
        this.dataList = response.data.map(item => {
          return {
            k: item.craftsDeCode,
            v: item.craftsDeName
          }
        })
        this.getDataList()
      })
    },
  }
}
</script>

<style scoped>

</style>
