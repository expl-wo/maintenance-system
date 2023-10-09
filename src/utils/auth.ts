import Constants from "@/utils/constants";
import Cookies from 'js-cookie'
import {hasDepartPrivilege} from '@/utils/index'

export const TokenKey = 'digital_web_token'
export const UserInfo = 'digital_web_userInfo'
export const roleListKey = 'digital_role_list'
export const LimitZtKey = 'vue_admin_template_limit_zt'

const BtnPrivilege = 'digital_web_btn_privilege'

export function getRoleLimitZt() {
  let lz = Cookies.get(LimitZtKey);
  // @ts-ignore
  return !(null==lz || lz=="null" || lz==0 || lz=='0')
}
//初始化按钮权限数据
//获取按钮权限列表
function getBtnPermission(menuList, retList, departmentNumber){
  menuList.forEach(item=>{
    if(item.type === Constants.menuType.pc && item.authType === Constants.authType.btn && hasDepartPrivilege(item.belongDepart, departmentNumber)){
      retList.push(item.rankNum);
    }
    if(item.rankVOList && item.rankVOList.length > 0){
      getBtnPermission(item.rankVOList, retList, departmentNumber);
    }
  })
}

export function initBtnPermission(menuList, departmentNumber){
  const btnList = [];
  getBtnPermission(menuList, btnList, departmentNumber);
  localStorage.setItem(BtnPrivilege, JSON.stringify(btnList));
}

export function initBtnPri(Vue){
  //检验是否有按钮权限
  Vue.prototype.isAuth = function(key){
    const btnPrivilege = localStorage.getItem(BtnPrivilege);
    try{
      const btnPrivilegeList = JSON.parse(btnPrivilege);
      const index = btnPrivilegeList.indexOf(key);
      return index >= 0;
    }catch (e){
      return false;
    }
  }
}

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}


export function getUserInfo() {
  const userInfo = localStorage.getItem(UserInfo);
  try{
    return JSON.parse(userInfo);
  }catch (e){
    return {}
  }
}

export function setUserInfo(userInfo) {
  const data = JSON.stringify(userInfo);
  return localStorage.setItem(UserInfo, data)
}

export function removeUserInfo() {
  return localStorage.removeItem(UserInfo)
}


export function setRoleList(roleList){
  const data = JSON.stringify(roleList);
  return localStorage.setItem(roleListKey, data)
}

export function getRoleList(){
  const userList = localStorage.getItem(roleListKey);
  try{
    return JSON.parse(userList);
  }catch (e){
    return []
  }
}
