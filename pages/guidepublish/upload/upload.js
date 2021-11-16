var app=getApp();
var utils=require('../../../utils/util.js');
var validator=require('../../../utils/validator.js')
Page({
  data: {
    showTopTips: false,
    files: [],
    countIndex: 3,//最多上传图片的数量
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    isAgree: false,
    secectedHomeCat:"请选择",
    secectedCat:"请选择",
    is_free:0,
    updata_img:1
  },

  onLoad: function (e) {
    // app.console(e)
    var t=this;
    if(e.q=='1'){
      t.get_data()
      wx.setNavigationBarTitle({
        title: '发布商品',
      })
      t.setData({
        goog_status:1
      })
      if(e.good_id){
        t.edit(e.good_id)
      }
      
    }else{
      // app.console(22222)
      wx.setNavigationBarTitle({
        title: '求购',
      })
      t.setData({
        goog_status: 3
      })
      t.get_data()
      if (e.good_id) {
        t.edit(e.good_id)
      }
    }
    
  },
  edit:function(good_id){
    var t=this;
    app.console('edit update')
    utils.net('/get-good-info', { 'good_id': good_id },
      function (e) {
        if (e.code == 200) {
          var good=e.data.good_info,home_cat_list=t.data.home_cat_list
          for(var i=0;i<home_cat_list.length;i++){
            if (home_cat_list[i].id == good.home_cat_id){
              t.setData({
                secectedHomeCat: home_cat_list[i].title
              })
              break;
            }
          }
          var cat_title = [], cat_list = t.data.cat_list;
          for (var i = 0; i < cat_list.length; i++) {
            if (good.home_cat_id == cat_list[i].home_cat_id) {
              cat_title.push(cat_list[i].title)
            }
            if(good.cat_id==cat_list[i].id){
              t.setData({ 
                secectedCat:cat_list[i].title,
                cat_id:cat_list[i].id
                })
            }
          }
          t.setData({
            cat_title: cat_title,
            home_cat_id: good.home_cat_id
          })
         t.setData({
           title:good.title,
           discreption: good.discreption,
           phone:good.phone,
           old_price: good.old_price,
           new_price: good.new_price,
           good_id:good.id,
           updata_img:0,
         })
        } else {
          app.console(e.msg)
        }

      }
    )
  },
  uploadGoods:function(e){
    // app.console(e)
    var t=this,ob=e.detail.value
    var title = ob.title, discreption = ob.discreption, home_cat_id = t.data.home_cat_id, cat_id = t.data.cat_id, files = t.data.files, new_price = ob.new_price, old_price = ob.old_price, goog_status = t.data.goog_status, phone = ob.phone, updata_img = t.data.updata_img;
    app.console(goog_status)
    if(!title){
      t.showTopTips('请输入商品名字~~')
      return;
    } else if (!discreption){
      t.showTopTips('请输入商品介绍~~')
      return;
    } else if (!validator.valiPhone(phone)) {
      // t.showTopTips('请输入手机号~~')
      return;
    } else if (!home_cat_id || !cat_id) {
      t.showTopTips('请选择商品类型~~')
      return;
    } else if (!files[0]&&updata_img) {
      t.showTopTips('请选择图片上传~~')
      return;
    } else if (goog_status==1&&!new_price) {
      t.showTopTips('请输入二手价~~')
      return;
    } else if (goog_status==1 &&!old_price) {
      t.showTopTips('请输入原价~~')
      return;
    } else if (!t.data.isAgree) {
      t.showTopTips('你还没同意相关条款~~')
      return;
    }else{
    var formData={
      'title': title,
      'discreption':discreption,
      'home_cat_id':home_cat_id,
      'cat_id':cat_id,
      'new_price': new_price,
      'old_price': old_price,
      'goog_status': goog_status,
      'phone':phone,
      'updata_img':updata_img,
      'good_id':t.data.good_id
    }
      var index = 1;
      wx.showToast({
        title: '上传中。。' + index+'/'+files.length,
        icon: 'loading',
        duration: 200000
      })
      utils.net('/upload-goods', formData,
    function(e){
      // 成功
      var good_id = e.data.good_id
     
      if(e.code==200&&updata_img){
        for (var i = 0; i < files.length;i++){
          utils.upload_file('/upload-img', files[i], 'img', { 'good_id': good_id},
          function(e){
            // 成功
            app.console('index:'+index)
            if (index == files.length){
              wx.hideToast()
              app.alert('发布成功~~', 'success', 1500)
              setTimeout(function () {
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }, 1500);
            }
            index++
          },
          function(e){
            // 失败
            wx.hideToast()
          }
          )
        }
      }else{
        app.alert('发布成功~~', 'success', 1500)
        setTimeout(function () {
          wx.navigateBack({
          })
        }, 1500);
      }
    }
    )
    }
  },

  get_data:function(){
    var t=this;
    utils.net('/upload-get', { },
    function(e){
      t.setData({
        home_cat_list: e.data.home_cat_list,
        cat_list: e.data.cat_list
      })
      var home_cat_title = [], home_cat_list = t.data.home_cat_list;
      for (var i = 0; i < home_cat_list.length;i++){
        home_cat_title.push(home_cat_list[i].title)
        }
        t.setData({
          home_cat_title: home_cat_title
        })
    })
   
  },
  showTopTips: function (error) {
    var that = this;
    this.setData({
      showTopTips: true,
      error: error
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },

  
  switchChange:function(){
    var t=this;
    t.setData({
      is_free: !t.data.is_free
    })
    if (t.data.is_free){
      t.setData({
        goog_status:2
      })
    }else{
      t.setData({
        goog_status: 1
      })
    }
  },
  
  bindCatChange: function (e) {
    var t=this;
    var cat_list = t.data.cat_list, home_cat_id = t.data.home_cat_id, cat_title = t.data.cat_title;
    console.log('picker country 发生选择改变，携带值为', e.detail.value);
    for (var i = 0; i < cat_list.length;i++){
      if (home_cat_id == cat_list[i].home_cat_id){
        if (cat_list[i].title == cat_title[e.detail.value]){
          t.setData({
            cat_id: cat_list[i].id
          })
        }

      }
    }
    t.setData({
      secectedCat: t.data.cat_title[e.detail.value],
      home_cat_id: home_cat_id ,
      // cat_id: t.data.cat_list[t.data.home_cat_index][e.detail.value].id
    })
    // app.console('home_cat_id:'+t.data.home_cat_id)
    // app.console('cat_id:' + t.data.cat_id)
    
  },
  
  bindHomeCatChange: function (e) {
    var t=this;
    console.log('picker account 发生选择改变，携带值为', e.detail.value);
    var home_cat_list = t.data.home_cat_list, cat_list = t.data.cat_list;
    var home_cat_id = home_cat_list[e.detail.value].id
    var cat_title = [], cat_index=0;
    for (var i = 0; i < cat_list.length;i++){
      if (home_cat_id == cat_list[i].home_cat_id){
        cat_title.push(cat_list[i].title)
      }
    }
    this.setData({
      secectedHomeCat: home_cat_list[e.detail.value].title,
      cat_title: cat_title,
      home_cat_index: e.detail.value,
      home_cat_id: home_cat_id
    })
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: this.data.count[this.data.countIndex],
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  }
});