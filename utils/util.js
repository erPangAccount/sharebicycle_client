const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getLocationArrayToStorage = (storageKey) => { //获取到位置数据并保存到缓存中
  var beforLocationArray = wx.getStorageSync(storageKey) || []
  wx.getLocation({
    type: 'gcj02', 
    success: res => {
        if (beforLocationArray.length) {
          beforLocationArray.push(res)
        } else {
          beforLocationArray = [
            res
          ]
        }
        wx.setStorageSync(storageKey, beforLocationArray)
    },
    fail: res => {
      wx.setStorageSync(storageKey + 'Error', res)
    }
  })
}

const getLocationToStorage = () => { //获取到位置数据并保存到缓存中
  var storageKey = "location"
  wx.getLocation({
    type: 'gcj02', 
    success: res => {
      loading('获取位置中……')
      wx.setStorageSync(storageKey, res)
    },
    fail: res => {
      wx.setStorageSync(storageKey + 'Error', res)
    }
  })
}

const loading = function(title) {
  wx.showLoading({
    mask: true,
    title: title
  })
}


const stopLoading = function() {
  wx.hideLoading()
}

module.exports = {
  formatTime: formatTime,
  getLocationArrayToStorage: getLocationArrayToStorage,
  getLocationToStorage: getLocationToStorage,
  loading: loading,
  stopLoading: stopLoading
}
