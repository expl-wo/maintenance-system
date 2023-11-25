<template>
  <el-dialog draggable  appendToBody title="列配置" width="800px" top="5vh" v-model="dialogVisible"  v-if="dialogVisible" modal>
    <div class="otherCon wp">
      <el-row :gutter="12" class="otherCon">
        <el-col :span="12" class="hp p-lf">
          <el-card shadow="hover" class="hp">
            <div slot="header" class="clearfix">
              <div>
                <span>基础列配置</span>
                <el-button @click="baseSelectedAll">全选</el-button>
                <el-button @click="baseUnselectedAll">全不选</el-button>
              </div>
            </div>
            <div class="wp hp app-containerC">
              <el-tree
                ref="baseTreeRef"
                node-key="property"
                check-on-click-node
                :expand-on-click-node="false"
                :data="baseColumnList"
                :default-checked-keys="baseSelectedColumnProperty"
                show-checkbox
                :props="defaultProps">
              </el-tree>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12" class="hp p-rf">
          <el-card shadow="hover" class="hp">
            <div slot="header" class="clearfix">
              <div>
                <span>采购、设计、生产列配置</span>
                <el-button @click="moreSelectedAll">全选</el-button>
                <el-button @click="moreUnselectedAll">全不选</el-button>
              </div>
            </div>
            <div class="wp hp app-containerC">
              <el-tree
                ref="moreTreeRef"
                node-key="property"
                check-on-click-node
                :expand-on-click-node="false"
                :data="moreColumnList"
                :default-checked-keys="moreSelectedColumnProperty"
                show-checkbox
                :props="defaultProps">
              </el-tree>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <template #footer>
      <div class="dialog-footer">
      <el-button @click="dialogVisible=false">取消</el-button>
      <el-button @click="handleSave" type="primary">保存</el-button>
    </div>
    </template>
  </el-dialog>
</template>

<script>
import pageset from '@/api/sys/pageset'
export default {
  name: 'configColumnDialog',
  data(){
    return {
      dialogVisible: false,
      params: {},
      baseColumnList: [],
      moreColumnList: [],
      id: '',
      hasConfigColumn: '',
      baseSelectedColumnProperty: [],
      moreSelectedColumnProperty: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    async init(params){
      this.params = params;
      this.setBaseColumnList();
      // this.setMoreColumnList();
      let response = await pageset.my({
        pageId: params.pageId
      })
      if(response.data){
        let data = response.data;
        this.id = data.id;
        let obj = JSON.parse(data.columnProperty);
        if(obj.baseCheckedKey !== undefined){
          this.hasConfigColumn = true;
          this.baseSelectedColumnProperty = obj.baseCheckedKey;
          this.moreSelectedColumnProperty = obj.moreCheckedKey;
        }else{
          this.setDefaultProperty();
        }
      }else{
       this.setDefaultProperty();
      }
      this.dialogVisible = true;
    },
    setDefaultProperty(){
      this.id = '';
      this.hasConfigColumn = false;
      this.baseSelectedColumnProperty = this.getBaseAllKeys();
      this.moreSelectedColumnProperty = this.getMoreAllKeys();
    },
    setBaseColumnList(){
      let columnList = this.params.columnList;
      columnList.some((item, index)=>{
        if(item.children && item.children.length > 0){
          this.baseColumnList = columnList.slice(0, index);
          this.moreColumnList = columnList.slice(index);
          return true;
        }else{
          return false;
        }
      })
    },
    // setMoreColumnList(){
    //
    // },
    handleSave(){
      //保存数据
      let data = this.getSelectedKeys();
      let formatData = {
        id: this.id,
        pageId: this.params.pageId,
        columnProperty: JSON.stringify(data),
      };
      pageset.set(formatData).then(response=>{
        if(response.err_code === this.$constants.statusCode.success){
          this.dialogVisible = false;
          this.$emit('refreshColumn', data.baseCheckedKey.concat(data.moreCheckedKey).concat(data.moreHalfCheckedKey));
          this.$nextTick(()=>{
            this.$message({
              message: '列配置数据保存成功',
              type: 'success',
              duration: 5000,
            })
          })
        }else{
          this.$message.error(response.msg);
        }
      })
    },
    getSelectedKeys(){
      let baseCheckedKey = this.$refs.baseTreeRef.getCheckedKeys();
      let moreCheckedKey = this.$refs.moreTreeRef.getCheckedKeys();
      let moreHalfCheckedKey = this.$refs.moreTreeRef.getHalfCheckedKeys();

      return {
        baseCheckedKey,
        moreCheckedKey,
        moreHalfCheckedKey
      }
    },
    baseSelectedAll(){
      this.$refs.baseTreeRef.setCheckedKeys(this.getBaseAllKeys())
    },
    baseUnselectedAll(){
      this.$refs.baseTreeRef.setCheckedKeys([])
    },
    moreSelectedAll(){
      this.$refs.moreTreeRef.setCheckedKeys(this.getMoreAllKeys())
    },
    moreUnselectedAll(){
      this.$refs.moreTreeRef.setCheckedKeys([])
    },
    getBaseAllKeys(){
      let propertys = [];
      this.getAllPropertyList(this.baseColumnList, propertys);
      return propertys;
    },
    getMoreAllKeys(){
      let propertys = [];
      this.getAllPropertyList(this.moreColumnList, propertys);
      return propertys;
    },
    getAllPropertyList(treeData, propertys){
      treeData.forEach(item=>{
        propertys.push(item.property);
        if(item.children && item.children.length > 0){
          this.getAllPropertyList(item.children, propertys);
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.selectedBtnWrapper{
  border-bottom: 1px solid #dfe6ec;
  margin-bottom: 8px;
  padding-bottom: 8px;
}
.checkboxGroupWrapper{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-left: 20px;
  height: 400px;
  flex-wrap: wrap;
  .checkboxItem{
    width: 20%;
  }
}

::deep(.el-tree){
  height: calc(95vh - 320px);
  overflow: auto;
}
</style>
