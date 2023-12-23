<template>
  <el-dialog draggable destroy-on-close appendToBody :title="model.id? '编辑': '新增'" width="1200px" v-model="dialogVisible" modal>
    <el-form :model="model" ref="form" :rules="rules" label-width="140px" >

      <el-row>
        <el-col :span="12">
          <el-form-item prop="stepCode" label="工步编码：" >
            <el-input v-model="model.stepCode"  disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="stepName" label="工步名称：" >
            <el-input v-model="model.stepName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item prop="operationNumber" label="操作项序号：" >
            <el-input v-model="model.operationNumber"  type="number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="operationCode" label="操作项编码：" >
            <el-input v-model="model.operationCode"  ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item prop="operationName" label="操作项名称：" >
            <el-input v-model="model.operationName"  ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="operationDescription" label="操作项描述：" >
            <el-input v-model="model.operationDescription" type="textarea" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item prop="operationType" label="操作项类型：" >
            <xui-dict-select class="width100Percent" item-code="WorkContentType"
                             v-model="model.operationType"
            ></xui-dict-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="isRequired" label="是否必填：" >
            <xui-dict-select class="width100Percent" item-code="yn"
                             v-model="model.isRequired"
            ></xui-dict-select>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row>
        <el-col :span="10" v-if="model.operationType === '3' || model.operationType === '4'">
          <el-form-item prop="dictionaryCode"  label="选项名称">
            <el-input readonly v-model="dictName" ></el-input>
          </el-form-item>

        </el-col>
        <el-col :span="2" v-if="model.operationType === '3' || model.operationType === '4'">
          <el-button style="margin-left: 10px" type="primary" @click="selectItem">选择</el-button>
        </el-col>
        <el-col :span="12" v-if="model.operationType !== '3' && model.operationType !== '4'" >
          <el-form-item prop="maximumContentLength" label="内容最大长度：">
            <el-input v-model="model.maximumContentLength"  ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="correctValue" label="正确值：" >
            <xui-dict-select v-if="model.operationType === '3' || model.operationType === '4'"
                             class="width100Percent"

                             :item-code="model.dictionaryCode" size="small"
                             v-model="model.correctValue" clearable>
            </xui-dict-select>
            <el-input v-else v-model="model.correctValue" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row >
        <el-col :span="12">
          <el-form-item prop="lowerLimit" label="上限：" >
            <el-input v-model="model.upperLimit"  ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="upperLimit" label="下限：" >
            <el-input v-model="model.lowerLimit"  ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item prop="dataUnit" label="数据单位：">
            <el-input v-model="model.dataUnit " ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="isMultiline" label="是否多行：" >
            <xui-dict-select class="width100Percent" item-code="yn"
                             v-model="model.isMultiline"
            ></xui-dict-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="requireImageFile" label="是否上传图片/文件：" >
            <xui-dict-select class="width100Percent" item-code="yn"
                             v-model="model.requireImageFile"
            ></xui-dict-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="executionFrequency" label="执行频次：" >
            <xui-dict-select class="width100Percent" item-code="OperationTimeline"
                             v-model="model.executionFrequency"
            ></xui-dict-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="eligibilityCriteria" label="合格标准：" >
            <el-input v-model="model.eligibilityCriteria" type="textarea" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="reviewTimeLimit" label="复核时效：" >
            <el-input v-model="model.reviewTimeLimit"  ></el-input>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item prop="relyPropertyId" label="依赖操作项">
            <el-select v-model="model.dependentOperation" placeholder="请选择" class="width100Percent" @change="relationPropertyChange" clearable>
              <el-option v-for="x in propertyList" :key="x.id" :label="x.allName" :value="x.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="dependentOperationOption" label="依赖操作项选项：" >
            <xui-dict-select class="width100Percent" :item-code="relyPropertyDictCode"
                             v-model="model.dependentOperationOption"
            ></xui-dict-select>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <div >
      <el-button  @click="dialogVisible=false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </div>
    <dict-list-dialog ref="dictListDialogRef" @select="handleSelectSuccess"></dict-list-dialog>
  </el-dialog>
</template>

<script>
import {getDictNameByItemCode} from '@/components/xui/dictionary/index'
import Constants from "@/utils/constants";
import {getWorkContent, saveWorkContent} from "@/api/plan";
import dictListDialog from "@/views/system/dict/dictListDialog.vue";
import XuiDictSelect from "@/components/xui/select/dict-select";
export default {
  name: 'checkItemFromDialog',
  components:{
    XuiDictSelect,
    dictListDialog
  },
  data() {
    return {
      initModel: {
        itemId: '',
        stepId:'',
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
        maximumContentLength:0,
        requireImageFile:'',
        isMultiline:'',
        isRequired:'',
        dependentOperation:'',
        dependentOperationOption:'',
        executionFrequency:'',
        eligibilityCriteria:'',
        reviewTimeLimit:'',
      },

      model: {},
      propertyList: [],
      tableData:[],
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
        executionFrequency: [{
          required: true, message: '不能为空', trigger: 'blur'
        }],
      }
    }
  },
  computed: {
    dictName(){
      let dictCode = this.model.dictionaryCode;
      if(Constants.isNotEmpty(dictCode)){
        let value = getDictNameByItemCode(dictCode);
        return value;
      }else{
        return ''
      }
    }
  },

  methods: {
    init(data,item,obj) {
      this.relyPropertyDictCode = ''
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
      this.propertyList = item.filter( i => i.id !== data.id)
      if (data){
        this.model.stepId   = data.id
        this.model.stepCode = data.craftsDeCode
        this.model.stepName = data.craftsDeName
      }
      this.$nextTick( ()=>{
        this.$refs.form && this.$refs.form.clearValidate();
      })
      this.dialogVisible = true
    },
    selectItem(){
      this.$nextTick( ()=>{
        this.$refs.dictListDialogRef &&this.$refs.dictListDialogRef.init();
      })
    },

    relationPropertyChange(selectedId){
      this.model.dependentOperationOption = ''
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
      this.$nextTick( ()=>{
        this.$refs.dictListDialogRef && this.$refs.dictListDialogRef.init();
      })
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
