<template>
  <div class="app-container">
    <el-row :gutter="12" style="height: 100%">
      <el-col :span="24" style="height: 100%" class="hp p-lf">
        <el-card shadow="hover" style="height: 60%">
          <div class="wp hp app-containerC">
            <div class="filter-container">
              <el-form :inline="true" class="demo-form-inline demo-form-zdy">
                <el-form-item size="small">
                  <el-button type="primary" icon="sell" v-if="isAuth('GZGButtonGeneral')" @click="putRecord('put')">入炉登记</el-button>
                </el-form-item>
                <el-form-item size="small">
                  <el-button type="primary" icon="sell" v-if="isAuth('GZGButtonGeneral')" @click="putRecordConfirm()">入炉登记确认</el-button>
                </el-form-item>
                <el-form-item size="small">
                  <el-button type="primary" icon="edit" v-if="isAuth('GZGButtonGeneral')" @click="putRecord('status')">状态修改</el-button>
                </el-form-item>
                <el-form-item size="small">
                  <el-button type="primary" icon="soldOut" v-if="isAuth('GZGButtonGeneral')" @click="outRecordConfirm()">确认可出炉</el-button>
                </el-form-item>
                <el-form-item size="small">
                  <el-button type="success" icon="soldOut" v-if="isAuth('GZGButtonGeneral')" @click="putRecord('out')">出炉登记</el-button>
                </el-form-item>
                <el-form-item size="small">
                  <el-button type="warning" icon="soldOut" v-if="isAuth('GZGButtonGeneral')" @click="furnaceEntryChange()">入炉变更</el-button>
                </el-form-item>
                <el-form-item size="small">
                  <el-button type="warning" icon="soldOut" v-if="isAuth('GZGButtonGeneral')" @click="clearTankRecord()">设为空罐</el-button>
                </el-form-item>
              </el-form>
            </div>

            <el-table
              :data="tableData"
              class="otherCon wp"
              style="height:58%; width: 100%;font-size:0.8rem;"
              row-key="id"
              border
              :row-class-name="clickStyle"
              @row-click="rowClick"
              :row-style="{height: '54px'}"
              :cell-style ="{borderColor:'#538bea',borderStyle:'double'}"
            >
              <el-table-column prop="dryingTankCode" align="center" width="100" label="干燥罐"/>
              <el-table-column prop="products" align="center" width="200" label="生产号"/>
              <el-table-column prop="status" align="center" label="运行状态">
                <template #default="scope">
                  <span v-if="scope.row.status == 0 || scope.row.status == null">待产</span>
                  <span v-else-if="scope.row.status == 1">准备</span>
                  <span v-else-if="scope.row.status == 2">加热</span>
                  <span v-else-if="scope.row.status == 3">降压</span>
                  <span v-else-if="scope.row.status == 4">高真空</span>
                  <span v-else-if="scope.row.status == 5">检修</span>
                  <span v-else-if="scope.row.status == 6">保温</span>
                  <span v-else-if="scope.row.status == 7">升温</span>
                </template>
              </el-table-column>
              <el-table-column prop="dryingProcessCode" align="center" width="115" label="工艺方案" />
              <el-table-column prop="processMode" align="center" width="90" label="工艺方式" />
              <el-table-column prop="putDate" align="center" width="150" label="入炉时间" />
              <el-table-column prop="dryingDate" align="center" width="80"  label="干燥时间(h)" />
              <el-table-column prop="planOutDate" align="center" width="150"  label="预计出炉时间" />
              <el-table-column prop="remarks" align="center" label="备注" />
              <el-table-column prop="outDate" align="center" width="150" label="车间实际出炉时间" />
              <el-table-column prop="delayDate" align="center" width="80" label="延迟时间(h)" />
              <el-table-column prop="reason" align="center" width="70" label="原因" />
              <el-table-column prop="insulationWeight" align="center" width="80" label="绝缘重量统计" />
              <el-table-column prop="lastOutDate" align="center" width="90"  label="上次出炉时间" />
              <el-table-column prop="editorName" align="center"  label="更新人" />
              <el-table-column prop="editDt" align="center" width="90"  label="更新时间" />
              <el-table-column prop="putCheck" align="center" width="70" label="检查情况(入炉)" />
              <el-table-column prop="outCheck" align="center" width="70" label="检查情况(出炉)" />
            </el-table>

          </div>
        </el-card>
        <div style="height: 40% ">
          <el-tabs tab-position="left" type="border-card" style="height: 100%" class="table-content-height-reset">
            <el-tab-pane label="可入炉产品" style="height: 100%" >
              <div class="wp hp app-containerC">
                <div class="filter-container">
                  <el-form :inline="true" :model="listQuery" class="demo-form-inline demo-form-zdy">
                    <el-form-item label="月份/生产号/型号" size="small">
                      <el-input v-model="listQuery.search" placeholder="月份/生产号/型号" style="width: 180px;" class="filter-item" clearable />
                    </el-form-item>
                    <el-form-item label="区分" size="small">
                      <el-select v-model="listQuery.isFinish" @change="getProductData()" placeholder="请选择">
                        <el-option
                            v-for="item in booleanData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="干燥罐" size="small">
                      <el-select v-model="listQuery.dryingTankCode" @change="getProductData()" clearable placeholder="请选择">
                        <el-option
                            v-for="item in tankData"
                            :key="item.id"
                            :label="item.dryingTankCode"
                            :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="计划入炉时间段" size="small">
                      <el-date-picker
                          @change="getProductData()"
                          v-model="dateRange"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item size="small">
                      <el-button type="primary" icon="el-icon-search" @click="getProductData()">查询</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <el-table highlight-current-row
                          :data="productData"
                          stripe
                          row-key="id"
                          border
                          style="height: auto"
                          @selection-change="selectionChange"
                          ref="productTable"
                          :cell-style ="{borderColor:'#538bea'}"
                >
                  <el-table-column align="center" type="selection" width="50" ></el-table-column>
                  <el-table-column prop="month" align="center" label="月份"  width="100"/>
                  <el-table-column prop="productNo" align="center" label="生产号"  width="200"/>
                  <el-table-column prop="model" align="center" label="型号" width="200" />
                  <!--                <el-table-column prop="" align="center" label="绝缘重量" />-->
                  <el-table-column prop="tableName" align="center" label="干燥罐炉号" />
                  <el-table-column prop="startDate" align="center" width="200" label="计划入炉时间" />
                  <el-table-column prop="quantity" align="center" label="数量" />
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="已入炉产品" >
              <el-table highlight-current-row
                        :data="inTankProductData"
                        stripe
                        row-key="id"
                        border
                        :cell-style ="{borderColor:'#538bea'}"
              >
                <el-table-column prop="option" align="center" width="100" label="操作">
                  <template #default="scope">
                    <el-button type="primary" size="small" @click="cancelSingle(scope.row)">取消</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="productNo" align="center" label="生产号"  width="250"/>
                <el-table-column prop="model" align="center" label="型号" width="300" />
                <el-table-column prop="dryingProductType" align="center" label="类型" />
                <el-table-column prop="output" align="center" label="产量(万kVA)" />
                <el-table-column prop="amount" align="center" label="产值(万元)" />
                <el-table-column prop="planStartDate" align="center" label="计划入炉时间" />
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>


      </el-col>
    </el-row>


    <!-- 入炉登记弹窗 -->
    <el-dialog draggable  :close-on-click-modal="false" title="入炉登记" v-model="putDialogVisible" >
      <div class="app-container">
        <el-form ref="putForm" label-position="right" label-width="110px" :rules="rules" :model="putForm" >
          <el-form-item label="干燥罐炉号:"  size="small">
            <span>{{ row==null ? '' : row.dryingTankCode}}</span>
          </el-form-item>
          <el-form-item label="入炉时间:" prop="putDate"  size="small">
            <el-date-picker
              v-model="putForm.putDate"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="工艺方案:"  size="small">
            <el-select
              v-model="putForm.processPlan"
              style="width: 320px;"
              @change="setDryingTime"
              placeholder="请选择">
              <el-option
                v-for="item in progressPlanData"
                :key="item.id"
                :label="item.planCode"
                :value="item.planCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="干燥时间:" prop="dryingDate" size="small">
            <el-input v-model="putForm.dryingDate" placeholder="干燥时间" style="width: 320px;" class="filter-item" size="small"><template >小时</template></el-input>
          </el-form-item>
          <el-form-item label="工艺方式:" prop="processMode" size="small">
            <el-select
              v-model="putForm.processMode"
              style="width: 320px;"
              placeholder="请选择">
              <el-option
                v-for="item in modeData"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="绝缘重量统计:"  size="small">
            <el-input v-model="putForm.insulationWeight" placeholder="绝缘重量统计" style="width: 320px;" class="filter-item" size="small" />
          </el-form-item>
          <el-form-item label="检查情况(入炉):" prop="putCheck"  size="small">
            <el-input v-model="putForm.putCheck" placeholder="检查情况(入炉)" style="width: 320px;" class="filter-item" size="small" />
          </el-form-item>
        </el-form>
      </div>
      <div  class="dialog-footer">
        <el-button size="small" @click="putDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="submitForm('putForm')">确认</el-button>
      </div>
    </el-dialog>

    <!-- 入炉确认弹窗 -->
    <el-dialog draggable  :close-on-click-modal="false" title="入炉登记确认" v-model="confirmDialogVisible" >
      <div class="app-container">
        <el-form ref="putForm" label-position="right" label-width="110px" :model="putForm" >
          <el-form-item label="干燥罐炉号:"  size="small">
            <span>{{row==null?'':row.dryingTankCode}}</span>
          </el-form-item>
          <el-form-item label="入炉时间:" prop="putDate"  size="small" disabled="true">
            <el-date-picker
              v-model="putForm.putDate"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="类别" size="small">
            <xui-dict-select item-code="dryingClassification" size="small" v-model="putForm.dryingProductType"
                             class="filter-item" clearable></xui-dict-select>
          </el-form-item>
        </el-form>
      </div>
      <div  class="dialog-footer">
        <el-button size="small" @click="confirmDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="putConfirm()">确认</el-button>
      </div>
    </el-dialog>

    <!-- 状态修改登记弹窗 -->
    <el-dialog draggable  :close-on-click-modal="false" title="状态更新" v-model="statusDialogVisible" >
      <div class="app-container">
        <el-form ref="statusForm" label-position="right" label-width="110px" :rules="rules" :model="statusForm" >
          <el-form-item label="状态:"  size="small">
            <el-select
              v-model="statusForm.status"
              style="width: 320px;"
              placeholder="请选择">
              <el-option
                v-for="item in statusData"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注:"  size="small">
            <el-input v-model="statusForm.remarks" placeholder="备注" style="width: 320px;" class="filter-item" size="small" />
          </el-form-item>
        </el-form>
      </div>
      <div  class="dialog-footer">
        <el-button size="small" @click="statusDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="submitForm('statusForm')">确认</el-button>
      </div>
    </el-dialog>

    <!-- 出炉登记弹窗 -->
    <el-dialog draggable  :close-on-click-modal="false" title="出炉登记" v-model="outDialogVisible" >
      <div class="app-container">
        <el-form ref="outForm" label-position="right" label-width="130px" :rules="rules" :model="outForm" >
          <el-form-item label="干燥罐炉号:"  size="small">
            <span>{{row==null?'':row.dryingTankCode}}</span>
          </el-form-item>
          <el-form-item label="可出炉时间:" prop="planOutDate"  size="small">
            <el-date-picker
              v-model="outForm.planOutDate"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="车间实际出炉时间:" prop="outDate"  size="small">
            <el-date-picker
              v-model="outForm.outDate"
              @change="outDateSelect"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="延迟时间:" size="small">
            <el-input v-model="outForm.delayDate" placeholder="延迟时间" style="width: 320px;" class="filter-item" size="small"><template >小时</template></el-input>
          </el-form-item>
          <el-form-item label="延迟原因:"  size="small">
            <el-input v-model="outForm.reson" placeholder="延迟原因" style="width: 320px;" class="filter-item" size="small" />
          </el-form-item>
          <el-form-item label="备注:"  size="small">
            <el-input v-model="outForm.remarks" placeholder="备注" style="width: 320px;" class="filter-item" size="small" />
          </el-form-item>
          <el-form-item label="检查情况(出炉):" prop="outCheck"  size="small">
            <el-input v-model="outForm.outCheck" placeholder="检查情况(出炉)" style="width: 320px;" class="filter-item" size="small" />
          </el-form-item>
        </el-form>
      </div>
      <div  class="dialog-footer">
        <el-button size="small" @click="outDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="submitForm('outForm')">确认</el-button>
      </div>
    </el-dialog>

    <!-- 修改入炉信息弹窗 -->
    <el-dialog draggable  :close-on-click-modal="false" title="入炉登记" v-model="changeDialogVisible" >
      <div class="app-container">
        <el-form ref="putForm" label-position="right" label-width="110px" :model="changeForm" >
          <el-form-item label="干燥罐炉号:"  size="small">
            <span>{{row==null?'':row.dryingTankCode}}</span>
          </el-form-item>
          <el-form-item label="入炉时间:" prop="putDate"  size="small" disabled="true">
            <el-date-picker
              v-model="changeForm.putDate"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="干燥时间:" prop="dryingDate" size="small">
            <el-input v-model="changeForm.dryingDate" placeholder="干燥时间" style="width: 320px;" class="filter-item" size="small"><template >小时</template></el-input>
          </el-form-item>
          <el-form-item label="工艺方式:" prop="processMode" size="small">
            <el-select
              v-model="changeForm.processMode"
              style="width: 320px;"
              placeholder="请选择">
              <el-option
                v-for="item in modeData"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div  class="dialog-footer">
        <el-button size="small" @click="putDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="changeConfirm()">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import dryingProcess from '@/api/pm/dryingProcess'
