const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onShow() {
    this.setData({
      userInfo:app.globalData.userInfo
    })

    this.getMyMsgList();
  },

  //获取所有和我聊天的用户列表
  getMyMsgList(){
    var that=this;
    //获得聊天记录数据库中，用户A或B是本人的记录
    const _=wx.cloud.database().command //不知道为啥，只有像这样在外面重新命名之后函数才能正确使用
    wx.cloud.database().collection('chat_record').where(
      _.or([
        {
          _openid:app.globalData.userInfo.openid
        }, 
        {
          userB_openid:app.globalData.userInfo.openid
        }
      ])
    ).orderBy('time','desc')//按时间顺序排列
    .get({
      success(res){
        console.log('与我有聊天记录的聊天数据：',res.data)
        that.setData({
          myMsgList:res.data
        })
      }
    })
  },

  //跳转到正在聊天的页面
  toChatting(e){
    console.log(e.currentTarget.dataset.openid)
    wx.navigateTo({
      url: '/pages/chatting/chatting?_openid='+e.currentTarget.dataset.openid,
    })
  }

})