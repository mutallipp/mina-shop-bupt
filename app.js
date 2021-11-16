//app.js
App({
  globalData: {
    // domain: 'http://10.122.200.41:5000/mina/api',
    // host: 'http://10.122.200.41:5000',
    domain: 'http://localhost:5000/mina/api',
    host: 'http://localhost:5000/',
    userInfo: null,
    needKnow: 1,
  },
  onLaunch: function () {
    this.check_auth()
    this.getSytemInfo()
  },

  
check_auth:function(){
  var t = this;
  // 展示本地存储能力
  // var logs = wx.getStorageSync('logs') || []
  // logs.unshift(Date.now())
  // wx.setStorageSync('logs', logs)
  var is_auth = t.getCache('is_auth')
  // 本地缓存拿不到授权信息
    if(!is_auth){
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框

            // 异步存储
            wx.setStorage({
              key: "is_auth",
              data: 1,
            })
            t.getUserInfo()

          } else {
            t.console('没有授权登录~~~~')
          }
        }
      })
    }else{
      // 从本地拿到授权信息了
      t.getUserInfo()
    }


    // if (this.globalData.location == 0) {
    //   wx.navigateTo({
    //     url: '/pages/index/select_school/select_school',
    //   })
    // }
  t.onReady()
},

  onReady: function () {
    var t=this
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: t.globalData.domain+'/member/check-reg', 
            data:{ 'code': res.code },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': t.getCache('token')
            },
            success:function (e) {
              if (e.code == 200) {
                app.setCache('token', e.data.token)
                t.globalData.user_info = e.data.user_info
              } else if (e.code == 3001) {
               
                t.alert('token被删除了')
                t.setCache('token', e.data.token)
                t.setCache('location', e.data.location)
                t.globalData.location = e.data.location

              }
              // app.console(e)
            }
          })
        }
      }
    })
  },
  getCache: function (key) {
    var value = undefined;
    try {
      value = wx.getStorageSync(key);
    } catch (e) {
    }
    return value;
  },
  setCache: function (key, value) {
    wx.setStorage({
      key: key,
      data: value
    });
  },

  removeCache:function(key){
    wx.removeStorage({
      key: key,
      success: function (res) {
        // console.log(res.data)
        return true
      },
      fail:function(e){
        return false
      }
    })
  },

getUserInfo:function(){
  var t=this;
  wx.getUserInfo({
    success: res => {
      // 可以将 res 发送给后台解码出 unionId
      t.globalData.userInfo = res.userInfo
      t.console('getUserInfo被调用了')
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      if (this.userInfoReadyCallback) {
        this.userInfoReadyCallback(res)
      }
    }
  })
},


  pushFormIdInfo: function (t) {
    var e = this.globalData.formIds;
    // 更新formIds  数据库
   
  },
  updateLoginTime: function () {
    var t = new Date();
    t.setHours(0), t.setMinutes(0), t.setSeconds(0), t.setMilliseconds(0);
    var e = t.getTime();
    wx.setStorage({
      key: "logintime",
      data: e
    }), this.globalData.logintime = e;
  },

  getSytemInfo:function(){
    var t=this;
    wx.getSystemInfo({
      success: function(res) {
        //t.console(res)
        t.globalData.systemInfo=res
      },
    })
  },

  show: function (content, confirm,concel){
    wx.showModal({
      title: '温馨提示',
      content: content,
      confirmColor:"#00FF00",
      cancelColor:"#FF0066",
      success(res) {
        if (res.confirm) {
          typeof confirm == "function" && confirm(res)
          t.console('用户点击确定')
        } else if (res.cancel) {
          typeof concel == "function" && concel(res)
          t.console('用户点击取消')
        }
      }
    })
  },

  tip:function(content,confirm){
    var t=this;
    wx.showModal({
      title: '温馨提示',
      content: content,
      confirmColor: "#00FF00",
      showCancel: false,
      success(res) {
        if (res.confirm) {
          typeof confirm == "function" && confirm(res)
          t.console('用户点击确定')
        } 
      }
    })
  },

  alert: function (title, icon='none',time=1500){
    wx.showToast({
      title: title,
      icon: icon,
      duration: time
    })
  },
  
  console:function(e){
    console.log(e)
  },

})