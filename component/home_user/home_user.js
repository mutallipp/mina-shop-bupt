// component/home_user.js
var utils=require('../../utils/util.js'),app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    user_info : null
  },

  /**
   * 组件的方法列表
   */
  attached() {
    var user_info = app.globalData.userInfo
    this.setData({
      user_info: user_info
    })
     }, 
  ready() { },
  methods: {
    
  }
})
