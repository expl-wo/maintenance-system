/**
 * Created by fp on 2018/9/30.
 */
import validation from "./validation";
const validationFunc = {};
validationFunc.phone = (rule, value, callback) => {
  if (validation.checkNull(value)) {
    callback();
    return false
  }
  if (!validation.checkPhone(value) && validation.checkTel(value)) {
    callback(new Error('格式错误,请输入号码'));
    return false
  }
  callback();
};

validationFunc.mobilePhone = (rule, value, callback) => {
  if (validation.checkNull(value)) {
    callback();
    return false
  }
  if (!validation.checkPhone(value)) {
    callback(new Error('格式错误,请输入11位手机号码'));
    return false
  }
  callback();
};

validationFunc.fixPhone = (rule, value, callback) => {
  if (validation.checkNull(value)) {
    callback();
    return false
  }
  if (!validation.checkTel(value)) {
    callback(new Error('格式错误'));
    return false
  }
  callback();
};

validationFunc.email = (rule, value, callback) => {
  if (validation.checkNull(value)) {
    callback();
    return false
  }
  if (!validation.checkEmail(value)) {
    callback(new Error('邮箱格式错误'));
    return false
  }
  callback();
};

validationFunc.checkNonnegative = (rule, value, callback) => {
  if (validation.checkNull(value)) {
    callback();
    return false
  }
  if (!validation.checkNonnegative(value)) {
    callback(new Error('请输入非负数'));
    return false
  }
  callback();
};

validationFunc.checkNeedSelect = (rule, value, callback) => {
  if (validation.checkNull(value)) {
    callback(new Error('请进行选择'));
    return false
  }
  callback();
};
validationFunc.checkInteger = (rule, value, callback) => {
  const REG_INTEGER = /^-?(([1-9]\d*)|0)$/;
  if (value == null || value == undefined || value == '') {
    callback();
    return false
  }
  if (!REG_INTEGER.exec(value)) {
    callback(new Error('请输入非负整数'));
    return false
  }
  callback();
  ;
};


validationFunc.notEmptyArray = (rule, value, callback) => {
  if (value == null || value == undefined || value == '' || value.length === 0) {
    callback();
    return false
  }
  callback();
  ;
};


validationFunc.regPassword = (rule, value, callback) => {
  /* let reg = /^(?=.*[a-zA-Z])(?=.*[1-9])(?=.*[\W]).{8,}$/;
   if (!reg.test(value)) {
   callback(new Error('必须包含字母，数字，特殊符号，长度不得少于8位'));
   return false
   }*/
  callback();
};


validationFunc.regNumberChar = (rule, value, callback) => {
  if (!validation.checkSpellNumberChar(value)) {
    callback(new Error('只能输入数字与英文字符'));
    return false
  }
  callback();
};

export default validationFunc;
