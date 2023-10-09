import { getToken } from '@/utils/auth'
/**
 * 同步请求
 * Created by fp on 2018/10/18.
 */
function urlEncode(param, key, encode) {
  if (param === null) {
    return ''
  }
  let paramStr = ''
  const t = typeof param
  if (t === 'number' || t === 'string' || t === 'boolean') {
    paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param)
  } else {
    for (const i in param) {
      const k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
      paramStr += urlEncode(param[i], k, encode)
    }
  }
  return paramStr
}

function encodeFormData(data) {
  if (!data) return ''
  var pairs = []
  for (var name in data) {
    if (!data.hasOwnProperty.call(name)) continue
    if (typeof data[name] === 'function') continue
    var value = data[name].toString()
    name = encodeURIComponent(name.replace('%20', '+'))
    value = encodeURIComponent(value.replace('%20', '+'))
    pairs.push(name + '=' + value)
  }
  return pairs.join('&')
}

function adornUrl(url) {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return  process.env.VUE_APP_BASE_API + url
}

export const syncAjax = function (params) {
  //解决数据字典同步请求的问题，不需要引入jquery，减少打包的体积
  let xhr = null
  params.type = params.type ? params.type : 'get'
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest()
  } else {
    xhr = new ActiveXObject('Microsoft.XMLHTTP')
  }
  xhr.withCredentials = true
  params.data = params.data || {}
  let url = params.url
  if (!params.notAdornUrl) {
    url = adornUrl(url)
  }
  xhr.onreadystatechange = function () {
    if (parseInt(xhr.readyState) == 4) {
      const responseText = xhr.responseText
      try {
        const result = eval('(' + responseText + ')')
        if (params.success && params.success instanceof Function) {
          params.success(result)
        }
      } catch (reason) {
        let itemCode = ''
        if (params.data && params.data.itemCode) {
          itemCode = params.data.itemCode
        }
        params.success({
          result: {}
        })
      }
    }
  }
  let token = getToken()
  if (params.type.toLowerCase() === 'get') {
    const encode = urlEncode(params.data)
    if (encode !== '') {
      url += '?' + encode.substr(1)
    }
    //2.打开与服务器的链接
    xhr.open('get', url, false)
    if (token) {
      xhr.setRequestHeader('token', token.toString())
    }
    //3.发送给服务器
    xhr.send(null)
  } else {
    let data = JSON.stringify(params.data)
    xhr.open('post', url, false)
    xhr.setRequestHeader('Content-Type', 'application/json')
    if (token) {
      xhr.setRequestHeader('Authorization', token.toString())
    }
    xhr.send(data)
  }
}
