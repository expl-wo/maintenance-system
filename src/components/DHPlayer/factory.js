// import Vue from 'vue'
// let vue = new Vue()
import request from '@/utils/request'
let vue = {
    //透传给大华ICC
    resetAjax: (targetObj) => {
        request({
            url: '/api/evo-ims-link/icc/video-dh-player',
            method: 'post',
            data: { uri: targetObj.url, param: targetObj.data }
        }).then(res => {
            targetObj.onSuccess(res.data)
        }).catch((err) => {
            targetObj.onError(err)
        })
    }
}
// vue.resetAjax() {
//     // 此处要改为三方的请求方式, 修改为第三方的调用逻辑。 
//     // 注意，以下所有接口需要三方接口做转发，【即接收请求，并完全返回 ICC 参数即可】
//     // 后端需要接口鉴权。
// }

export default {
    /**
     * @method fetchRealRtsp 获取实时视频RTSP地址
     * @returns 固定为 new Promise 的格式, 不可删除 return new Promise
     * @resolve 结构如下
     * 
     * {
     *      url: "rtsp://...."
     *      token: 12,
     *      ...
     * }
     */
    fetchRealRtsp(param) {
        return new Promise((resolve, reject) => {
            vue.resetAjax({
                method: 'post',
                url: `admin/API/MTS/Video/StartVideo`,
                data: param,
                onSuccess(res) {
                    resolve(res.data.data)
                },
                onError(res) {
                    reject(res)
                }
            })
        })
    },
    /**
     * @method fetchTalkRTSP 获取对讲的RTSP地址
     * @returns 固定为 new Promise 的格式, 不可删除 return new Promise
     * @resolve 结构如下
     * 
     *  {
     *      url: "rtsp://...."
     *      token: 12,
     *      ...
     *  }
     */
    fetchTalkRtsp(param) {
        return new Promise((resolve, reject) => {
            vue.resetAjax({
                method: 'post',
                url: 'admin/API/MTS/Audio/StartTalk',
                data: param,
                onSuccess(res) {
                    resolve(res.data.data)
                },
                onError(res) {
                    reject(res)
                }
            })
        })
    },

    /**
     * @method stopTalk 停止对讲
     * @returns 固定为 new Promise 的格式, 不可删除 return new Promise
     */
    stopTalk(param) {
        return new Promise((resolve, reject) => {
            vue.resetAjax({
                method: 'post',
                url: 'admin/API/MTS/Audio/StopTalk',
                data: param,
                onSuccess(res) {
                    resolve(res.data.data)
                },
                onError(res) {
                    reject(res)
                }
            })
        })
    },

    /**
     * @method 查询录像
     * @returns 固定为 new Promise 的格式, 不可删除 return new Promise
     * @resolve 结构如下
     * 
     * {
     *     record: []
     * }
     */
    queryRecord(param) {
        return new Promise((resolve, reject) => {
            vue.resetAjax({
                method: "post",
                url: "admin/API/SS/Record/QueryRecords",
                data: param,
                onSuccess(res) {
                    resolve(res.data.data)
                },
                onError(res) {
                    reject(res)
                }
            })
        })
    },
    /**
     * 获取录像回放
     * @returns 固定为 new Promise 的格式, 不可删除 return new Promise
     * @resolve 结构如下
     * 
     * resolve({
     *      url: "rtsp://...."
     *      token: 12,
     *      ...
     * })
     */
    fetchPlaybackByTime(param) {
        return new Promise((resolve, reject) => {
            vue.resetAjax({
                method: 'post',
                url: 'admin/API/SS/Playback/StartPlaybackByTime',
                data: param,
                onSuccess(res) {
                    resolve(res.data.data)
                },
                onError(res) {
                    reject(res)
                }
            })
        })
    },

    /**
     * @method param
     * @returns 固定为 new Promise 的格式, 不可删除 return new Promise
     * @resolve 结构如下
     * 
     * resolve({
     *      url: "rtsp://...."
     *      token: 12,
     *      ...
     * })
     */
    fetchPlaybackByFile(param) {
        return new Promise((resolve, reject) => {
            vue.resetAjax({
                method: 'post',
                url: 'admin/API/SS/Playback/StartPlaybackByFile',
                data: param,
                onSuccess(res) {
                    resolve(res.data.data)
                },
                onError(res) {
                    reject(res)
                }
            })
        })
    },

    /**
   * 云台方向控制
   * @param param
   * @returns {Promise<unknown>}
   */
    setPtzDirection(param) {
        return new Promise((resolve, reject) => {
            vue.resetAjax({
                method: 'post',
                url: 'admin/API/DMS/Ptz/OperateDirect',
                data: param,
                onSuccess(res) {
                    resolve(res.data)
                },
                onError(res) {
                    reject(res)
                }
            })
        })
    },
    /**
     * 云台镜头控制
     * @param param
     * @returns {Promise<unknown>}
     */
    setPtzCamera(param) {
        return new Promise((resolve, reject) => {
            vue.resetAjax({
                method: 'post',
                url: 'admin/API/DMS/Ptz/OperateCamera',
                data: param,
                onSuccess(res) {
                    resolve(res.data)
                },
                onError(res) {
                    reject(res)
                }
            })
        })
    },
}