const app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:null,
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo_openid:app.globalData.userInfo.openid
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击“帮助他”进入聊天页面
    toChat(){
      wx.navigateTo({
        url: '/pages/chatting/chatting?_id='+this.properties.item._id+'&_openid='+this.properties.item._openid,
      })
    },
    //点击头像进入他人主页
    toOther(){
      wx.navigateTo({
        url: '/pages/others/others?_openid='+this.properties.item._openid,
      })
    }
  }
})
