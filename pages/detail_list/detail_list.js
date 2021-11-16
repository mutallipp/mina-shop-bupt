 //index.js
//获取应用实例
const app = getApp(),dicData=require('../../utils/dicData.js');
var utils = require('../../utils/util.js')
Page({
  data: {
    current: 0,
    swiperCurrent: 0, 
    iscity: !1,
    needKnow: !0,
    pageSize: 20,
    userInfo: {},
    location: '',
    hasUserInfo: !1,
    not: null,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),

    text: "这是一条测试公告，看看效果怎么样，2019年3月23日",
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marquee_margin: 30,
    size: 14,
    interval: 20 ,// 时间间隔
    currentTab: 0,
    navScrollLeft: 0,
    schoolshow: !0,
    schoolshowhide: !1,
    schoolnumber: "8129",
    loading:false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (e) {
    var t=this;
    var goodsId = e.goodsId    //列表id
    var tid=e.Tid
    // app.console(typeof tid)
    if(tid){
      t.get_data(tid)
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
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

  goToSearch: function () {
    wx.navigateTo({
      url: '/pages/index/search/search',
    })
  },

  get_data:function(tid){
    var t=this;
    var page_num=t.data.page_num,order=t.data.order;
    t.setData({ loading:true})
    utils.net('/detail-list', { 'home_cat_id': tid},
      function(e){
        // app.console(e)
        var good_list = e.data.good_list;
        var has_more=[],order=[],page_num=[]
        t.setData({ loading:false})
        if(e.code==200){
          for (var i = 0; i < e.data.cat_list.length;i++){
            has_more[i]=1;
            order[i] = 0;
            page_num[i] = 2;
          }
          t.setData({
            navData: e.data.cat_list,
            currentTab: e.data.cat_list[0].id,
            banners: e.data.banner_list,
            good_list: good_list.data,
            good_all: good_list.data,
            has_more: has_more,
            order: order,
            page_num,
            tid
          })
        }else{}
      }
    )
  },

getGoodList:function(){
  var t = this, currentTab = t.data.currentTab;
  var page_num = t.data.page_num[currentTab], order = t.data.order[currentTab], tid = t.data.tid;
  // app.console(t.data.order[order])
  app.alert('加载中。。。','loading',100000)
  t.setData({ loading:true})
  utils.net('/detail-list', { 'home_cat_id': tid, 'page_num': page_num, 'order': order},
    function(e){
      wx.hideToast()
      t.setData({ loading:false})
      if(e.code==200){
        var good_list=e.data.good_list
        var page_num = t.data.page_num
        var prder = t.data.order
        if(good_list.has_more){
          page_num[currentTab]++
          t.setData({
            page_num: page_num,
            good_all:t.data.good_all.concat(good_list.data),
            good_list: t.data.good_list.concat(good_list.data)
          })
        }else{
          var order = t.data.order
          var page_num = t.data.page_num
          order[currentTab] ++
          page_num[currentTab]=1
          t.setData({
            order: order,
            page_num: page_num,
            good_all: t.data.good_all.concat(good_list.data),
            good_list: t.data.good_list.concat(good_list.data)
          })
        }
      }else if(e.code==4000){
        var order = t.data.order
        var page_num = t.data.page_num
        // app.console('order' + order)
        order[currentTab]++
        
        page_num[currentTab] = 1
        t.setData({
          order: order
        })
        if (t.data.order[currentTab]<5){
          setTimeout(function () {
            t.getGoodList();
          }, 1000);
         
        }else{
          app.alert('没有更多的了~~', 1000)
        }
       
      }
    },
    function(e){
      // 失败
    },
    function(e){
      
      // complate
      // t.setData({loading:false})
    }
  )
},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var t = this;
    app.console('onReachBottom')
    var order = t.data.order[t.data.currentTab]
    var has_more = t.data.has_more[t.data.currentTab]
    if (!t.data.loading && order < 5 && has_more) {
      setTimeout(function () {
        t.getGoodList();
      }, 1000);
    }else{
      app.alert('没有更多的了~~', 1000)
    }
  },

  changschool: function () {
    wx.navigateTo({
      url: '/pages/index/select_school/select_school',
    })
  },
  switchNav: function (e) {
    var t=this;
    app.console('current:'+e.currentTarget.dataset.current)
    var cat_id = e.currentTarget.dataset.current,good_all=t.data.good_all,good_list=[];
    if (cat_id==0){
      t.setData({
        currentTab: 0,
        good_list: good_all,
      })
      return;
    }
    for (var i = 0; i < good_all.length;i++){
      if (good_all[i].cat_id == cat_id){
        good_list.push(good_all[i])
      }
    }
    t.setData({
      currentTab: e.currentTarget.dataset.current,
      good_list: good_list,
    })
    // app.console('currentTab:' + t.data.currentTab)
    if (!good_list){
      var page_num=t.data.page_num
      page_num[cat_id]=1
      t.setData({
        page_num: page_num
      })
    }
  },
  onShow: function () {
    var t = this;
    var location = app.getCache('location');
    if (!location && app.getCache('is_auth') == 1) {
      t.changschool();
      return;
    } else {
      t.setData({
        location: location
      })
    }
  },
  bindchange:function(e){

  }
 
})
