// pages/order_detail/index.js
const app = getApp()
const utils = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowOrderId: 0,
    clientHeight: app.globalData.clientHeight - 130,
    location: {},
    locationArr: [],
    polyline: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nowOrderId: options.id
    })

    this.getLocation()

  },

  onShow: function() {
    //模拟假数据,实现地图的轨迹
      this.setData({
        locationArr: wx.getStorageSync('locationArray')
      })
    this.formatLocationData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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
          longitude: data[i].longitude,
          latitude: data[i].latitude
        }
      )
    }

    this.setData({
      polyline: formatedData
    })
  }
})