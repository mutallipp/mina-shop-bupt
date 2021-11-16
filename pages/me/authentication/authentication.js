// pages/me/authentication/authentication.js
const app=getApp(),utils=require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:4,
    cardpics:'/images/icon.png',
    withcardpics: '/images/icon.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // "pages/me/me"
  },
  form:function(e){
    var t=this
    app.console(e.detail.value)
    var value = e.detail.value
    if (!value.school){
      app.tip('请输入学校~~~')
      return;
    } else if (!value.studentID) {
      app.tip('请输入学号~~~')
      return;
    } if (!value.user_name) {
      app.tip('请输入名称~~~')
      return;
    } if (!value.phone) {
      app.tip('请输入手机号~~~')
      return;
    } else if (!t.data.ID_card && !t.data.SID_card){
      app.tip('请输入上传学生证或者身份证~~~')
      return;
    }

    utils.net('/post-authentical', { 'school': value.school, 'studentID': value.studentID, 'user_name': value.user_name, 'phone': value.phone},
    function(e){
      if(e.code==200){
        utils.upload_file('upload-authentical-img', t.data.ID_card,'ID_card',{},
        function(e){
          if(e.code==200){

          }
        }
        )

        utils.upload_file('upload-authentical-img', t.data.SID_card, 'SID_card', {},
          function (e) {
            if (e.code == 200) {

            }
          }
        )
      }
    }
    )
  },

  uploadSImg: function () {
    var t = this, a = wx.createCanvasContext("myCanvas");
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: function (e) {
        console.log(e);
        var n = e.tempFilePaths;
        t.setData({
          cardpics: n[0]
        }), wx.getImageInfo({
          src: n[0],
          success: function (n) {
            console.log(n), t.setData({
              cardpicsWidth: n.width,
              cardpicsHeight: n.height
            });
            var s = t.data.cardpicsHeight / t.data.cardpicsWidth;
            a.drawImage(e.tempFilePaths[0], 0, 0, 300, 300 * s), a.draw(!1, function () {
              wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: 300,
                height: 300 * s,
                destWidth: 300,
                destHeight: 300 * s,
                canvasId: "myCanvas",
                success: function (a) {
                  app.console("hanwei", a), t.setData({
                    SID_card: a.tempFilePath
                  });
                }
              });
            });
          }
        });
      }
    });
  },

  uploadUImg: function () {
    var t = this, a = wx.createCanvasContext("youCanvas");
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: function (e) {
        var n = e.tempFilePaths;
        t.setData({
          withcardpics: n[0]
        }), wx.getImageInfo({
          src: n[0],
          success: function (n) {
            t.setData({
              cardpicsWidth: n.width,
              cardpicsHeight: n.height
            });
            var s = t.data.cardpicsHeight / t.data.cardpicsWidth;
            a.drawImage(e.tempFilePaths[0], 0, 0, 300, 300 * s), a.draw(!1, function () {
              wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: 300,
                height: 300 * s,
                destWidth: 300,
                destHeight: 300 * s,
                canvasId: "youCanvas",
                success: function (a) {
                  console.log("hanwei", a.tempFilePath), t.setData({
                    ID_card: a.tempFilePath
                  });
                }
              });
            });
          }
        });
      }
    });
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