//app.js
const utils = require('./utils/util.js');
const ajax = require('./utils/ajax.js');
const { $Toast } = require('./dist/base/index.js');

App({
  onLaunch: function () {
    //获取系统屏幕高度
    this.getClientHeight()
    this.login()  //调用微信api 实现微信登录流程
    
    // 清除地址缓存
    var storageKey = "location"
    wx.removeStorageSync(storageKey)
    wx.removeStorageSync(storageKey  + 'Error')
    // this.setWatcher(this.globalData, this.watch)
    
  },
  getClientHeight: function() {
    wx.getSystemInfo({    //获取系统屏幕高度，实现滚动view自适应
      success: res => {
        this.globalData.clientHeight = res.windowHeight
      }
    })
  },
  data: {
    interval: "",
    storageDatas: [],
    storageKeys: []
  },
  login: function() {
    // 登录
    var that = this;
    wx.login({
      success: res => {
        wx.request({
          url: ajax.ajaxBaseUrl + 'session',   
          method: 'post',
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (!res.data.status) { 
              that.globalData.session = res.data.data
              that.getUserInfo()
            }
          },
          fail(err) {
            console.log(err)
          }
        })
      }
    })
  },
  getUserInfo: function() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              
              this.saveUserInfoToService()
            }
          })
        }
      }
    })
  },
  globalData: {
    systemUserInfo: null,
    userInfo: null,
    isUsingCar: false,
    nowOrderInfo: null,
    clientHeight: 0,
    session: null
  },
  saveUserInfoToService: function() {
    wx.request({
      url: ajax.ajaxBaseUrl + 'client',
      method: 'post',
      data: {
        nick: this.globalData.userInfo.nickName,
        openId: this.globalData.session.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (!res.data.status) {
          wx.setStorageSync('systemUserInfo', res.data.data)
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  // /**
  //    * 设置监听器
  //    */
  // setWatcher(data, watch) { // 接收传过来的data对象和watch对象
  //   Object.keys(watch).forEach(v => { // 将watch对象内的key遍历
  //     this.observe(data, v, watch[v]); // 监听data内的v属性，传入watch内对应函数以调用
  //   })
  // },
  // /**
  //    * 监听属性 并执行监听函数
  //    */
  // observe(obj, key, watchFun) {
  //   var val = obj[key]; // 给该属性设默认值
  //   var that = this
  //   Object.defineProperty(obj, key, {
  //     configurable: true,
  //     enumerable: true,
  //     set: function (value) {
  //       watchFun(value, val, that); // 赋值(set)时，调用对应函数
  //       val = value;
  //     },
  //     get: function () {
  //       return val;
  //     }
  //   })
  // },
  // watch: {
  //   isUsingCar: function (newValue, oldValue, that) {
  //     if (newValue) {
  //       //如果是在用车, 每隔一段时间就获取到定位信息
  //       var interval= setInterval(() => { //每分钟定位
  //         wx.request({
  //           url: ajax.ajaxBaseUrl + 'bicycle',
  //           method: 'put',
  //           data: {
  //             token: wx.getStorageSync('systemUserInfo').token,
  //             id: wx.getStorageSync('nowOrderInfo').id,
  //             location: 1
  //           },
  //           header: {
  //             'content-type': 'application/json' // 默认值
  //           },
  //           success(res) {
  //             if (res.data.status == 3) {
  //               $Toast({
  //                 content: res.data.msg,
  //                 icon: 'prompt',
  //                 duration: 0,
  //                 mask: false
  //               });
  //             }
  //             if (!res.data.status) {
  //               $Toast.hide();
  //             }
  //           },
  //           fail(err) {
  //             console.log(err)
  //           }
  //         })
  //       }, 60000)
  //       that.data.interval = interval
  //     } else {
  //       clearInterval(that.data.interval)
  //     }
  //   }
  // }

})