//index.js
//获取应用实例
const app = getApp()
const ajaxa = require('./ajax.js');
const utils = require('../../utils/util.js')

Page({
  data: {
    clientHeight: 0,
    isUsingCar: app.globalData.isUsingCar,
    currentMenu: "homepage",
    showFindCarModal: false,
    showUseCarModal: false,
    orderModalShow: false,
    findCarModalButton: [
      {
        name: '扫码找车'
      },
      {
        name: '车号找车'
      },
      {
        name: '取消'
      }
    ],
    useCarModalButton: [
      {
        name: '扫码用户'
      },
      {
        name: '车号用车'
      },
      {
        name: '取消'
      }
    ],
    orderModelButton: [
      {
        name: '确定'
      }
    ],
    showInputCarNumberModel: false,
    inputCarNumberModelButton: [
      {
        name: '确定'
      },
      {
        name: '取消'
      }
    ],
    beforModel: "",
    inputModelTitle: "",
    inputCarNumber: "",
    location:{},
    storageKeys: "",
    storageDatas: ""
  },
  //事件处理函数
  onLoad: function () {
    wx.getSystemInfo({    //获取系统屏幕高度，实现滚动view自适应
        success: res => {
          this.setData({
            clientHeight: res.windowHeight - 70 - 50 
          });
        }
      })


    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  handleFindCarsButtonClick: function() { //找车按钮
    this.setData({
      showFindCarModal: true
    })
  },  
  handleUseCarsButtonClick: function() {  //用车按钮 
    this.setData({
      showUseCarModal: true
    })
  },
  handleFindCarMethod: function({ detail }) { //选择找车方式
    const index = detail.index
    switch (index) {
      case 0:
        this.scanCode();
        break;
      case 1:
        this.setData({
          showInputCarNumberModel: true,
          beforModel: "find_car",
          inputModelTitle: "请输入需要寻找的车号！"
        })
        console.log('车号')
        break;
      case 2:
        console.log('取消')
        this.setData({
          showFindCarModal: false
        })
        break;
    }
  },
  handleUserCarMethod: function({ detail }) { //选择用车方式
    const index = detail.index
    switch (index) {
      case 0:
        this.scanCode();
        app.globalData.isUsingCar = true;
        this.setData({
          isUsingCar: app.globalData.isUsingCar
        })
        break;
      case 1:
        this.setData({
          showInputCarNumberModel: true,
          beforModel: "use_car",
          inputModelTitle: "请输入需要使用的车号！"
        })
        console.log('车号')
        break;
      case 2:
        console.log('取消')
        this.setData({
          showUseCarModal: false
        })
        break;
    }
  },
  handleHideOrderModel: function() {  //关闭订单结算提示
    this.setData({
      orderModalShow: false
    })
  },
  handleInputCarNumberMethod: function({ detail }) {  //输入车号
    this.setData({
      showFindCarModal: false,
      showUseCarModal: false,
      showInputCarNumberModel: false
    })
    const index = detail.index
    switch (index) {
      case 0:
        if (this.data.beforModel.length) { //存在上一个模型
          if (this.data.beforModel == 'find_car') { //找车
            console.log('find car ajax')
          } else if (this.data.beforModel == 'use_car') { //用车
            console.log('use car ajax')
            app.globalData.isUsingCar = true;
            this.setData({
              isUsingCar: app.globalData.isUsingCar
            })
          }
        }
        break;
      case 1:
        if (this.data.beforModel.length) { //存在上一个模型
          if (this.data.beforModel == 'find_car') { //找车
            this.setData({
              showFindCarModal: true
            })
          } else if (this.data.beforModel == 'use_car') { //用车
            this.setData({
              showUseCarModal: true
            })
          }
        }
        break;
    }
  },
  handleStopUseCarClick() { //停止使用
    app.globalData.isUsingCar = false;
    this.setData({
      isUsingCar: app.globalData.isUsingCar,
      orderModalShow: true
    })
    //获取到所有未保存的订单数据,发送后台
    this.getNotSaveToBackground()
    setTimeout(() => {
      //获取数据
      var storages = this.data.storageDatas
      //向后台发送数据

      //pass

      //成功清理当前订单信息,写在成功回调中
      this.clearStorages(this.data.storageKeys)
    }, 500)
  },
  getNotSaveToBackground: function () {  //获取没有保存到后台的所有订单数据
    var storageKeys = [];
    var storageDatas = [];
    var that = this;
    wx.getStorageInfo({
      success: res => {
        storageKeys = res.keys.filter(key => {
          var filterMap = [
            'location'
          ]
          if (filterMap.indexOf(key) == -1) {
            //不存在于比较数组中 
            return true;
          } else {
            return false;
          }
        })
        if (storageKeys.length) {
          storageKeys.forEach(key => {
            var itemData = wx.getStorageSync(key)
            if (itemData) {
              storageDatas.push(itemData)
            }
          })
        }
        that.data.storageKeys = storageKeys
        that.data.storageDatas = storageDatas
      }
    })

  },
  clearStorages: function(keys) { //清理指定keys的本地缓存
    if (!Array.isArray(keys)) { //不是数组转换为数组
      keys = [
        keys
      ]
    }

    keys.forEach(key => { //遍历指定需要删除缓存的key，逐个删除
      wx.removeStorageSync(key) 
    })
  },
  handleOrderListClick() {
    wx.navigateTo({
      url: 'pages/order/index'
    })
  },
  handleChange({ detail }) {
    switch (detail.key) {
      case 'homepage':
       break;
      case 'order':
        wx.navigateTo({
          url: '../order/index'
        })
        break;
      case 'mine':
        wx.navigateTo({
          url: '../user/index'
        })
        break;
    }
  },
  scanCode: function() {
    wx.scanCode({
      success: res => {
        console.log(res)
      }
    })
  },
  handleFresh: function () {
    console.log('refresh');
    utils.loading("刷新中……");
    setTimeout(() => {
      utils.stopLoading();
    }, 5000)
  },
  handleLoadMore: function () {
    console.log('load more');
    utils.loading("加载更多中……");
    setTimeout(() => {
      utils.stopLoading();
    }, 5000)

  },
  handleToOrderInfo: function (event) {
    var datas = event.currentTarget
    wx.navigateTo({
      url: '../order_detail/index?id=' + datas['id'],
    })
  },
  handleReturnError: function() {
    wx.navigateTo({
      url: '../return/index',
    })
  }
})
