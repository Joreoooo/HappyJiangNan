const app=getApp()
const util=require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获得个人数据
    this.setData({
      userInfo:app.globalData.userInfo
    })
  },
  //获取所有输入数据
  getInput(e){
    console.log("输入的文本内容：",e.detail.value)
    this.setData({
      content:e.detail.value
    })
  },

   //发表订单
   submit(){
    wx.cloud.database().collection('question').add({
      data:{
        nickName:this.data.userInfo.nickName,
        avatarUrl:this.data.userInfo.avatarUrl,
        content:this.data.content,
      },
      success(res){
        console.log('发表帖子成功',res)
        wx.switchTab({
          url: '/pages/mine/mine',
          success: function (e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
            wx.showToast({
              title: '提交成功',
            })
        }})
      }
    })
  }
})