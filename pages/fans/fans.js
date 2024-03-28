// pages/fans/fans.js
Page({

  data: {

  },

  onLoad(options) {
    console.log(options)
    this.setData({
      _openid:options._openid
    })
    this.getFans();
  },
  //获取粉丝列表
  getFans(){
    var that=this;
    wx.cloud.database().collection('userList').where({_openid:this.data._openid}).get({
      success(res){
        console.log('粉丝列表',res.data[0].fans)
        that.setData({
          fansList:res.data[0].fans
        })
      }
    })
  },

  //点击进入他人主页
  toOther(e){
    console.log(e.currentTarget.dataset._openid)
    wx.navigateTo({
      url: '/pages/others/others?_openid='+e.currentTarget.dataset._openid,
    })
  },


})