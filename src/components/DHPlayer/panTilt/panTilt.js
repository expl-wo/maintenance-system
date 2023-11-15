/**
 * 云台功能
 */
 class PanTilt{
    constructor(options = {}) {
        // 云台节点
        this.el = options.el;
        // 云台元素
        this.$el = document.querySelector('#' + this.el)
        if(this.$el) {
            this.__createPanTilt();
        }
        // 选中的窗口的正在播放的通道
        this.channel = null;
        // 相关的请求接口方法
        // 云台方向控制接口
        this.setPtzDirection = options.setPtzDirection;
        // 云台镜头控制接口
        this.setPtzCamera = options.setPtzCamera;
        this.clickDirectFlag = false;
        this.setPtzDirectionPromiseList = [];
        this.setPtzDirectionRun = false;
        this.setPtzCameraPromiseList = [];
        this.setPtzCameraRun = false
    }

    /**
     * 设置通道
     * @param channel
     */
    setChannel(channel) {
        this.channel = channel;
        if(!channel) {
            // 通道不存在，则禁用云台
            document.querySelector(`#${this.el} .ws-pan-tilt-mask`).style.display = 'block'
            return;
        }
        let capability = channel.capability;
        switch(String(channel.cameraType)) {
            case "1": // 枪机通道
                // 枪机通道能力集有电动聚焦或者云台控制时，开放变倍、变焦
                if(parseInt(capability, 2) & parseInt("100", 2)
                    || parseInt(capability, 2) & parseInt("10000000000000000", 2)
                ) {
                    document.querySelector(`#${this.el} .ws-pan-tilt-mask-zoom`).style.display = 'none'
                } else {
                    document.querySelector(`#${this.el} .ws-pan-tilt-mask-zoom`).style.display = 'block'
                }

                // 枪机通道能力集有云台控制时，开放方向控制
                if(parseInt(capability, 2) & parseInt("10000000000000000", 2)) {
                    document.querySelector(`#${this.el} .ws-pan-tilt-mask-direction`).style.display = 'none'
                } else {
                    document.querySelector(`#${this.el} .ws-pan-tilt-mask-direction`).style.display = 'block'
                }
                document.querySelector(`#${this.el} .ws-pan-tilt-mask-aperture`).style.display = 'block'
                break;
            case "2": // 球机通道
                // 球机通道，可以使用云台所有功能
                document.querySelector(`#${this.el} .ws-pan-tilt-mask`).style.display = 'none'
                break;
            default:
                // 默认禁用云台
                document.querySelector(`#${this.el} .ws-pan-tilt-mask`).style.display = 'block'
        }
    }

    __createPanTilt() {
        this.$el.innerHTML = `
            <div class="ws-pan-tilt-control">
                <!--云台方向控制-->
                <div class="ws-pan-tilt-circle">
                    <div class="ws-pan-tilt-direction-item"><img src="${require('./svg/arrow-t.svg')}" title="上" direct="1"/></div>
                    <div class="ws-pan-tilt-direction-item"><img src="${require('./svg/arrow-rt.svg')}" title="右上" direct="7"/></div>
                    <div class="ws-pan-tilt-direction-item"><img src="${require('./svg/arrow-r.svg')}" title="右" direct="4"/></div>
                    <div class="ws-pan-tilt-direction-item"><img src="${require('./svg/arrow-rb.svg')}" title="右下" direct="8"/></div>
                    <div class="ws-pan-tilt-direction-item"><img src="${require('./svg/arrow-b.svg')}" title="下" direct="2"/></div>
                    <div class="ws-pan-tilt-direction-item"><img src="${require('./svg/arrow-lb.svg')}" title="左下" direct="6"/></div>
                    <div class="ws-pan-tilt-direction-item"><img src="${require('./svg/arrow-l.svg')}" title="左" direct="3"/></div>
                    <div class="ws-pan-tilt-direction-item"><img src="${require('./svg/arrow-lt.svg')}" title="左上" direct="5"/></div>
                    <div class="ws-pan-tilt-inner-circle">
                        <div class="three-circle">
                        </div>
                    </div>
                </div>
                
                <!--云台变倍、聚焦、光圈控制-->
                <div class="cloud-control-wrapper">
                    <div class="ws-pan-tilt-control-item"><img src="${require('./svg/ptz-icon1.svg')}" title="变倍-" operateType="1" direct="2"/></div>
                    <div class="ws-pan-tilt-control-item"><img src="${require('./svg/ptz-icon2.svg')}" title="变倍+" operateType="1" direct="1"/></div>
                    <div class="cloud-control-separate"></div>
                    <div class="ws-pan-tilt-control-item"><img src="${require('./svg/ptz-icon3.svg')}" title="聚焦-" operateType="2" direct="2"/></div>
                    <div class="ws-pan-tilt-control-item"><img src="${require('./svg/ptz-icon4.svg')}" title="聚焦+" operateType="2" direct="1"/></div>
                    <div class="cloud-control-separate"></div>
                    <div class="ws-pan-tilt-control-item"><img src="${require('./svg/ptz-icon5.svg')}" title="光圈-" operateType="3" direct="2"/></div>
                    <div class="ws-pan-tilt-control-item"><img src="${require('./svg/ptz-icon6.svg')}" title="光圈+" operateType="3" direct="1"/></div>
                </div>
                
                <!--遮罩，当通道没有云台功能时，使用遮罩遮住云台按钮-->
                <!--方向按钮遮罩-->
                <div class="ws-pan-tilt-mask ws-pan-tilt-mask-direction"></div>
                <!--变倍、聚焦遮罩-->
                <div class="ws-pan-tilt-mask ws-pan-tilt-mask-zoom"></div>
                <!--光圈遮罩-->
                <div class="ws-pan-tilt-mask ws-pan-tilt-mask-aperture"></div>
            </div>
        `
        // 添加监听
        this.addListener()
       
    }

    addListener() {
        try {
            let domList = document.querySelectorAll(`#${this.el} .ws-pan-tilt-direction-item img`)
            domList.forEach(dom => {
                dom.addEventListener('mouseup', (e) => {
                    if(this.clickDirectFlag) {
                        this.clickDirectFlag = false
                        this.__setPtzDirection(e.target.getAttribute("direct"), "0")
                    }
                })
                dom.addEventListener('mousedown', this._throttle((e) => {
                    if(!this.clickDirectFlag) {
                        this.clickDirectFlag = true
                        this.__setPtzDirection(e.target.getAttribute("direct"), "1")
                    }
                }))
                dom.addEventListener('mouseout', this._throttle((e) => {
                    if(this.clickDirectFlag) {
                        this.clickDirectFlag = false
                        this.__setPtzDirection(e.target.getAttribute("direct"), "0")
                    }
                }))
            })
            let domList2 = document.querySelectorAll(`#${this.el} .ws-pan-tilt-control-item img`)
            domList2.forEach(dom => {
                dom.addEventListener('mouseup', (e) => {
                    if(this.clickDirectFlag) {
                        this.clickDirectFlag = false
                        this.__setPtzCamera(e.target.getAttribute("operateType"), e.target.getAttribute("direct"), "0")
                    }
                })
                dom.addEventListener('mousedown', this._throttle((e) => {
                    if(!this.clickDirectFlag) {
                        this.clickDirectFlag = true
                        this.__setPtzCamera(e.target.getAttribute("operateType"), e.target.getAttribute("direct"), "1")
                    }
                }))
                dom.addEventListener('mouseout', this._throttle((e) => {
                    if(this.clickDirectFlag) {
                        this.clickDirectFlag = false
                        this.__setPtzCamera(e.target.getAttribute("operateType"), e.target.getAttribute("direct"), "0")
                    }
                }))
            })
        } catch(err) {
            let timer = setTimeout(() => {
                this.addListener()
                clearTimeout(timer)
            }, 300)
        }
    }

    __setPtzDirection(direct, command) {
        debugger
        // 方向：1=上，2=下，3=左，4=右，5=左上，6=左下，7=右上，8=右下
        const params = {
            project: 'PSDK',
            method: 'DMS.Ptz.OperateDirect',
            data: {
                direct,
                command,
                stepX: '4',
                stepY: '4',
                channelId: this.channel.id
            }
        };
        this.setPtzDirectionPromiseList.push(() => {
            return new Promise((resolve, reject) => {
                this.setPtzDirection && this.setPtzDirection(params).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        })
        if(!this.setPtzDirectionRun) {
            let reqQueue = () => {
                this.setPtzDirectionRun = true
                this.setPtzDirectionPromiseList[0]().then(() => {
                }).catch((err) => {
                    console.error('云台方向控制err:', err);
                }).finally(() => {
                    this.setPtzDirectionPromiseList.shift()
                    if(!this.setPtzDirectionPromiseList.length) {
                        this.setPtzDirectionRun = false
                    } else {
                        reqQueue()
                    }
                })
            }
            reqQueue()
        }
    }

    __setPtzCamera(operateType, direct, command) {
        // operateType 操作类型：1=变倍，2=变焦，3=光圈
        // direct 	方向：1=增加，2=减小
        // command 	命令：0=停止，1=开启
        const params = {
            project: 'PSDK',
            method: 'DMS.Ptz.OperateCamera',
            data: {
                operateType,
                direct,
                command,
                step: '4',
                channelId: this.channel.id
            }
        };


        this.setPtzCameraPromiseList.push(() => {
            return new Promise((resolve, reject) => {
                this.setPtzCamera && this.setPtzCamera(params).then(() => {
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        })
        if(!this.setPtzCameraRun) {
            let reqQueue = () => {
                this.setPtzCameraRun = true
                this.setPtzCameraPromiseList[0]().then(() => {
                }).catch((err) => {
                    console.error('云台方向控制err:', err);
                }).finally(() => {
                    this.setPtzCameraPromiseList.shift()
                    if(!this.setPtzCameraPromiseList.length) {
                        this.setPtzCameraRun = false
                    } else {
                        reqQueue()
                    }
                })
            }
            reqQueue()
        }
    }

    _throttle(func, delay) {  
        let lastCall = 0;  
        return function(...args) {  
          const now = new Date().getTime();  
          if (now - lastCall < delay) {  
            return;  
          }  
          lastCall = now;  
          return func.apply(this, args);  
        }  
      }
}

export default PanTilt
