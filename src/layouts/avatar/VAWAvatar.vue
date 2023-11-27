<template>
  <div class="vaw-avatar-container">
    <!--切换用户-->
    <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" v-if="roleslogin && roleslogin.currRole && roleslogin.currRole.v">
      <div class="avatar-wrapper font_size_10" >
        切换角色-{{roleslogin.currRole.v}}
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown" v-if="roleslogin.roles && roleslogin.roles.length > 0">
        <el-dropdown-item v-for="x in roleslogin.roles" :key="x.id">
          <div @click="switchRoles(x)" :class="{'col_blue': roleslogin.currRole.k == x.id}">{{x.roleName}}</div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown>
      <div class="action-wrapper">
        <span class="nick-name el-dropdown-link">
          <span>{{ userInfo.name }}</span>
          <el-icon>
            <CaretBottomIcon />
          </el-icon>
        </span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <router-link to="/">
            <el-dropdown-item v-if="mssg!=='main'">
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item v-if="builtin==1" @click="dialogRePasswordsisible = true">修改密码</el-dropdown-item>
<!--          <el-dropdown-item :icon="UserIcon" @click="onPersonalCenter"
            >个人中心</el-dropdown-item
          >-->
          <el-dropdown-item :icon="SwitchButton" @click="onLogout"
            >退出登录</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dialog v-dialogDrag  :close-on-click-modal="false"  :append-to-body="true" title="修改密码" v-model="dialogRePasswordsisible" class="roleDialog" >
      <el-form ref="rePasswords" label-position="right" label-width="140px" :rules="submitRules" :model="rePasswords">
        <el-form-item label="旧密码:" prop="name">
          <el-input v-model="rePasswords.oldPwd" placeholder="输入旧密码" style="width: 310px;" show-password class="filter-item" />
        </el-form-item>
        <el-form-item label="新密码:" prop="number">
          <el-input v-model="rePasswords.newPwd" placeholder="输入新密码" style="width: 310px;" show-password class="filter-item" />
        </el-form-item>
        <el-form-item label="重复密码:" prop="number">
          <el-input v-model="rePasswords.reNewPwd" @blur="checkNewPwd" placeholder="再次输入新密码" style="width: 310px;" show-password class="filter-item" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
        <el-button @click="dialogRePasswordsisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePassword">
          保存
        </el-button>
      </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ElMessageBox } from "element-plus";
import { User as UserIcon, SwitchButton } from "@element-plus/icons-vue";
import useUserStore from "@/store/modules/user";
import layoutStore from "../store";
import {getUserInfo, removeToken} from "@/utils/auth";

export default defineComponent({
  name: "VAWAvatar",
  setup() {
    const useStore = useUserStore();
    function onPersonalCenter() {
      (layoutStore as any).onPersonalCenter &&
        (layoutStore as any).onPersonalCenter();
    }
    const userInfo = getUserInfo();

    function onLogout() {
      ElMessageBox({
        title: "提示",
        message: "是否要退出登录？",
        type: "warning",
        confirmButtonText: "退出",
        cancelButtonText: "取消",
        showCancelButton: true,
      }).then(() => {
        removeToken();
        useStore.logout().then(() => {
          (layoutStore as any).onLogout && (layoutStore as any).onLogout();
        });
      });
    }
    return {
      useStore,
      onPersonalCenter,
      onLogout,
      UserIcon,
      SwitchButton,
      userInfo,
      dialogRePasswordsisible:false,
      rePasswords:{
        oldPwd:'',
        newPwd:'',
        reNewPwd:''
      },
      submitRules: {
        oldPwd: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        newPwd: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ],
        reNewPwd: [
          { required: true, trigger: 'change', message: '该项为必填项' }
        ]
      },
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";
:deep(.el-dropdown) {
  color: currentColor !important;
}
.vaw-avatar-container {
  .action-wrapper {
    display: flex;
    align-items: center;
    .avatar {
      width: calc(#{$logoHeight} - 15px);
      height: calc(#{$logoHeight} - 15px);
      display: flex;
      align-items: center;
      border: 1px solid var(--el-color-primary-light-7);
      border-radius: 50%;
      & > img {
        border: 1px solid #f6f6f6;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    }
    .nick-name {
      margin-left: 10px;
      .tip {
        transform: rotate(0);
        transition: transform $transitionTime;
      }
    }
  }
}
.vaw-avatar-container:hover {
  cursor: pointer;
  .nick-name .tip {
    transform: rotate(180deg);
    transition: transform $transitionTime;
  }
}
</style>
