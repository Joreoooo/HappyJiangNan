const app=getApp()
const util=require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },


  onLoad(options) {
    var that=this;
    wx.cloud.database().collection('active').where({_openid:app.globalData.userInfo.openid}).get({
      success(res){
        console.log(res.data)
        that.setData({
          MyActiveList:res.data
        })
      }
    })
  },

 
})