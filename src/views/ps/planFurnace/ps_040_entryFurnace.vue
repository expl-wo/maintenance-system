<template>
  <div class="app-container app-containerC">
    <el-row :gutter="12" class="otherCon">
      <el-col :span="14" class="hp p-lf">
        <el-card shadow="hover" class="hp">
          <template #header>
          <div class="hasLegend">
            <div>
              <el-button type="danger" v-if="isApprovePage || $isAuth('0404planFurnace.delete')" icon="Delete" @click="handleDeleteProduct">删除</el-button>
              <el-button type="primary" v-if="isApprovePage || $isAuth('0404planFurnace.editTank')" icon="Edit" @click="handleEditTank">修改干燥罐</el-button>
            </div>
            <div class="legend-wrapper" style="justify-content: flex-start">
              <simple-gant-legend :show-selected="false"></simple-gant-legend>
            </div>
          </div>
          </template>
          <div class="wp hp app-containerC">
            <div class="xui-gant show-more-text">
              <div class="xui-gant__time">
                <div class="xui-gant__time-item"  :style="{'marginRight': item.width - 80 + 'px'}" v-for="(item, index) in timeLineList">
                  <div class="xui-gant__time-name">{{item.label}}
                  </div>
                  <div class="xui-gant__time-line is-first" :class="{'is-first': index === 0}">
                  </div>
                </div>
                <div class="xui-gant__time-add"></div>
              </div>
              <div class="xui-gant__furnace">
                <div class="xui-gant__furnace-item"  v-for="(item, index) in gantList" :key="index">
                  <div class="xui-gant__furnace-name">{{ item.tableName }}</div>
                  <div class="xui-gant__furnace-block">
                    <div class="xui-gant__plan" >
                      <div class="xui-gant__plan-content" @click="handleSelectNode(subItem)"  v-for="(subItem, index2) in item.chartDataList" :key="index2"
                           :class="{'is-selected': gantSelectedNode===subItem}"
                           :style="{'width': subItem.xLong + 'px'}">
                        <div class="xui-gant__plan-item"  :style="{'width': subItem.xLong - 2 + 'px'}">
                          <div class="xui-gant__plan-block border-right" :class="{'empty': subItem.isEmpty}">
                            <el-tooltip class="item" effect="dark" :content="subItem.productNames" placement="top-start">
                              <div class="xui-gant__plan-detailWrapper" :class="subItem.classNames">
                                <div class="xui-gant__plan-detail" :class="productName.clz" v-for="(productName, subIndex) in subItem.productList" :key="subIndex">
                                  {{productName.productNo}}
                                </div>
                              </div>
                            </el-tooltip>
                          </div>
                        </div>
                        <div class="xui-gant__plan-time">
                          <div class="xui-gant__plan_start-time">
                            <span v-if="subItem.intervalDays > 1">{{subItem.simpleStartDate}}</span>
                          </div>
                          <div class="xui-gant__plan_end-time">
                            {{subItem.simpleNodeDate}}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10" class="hp p-rf">
        <product-list ref="productListRef" :furnace="gantSelectedNode" @refresh="getData" @addGant="handleAddGant" @approval="handleApproval"></product-list>
        <submit-approval-dialog ref="submitApprovalDialogRef" @refresh="handleRefresh"></submit-approval-dialog>
      </el-col>
    </el-row>
    <delete-gant-plan-dialog ref="deleteGantPlanDialogRef"  @refresh="handleSearch"></delete-gant-plan-dialog>
    <edit-tank-dialog ref="editTankDialogRef" @refresh="handleSearch"></edit-tank-dialog>
  </div>
</template>

<script>
import planWeek from '@/api/plan/planWeek'
import dryingManage from '@/api/plan/dryingManage'
import productList from '@/views/ps/planFurnace/productList'
import submitApprovalDialog from '@/views/ps/planWeek/dialog/submitApprovalDialog.vue'
import formatGantMixins from '@/views/ps/_public/formatGantMixins'
import deleteGantPlanDialog from '@/views/ps/_public/deleteGantPlanDialog.vue'
import enterSearchMixins from '@/mixins/enterSearchMixins'
import editTankDialog from '@/views/ps/planFurnace/editTankDialog.vue'
import SimpleGantLegend from '@/views/ps/_public/simpleGantLegend'

