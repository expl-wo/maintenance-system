<template>
  <el-dialog v-dialogDrag  appendToBody :title="model.id? '编辑': '新增'" width="800px" v-model="dialogVisible" modal>
    <el-form :model="model" ref="form" :rules="rules" label-width="140px" >
      <el-row>
        <el-col :span="12">
          <el-form-item prop="stepCode" label="工步编码：" >
            <el-input v-model="model.stepCode"  ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="stepName" label="工步名称：" >
            <el-input v-model="model.stepName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="operationNumber" label="操作项序号：" >
            <el-input v-model="model.operationNumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="operationCode" label="操作项编码：" >
            <el-input v-model="model.operationCode"  ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="operationName" label="操作项名称：" >
            <el-input v-model="model.operationName"  ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="operationDescription" label="操作项描述：" >
            <el-input v-model="model.operationDescription"  ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="operationType" label="操作项类型：" >
            <xui-dict-select class="w-100percent" item-code="propertyType"
                             v-model="model.operationType"
            ></xui-dict-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" >
          <el-form-item prop="dictionaryCode"  label="字典编码">
            <el-input v-model="model.operationType"  ></el-input>

            <el-button type="primary" @click="created">选择</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="lowerLimit" label="上限：" >
            <el-input v-model="model.upperLimit"  ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="upperLimit" label="下限：" >
            <el-input v-model="model.lowerLimit"  ></el-input>
          </el-form-item>
        </el-col>
          <el-col :span="12">
            <el-form-item prop="correctValue" label="正确值：" >
              <xui-dict-select v-if="model.operationType === 'singleSelect' || model.operationType === 'inputSelect'" class="w-100percent"
                               :item-code="model.dictionaryCode" size="mini"
                               v-model="model.correctValue" clearable></xui-dict-select>
              <el-input v-else v-model="model.correctValue"></el-input>
            </el-form-item>
          </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="maximumContentLength" label="内容最大长度：">
            <el-input v-model="model.maximumContentLength"  ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="dataUnit" label="数据单位：" >
            <el-input v-model="model.dataUnit " ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="requireImageFile" label="是否需要上传图片/文件：" >
            <xui-dict-select class="w-100percent" item-code="yn"
                             v-model="model.requireImageFile"
            ></xui-dict-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="isMultiline" label="是否多行：" >
            <xui-dict-select class="w-100percent" item-code="yn"
                             v-model="model.isMultiline"
            ></xui-dict-select>
          </el-form-item>
        </el-col>
      </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="isRequired" label="是否必填：" >
              <xui-dict-select class="w-100percent" item-code="yn"
                               v-model="model.isRequire"
              ></xui-dict-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">

              <el-form-item prop="relyPropertyId" class="formItemSelectBtn" label="依赖操作项">
                <el-select v-model="model.relyPropertyId" placeholder="请选择" class="w-100percent" @change="relationPropertyChange" clearable>
                  <el-option v-for="x in propertyList" :key="x.id" :label="x.allName" :value="x.id" />
                </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="dependentOperationOption" label="依赖操作项选项：" >
            <xui-dict-select class="w-100percent" item-code="yn"
                             v-model="model.dependentOperationOption"
            ></xui-dict-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="executionFrequency" label="执行频次：" >
            <el-input v-model="model.executionFrequency"  ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="eligibilityCriteria" label="合格标准：" >
            <el-input v-model="model.eligibilityCriteria"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="reviewTimeLimit" label="复核时效：" >
            <el-input v-model="model.reviewTimeLimit"  ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <div slot="footer">
      <el-button  @click="dialogVisible=false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </div>

  </el-dialog>
</template>

<script>
import Constants from "@/utils/constants";
import {getWorkContent, saveWorkContent} from "@/api/plan";
import {getDictListByKey} from "@/components/xui/dictionary";
import XuiDictSelect from "@/components/xui/select/dict-select";


export default {
  name: 'checkItemFromDialog',
  components: {XuiDictSelect},
  data() {
    return {
      initModel: {
        itemId: '',
        stepCode:'',
        stepName:'',
        operationNumber:'',
        operationCode:'',
        operationDescription:'',
        operationType:'',
        operationName:'',
        dictionaryCode:'',
        lowerLimit:'',
        upperLimit:'',
        correctValue:'',
        dataUnit:'',
        maximumContentLength:'',
        requireImageFile:'',
        isMultiline:'',
        isRequire:'',
        dependentOperation:'',
        dependentOperationOption:'',
        executionFrequency:'',
        eligibilityCriteria:'',
        reviewTimeLimit:'',
      },
      model: {},
      propertyList: [],
      tableData:[],
      relyPropertyId:'',
      relyPropertyDictCode:'',
      dialogVisible: false,
      rules: {
        operationName: [{
          required: true, message: '不能为空', trigger: 'blur'
        }],
        dataUnit: [{
          required: true, message: '不能为空', trigger: 'blur'
        }],
        requireImageFile: [{
          required: true, message: '不能为空', trigger: 'blur'
        }],
        isMultiline: [{
          required: true, message: '不能为空', trigger: 'blur'
        }],
      }
    }
  },


  methods: {
    init(obj) {
      if (obj === null || obj === undefined) {
        //是新增
        this.model = {
          ...this.initModel
        }
      } else {
        this.model = {
          ...this.initModel,
          ...obj
        }
      }
      this.$refs.form && this.$refs.form.clearValidate();
      this.dialogVisible = true
    },
    created() {

      let dataList = getDictListByKey(this.itemCode)
      if (this.includeAll && !this.multiple) {
        dataList = [{
          code: this.allValue,
          name: '全部'
        }].concat(dataList)
      }
      this.dictDataList = dataList
    },

    relationPropertyChange(selectedId){
      let selectedItem = this.propertyList.find(item=>{
        return item.id === selectedId;
      })
      if(selectedItem){
        this.relyPropertyDictCode = selectedItem.dictionaryCode;
      }
    },
    handleSelectSuccess(row){
      this.model.dictionaryCode = row.code;
      this.model.correctValue = '';
    },
    handleSelectDict(){
      this.$refs.dictListDialogRef && this.$refs.dictListDialogRef.init();
    },
    handleSubmit(){
      this.$refs.form.validate(val=>{
        if(!val){
          return;
        }
        saveWorkContent(this.model).then(resoponse=>{
          if(resoponse.err_code === Constants.statusCode.success){
            this.$message.success("数据保存成功");
            this.dialogVisible = false;
            this.$emit('refresh', {})
          }else{
            this.$message.error(resoponse.err_msg);
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
