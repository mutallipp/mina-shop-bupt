module.exports = {
  valiPhone: valiPhone,
}

function valiPhone(phone){
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
  if (phone.length == 0) {
    wx.showToast({
      title: '输入的手机号为空',
      icon: 'success',
      duration: 1500
    })
    return false;
  } else if (phone.length < 11) {
    wx.showToast({
      title: '手机号长度有误！',
      icon: 'success',
      duration: 1500
    })
    return false;
  } else if (!myreg.test(phone)) {
    wx.showToast({
      title: '手机号有误！',
      icon: 'success',
      duration: 1500
    })
    return false;
  } else {
    return true
  }
}