//index.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js');
const { $Toast } = require('../../dist/base/index');
const { $Message } = require('../../dist/base/index');

Page({
  data: {
    clientHeight: app.globalData.clientHeight,
    beforModel: "",
    inputModelTitle: "",
    location: {}
  },
  //事件处理函数
  onLoad: function () {
    if (app.globalData.userInfo) {
      app.saveUserInfoToService();
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          app.saveUserInfoToService();
        }
      })
    }
  },
  onShow: function()
  {
    var nowOrderInfo = wx.getStorageSync('nowOrderInfo');
    if (nowOrderInfo) {
      app.globalData.isUsingCar = true;
      wx.navigateTo({
        url: '../use/index',
      })
    } else {
      app.globalData.isUsingCar = false;
      this.getLocation();
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getLocation: function () { //获取位置
    var that = this;
    var storageKey = "location"
    var locationError = ""
    utils.loading('获取位置中……');
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        wx.setStorageSync(storageKey, res)
        this.setData({
          location: res
        })
      },
      fail: res => {
        $Message({
          content: res.errMsg,
          type: "error",
          duration: 5
        });
        wx.openSetting({
          success(res) {
            console.log(res.authSetting)
            res.authSetting = {
              "scope.userInfo": true,
              "scope.userLocation": true
            }
          }
        })
      }
    })
    setTimeout(() => {
      locationError = wx.getStorageSync(storageKey + 'Error');
      if (!locationError) {
        utils.stopLoading();
      }
    }, 500) 
    // 1000 = 1秒
  },
  hanldeToUseOrFindCar: function() {  //跳转到用车 找车按钮页面
    console.log(wx.getStorageSync('systemUserInfo'));
    if (wx.getStorageSync('systemUserInfo')) {
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
