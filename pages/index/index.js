var top=require('../template/top/top.js'),app=getApp()
var utills=require('../../utils/util.js')
var dicData=require('../../utils/dicData.js')
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    is_auth: null,
    needKnow: 1,
    location:'',
    tabs: ["最新", "免费","求购"],
    activeIndex: 0,
    page_num:[2,2,2],
    order:[0,0,0],
    has_more:[1,1,1],
    loading:false,
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t=this;
    // app.console(dicData)
    if (app.globalData.needKnow==0){
      t.setData({
        needKnow:0
      })
    }
    t.check_login()
    t.check_auth()
    if (t.data.is_auth) {
      t.get_data()
    }
    
  },

  check_login: function () {
    var location='',t=this;
    
    // app.console(typeof app.globalData.location)
    wx.login({
      success: function (res) {
        if (res.code) {
          utills.net('/member/check-reg', { 'code': res.code},
          function(e){
            if(e.code==200){
              app.setCache('token',e.data.token)
              t.setData({ is_login: 1})
              app.globalData.user_info = e.data.user_info
            } else if (e.code == 3001){
              t.setData({
                location: e.data.location,
                is_login:1
              })
              app.alert('token被删除了')
              app.setCache('token', e.data.token)
              app.setCache('location', e.data.location)
              app.globalData.location = e.data.location
              
            }
            // app.console(e)
          }
          )
        }
      }
    })

    if ('location' in app.globalData){
      location = app.globalData.location
    }else{
      location=app.getCache('location')
    }
  t.setData({
    location: location
  })
  },
  goToSearch:function(){
    wx.navigateTo({
      url: '/pages/index/search/search',
    })
  },
  get_data:function(){
    app.alert('加载中..','loading')
    var t=this;
    t.setData({
      loading:true
    })
    utills.net('/index',{},
    function(e){
      wx.hideToast()
      if(e.code==200){
        var data = e.data;
        var good_fresh_list = e.data.good_fresh_list
        var good_free_list = e.data.good_free_list
        var good_need_list = e.data.good_need_list
        t.setData({
          banners: data.banner_list,
          home_cat_list: data.home_cat_list,
          good_fresh_list: good_fresh_list.data,
          good_free_list: good_free_list.data,
          good_need_list: good_need_list.data,
          loading:false,
        })
        if (good_fresh_list.has_more){
          var has_more=t.data.has_more
          has_more[0]=1
          t.setData({
            has_more: has_more
          })
        }else{
          var order = t.data.order;
          var page_num = t.data.page_num
          page_num[0]=1
          order[0]=1
          t.setData({
            order: order,
            page_num: page_num
          })
        }
        if (good_free_list.has_more) {
          var has_more = t.data.has_more
          has_more[1] = 1
          t.setData({
            has_more: has_more
          })
        } else {
          var order = t.data.order
          var page_num = t.data.page_num
          page_num[1] = 1
          order[1] = 1
          t.setData({
            order: order,
            page_num: page_num
          })
        }
        if (good_need_list.has_more) {
          var has_more = t.data.has_more
          has_more[2] = 1
          t.setData({
            has_more: has_more
          })
        } else {
          var order = t.data.order
          var page_num = t.data.page_num
          page_num[0] = 1
          order[2] = 1
          t.setData({
            order: order,
            page_num: page_num
          })
        }
    }else{
      app.alert(e.msg)
    }
    },
    function(e){
      // 失败
    },
    function(e){
      wx.hideToast()
    },
    )
  },

  getGoodList:function(){
    var t = this;
    var activeIndex = t.data.activeIndex, page_num = t.data.page_num[activeIndex]
    var order = t.data.order[activeIndex], good_status = parseInt(activeIndex) +1
    app.alert('加载中。。。','loading',100000)
    t.setData({loading:true})
    utills.net('/index-refresh', { 'page_num': page_num, 'good_status': good_status, 'order': order },
    function(e){
      // wx.hideToast()
      t.setData({
        loading:false
      })
      var page_num = t.data.page_num
      if(e.code==200){
        switch (parseInt(activeIndex)){
          case 0:
          {
            // fresh_list
              var good_fresh_list=e.data.good_list
              
            t.setData({
              good_fresh_list: t.data.good_fresh_list.concat(good_fresh_list.data)
            })
              if (good_fresh_list.has_more){
                
                page_num[0]++
                t.setData({
                  page_num: page_num
                })
                
              }else{
                var order=t.data.order;
                var has_more=t.data.has_more
                has_more[0]=1
                order[0]++
                page_num[0]=1
                t.setData({ order: order, has_more: has_more})
              }
              break;
          }
            
          case 1:
          {
            // free_list
              var good_free_list = e.data.good_list
              var page_num = t.data.page_num
              if (t.data.good_free_list.length>0){
                t.setData({
                  good_free_list: t.data.good_free_list.concat(good_free_list.data)
                })
              }else{
                t.setData({
                  good_free_list: good_free_list.data
                })
              }
             
              if (good_free_list.has_more) {
                var page_num = t.data.page_num
                page_num[1]++
                t.setData({
                  page_num: page_num
                })

              } else {
                var order = t.data.order
                var has_more = t.data.has_more
                has_more[1] = 1
                page_num[1]=1
                order[1]++;
                t.setData({ order: order, has_more: has_more});
              }
              break;
          }
          case 2:
          {
            // nedd_list
              var good_need_list = e.data.good_list;
              var page_num = t.data.page_num;
              if (t.data.good_need_list.length>0){
                t.setData({
                  good_need_list: t.data.good_need_list.concat(good_need_list.data)
                })
              }else{
                t.setData({
                  good_need_list: good_need_list.data
                })
              }
              
              if (good_need_list.has_more) {
                var page_num = t.data.page_num
                page_num[2]++
                t.setData({
                  page_num: page_num
                })

              } else {
                var order = t.data.order
                var has_more = t.data.has_more
                has_more[2] = 1
                page_num[2] = 1
                order[2]++;
                t.setData({ order: order, has_more: has_more});
              }
              break;
          }
          default :
          return;
        }

      } else if (e.code == 4000){
        app.console(e.msg)
        var order = t.data.order;
        var has_more = t.data.has_more
        has_more[activeIndex] = 1
        order[activeIndex]++
        page_num[activeIndex] = 1
        t.setData({ order: order, has_more: has_more, page_num: page_num })
        if(t.data.order[t.data.activeIndex]<5){
          setTimeout(function () {
            t.getGoodList()
          }, 1000);
          
        }else{
          app.alert('没有更多的了~~',1000)
        }
       
      }
      else{
        app.console('getGoodList')
      }
      wx.hideToast()
    },
    function(e){
      // 失败
      wx.hideToast()
    },
    function(e){
      // 完成
      wx.hideToast()
      t.setData({
        loading:false
      })
    }
    )

  },

  check_auth() {
    var t=this;
    var is_auth=utills.check_auth()
    app.console('授权 ' + is_auth)
    if(is_auth==1){
      // 已授权
      t.setData({
        is_auth:1
      })
    }else{
      // 没授权
      t.setData({
        is_auth: 0
      })
    }
  },

  goto_detail_list:function(e){
    var t=this;
    // app.console(e)
    var goodsId = e.currentTarget.dataset.goodsid
    var Tid = e.currentTarget.dataset.tid
    // app.console(Tid)
    wx.navigateTo({
      url: '../detail_list/detail_list?goodsId=' + goodsId + '&Tid=' + Tid,
    })
  },

  changschool:function(){
    wx.navigateTo({
      url: '/pages/index/select_school/select_school',
    })
  },
  shop: function (res) {
    var e = res.detail.formId,t=this;
    app.pushFormIdInfo(e), app.updateLoginTime(), this.setData({
      needKnow: 0
    });
    app.globalData.needKnow=0;
    //app.console(res)
  },

  bindGetUserInfo:function(e){
    var t = this, is_auth = app.getCache('is_auth')
    if (is_auth){
      t.setData({
        is_auth: 1,
        needKnow: !1,
      })
    }else{
    var t=this;
    console.log(e.detail.userInfo)
      var userInfo = {
        'nickname': e.detail.userInfo.nickName,
        'avatar': e.detail.userInfo.avatarUrl,
        'sex': e.detail.userInfo.gender
      }
      app.globalData.userInfo = e.detail.userInfo
      app.setCache('userInfo', e.detail.userInfo)
    t.setData({
      needKnow:!1,
      is_auth:1
    })
      if (!app.getCache('location')){
        this.changschool()
      }
  
      app.setCache('is_auth',1)

      wx.login({
        success: function (res) {
          if (res.code) {
            var code = res.code;
            var data = {
              'nickname': e.detail.userInfo.nickName,
              'avatar': e.detail.userInfo.avatarUrl,
              'sex': e.detail.userInfo.gender,
              'code': code
            }
            utills.net('/member/login', data,
              function (e) {
                app.console(e.msg)
                app.setCache('token',e.data.token)
              })
          }
        }
      })
    }
    t.get_data()
   
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var t=this;
    t.check_school()
    setTimeout(function(){
      
    },500)
    
  },

  check_school:function(){
    var t=this;
    if (!t.data.location && app.getCache('is_auth') == 1) {
      app.console('is_auth=1' + t.data.location)
      t.changschool();
    } else {
      t.setData({
        location: app.getCache('location')
      })
    }
    if (app.globalData.needKnow == 0) {
      t.setData({
        needKnow: 0
      })
    }
  },
  
  bindchange:function(e){

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
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
    var t=this;
    var order=t.data.order[t.data.activeIndex]
    var has_more=t.data.has_more
    if (!t.data.loading && order < 5 && has_more[t.data.activeIndex]){
      app.alert('加载中..','loading',20000)
      setTimeout(function () {
        t.getGoodList()
      }, 1000);
      
    }else{
      app.alert('没有更多的了~~', 1000)
    }
  },

  slider:function(e){
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})