import dryingManage from "@/api/plan/dryingManage";
import dict from '@/api/sys/dict'
import {timeTranslate, timeTranslateHMS} from '@/utils/common'
import  {isAuth} from "@/utils/control"


  export default {
    name: 'dryingInout',
    data() {
      return {
        tableData: [],
        productData: [],
        total: 0,
        listQuery: {
          pg_pagenum: 1,
          pg_pagesize: 20,
          search: null,
          dryingTankCode: null,
          startDate: null,
          endDate: null,
          isFinish: '0'
        },
        progressPlanData:[],
        tankData: [],
        booleanData: [
          {label:"未入炉",value:'0'},
          {label:"已入炉",value:'1'},
          {label:"全部",value:'-1'}
        ],
        dateRange: null,
        selectData: [],
        row: null,
        modeData: [],
        putDialogVisible: false,
        putForm: {
          putDate: timeTranslateHMS(new Date()),
          dryingDate: null,
          processPlan: null,
          processMode: null,
          insulationWeight: null,
          putCheck: "正常",
          dryingProcessId:null,
          dryingProcessCode:null,
          dryingTankCode:null,
          dryingProductType: null,
        },
        statusDialogVisible: false,
        statusForm: {
          status: null,
          remarks: null,
        },
        statusData: [
          {value:0,label:"待产"},{value:1,label:"准备"},{value:2,label:"加热"},{value:3,label:"降压"},
          {value:4,label:"高真空"},{value:5,label:"检修"},{value:6,label:"保温"},{value:7,label:"升温"},
        ],
        outDialogVisible: false,
        outForm: {
          planOutDate: null,
          outDate: null,
          delayDate: null,
          reson: "无",
          remarks: null,
          putCheck: null,
        },
        confirmDialogVisible:false,
        rules: {
          putDate:[{required: true, message: '请选择入炉时间', trigger: 'change' }],
          dryingDate:[{required: true, message: '请输入干燥时间', trigger: 'blur'}],
          processMode:[{ required: true, message: '请选择工艺方式', trigger: 'change' }],
          putCheck:[{required: true, message: '请输入检查情况', trigger: 'blur'}],
          planOutDate:[{required: true, message: '请选择可出炉时间', trigger: 'change' }],
          outDate:[{required: true, message: '请选择车间实际出炉时间', trigger: 'change' }],
          outCheck:[{required: true, message: '请输入检查情况', trigger: 'blur'}],
        },
        changeDialogVisible:false,
        changeForm:{
          processMode:null,
          dryingDate:null,
          putDate:null
        },
        inTankProductData:[]
      }
    },
    beforeMount() {
      let date = new Date();
      let startDate = new Date(date.getTime()-7*24*3600*1000);
      let endDate = new Date(date.getTime()+7*24*3600*1000);
      this.dateRange = [];
      this.dateRange[0] = timeTranslate(startDate) // 开始日期
      this.dateRange[1] = timeTranslate(endDate) // 结束日期
      this.getModeData()
      this.getTableDate()
      this.getProductData()
      this.getTankData()
    },
    methods: {
      getPlanData(tankId){
        dryingProcess.tankPlan({tankId:tankId}).then(res=>{
          this.progressPlanData = res.data
        })
      },
      getModeData(){
        console.log(111333)
        dict.getDetail({"code":"","name":"","itemCode":"dryingMethod"}).then(res=>{
          this.modeData = res.data
        })
      },
      getTableDate() {
        dryingManage.queryDryingInout().then(res=>{
          this.tableData = res.data;
        })
      },
      isAuth(key){
        return isAuth(key)
      },
      getProductData() {
        if (this.dateRange) {
          this.listQuery.startDate = this.dateRange[0]
          this.listQuery.endDate = this.dateRange[1]
        } else {
          this.listQuery.startDate = null
          this.listQuery.endDate = null
        }
        dryingManage.getDryingInoutProduct(this.listQuery).then(res=>{
          if(res.err_code === 10000){
            this.total = res.total_count
            this.productData = res.data
          }

        })
      },
      getTankData() {
        dryingManage.findAllDryingTank({'dryingTankCode': ''}).then(res=>{
          this.tankData = res.data;
        })
      },
      getList(val) {
        this.listQuery.pg_pagenum = val.page
        if (val.limit) {
          this.listQuery.pg_pagesize = val.limit
        }
        this.getProductData();
      },
      selectionChange(select){
        this.selectData = select
      },
      clickStyle ({row, rowIndex}) {
        if (this.row == row ) {
          return "selected-row";
        }
      },
      rowClick (row) {
        this.row=row
        console.log(row)
        this.outForm.planOutDate = row.planOutDate
        this.statusForm.status = row.status == null?0:row.status
        this.inProducts()
      },
      putRecord(key){
        if(this.row == null) {
          this.$message.error("请先选择一个干燥罐!");
          return;
        }

        if (key == 'put') {
          this.putForm.dryingTankCode = this.row.dryingTankCode
          this.putForm.dryingTankId = this.row.dryingTankId
          this.putForm.processPlan = null
          this.putForm.dryingDate = null
          this.getPlanData(this.row.dryingTankCode)
          this.putDialogVisible = true;
        }
        else if (key == 'status') this.statusDialogVisible = true;
        else if (key == 'out') this.outDialogVisible = true;
      },
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          try{
            if (valid) {
              if (formName=='putForm') {
                this.putForm.id = this.row.id
                this.putForm.recordId = this.row.recordId
                dryingManage.putRecord(this.putForm).then(res=>{
                  if (res.err_code == 10000) {
                    this.$message.success("入炉登记成功！")
                    this.dataInit()
                    this.putDialogVisible = false;
                  }
                })
              } else if (formName=='statusForm') {
                this.statusForm.recordId = this.row.recordId
                dryingManage.update(this.statusForm).then(res=>{
                  if (res.err_code == 10000) this.$message.success("修改状态成功！")
                  this.dataInit()
                  this.statusDialogVisible = false;
                })
              } else if (formName=='outForm') {
                this.outForm.id = this.row.id
                dryingManage.outRecord(this.outForm).then(res=>{
                  if (res.err_code == 10000) this.$message.success("出炉成功！")
                  this.dataInit()
                  this.outDialogVisible = false;
                })
              }
            } else {
              return false;
            }
          }catch(e){
            this.$message.error(this.title+"失败")
          }
        });
      },
      dataInit(){
        this.getTankData()
        this.getTableDate()
      },
      putRecordConfirm(){
        if (this.selectData.length == 0) {
          this.$message.error("请至少选择一个生产号！")
          return;
        }
        this.confirmDialogVisible = true
      },
      putConfirm(){
        if (!this.putForm.dryingProductType) {
          this.$message.error("请选择类别！")
          return;
        }
          this.putForm.id = this.row.id
          this.putForm.recordId = this.row.recordId
          let param = {
            'record': this.putForm,
            'pl15ids': this.selectData.map(item=>{return item.planNodeId})
          }
          dryingManage.putRecordConfirm(param).then(res=>{
            if (res.err_code == 10000) {
              this.$message.success("入炉登记确认成功！")
              this.getTableDate()
              this.$refs.productTable.clearSelection();
              this.confirmDialogVisible = false
            }
          });
      },
      outRecordConfirm(){
        this.$confirm('确认可出炉?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.outForm.id = this.row.id
          dryingManage.outRecordConfirm(this.outForm).then(res=>{
            if (res.err_code == 10000) this.$message.success("信息提醒成功！")
            this.getTableDate()
          });
        });
      },
      outDateSelect(){
        let planOutDate = new Date(this.outForm.planOutDate.replace(/-/g, "/"));
        let outDate = new Date(this.outForm.outDate.replace(/-/g, "/"));
        let dateDiff = outDate - planOutDate;
        this.outForm.delayDate = Math.floor(dateDiff / (1000 * 60 * 60));
      },
      setDryingTime(){
        let chosedDryingPlan = this.progressPlanData.filter(item=>item.planCode == this.putForm.processPlan)
        let chosedCode = chosedDryingPlan[0];
        this.putForm.dryingDate = chosedCode.estimatedTotalTime
        this.putForm.dryingProcessId = chosedCode.id
        this.putForm.dryingProcessCode = chosedCode.planCode
      },
      furnaceEntryChange(){
        console.log(this.row)
        if(!this.row){
          this.$message.error("请选择干燥罐")
          return
        }
        if(this.row.status == 0){
          this.$message.error("改干燥罐状态为待产，无法变更入炉信息")
          return
        }
        this.changeForm.dryingDate = this.row.dryingDate
        this.changeForm.putDate = this.row.putDate
        this.changeForm.processMode = this.row.processMode
        this.changeDialogVisible = true
      },
      changeConfirm(){
        let param = {
          id: this.row.id,
          recordId: this.row.recordId,
          dryingDate: this.changeForm.dryingDate,
          processMode: this.changeForm.processMode
        }
        dryingManage.furnaceEntryChange(param).then(res=>{
          if (res.err_code == 10000) {
            this.$message.success("变更成功！")
            this.getTableDate()
            this.changeForm = {
              processMode:null,
              dryingDate:null,
              putDate:null
            }
            this.changeDialogVisible = false
          }
        })
      },
      clearTankRecord(){
        if(!this.row){
          this.$message.error("请选择干燥罐")
          return
        }
        dryingManage.clearTankRecord({id:this.row.id, recordId: this.row.recordId}).then(res=>{
          if (res.err_code == 10000) {
            this.$message.success("设置空罐成功！")
            this.getTableDate()
          }
        })
      },
      inProducts(){
        dryingManage.inTankProduct({recordId:this.row.recordId}).then(res=>{
          this.inTankProductData = res.data
        })
      },
      cancelSingle(productRow){
        dryingManage.cancelSingle({recordId:this.row.recordId,productRecordId:productRow.id}).then(res=>{
          if (res.err_code === 10000) {
            this.$message.success("取消成功！")
            this.getTableDate()
          }
        })
      }
    }
  }
</script>
<style scoped>
  .border {
    border: 1px solid #ebebeb;
    border-radius: 8px;
    -webkit-box-shadow: 0 0 15px 0 rgba(232, 237, 250, .6), 0 7px 11px 0 rgba(232, 237, 250, .5);
    box-shadow: 0 0 15px 0 rgba(232, 237, 250, .6), 0 7px 11px 0 rgba(232, 237, 250, .5);
    height: 600px;
  }

  .p-10 {
    padding: 0 10px 10px 10px
  }

  .placeholderDiv {
    font-size: 12px;
    color: red;
  }

  :deep(.selected-row){
    background: #ffff00;
  }
  :deep(.el-tabs--border-card > .el-tabs__content)  {
    height: 100% !important;
  }
</style>
