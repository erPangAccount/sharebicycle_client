// pages/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMenu: "mine",
    hasHeadImage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  handleChange({ detail }) {
    switch (detail.key) {
      case 'homepage':
        wx.navigateTo({
          url: '../use/index'
        })
        break;
      case 'mine':
        break;
    }
  }
})