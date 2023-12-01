<template>
  <div class="app-container">
      <el-form ref="model" label-position="right" label-width="90px" :rules="submitRules" :model="model">
        <el-form-item label="异常分类:" prop="cateId" size="mini">
          <el-select v-model="model.cateid"  placeholder="请选择异常分类" filterable @change="queryAbnormal">
            <el-option
              v-for="item in cates"
              :key="item.id"
              :label="item.cateName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="异常项:" prop="abnormalId" size="mini">
          <el-select v-model="model.abnormalId"  placeholder="异常项" filterable @change="queryResponder">
            <el-option
              v-for="item in abnormal"
              :key="item.id"
              :label="item.abnormalName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="响应人:" prop="asResponderId" size="mini">
          <el-select v-model="model.asResponderId"  placeholder="响应人" filterable>
            <el-option
              v-for="item in responder"
              :key="item.id"
              :label="item.name "
              :value="item.id"
              @click.native="changeResponder(item)" >
              <span style="float: left">{{ item.name }}</span>
<!--              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.number }}</span>-->
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产号:" size="mini">
          <el-select
            v-model="model.productNo"
            filterable
            remote
            reserve-keyword
            placeholder="请输入生产号"
            :remote-method="remoteMethod"
            :loading="loading">
            <el-option
              v-for="item in options"
              :key="item.productNoFull"
              :label="item.productNoFull"
              :value="item.productNoFull"
              @click.native="selectProductNo(item)">
            </el-option>
          </el-select>