export default {
  name: 'ps_040_entryFurnace',
  components: {
    SimpleGantLegend,
    productList,
    submitApprovalDialog,
    deleteGantPlanDialog,
    editTankDialog
  },
  mixins: [formatGantMixins, enterSearchMixins],
  data(){
    let isApprovePage = false;
    let routePath = this.$route.fullPath;
    if(routePath.indexOf('0405planFurnaceApproval')>=0){
      isApprovePage = true
    }
    return {
      isApprovePage,
      nodeType: this.$constants.nodeType.furnace,
      nodeTypeDesc: this.$constants.nodeType.furnaceDesc,
      menuDesc: '入炉计划',
      gantList: [],
      timeLineList: [],
      gantSelectedNode: null,
      nodeNameAttr: 'dryingTankCode',
      gantNameAttr: 'tank'
    }
  },
  mounted() {
    this.getTimeLineList();
    this.getData();
  },
  methods: {
    handleSearch(){
      this.getData();
      this.$refs.productListRef.initData();
    },
    async getData(){
      this.gantSelectedNode = null;
      let gantResponse = await dryingManage.findAllDryingTank({
        dryingTankCode: '',
        dryingMethod: '',
        tankClassification:'body',
        pageNum: 1,
        pageSize: this.$constants.pageEntryCount
      })
      let gantTable = gantResponse.data;
      let tableList = await planWeek.queryFurnaceList({
        nodeId: this.nodeType
      })
     /* tableList.data.forEach(item=>{
        item.products.forEach((subItem, index)=>{
          if(index === 1){
            subItem.startDate = '2022-06-11';
            subItem.nodeDate = '2022-06-15'
          } else{
            subItem.startDate = '2022-06-01';
            subItem.nodeDate = '2022-06-10'
          }
        })
      })*/
      let formattedGantList = this.formatGantList(gantTable);

      this.formatData(formattedGantList, tableList.data);
    },

    handleAddGant(result){
      //检测右边是否有选中
      if(!this.gantSelectedNode){
        this.$message.error(`请先在左侧选择要加入的${this.nodeTypeDesc}段`);
        return;
      }
      let nodeId = this.gantSelectedNode.tableId;
      if(result.furnaceIds && result.furnaceIds.indexOf(nodeId) >= 0){
        this._handleAddGant(result);
      }else{
        this.$message.error(`请在左侧选择允许加入的干燥罐`);
      }
    },
    //提交审批
    handleApproval(){
      if(this.gantList.length ===0){
        this.$message.error('甘特图没有数据');
        return;
      }
      let yuPaiList = [];
      this.gantList.forEach(item=>{
        item.children.forEach(suItem=>{
          if(suItem.status == this.$constants.confirmStatus.beforehand){
            yuPaiList.push(suItem)
          }
        })
      })
      if(yuPaiList.length == 0){
        this.$message.error('甘特图没有已预排的数据');
        return;
      }
      this.$refs.submitApprovalDialogRef.initDataNoNeedGx(yuPaiList, {
        nodeId: '20'
      });
    },
    handleRefresh(){
      this.handleSearch();
    },
    handleEditTank(){
      if(!this.gantSelectedNode){
        this.$message.error(`请选择生产号节段`);
        return;
      }
      if(!this.gantSelectedNode.children || this.gantSelectedNode.children.length === 0){
        this.$message.error(`请选择有生产号的节段`);
        return;
      }
      let data  = {
        tank: this.gantSelectedNode,
        nodeId: this.nodeType,
        tankList: this.gantList
      }
      this.$refs.editTankDialogRef.init(data);
    },
  }
}
</script>

<style lang="scss" src="@/styles/xui/gant.scss"></style>
<style scoped>

</style>
