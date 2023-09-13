<template>
  <el-dialog draggable :close-on-click-modal="false" :title="title" v-if="dialogFormVisible"
             v-model="dialogFormVisible" class="roleDialog">
    <el-form ref="formRef" label-width="120px" :model="model" :rules="submitRules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="权限类型:" prop="pType">
            <xui-dict-select item-code="permissionType" v-model="model.pType"></xui-dict-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="父菜单名称:" prop="fId">
            <el-tree-select v-model="model.fId" :data="treeList" style="width: 100%;" check-strictly
                            :render-after-expand="false"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称:" prop="pName">
            <el-input v-model="model.pName" placeholder="权限名称" class="filter-item"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="编号:" prop="pCode">
            <el-input v-model="model.pCode" placeholder="权限编号" class="filter-item"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="排序号: " prop="showOrder">
            <el-input-number v-model="model.showOrder" style="width: 100%" placeholder="排序号"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否可用:" prop="pEnabled">
            <xui-dict-select item-code="yn" v-model="model.pEnabled"></xui-dict-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="model.pType == 'menu'">
        <el-col :span="12">
          <el-form-item label="图标:" prop="iconName">
            <div class="xui-choose-comb__input xui-border">
              <el-icon :size="18" style="display: flex">
                <component :is="model.iconName"/>
              </el-icon>
            </div>
            <el-button type="primary" class="xui-choose-comb__btn"
                       @click="handleSelectIcon">选择
            </el-button>
            <icon-select-dialog @select="handleSelect" ref="iconSelectDialogRef"></icon-select-dialog>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="路径:" prop="pUrl">
            <el-input v-model="model.pUrl" placeholder="路径" class="filter-item"
            />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveData">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import Constants from '@/_public/utils/constants'
import {insertPermissionInfo} from "@/sys/api/permission";
import {deepClone} from "@/_public/utils";
import iconSelectDialog from './iconSelectDialog.vue'


export default {
  name: "addOrUpdateDialog",
  props: {
    treeList: Array
  },
  components: {
    iconSelectDialog
  },
  data() {
    return {
      title: '',
      dialogFormVisible: false,
      initModel: {},
      model: {},
      departmentTree: [],
      submitRules: {
        fId: [{required: true, trigger: 'change', message: '该项为必填项'}],
        pName: [{required: true, trigger: 'blur', message: '该项为必填项'}],
        pCode: [{required: true, trigger: 'blur', message: '该项为必填项'}],
        pType: [{required: true, trigger: 'change', message: '该项为必填项'}],
        pEnabled: [{required: true, trigger: 'change', message: '该项为必填项'}],
        showOrder: [{required: true, trigger: 'blur', message: '该项为必填项'}],
        pUrl: [{required: true, trigger: 'blur', message: '该项为必填项'}],
        iconName: [{required: true, trigger: 'blur', message: '该项为必填项'}],
      },
    }
  },
  methods: {
    handleSelect(iconName) {
      this.model.iconName = iconName;
    },
    initEdit(selectData) {
      this.initModel = {
        // eslint-disable-next-line no-mixed-spaces-and-tabs
        id: '',
        pName: '',
        pCode: '',
        pType: '',
        pUrl: '',
        viewPath: '',
        pMethod: '',
        iconName: '',
        fId: '',
        pEnabled: Constants.flag.y,
        showOrder: '',
      }
      if (selectData !== null) {
        Object.assign(this.initModel, selectData);
        delete this.initModel.sub;
        delete this.initModel.children;
      }
      this.model = {
        ...this.initModel
      }
      this.title = '权限编辑';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate();
      })
    },

    handleSelectIcon() {
      this.$refs.iconSelectDialogRef?.init();
    },

    init() {
      this.initModel = {
        id: '',
        pName: '',
        pCode: '',
        pType: '',
        pUrl: '',
        viewPath: '',
        pMethod: '',
        iconName: '',
        fId: 'root',
        pEnabled: '',
        showOrder: '',
      }
      this.model = {
        ...this.initModel
      }
      this.title = '权限新增';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate();
      })
    },

    initSub(selectData) {
      this.initModel = {
        id: '',
        pName: '',
        pCode: '',
        pType: '',
        pUrl: '',
        viewPath: '',
        pMethod: '',
        iconName: '',
        fId: '',
        pEnabled: '',
        showOrder: '',
      }
      this.initModel.fId = selectData.id;
      this.model = {
        ...this.initModel
      }
      this.title = '权限新增';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate();
      })
    },

    saveData() {
      this.$refs.formRef.validate(valid => {
        if (!valid) {
          return;
        }
        const params = deepClone(this.model);
        //一级资源菜单fId设置为空
        params.fId = params.fId === 'root' ? '' : params.fId;
        insertPermissionInfo(params).then(response => {
          if (response.code == Constants.respCode.success) {
            this.$message.success('保存/修改成功');
            this.dialogFormVisible = false;
            this.$emit('refresh', {});
          } else {
            this.$message.error(response.msg);
          }
        })
      })
    },
  }
}
</script>

<style scoped>

</style>
