/**
 * Created by fp
 */
import request from '@/utils/request'

const url = {
  //新增 	POST
  addOrUpdate: '/wireWrapTargetValue',
}

export default {
  url: url,
  addOrUpdate(params) {
    return request({
      url: url.addOrUpdate,
      method: 'POST',
      data: params
    })
  },

}
