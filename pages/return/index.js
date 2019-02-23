// pages/return/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCloseOrder: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  handleIsCloseOrderChange: function(event) {
    this.setData({
      isCloseOrder: event.detail.value
    })
  },

  formSubmit: function () {
    console.log('form发生了submit事件，携带数据为：')
  },
  formReset: function () {
    console.log('form发生了reset事件')
  }
})