// pages/index/select_school/select_school.js

var app = getApp(), utils = require('../../../utils/util.js')
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
    school: '',
    schoolName: [{
      text: "vivo x20"
    }, {
      text: "Python"
    }, {
      text: "英语四级"
    }],
    hosList: [],
    container: !0,
    hot: !0,
    centent_Show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.set_school()

  },
  input1: function (e) {
    var t = this;
    var input_result = e.detail.value
    // app.console(school)
    t.setData({
      input_result: input_result,
    })

  },
  search: function (e) {
    var t = this;
    if (!t.data.input_result) {
      app.alert('搜索内容不能为空')
      return;
    }
    utils.net('/search-good', { 'q': t.data.input_result },
      function (e) {
        // app.console(e)
        if(e.code==200){
          t.setData({
            good_list: e.data.good_list.data
          })
        }
      }
    )
  },

  peking: function (e) {
    // app.console(e)
    var search_result = e.currentTarget.dataset.text, t = this;

    // 搜索记录存到本地
    var history_search = [];
    if (!app.getCache('history_search')) {
      history_search.push(search_result)
      app.setCache('history_search', history_search)
    } else {
      history_search = app.getCache('history_search')
      var conter = 0
      for (let i = 0; i < history_search.length; i++) {
        if (history_search[i] == search_result) {
          conter++;
          // app.console(history_search[i] + '==' + location)
        }
      }
      app.console('cont:' + conter)
      if (conter == 0) {
        app.console(2)
        history_search.push(search_result)
        app.setCache('history_search', history_search)
      }


    }
    utils.net('/search-good', { 'q': search_result },
      function (e) {
        app.console(e)
        if(e.code==200){
          t.setData({
            good_list: e.data.good_list.data
          })
        }
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
      history_search: app.getCache('history_search')
    })
  },
  listenerStorageClear: function () {
    var t = this;
    app.removeCache('history_search')
    t.setData({
      history_search: ''
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