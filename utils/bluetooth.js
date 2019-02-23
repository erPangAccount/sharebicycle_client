//1.初始化蓝牙设备
//2.获取本机蓝牙设备状态
//3.搜索周边蓝牙
//4.获取找到的蓝牙设备信息
//5.创建连接
//6.获取服务
//7.获取服务下的特征值
//8.数据交互->读值，实时读值，写值

/**
 * 1.初始化蓝牙设备
 * 2.获取本机蓝牙设备状态
 * 3.搜索周边蓝牙
 * 4.获取找到的蓝牙设备信息
 * 5.创建连接
 */
const initBluetooth = () => {
  wx.openBluetoothAdapter({
    success: res => {
      console.log(res)
      getBluetoothState() //获取蓝牙状态
    },
    fail: res => {
      console.log(res)
    }
  })
}

/**
 * 获取本机蓝牙状态
 */
const getBluetoothState = () => {
  wx.getBluetoothAdapterState({
    success: function(res) {
      console.log("获取本机蓝牙状态", res)
      onBluetoothChange() //监听蓝牙状态变化
      startBluetoothSearch() //开始搜索周边
    },
  })
}

/**
 * 监听蓝牙适配器状态变化
 */
const onBluetoothChange = () => {
  wx.onBluetoothAdapterStateChange(function(res){
    console.log("监听蓝牙适配器状态变化", res)
  })
}

/**
 * 搜索设备
 */
const startBluetoothSearch = () => {
  wx.startBluetoothDevicesDiscovery({
    services: [], //
    success: function(res) {
      console.log('开始搜索周边设备', res)
      onBluetoothFound()  //发现蓝牙设备时
    }
  })
}

/**
 * 获取搜索到的蓝牙设备
 */
const onBluetoothFound = () => {
  wx.onBluetoothDeviceFound(function(res){
    console.log('发现设备', res)
    stopBluetoothSearch() //停止搜索
  })
}

/**
 * 停止搜索
 */
const stopBluetoothSearch = () => {
  wx.stopBluetoothDevicesDiscovery({
    success: function(res) {
      console.log('停止搜索周边蓝牙设备', res)
      //保存蓝牙设备信息到指定位置
    },
  })
}

/**
 * 连接蓝牙设备
 */
const connectBluetooth = (deviceInfo) => {
  wx.createBLEConnection({
    deviceId: '',
    success: function(res) {
      console.log('连接低功耗蓝牙设备', res)
    },
  })
}

/**
 * 获取蓝牙设备serive
 */
const getBluetoothServices = (deviceInfo) => {
  wx.getBLEDeviceServices({
    deviceId: '',
    success: function(res) {
      console.log('获取低功耗蓝牙设备所有服务service', res)
    },
  })
}

/**
 * 获取蓝牙设备下的某个service的具体特征信息
 */
const getBluetoothCharacteristics = (deviceInfo, serive) => {
  wx.getBLEDeviceCharacteristics({
    deviceId: '',
    serviceId: '',
    success: function(res) {
      console.log('获取蓝牙设备指定服务的所有特征值', res)
    },
  })
}

/**
 * 读取蓝牙设备下的某个service的某个具体特征的值
 */
const readBluetoothCharacteristicData = (deviceInfo, serive, characteristic) => {
  wx.readBLECharacteristicValue({
    deviceId: '',
    serviceId: '',
    characteristicId: '',
    success: function(res) {
      console.log('读取蓝牙设备某个具体service下的特征下的值', res)
    }
  })
}

/**
 * 实时读取蓝牙设备下的某个service的某个具体特征的值
 */
const realtimeReadBluetoothCharacteristicData = (deviceInfo, serive, characteristic) => {
  wx.notifyBLECharacteristicValueChange({
    deviceId: '',
    serviceId: '',
    characteristicId: '',
    state: true,
    success: function(res) {
      console.log('实时读取蓝牙设备某个具体service下的特征下的值', res)
    }
  })
}

/**
 * 修改蓝牙设备下的某个service的某个具体特征的值
 */
const writeBluetoothCharacteristicData = (deviceInfo, serive, characteristic) => {
  wx.writeBLECharacteristicValue({
    deviceId: '',
    serviceId: '',
    characteristicId: '',
    value: [],
    success: function(res) {
      console.log('修改蓝牙设备特征值', res)
    },
  })
}
