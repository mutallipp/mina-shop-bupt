const app=getApp()
module.exports={
  net: net,
  check_auth: check_auth,
  formatTime: formatTime,
  promisify: promisify,
  upload_file: upload_file
}

function upload_file(url, filePath, name, formData, success, fail) {
  wx.showToast({
    title: '上传中',
    icon: 'loading',
    duration: 10000,
  })
  console.log('a=' + filePath)
  wx.uploadFile({
    url: app.globalData.domain + url,
    filePath: filePath,
    name: name,
    header: {
      'content-type': 'multipart/form-data',
      'Authorization': getToken()
    }, // 设置请求的 header
    formData: formData, // HTTP 请求中其他额外的 form data
    success: function (res) {
      app.console(res);
      if (res.statusCode == 200 && !res.data.result_code) {

        typeof success == "function" && success(JSON.parse(res.data));
      } else {
        typeof fail == "function" && fail(res.data);
      }
    },
    fail: function (res) {
      console.log(res);
      typeof fail == "function" && fail(res);
    }
  })
  wx.hideToast()
}

function check_auth(){
  var t = this;
  var is_auth = app.getCache('is_auth')
  // 本地缓存拿不到授权信息
  if (!is_auth) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          app.setCache('is_auth',1)
          //t.getUserInfo()
          return 1
        } else {
          app.console('没有授权登录~~~~')
          return 0
        }
      }
    })
  } else {
    // 从本地拿到授权信息了
    return 1
  }
}

function net(url,data,success,fail,complate){
  wx.request({
    url: app.globalData.domain + url,
    header: getRequesHeader(),
    method: 'POST',
    data:data,
    success: function (res) {
      if (res.statusCode == 200) {
        typeof success == "function" && success(res.data)
      } else {
        typeof fail == "function" && fail(res.data);
      }
    },
    fail: function () {
      typeof fail == "function" && fail(res.data);
    },
    complete: function (res) {
      typeof complate == "function" && complate(res.data)
    }
  })
}

function getRequesHeader(){
  return {
    'content-type': 'application/x-www-form-urlencoded',
    'Authorization': getToken()
  }
}

function getToken(){
  var token=app.getCache('token')
  return token
}

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}  

function promisify(api) {
  return (options, ...params) => {
    return new Promise((resolve, reject) => {
      const extras = {
        success: resolve,
        fail: reject
      }
      api({ ...options, ...extras }, ...params)
    })
  }
}
 