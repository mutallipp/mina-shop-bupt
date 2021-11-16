// pages/me/me.js
var app=getApp(),utils=require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t = this,aaa={}
    // app.console(typeof aaa)
    var userInfo=app.globalData.userInfo
    // app.console(user_info)
    t.get_data()
    t.setData({
      userInfo: userInfo

    })
  },
  get_data:function(){
    var t=this;
    utils.net('/members/me',{},
    function(e){
      t.setData({
        me_cat_list:e.data.me_cat_list
      })
      // app.console(e.data)
    }
    )
  },

  me_cat:function(e){
    
    var index = e.currentTarget.dataset.index;
    if(index==0){
      app.console('我卖的')
      wx.navigateTo({
        url: "/pages/me/sell/sell",
      })
    } else if (index == 1) {
      app.console('个人积分')
      wx.navigateTo({
        url: "/pages/me/want/want",
      })
    } if (index == 2) {
      app.console('收藏')
      wx.navigateTo({
        url: "/pages/me/want/want",
      })
    } if (index == 3) {
      app.console('个人资料')
      wx.navigateTo({
        url: "/pages/me/member/member",
      })
    }
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