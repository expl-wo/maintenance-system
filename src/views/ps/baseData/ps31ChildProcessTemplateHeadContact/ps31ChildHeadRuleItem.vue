<template>
  <div  class="wp hp app-containerC">
    <div class="panel-menu-search filter-container searchCon">
      <el-button @click="handleAdd"  type="primary">新增</el-button>
    </div>
      <el-table ref="tableRef" :data="tableData" :border="true" header-cell-class-name="bgblue" style="width: 100%" stripe row-key="id" >
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
        <el-table-column prop="safetyPrecautions" align="center"  width="120"   label="安全注意事项" />
        <el-table-column prop="isKeyStep" label="是否关键工步" align="center" width="100">
          <template v-slot="{row}">
            <div v-if="row.isKeyStep == 0">否</div>
            <div v-if="row.isKeyStep == 1">是</div>
          </template>
        </el-table-column>
        <el-table-column prop="qualityRiskIdentification" align="center"  width="120"   label="质量风险识别" />
        <el-table-column prop="executionFrequency" align="center"  width="120"   label="执行频次" />

        <el-table-column header-align="center" align="center" width="300" label="操作">
          <template v-slot="scope">
            <el-button-group>
              <el-button  title="编辑" type="primary" icon="Edit"
                          @click="handEdit(scope.row)" />
<!--              <el-button  title="保存" type="primary" icon="Cellphone"-->
<!--                         @click="saveItemDataCondition(scope.row)">-->
<!--                保存-->
<!--              </el-button>-->
              <el-button  title="删除" type="danger" icon="Delete"
                         @click="handleDelete(scope.row)" />
              <el-button  title="查看工作内容" type="primary" icon="Cellphone"
                          @click="handleWorkContent(scope.row)">
                查看工作内容
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
        </el-table>
      <pagination :total="total" :page ="listItemUpdate.pg_pagenum" :limit="listItemUpdate.pg_pagesize" class="searchCon"
                  @pagination="getList"/>

      <el-dialog v-dialogDrag  appendToBody :title="listItemUpdate.id? '编辑': '新增'"
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
            <el-form-item label=" 工步名称:" prop="craftsDeName" >
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
        <el-row>
          <el-col :span="24">
            <el-form-item label=" 安全注意事项:" prop="safetyPrecautions" >
              <el-input v-model="listItemUpdate.safetyPrecautions" placeholder="请输入安全注意事项" style="width: 350px;"
                        class="filter-item" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="质量风险识别:" prop="qualityRiskIdentification" >
              <el-input v-model="listItemUpdate.qualityRiskIdentification" placeholder="请输入质量风险识别" style="width: 350px;"
                        class="filter-item" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
              <el-form-item label=" 是否关键工步:" prop="isKeyStep" >
                <el-switch v-model="listItemUpdate.isKeyStep" active-value='1' inactive-value='0' active-color="#13ce66"
                           inactive-color="#808080" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="执行频次:" prop="executionFrequency" >
                <el-input v-model="listItemUpdate.executionFrequency" placeholder="请输入执行频次" style="width: 350px;"
                          class="filter-item" />
              </el-form-item>
            </el-col>
          </el-row>


      </el-form>
      <div slot="footer">
        <el-button  @click="dialogVisible=false">取消</el-button>
        <el-button  type="primary" @click="saveItemData">保存</el-button>
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
import checkItem from "@/views/ps/baseData/ps50WorkContent/checkItem";
import { certainProp} from '@/utils'


export default {
  name: 'ps31ChildHeadRuleItem',
  components: {Pagination,checkItem},
  data() {
    return {
      dataList: [],
      total: 0,
      dialogVisible: false,
      listItemUpdate: { // 子工艺模板行数据
        id:'',
        craftsId:'',
        craftsDeName: '',
        craftsDeCode: '',
        pg_pagenum: 1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 10, // 查询第几页数据，默认第一页 pg_pagesize
        standardWorkingHour: '', //标准工时
        isVisible: '1', //是否可见
        needRate:'',//是否需要打等级
        isEnd:'0',//是否最后一道工序
        safetyPrecautions:'',
        isKeyStep:'',
        executionFrequency:'',
        qualityRiskIdentification:''
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



    handEdit(row){
      this.dialogVisible = true
      this.listItemUpdate.id = row.id
      this.craftsId= this.listItemUpdate.craftsId
      this.listItemUpdate.craftsDeCode = row.craftsDeCode
      this.listItemUpdate.craftsDeName = row.craftsDeName
      this.listItemUpdate.isEnd = row.isEnd
      this.listItemUpdate.isVisible = row.isVisible
      this.listItemUpdate.standardWorkingHour = row.standardWorkingHour
      this.listItemUpdate.safetyPrecautions = row.safetyPrecautions
      this.listItemUpdate.qualityRiskIdentification = row.qualityRiskIdentification
      this.listItemUpdate.isKeyStep = row.isKeyStep
      this.listItemUpdate.executionFrequency = row.executionFrequency

    },
    saveItemData() {
      this.dialogVisible = false;
      let params = {
            procedures: [{
              id:this.listItemUpdate.id,
              craftsId: this.listItemUpdate.craftsId,
              craftsDeName: this.listItemUpdate.craftsDeName,
              craftsDeCode: this.listItemUpdate.craftsDeCode,
              isVisible: this.listItemUpdate.isVisible,
              needRate:this.listItemUpdate.needRate,
              isEnd:this.listItemUpdate.isEnd,
              standardWorkingHour: this.listItemUpdate.standardWorkingHour,
              safetyPrecautions:this.listItemUpdate.safetyPrecautions,
              qualityRiskIdentification:this.listItemUpdate.qualityRiskIdentification,
              isKeyStep:this.listItemUpdate.isKeyStep,
              executionFrequency: this.listItemUpdate.executionFrequency,
              }]
      }
      insertCraftsDe(params).then(response => {
        this.$message({
          message: "新增成功",
          type: 'success'
        })
        this.getDataList()
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
    initData(craftsId) {

      this.listItemUpdate.craftsId = craftsId ==null ?'':craftsId.id
      // this.timeLimitId = data.id;
     findAllCraftsDes({
        craftsId:this.listItemUpdate.craftsId,
        craftsDeCode: '',
        craftsDeName: '',
       pg_pagenum: 1,
       pg_pagesize: 10
      }).then(response => {
       this.tableData = response.data
       this.total = response.total_count

        this.dataList = response.data.map(item => {
          return {
            k: item.craftsId,
            v: item.craftsDeName
          }
        })
      })
    },

    handleWorkContent(row) {
      let params = certainProp(row, ['id', 'tempName'])
      this.$router.push({
        path: 'checkItem',
        query: params
      })
    },
    handleAdd() {
      this.listItemUpdate = {
        id: '',
        craftsId: this.listItemUpdate.craftsId,
        craftsDeCode: '', //工步编码
        craftsDeName: '', //工步名称
        standardWorkingHour:'',
        isVisible:'',
        isEnd:'',
        safetyPrecautions:'',
        qualityRiskIdentification:'',
        isKeyStep:'',
        executionFrequency:''

      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate()
      })
    },
  }
}
</script>

<style scoped>

</style>
