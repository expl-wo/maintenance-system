<template>
  <div class="login-container">
    <div class="wp hp login-container-mask app-containerC cc animation-scale-up">
      <h1 class="col_white" style="margin:0 0 0.67em 0;">衡变LTC系统</h1>
      <el-form ref="loginFormRef" class="login-form" auto-complete="on"
               label-position="left" :model="model" :rules="rules" @submit.prevent>
        <div class="wp hp loginForm_border">
          <div class="title-container app-containerR cc">
            <img src="@/assets/logo.png" class="sidebar-logo">
          </div>
          <div class="loginTip">请使用综合管理平台账号登录</div>
          <el-form-item prop="username" required>
            <el-input
                ref="username"
                v-model.trim="model.username"
                placeholder="账号"
                name="username"
                type="text"
                prefix-icon="User"
                auto-complete="off"
                @keyup.enter="onLogin"
            />
          </el-form-item>

          <el-button :loading="loading"
                     size="medium"
                     type="primary loginBtn"
                     style="width:100%;"
                     @click.prevent="onLogin">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </div>
      </el-form>
     <!-- <div class="downloadApp">扫描二维码或访问{{ downloadUrl }}下载App</div>
      <div id="mesAppDownload" style="width: 150px;height: 150px;"></div>-->
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, nextTick, reactive, onMounted} from "vue";
import {ElMessage} from 'element-plus'
import {useRoute, useRouter} from "vue-router";
import useUserStore from "@/store/modules/user";
import QRCode from "qrcodejs2";
import md5 from 'js-md5';

export default defineComponent({
  name: "Login",
  setup() {
    const loading = ref(false);
    const downloadUrl = ref('http://slm.tbea-hb.com.cn/d.html');

    const rules = reactive({
      username: [{ required: true, trigger: 'blur', message: '用户名不能为空'}],
    })
    const model = reactive({
      username: '',
      password: ''
    })

    if(process.env.NODE_ENV === "development"){
      model.username = '131952';
      model.password = 'Kingking2100';
    }

    const  loginFormRef = ref();
    const passwordInputRef = ref();

    const router = useRouter();
    const route = useRoute();
    const userStore = useUserStore();

    const onLogin = () => {
      loading.value = true;
      loginFormRef.value.validate(valid=>{
        if(!valid){
          return;
        }
        const req = { username: model.username, password: md5(model.password), type: '0' }
          userStore.loginUserCode(req).then(() => {
            // eslint-disable-next-line no-debugger
            router
                .replace({
                  path: route.query.redirect
                      ? (route.query.redirect as string)
                      : "/ltc",
                })
                .then(() => {
                  loading.value = false;
                });
          }).catch(reason=>{
            ElMessage.error(reason.msg);
            loading.value = false;
          }).finally(()=>{
            loading.value = false;
          });
      })
    };

    const constructQrCode = () => {
      new QRCode(document.getElementById('mesAppDownload'), {
        width: 150,
        height: 150,
        text: downloadUrl.value,
        colorDark: '#0194d9', // 前景色
        colorLight: '#ffffff', // 背景色
        correctLevel: QRCode.CorrectLevel.H// 降低容错级别
      })
    }
    /*onMounted(()=>{
      constructQrCode()
    })*/
    return {
      model,
      loginFormRef,
      rules,
      loading,
      onLogin,
      downloadUrl,
      passwordInputRef,
    };
  },
});
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;
$cursorBlock: #000;


</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  height: 100%;
  width: 100%;
  // background-color: $bg;
  background-image: url('../../assets/gongChang2.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  overflow: hidden;

  // .login-container-mask{
  //   background: rgba(48,63,76,0.15);
  //   background-image: radial-gradient(rgba(255,0,0,0), rgba(41,189,217,0.05), rgba(39,106,206,0.4));
  // }

  .login-form {
    position: relative;
    width:400px;
    max-width: 100%;
    // padding: 160px 35px 0;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    // margin: 160px auto;
    margin-bottom: 50px;
    overflow: hidden;
    .loginForm_border{
      padding: 18px 35px;
      border-radius: 5px;
      // border: 1px solid #94aac2;
      // -webkit-box-shadow: 1px 3px 7px #5f5f5f;
      // box-shadow: 1px 3px 7px #5f5f5f;
      background: #fff;

    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .sidebar-logo{
      width:100%;
    }
    .title {
      font-size: 26px;
      color: #2252a0;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: normal;
    }
    .set-language {
      color: #2252a0;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .logo{
    width:120%;
    height:120%
  }
}
.loginBtn{ background: #1281e5; width:100%;margin-bottom:10px;}

.downloadApp{
  margin-bottom: 10px;
}

.loginTip{
  position: absolute;
  top: 91px;
  font-size: 13px;
}
</style>
