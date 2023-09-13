<template>
  <el-dialog draggable :title="title"
             v-model="dialogVisible"
             width="600px"
             append-to-body
             :close-on-click-modal="false"
  >
    <el-form :model="form" :rules="rules" ref="formRef" labelWidth="90px">
      <el-form-item
          label="用户名"
          prop="userNumber"
      >
        <el-input v-model.trim="form.userNumber" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
          label="密码"
          prop="password"
      >
        <el-input
            type="password"
            v-model.trim="form.password"
            autocomplete="new-password"
        ></el-input>
      </el-form-item>
      <el-form-item
          label="确认密码"
          prop="confirmPassword"
      >
        <el-input
            type="password"
            v-model.trim="form.confirmPassword"
            autocomplete="new-password"
        ></el-input>
      </el-form-item>
      <el-form-item
          label="员工姓名"

          prop="username"
      >
        <el-input v-model.trim="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
          label="工牌二维码"

          prop="workcard"
      >
        <el-input v-model.trim="form.workcard" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio v-model="form.sex" label="1">男</el-radio>
        <el-radio v-model="form.sex" label="0">女</el-radio>
      </el-form-item>
      <el-form-item label="电话号码" prop="telephone">
        <el-input v-model.trim="form.telephone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
          label="邮箱地址"

          prop="email"
      >
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="departmentNumber">
        <el-select
            style="width:100%;"
            v-model="form.departmentNumber"
            placeholder="请选择部门名称"
        >
          <el-option
              v-for="item in organization"
              :key="item.departmentId"
              :label="item.name"
              :value="item.departmentNumber"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色" prop="newrolelist">
        <el-select
            style="width:100%;"
            v-model="form.newrolelist"
            multiple
            placeholder="请选择角色名称">
          <el-option
              v-for="role in roleList"
              :key="role.roleId"
              :label="role.roleDescription"
              :value="role.roleNumber"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel()">取消</el-button>
        <el-button v-if="isNewModel" type="primary" @click="addUser"
        >保存
        </el-button>
        <el-button v-else type="primary" @click="editUser"
        >保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {ElMessage} from 'element-plus'
import {defineComponent, reactive, ref, defineExpose} from "vue";
import {
  getOrganizationList,
  getRoleList,
  getUserAdd,
  getUserDetail,
  getUserUpdate,
} from "@/sys/api/user";
import {deepClone} from "@/_public/utils";
import Constants from '@/_public/utils/constants'
import validationFunc from "@/_public/utils/validationFunc";

const emit = defineEmits(["refresh"]);
defineExpose({init})

const dialogVisible = ref(false);

const title = ref('')

function cancel() {
  dialogVisible.value = false;
}

//获取部门列表
const organization = ref([]);
getOrganizationList().then(response => {
  organization.value = response.data;
})
//获取角色列表
const roleList = ref([]);
getRoleList().then(response => {
  roleList.value = response.data;
})

const isNewModel = ref(true);
//表单对象
const formRef = ref();
//校验

const initForm = {
  userNumber: "",
  password: "",
  confirmPassword: "",
  username: "",
  workcard: "",
  departmentNumber: "",
  groupVOS: [],//组的数据
  rolelist: [],
  telephone: "",
  email: "",
  sex: "1", //性别选择
  newrolelist: [],
  newGroupList: []
};
const form: any = reactive(deepClone(initForm));

function validatePass2(rule, value, callback) {
  if (value === '') {
    callback(new Error('请再次输入密码!'))
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致!'))
  } else if (value.length < 8) {
    callback(new Error('密码不少于8位!'))
  } else {
    callback()
  }
}

const rules = reactive({
  userNumber: [
    {required: true, message: "请输用户名!", trigger: "blur"},
    {pattern: /^[A-Za-z0-9]+$/, message: "只能输入字母和数字组合!"},
  ],
  password: [{required: true, message: "请输入密码!", trigger: "blur"}],
  confirmPassword: [{required: true, validator: validatePass2, trigger: 'blur'}],
  username: [
    {required: true, message: "请输入员工姓名!", trigger: "blur"},
  ],
  telephone: [
    {validator: validationFunc.phone, trigger: 'blur'},
  ],
  email: [
    {type: "email", message: "请输入正确的邮箱地址!", trigger: "blur"},
  ],
  departmentNumber: [
    {required: true, message: "请选择部门!", trigger: 'change'},
  ],
  newrolelist: [
    {required: true, message: "请选择角色!", trigger: 'change'},
  ],
});

//初始化数据
async function init(params) {
  if (!params) {
    title.value = '新增用户';
    isNewModel.value = true;
    dialogVisible.value = true;
  } else {
    isNewModel.value = false;
    dialogVisible.value = true;
    title.value = "编辑用户";
    const userDetail = await getUserDetail(params.userNumber);
    Object.assign(form, userDetail.data);
    const {roleVOList} = userDetail.data;
    let showRolelist = [];
    roleVOList.forEach((element) => {
      showRolelist.push(element.roleNumber);
    });
    form.newrolelist = showRolelist;
  }
}

function addUser() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const selectRoleList = roleList.value.filter((item) => {
        for (let i = 0; i < form.newrolelist.length; i++) {
          if (item.roleNumber == form.newrolelist[i]) return true;
        }
        return false;
      });
      form.rolelist = selectRoleList;
      const response = await getUserAdd(form);
      if (response.code === Constants.respCode.success) {
        ElMessage.success("添加用户成功!");
        emit('refresh', {})
        dialogVisible.value = false;
      } else {
        ElMessage.error(response.msg);
      }
    } else {
      return false;
    }
  });
}

//编辑保存
function editUser() {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const selectRoleList = roleList.value.filter((item) => {
        for (let i = 0; i < form.newrolelist.length; i++) {
          if (item.roleNumber == form.newrolelist[i]) return true;
        }
        return false;
      });
      form.rolelist = selectRoleList;
      const updataRes = await getUserUpdate(form);
      if (updataRes.code === Constants.respCode.success) {
        ElMessage.success("编辑用户成功!");
        emit('refresh', {})
        dialogVisible.value = false;
      }
    } else {
      return false;
    }
  });
}
</script>

<style scoped>

</style>