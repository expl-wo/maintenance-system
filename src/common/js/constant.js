let basePath = ''
if (!window.location.origin) {
    basePath = window.location.protocol + '//' + window.location.host + '/'
} else {
    basePath = window.location.origin + '/'
}
export default {
    // 基础路径
    basePath,
    // 系统版本号
    version: '1.0.0'
}