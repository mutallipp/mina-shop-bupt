// pages/index/select_school/select_school.js

var app=getApp(),utils=require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gcity: "当前选择学校：",
    hascity: "学校",
    nowcity: "北京大学",
    citylist: [],
    location: null,
    school:'',
    schoolName: [{
      text: "北京邮电大学"
    }, {
      text: "北京大学"
    }, {
      text: "清华大学"
    }, {
      text: "中国农业大学"
    }, {
      text: "中国人民大学"
    }, {
      text: "中央民族大学"
    }, {
      text: "北京林业大学"
    }, {
      text: "首都经济贸易大学"
    }, {
      text: "北京交通大学"
    }, {
      text: "南京体育学院奥林匹克学院"
    }, {
      text: "北京语言大学"
    }, {
      text: "中国地质大学（北京）"
    }],
    hosList: [],
    container: true,
    hot: !0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.set_school()
    utils.net('/members/get-school-list',{},
    function(e){
      if(e.code==200){
        app.setCache('hosList', e.data.school_list)
      }
    }
    )

  },
  input1:function(e){
    var t=this;
    t.search(e.detail.value)
    // var school = e.detail.value
    // // app.console(school)
    // t.setData({
    //   school: school,
    // })

  },
  search:function(e){
    var t=this;
    var a = app.getCache('hosList')
    // app.console(e)
    if ("" != e) {
      var o = [];
      for (var n in a) a[n].name.indexOf(e) >= 0 && (a[n].show = !0, o.push(a[n]));
      // app.console(o)
      0 == o.length ? t.setData({
        hosList: [{
          show: !0,
          name: "无此学校，请输入学校全称"
        }],
        container: false
      }) : t.setData({
        hosList: o,
        container: false
      });
    } else t.setData({
      hosList: a.data,
      container: true
    });
    // if(!t.data.school){
    //   app.alert('搜索内容不能为空')
    //   return;
    // }
    // utils.net('/members/school-list', { 'school': t.data.school},
    // function(e){
    //   // app.console(e)
    //   t.setData({
    //     hosList:e.data
    //   })
    // }
    // )
  },

  peking:function(e){
    // app.console(e)
    app.alert('请稍等..','loading',100000)
    var location=e.currentTarget.dataset.text,t=this;
    app.globalData.location = location
    t.setData({
      location: location
    })

    app.setCache('location', location)
    // 搜索记录存到本地
    var history_school = [];
    if (!app.getCache('history_school')){
      history_school.push(location)
      app.setCache('history_school', history_school)
    }else{
    history_school = app.getCache('history_school')
      var conter=0
      for (let i = 0; i < history_school.length;i++){
        if (history_school[i] == location){
          conter++;
          app.console(history_school[i] + '==' + location)
        }
      }
      app.console('cont:'+conter)
      if (conter==0){
        app.console(2)
        history_school.push(location)
        app.setCache('history_school', history_school)
      }

    
    }
    utils.net('/members/school', { 'school': location},
    function(e){
      // app.console(e)
      wx.hideToast()
      app.alert('请求成功','success',1000);
      setTimeout(function () {
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }, 1000);
        
      
      
      
    },
    function(e){
      // 失败
      wx.hideToast()
      app.alert('请求失败','fail')
    },
    function(e){
      // 完成
      // wx.hideToast()
    }
    )
    
  },

  set_school: function () {
    var t = this;
     if (app.getCache('location')) {
      var location = app.getCache('location')
      t.setData({
        location: location
      })
    } else {
      t.setData({
        location: '北京邮电大学'
      })
    }
    t.setData({
      history_school: app.getCache('history_school')
    })
  },
  listenerStorageClear:function(){
    var t=this;
    app.removeCache('history_school')
    t.setData({
      history_school:''
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})