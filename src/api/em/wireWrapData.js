/**
 * Created by fp
 */
import request from '@/utils/request'

const url = {
  //获取设备状态 	get
  getDeviceStatus: '/wireWrapData/getDeviceStatus',

  //获取设备统计数据 get
  getStatisticData: '/wireWrapData/getStatisticData',
}

export default {
  url: url,
  getDeviceStatus(params) {
    return request({
      url: url.getDeviceStatus,
      method: 'get',
      params
    })
  },
  getStatisticData(params) {
    return request({
      url: url.getStatisticData,
      method: 'get',
      params
    })
  },

}
