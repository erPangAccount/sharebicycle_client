//index.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js')

Page({
  data: {
    clientHeight: app.globalData.clientHeight,
    isUseingCar: false,
    beforModel: "",
    inputModelTitle: "",
    location: {}
  },
  //事件处理函数
  onLoad: function () {
    this.getLocation()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  handleStopUseCarClick() { //停止使用
    this.setData({
      isUseingCar: false
    })
  },
  getLocation: function () { //获取位置
    var storageKey = "location"
    var locationError = ""
    utils.getLocationToStorage();
    setTimeout(() => { //延迟半分钟处理
      locationError = wx.getStorageSync(storageKey + 'Error');
      this.setData({
        location: wx.getStorageSync(storageKey)
      })
      if (!locationError) {
        utils.stopLoading();
      }
    }, 2000)
  },
  hanldeToUseOrFindCar: function() {  //跳转到用车 找车按钮页面
    if (wx.getStorageInfoSync('systemUserInfo')) {
      wx.navigateTo({
        url: '../use/index',
      })
    } else {
      wx.navigateTo({
        url: '../login/index',
      })
    }
  }
})
