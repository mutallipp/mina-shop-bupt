// pages/detail/detail.js
var app=getApp();
var utils=require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    swiperCurrent:0,
    autoplay:1,
    interval: 3000,
    duration: 1000,
    qrc:'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p1597238857.webp',
      drawimg: "/images/botton_img.png",
    fillText: "您的好友",
    width: app.globalData.systemInfo.windowWidth,
    height: app.globalData.systemInfo.windowHeight,
    show_save_img_b:true
    // indicatorDots: 3,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var t = this, good_id = e.goodsId;
    t.setData({ good_id: good_id})
    // app.console(good_id)
    t.get_data(good_id);
    t.setData({
      userInfo: app.globalData.userInfo
    })
    app.console(t.data.userInfo)
  },

  get_data: function (good_id){
    var t=this;
    utils.net('/detail-get', { 'good_id': good_id},
    function(e){
      // app.console(e)   
      // 成功~~
      if(e.code==200){
      t.setData({
        good: e.data.good_info,
        comments: e.data.comment_list
      })
      }
    }
    )
  },

  contact:function(e){
    var t=this;
    var good=t.data.good
    if(app.globalData.user_info.id==good.member_id){
      app.alert("不能购买自己的宝贝哦~~~")
    }else{
      utils.net('/contact', { 'good_id': good.id},
      function(e){
        if(e.code==200){
          wx.makePhoneCall({
            phoneNumber: e.data.phone // 仅为示例，并非真实的电话号码
          })
        }else{
          app.alert(e.msg)
        }
      }
      )
    }
  },

  reply:function(e){  
    //app.console(e.detail.formId)
    var content = e.detail.value.content, form_id = e.detail.formId,t=this;
    var old_comment=t.data.comments
    var time = utils.formatTime(new Date()), userInfo = app.globalData.userInfo
   
    if (old_comment){
      for(let i in old_comment){
        if (old_comment[i].content.indexOf(content)==0){
          app.tip('不能重复发内容~~~', function (e) { })
          return;
        }
      }
      t.setData({
        comments: old_comment.concat([{ 'content': content, 'created_time': time }])
      })
    }else{
      t.setData({
        comments: [{ 'content': content, 'create_time': time }]
      })
    }
    
    utils.net('/send-comment', { 'good_id': t.data.good.id, 'to_member_id': t.data.good.member_id, 'content': content, 'nickname': userInfo.nickName, 'avatar': userInfo.avatarUrl, 'form_id': form_id},
    function(e){
      if(e.code==200){
        app.alert('留言成功','success')
      }
    }
    )
  },

  likeGood:function(e){
    var t=this;
    var good_id=t.data.good_id,act='add'
    //app.console(t.data.good.has_collected)
    utils.net('/good-like', { 'good_id': good_id, 'act': t.data.good.has_collected ? 'delete' :'add'},
    function(e){
      if(e.code==200){
        t.data.good.has_collected ? app.alert('收藏成功~~') : app.alert('取消收藏成功~~')
        app.alert('操作成功~~')
        var good=t.data.good
        good.has_collected = t.data.good.has_collected ? 0 : 1
        t.setData({good:good})
      }else{
        app.alert(e.msg)
      }
    }
    )
  },

  share: function () {
    var t=this;
    // this.drawShare(), this.setData({
    //   chooseSize: !1
    // });


    const wxGetImageInfo =utils.promisify(wx.getImageInfo)
    const width=t.data.width-20
    const height = t.data.height-20
    const e = width
    Promise.all([
      wxGetImageInfo({
        src: app.globalData.host +'/static/upload/api/icon/haibao/cv-botomm.png'
      }),
      wxGetImageInfo({
        src: t.data.good.img_url[1]
      })
    ]).then(res => {
      const a = wx.createCanvasContext('identify')

      // 底图
      // ctx.drawImage(res[0].path, 0, 0, 600, 900)

      a.drawImage(res[0].path, e / 7, 24 * e / 13 * 3 / 4 / 24, 5 * e / 7, e),
       a.fillRect(e / 4, 3 * e / 15, e / 2, e / 32 * 21),
        a.setFontSize(e / 30), a.setTextAlign("center"), a.fillText(t.data.userInfo.nickName, e / 2, e / 8),
        a.fillText("分享了一个宝贝给您~", e / 2, e / 5.5), a.fillText(t.data.good.title, e / 2, e / 1.1),
        a.setFontSize(e / 25), a.fillText("￥" + t.data.good.new_price, 5 * e / 12, e / 1.04),
        a.setFontSize(e / 35), a.fillText("￥" + t.data.good.old_price, 6.5 * e / 12, e / 1.04),
        a.fillRect(6.3 * e / 12, e / 1.05, 20, 1), a.drawImage(t.data.good.img_url[0], e / 4 / 95 * 100, e / 4.7, e / 2 * .95, e / 3 * 2 * .95),
        a.drawImage(res[1].path, 1.2 * e / 7, 1.01 * e, e / 6, e / 6), a.setFontSize(e / 30),
        a.setFillStyle("#666666"), a.setTextAlign("left"), a.fillText("长按识别小程序和我联系吧~", e / 13 * 5, 1.1 * e),
        a.setFontSize(e / 38), a.setFillStyle("#fc716a"), a.fillText("校转赚-校内二手交易平台", e / 13 * 5, 1.15 * e),

      // a.stroke()
      a.draw()
      setTimeout(function () {
        t.save2img()
      }, 1000)
      t.setData({ show_save_img_b:false})
    })
  },



  save2img:function(){

    const wxCanvasToTempFilePath =utils.promisify(wx.canvasToTempFilePath)
    const wxSaveImageToPhotosAlbum = utils.promisify(wx.saveImageToPhotosAlbum)

    wxCanvasToTempFilePath({
      canvasId: 'identify'
    }, this).then(res => {
      return wxSaveImageToPhotosAlbum({
        filePath: res.tempFilePath
      })
    }).then(res => {
      wx.showToast({
        title: '已保存到相册'
      })
    })
  },


  swiperchange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  backIndex:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  tapBanner: function (event){
    var t=this;
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = t.data.good.img_url;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var t=this
    //t.clipImg(t.data.good.img_url[0])
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