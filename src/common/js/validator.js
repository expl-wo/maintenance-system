import regExps from "./rexp";
//安全基线
const safeLimit = (msg = '', isRequired = true) => {
    return [
        {
            type: 'pattern',
            pattern: regExps.safeLimit,
            message: '不允许输入&<>"\'()/\\',
            trigger: ['blur', 'change']
        },
        {
            required: isRequired,
            message: `${msg}不能为空`,
            trigger: ['change', 'blur']
        }
    ]
}
//必填
const requiredVerify = (msg = '', required = true) => {
    return [
        { required: required, message: `${msg}不能为空`, trigger: ['change', 'blur'] }
    ]
};
export default {
    safeLimit,
    requiredVerify
}
export {
    safeLimit,
    requiredVerify
}
