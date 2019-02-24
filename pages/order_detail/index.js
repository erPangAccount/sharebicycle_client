// pages/order_detail/index.js
const app = getApp();
const utils = require('../../utils/util.js');
const ajax = require('../../utils/ajax.js');
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowOrderId: 0,
    clientHeight: app.globalData.clientHeight - 130,
    location: {},
    locationArr: [],
    polyline: [],
    orderDetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nowOrderId: options.id
    })
    this.getOrderDetail()
  },

  onShow: function() {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  getOrderDetail: function () {
    var that = this;
    wx.request({
      url: ajax.ajaxBaseUrl + 'bicycle_show',
      method: 'get',
      data: {
        token: wx.getStorageSync('systemUserInfo').token,
        id: this.data.nowOrderId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (!res.data.status) {
        var location = res.data.data.location[0] || null;
        if (!location) {
          that.getLocation();
        } else {
          that.setData({
            location: {
              longitude: location.lng,
              latitude: location.lat
            }
          });
        }
          that.setData({
            orderDetail: res.data.data,
            locationArr: res.data.data.location
          })
         that.formatLocationData()
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
  getLocation: function () { //获取位置
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        that.setData({
          location: {
            longitude: res.longitude,
            latitude: res.latitude
          }
        })
      },
      fail: res => {
        console.log(res);
      }
    })
  },
  formatLocationData: function () { //格式化数据 ,格式要求 https://developers.weixin.qq.com/miniprogram/dev/component/map.html#map  polyline属性说明
    var data = this.data.locationArr || []
    var formatedData = [{
      points: [],
      color: "#FF0000DD",
      width: 2
    }]

    //points
    for(var i = 0; i < data.length; i++) {
      formatedData[0].points.push(
        {
          longitude: data[i].lng,
          latitude: data[i].lat
        }
      )
    }
    this.setData({
      polyline: formatedData
    })
  },
  toPay: function() {
    var that = this;
    wx.request({
      url: ajax.ajaxBaseUrl + 'bicycle',
      method: 'put',
      data: {
        token: wx.getStorageSync('systemUserInfo').token,
        id: this.data.nowOrderId,
        status: 3
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (!res.data.status) {
          that.setData({
            orderDetail: res.data.data
          })
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
  }
})