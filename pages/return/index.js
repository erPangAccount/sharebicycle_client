// pages/return/index.js
const app = getApp();
const ajax = require('../../utils/ajax.js');
const { $Message } = require('../../dist/base/index');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isCloseOrder: false,
    remark: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function()
  {
    this.setData({
      remark: wx.getStorageSync('nowOrderInfo').remark || ''
    })
  },
  handleIsCloseOrderChange: function(event) {
    this.setData({
      isCloseOrder: event.detail.value
    })
  },
  handleRemarkChange: function(event) {
    this.setData({
      remark: event.detail.detail.value
    })
  },
  formSubmit: function (e) {
    var that = this;
    var status;
    if (this.data.isCloseOrder) {
      status = 2
    } else {
      status = wx.getStorageSync('nowOrderInfo').status.status;
    }
    wx.request({
      url: ajax.ajaxBaseUrl + 'bicycle',
      method: 'put',
      data: {
        token: wx.getStorageSync('systemUserInfo').token,
        id: wx.getStorageSync('nowOrderInfo').id,
        status: status,
        remark: this.data.remark
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (!res.data.status) {
          if(res.data.data.status.status != 1) {
            app.globalData.isUsingCar = false;
            wx.removeStorageSync('nowOrderInfo');
          } else {
            wx.setStorageSync('nowOrderInfo', res.data.data);
          }
          wx.navigateBack({});
        } else {
          $Message({
            content: res.data.msg,
            type: "error",
            duration: 5
          });
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  formReset: function () {
    this.setData({
      isCloseOrder: false,
      remark: ""
    });
  }
})