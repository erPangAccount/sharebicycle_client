//index.js
//获取应用实例
const app = getApp();
const ajax = require('../../utils/ajax.js');
const utils = require('../../utils/util.js');
const { $Toast } = require('../../dist/base/index');
const { $Message } = require('../../dist/base/index');

Page({
  data: {
    isUsingCar: app.globalData.isUsingCar,
    clientHeight: 0,
    currentMenu: "homepage",
    showUseCarModal: false,
    orderModalShow: false,
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
    orderListData: {},
    nowOrderInfo: {}
  },
  //事件处理函数
  onLoad: function () {
    wx.getSystemInfo({    //获取系统屏幕高度，实现滚动view自适应
        success: res => {
          this.setData({
            clientHeight: res.windowHeight - 70 - 50 
          });
        }
    });
    this.setWatcher(app.globalData, this.watch)
  },
  onShow: function() {
    var nowOrderInfo = wx.getStorageSync('nowOrderInfo');
    if (nowOrderInfo) {
      app.globalData.isUsingCar = true;
      this.setData({
        isUsingCar: true,
        nowOrderInfo: nowOrderInfo
      })
    } else {
      app.globalData.isUsingCar = false ;
      this.setData({
        isUsingCar: false,
        nowOrderInfo: {}
      })
    }
    this.getOrderList();
  },
  getOrderList: function(callBack = null, page = 1) { //获取订单列表
    var that = this
    wx.request({
      url: ajax.ajaxBaseUrl + 'bicycle',
      method: 'get',
      data: {
        token: wx.getStorageSync('systemUserInfo').token,
        page: page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (!res.data.status) {
          if (page != 1) {
              var orderList = that.data.orderListData.data;
              var newData = res.data.data
              for (var i in newData.data) {
                orderList.push(newData.data[i]);
              }
              newData.data = orderList;
              that.setData({
                orderListData: newData
              })
          } else {
            that.setData({
              orderListData: res.data.data
            })
          }
          
          if (callBack != null) {
              callBack
          }
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
  handleUseCarsButtonClick: function() {  //用车按钮 
    this.setData({
      showUseCarModal: true
    })
  },
  handleUserCarMethod: function({ detail }) { //选择用车方式
    const index = detail.index
    switch (index) {
      case 0:
        this.scanCode();
        break;
      case 1:
        this.setData({
          showInputCarNumberModel: true,
          beforModel: "use_car",
          inputModelTitle: "请输入需要使用的车号！"
        })
        break;
      case 2:
        this.setData({
          showUseCarModal: false
        })
        break;
    }
  },
  handleHideOrderModel: function() {  //关闭订单结算提示
    this.pay()
  },
  handleInputCarNumberMethod: function({ detail }) {  //输入车号
    this.setData({
      showUseCarModal: false,
      showInputCarNumberModel: false
    })
    const index = detail.index
    switch (index) {
      case 0:
        if (this.data.beforModel.length) { //存在上一个模型
          if (this.data.beforModel == 'use_car') { //用车
            // this.useCar(this.data.inputCarNumber)
            this.useCar('001')
            var that = this;
            setTimeout(function() {
              that.setData({
                  isUsingCar: app.globalData.isUsingCar
                });
            }, 200);
          }
        }
        break;
      // case 1:
      //   if (this.data.beforModel.length) { //存在上一个模型
      //     if (this.data.beforModel == 'use_car') { //用车
      //       this.setData({
      //         showUseCarModal: true
      //       })
      //     }
      //   }
      //   break;
    }
  },
  handleStopUseCarClick() { //停止使用
    var that = this
    utils.loading("加载中……");
    wx.request({
      url: ajax.ajaxBaseUrl + 'bicycle',
      method: 'PUT',
      data: {
        token: wx.getStorageSync('systemUserInfo').token,
        status: 4,
        id: wx.getStorageSync('nowOrderInfo').id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        utils.stopLoading();
        if (!res.data.status) {
          that.setData({
            nowOrderInfo: res.data.data,
            isUsingCar: false,
            orderModalShow: true
          });
          app.globalData.isUsingCar = false;
          wx.removeStorageSync('nowOrderInfo');
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
        if (res.errMsg == "scanCode:ok") {  //扫描成功
          var carNumber = res.result.split('/').pop()
          this.useCar(carNumber)
          var that = this;
          setTimeout(function () {
            that.setData({
              isUsingCar: app.globalData.isUsingCar
            });
          }, 200);
        }
      }
    })
  },
  handleFresh: function () {
    utils.loading("刷新中……");
    this.getOrderList(utils.stopLoading());
  },
  handleLoadMore: function () {
    if (this.data.orderListData.current_page <= this.data.orderListData.last_page) {
      utils.loading("加载更多中……");
      this.getOrderList(utils.stopLoading(), this.data.orderListData.current_page + 1)
    } else {
      utils.loading("暂时没有更多数据！");
      setTimeout(() => {
        utils.stopLoading();
      }, 200)
    }
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
  },
  useCar: function (carNumber) {
    wx.request({
      url: ajax.ajaxBaseUrl + 'bicycle',
      method: 'post',
      data: {
        carNumber: carNumber,
        token: wx.getStorageSync('systemUserInfo').token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (!res.data.status) {
          app.globalData.isUsingCar = true;
          wx.setStorageSync('nowOrderInfo', res.data.data)
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
  pay: function () {
    var that = this;
    wx.request({
      url: ajax.ajaxBaseUrl + 'bicycle',
      method: 'put',
      data: {
        token: wx.getStorageSync('systemUserInfo').token,
        id: this.data.nowOrderInfo.id,
        status: 3
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (!res.data.status) {
          that.setData({
            nowOrderInfo: res.data.data,
            orderModalShow: false
          })
          that.getOrderList()
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



  /**
     * 设置监听器
     */
  setWatcher(data, watch) { // 接收传过来的data对象和watch对象
    Object.keys(watch).forEach(v => { // 将watch对象内的key遍历
      this.observe(data, v, watch[v]); // 监听data内的v属性，传入watch内对应函数以调用
    })
  },
  /**
     * 监听属性 并执行监听函数
     */
  observe(obj, key, watchFun) {
    var val = obj[key]; // 给该属性设默认值
    var that = this
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function (value) {
        watchFun(value, val, that); // 赋值(set)时，调用对应函数
        val = value;
      },
      get: function () {
        return val;
      }
    })
  },
  watch: {
    isUsingCar: function (newValue, oldValue, that) {
      if (newValue) {
        //如果是在用车, 每隔一段时间就获取到定位信息
        var interval = setInterval(() => { //每分钟定位
          wx.request({
            url: ajax.ajaxBaseUrl + 'bicycle',
            method: 'put',
            data: {
              token: wx.getStorageSync('systemUserInfo').token,
              id: wx.getStorageSync('nowOrderInfo').id,
              location: 1
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              if (res.data.status == 3) {
                $Toast({
                  content: res.data.msg,
                  icon: 'prompt',
                  duration: 0,
                  mask: false
                });
              } else if (!res.data.status) {
                $Toast.hide();
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
        }, 60000)
        that.data.interval = interval
      } else {
        clearInterval(that.data.interval)
      }
    }
  }
})
