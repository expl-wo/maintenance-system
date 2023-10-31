/**
 * Created by fp
 */
import request from '@/utils/request'

const url = {
  //查询用户界面列设置 	GET
  my: '/pageset/my',
  //新增或编辑用户列设置	POST
  set: '/pageset/set',
}

export default {
  url: url,
  my(params) {
    return request({
      url: url.my,
      method: 'get',
      params
    })
  },
  set(params) {
    return request({
      url: url.set,
      method: 'post',
      data: params
    })
  }
}