<!--          <el-input v-model="model.productNo" placeholder="生产号" style="width: 320px;" class="filter-item" size="mini" />-->
        </el-form-item>
        <el-form-item label="型号:" size="mini">
          <el-input v-model="model.productModel" placeholder="型号" disabled style="width: 320px;" class="filter-item" size="mini" />
        </el-form-item>
        <el-form-item label="项目名称:" size="mini">
          <el-input v-model="model.projectName" placeholder="项目名称" disabled style="width: 320px;" class="filter-item" size="mini" />
        </el-form-item>
        <el-form-item label="工序名称:" size="mini">
          <el-select v-model="model.opName"  placeholder="工序名称" filterable @change="queryAbnormal">
            <el-option
              v-for="item in midOps"
              :key="item.id"
              :label="item.opName + (item.opAlias==null?'':'[' +item.opAlias + ']')"
              :value="item.id"
              @click.native="changeMidOp(item)" >
              <span style="float: left">{{ item.opName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.opAlias }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述:" size="mini" prop="remarks">
          <el-input v-model="model.remarks"
                    placeholder="描述"
                    style="width: 320px;"
                    class="filter-item"
                    size="mini"
                    clearable
                    type="textarea"
                    autosize
                    maxlength="300"
                    show-word-limit/>
        </el-form-item>
        <el-form-item label="图片:" size="mini" prop="upload">
          <el-upload
            action="/api/file/upload"
            list-type="picture-card"
            :auto-upload="true"
            :on-success="success"
            :on-remove="remove"
          ref="upload"
          >
          <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="float: left" type="primary" @click="submit" size="mini">保存</el-button>
      </div>
  </div>
</template>

<script>
  import {getAndonConfigCateList, getAllAndonAbnormalList, trigger, getOrder, getMidOp} from '@/api/andonConfig'
  export default{
    data(){
      return{
        tableData:[],
        cates:[],
        abnormal:[],
        responder:[],
        picAddr:[],
        model:{
          cateid:'',
          abnormalId:'',
          asResponderId:'',
          asResponderName:'',
          asResponderTel:'',
          productNo:'',
          productModel:'',
          projectName:'',
          opId:'',
          remarks:'',
          productLineId:'',
          workspaceId:'',
          drawingNo:'',
          picAddr:'',
        },
        // 检验规则
        submitRules: {
          remarks: [
            { required: true, trigger: 'change', message: '该项为必填项' }
          ],
        },
        options:[],
        value: [],
        loading: false,
        midOps:[],
      }
    },
    props:{
      productInfo: {
        type:Object,
        required: false
      },
    },
    mounted(){
      this.model = {
        cateid:'',
        abnormalId:'',
        asResponderId:'',
        asResponderName:'',
        asResponderTel:'',
        productNo:null!==this.productInfo?this.productInfo.productNo:null,
        productModel:null!==this.productInfo?this.productInfo.productModel:null,
        projectName:null!==this.productInfo?this.productInfo.projectName:null,
        opId:null!==this.productInfo?this.productInfo.opPlanId:null,
        opName:null!==this.productInfo?this.productInfo.opName + (this.productInfo.opAlias==null?'':'[' +this.productInfo.opAlias + ']'):null,
        remarks:'',
        productLineId:'',
        workspaceId:'',
        drawingNo:null!==this.productInfo?this.productInfo.drawingNo:null,
        picAddr:'',
      }
      this.queryCate()
      if(this.productInfo != null){
        this.queryMidOp(this.productInfo.orderId)
      }

    },
    methods:{
      // 查询所有异常分类
      queryCate(){
        getAndonConfigCateList().then(res =>{
          this.cates = res.data
          this.model.cateid = this.cates[0].id
          this.queryAbnormal()
        })
      },
      // 根据异常分类查询异常项
      queryAbnormal(){
        getAllAndonAbnormalList({cateId : this.model.cateid}).then(res =>{
          this.abnormal = res.data
          this.model.abnormalId = res.data[0].id
          this.responder = res.data[0].responders
          this.model.asResponderId = this.responder[0].id
          this.model.asResponderName = this.responder[0].name
          this.model.asResponderTel = this.responder[0].number
        })
      },
      // 根据异常项展示响应人
      queryResponder(){
        this.abnormal.forEach(item => {
          if(item.id == this.model.abnormalId){
            this.responder = item.responders
            this.model.asResponderId = this.responder[0].id
            this.model.asResponderName = this.responder[0].name
            this.model.asResponderTel = this.responder[0].number
          }
        })
      },
      // 选择响应人
      changeResponder(item){
        this.model.asResponderId = item.id
        this.model.asResponderName = item.name
        this.model.asResponderTel = item.number
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            getOrder({searchKey: query}).then(res =>{
              this.options = res.data
              console.log(this.options);
            })
          }, 200);
        } else {
          this.options = [];
        }
      },
      selectProductNo(item){
        this.model.projectName = item.projectName
        this.model.productNo = item.productNoFull
        this.model.productModel = item.productModel
        this.queryMidOp(item.id)
      },
      queryMidOp(orderId){
        this.model.opId = ''
        this.model.opName = ''
        getMidOp({orderId : orderId}).then(res=>{
          this.midOps = res.data
          if(this.midOps && this.midOps.length > 0){
            this.model.opId = this.midOps[0].id
            this.model.opName = this.midOps[0].opName + (this.midOps[0].opAlias==null?'':'[' +this.midOps[0].opAlias + ']')
          }
        })
      },
      changeMidOp(item){
        this.model.opId = item.id
        this.model.opName = item.opName + (item.opAlias==null?'':'[' +item.opAlias + ']')
      },
      // 文件上传成功后保存地址
      success(response, file, fileList){
        this.picAddr = []
        fileList.forEach(item=>{
          if(item.response.code == 200){
            this.picAddr.push(item.response.data.filePath)
          }
        })
      },
      // 移除照片
      remove(file, fileList){
        this.picAddr = []
        fileList.forEach(item=>{
          if(item.response.code == 200){
            this.picAddr.push(item.response.data.filePath)
          }
        })
      },
      // 提报安灯
      submit(){
        this.$refs.model.validate((valid) => {
          if(valid){
            const req = {
              triRec:{
                cateid : this.model.cateid,
                abnormalId : this.model.abnormalId,
                affectedCount : 1,
                remarks : this.model.remarks,
                projectName : this.model.projectName,
                productNo : this.model.productNo,
                productModel : this.model.productModel,
                asResponderId : this.model.asResponderId,
                asResponderName : this.model.asResponderName,
                asResponderTel : this.model.asResponderTel,
                opId : this.model.opId
              },
              picAddr:this.picAddr
            }
            trigger(req).then(res=>{
              this.$message({ message: '提报成功', type: 'warning' })
              this.$emit('close') // 触发更新事件，父组件的showDialog会自动更新
            })
          }else {
            this.$message({ message: '请填写必填项', type: 'warning' })
            return false
          }
        })
      }
    }
  }
</script>

<style>

</style>
