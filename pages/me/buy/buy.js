var app = getApp(), utils = require('../../../utils/util.js');
Page({
  data: {
    order_list: ['', ''],
    statusType: ["求购", "待收货", "交易中", "已完成"],
    currentType: 0,
    tmp_type: 2
  },
  statusTap: function (e) {
    var currentType = e.currentTarget.dataset.index, t = this;
    t.setData({
      currentType: currentType
    })
    t.showView()

  },
  set_goodList: function (c_status) {
    var t = this;
    // app.console('set_goodList')
    var all_good = t.data.all_good;
    var good_list = [];
    if(c_status==1){
      for (var i = 0; i < all_good.length; i++) {
        if (all_good[i].c_status == c_status && all_good[i].status==3) {
          good_list.push(all_good[i])
        }
      }
    }else{
      for (var i = 0; i < all_good.length; i++) {
        if (all_good[i].c_status == c_status) {
          good_list.push(all_good[i])
        }
      }
    }
    t.setData({
      good_list: good_list
    })
  },
  orderDetail: function (e) {
    wx.navigateTo({
      url: "/pages/my/order_info?order_sn=" + e.currentTarget.dataset.id
    })
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var t = this;
    t.get_data()
  },
  get_data: function () {
    var t = this;
    utils.net('/member/buy-list', {'act':'buy'},
      function (e) {
        t.setData({
          all_good: e.data.good_list,
        })
        t.set_goodList(1);
      }
    )
  },
  showView: function (e) {
    var t = this;
    var all_good = t.data.all_good, currentType = t.data.currentType;
    var good_list = [];
    // app.console('showView')
    // app.console(currentType)
    if (currentType == 0) {
      // 在架宝贝
      t.set_goodList(1)
    } else if (currentType == 1) {
      // 待发货
      t.set_goodList(3)
    } if (currentType == 2) {
      // 在交易中
      t.set_goodList(2)
    } if (currentType == 3) {
      // 已完成
      t.set_goodList(4)
    } if (currentType == 4) {
      // 下架宝贝
      t.set_goodList(9)
    }

  },
  onShow: function () {

  },
  actOrder: function (e) {
    var t = this, act = e.currentTarget.dataset.act, good_id = e.currentTarget.dataset.id, index = e.currentTarget.dataset.index;
    // app.console(index)
    // app.console(good_id)
    if (act == 'xiajia') {
      app.console('xiajia')
      app.show('确定下架吗？',
        function (e) {
          t.edit(9, index)
          utils.net('/good-updata', { 'good_id': good_id, 'act': 'xiajia' },
            function (e) {
              app.alert(e.msg);
            }
          )
        }
      )
      return;
    } else if (act == 'edit') {
      app.console('edit')
      wx.navigateTo({
        url: '/pages/guidepublish/upload/upload?q=' + '2' + '&good_id=' + good_id,
      })
      return;
    } if (act == 'cSell') {
      app.console('cSell')
      app.show('确定发货吗？',
        function (e) {
          t.edit(3, index)
          utils.net('/good-updata', { 'good_id': good_id, 'act': 'cSell' },
            function (e) {
              app.alert(e.msg);
            }
          )
        }
      )
      return;
    } else if (act == 'contact') {
      app.console('contact')
      utils.net('/get-good-info', { 'good_id': good_id,'who':'buy' },
        function (e) {
          if (e.code == 200) {
            wx.makePhoneCall({
              phoneNumber: e.data.phone // 仅为示例，并非真实的电话号码
            })
          } else {
            app.console(e.msg)
          }

        }
      )
      return;
    } else if (act == 'delate') {
      app.console('delate')
      app.show('确定删除吗？',
        function (e) {
          t.edit(0, index)
          utils.net('/good-updata', { 'good_id': good_id, 'act': 'delate' },
            function (e) {
              app.alert(e.msg);
            }
          )
        }
      )
      return;
    }
  },

  orderConfirm: function (e) {

  },
  goAcit: function (e) {
    wx.navigateTo({
      url: "/pages/my/comment?order_sn=" + e.currentTarget.dataset.id
    });
  },

  is_see: function (e) {
    var t = this;
    // app.console(e.currentTarget.dataset.id)
    var index = e.currentTarget.dataset.index;
    var good_id = t.data.good_list[index].id
    var all_good = t.data.all_good, good_list = t.data.good_list;
    good_list[index].is_see = 1
    for (var i = 0; i < all_good.length; i++) {
      if (all_good[i].id = good_id) {
        all_good[i].is_see = 1;
        break;
      }
    }
    t.setData({
      all_good: all_good,
      good_list: good_list
    })
    utils.net('/good-updata', { 'good_id': e.currentTarget.dataset.id, 'act': 'is_see' },
      function (e) {

      }
    )
  },
  edit: function (c_status, index) {
    var t = this;
    var good_id = t.data.good_list[index].id
    var all_good = t.data.all_good, good_list = t.data.good_list;
    app.console(good_list[index])
    for (var i = 0; i < all_good.length; i++) {
      if (all_good[i].id == good_id) {
        all_good[i].c_status = c_status;
        app.console(all_good[i].c_status)
        app.console(all_good[i].title)
        break;
      }
    }
    t.setData({
      all_good: all_good,
    })
    t.showView()
  }
});
