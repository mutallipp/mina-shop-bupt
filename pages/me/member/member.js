// pages/me/member/member.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t=this
    t.setData({
      userInfo:app.globalData.userInfo,
      status: 1
      })
    app.console(app.globalData.user_info)
  },

get_user_info:function(){
  var t=this
  var user_info = app.globalData.user_info
  if(!user_info){
    t.get_user_info()
  }else{
    t.setData({
      status: user_info.status
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