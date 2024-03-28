const app=getApp()
const util=require("../../utils/util")
Page({

  data: {
    tabs:['全部',' 热门','校内打听','表白墙','分享新鲜事','疫情防控','组队搞事','桌游','此刻'],
    tabIndex:0,
    tabTag:""
  },

  onShow() {
    this.onLoad();
    this.getActiveList();
  },
  onLoad(){
     //获取个人数据
     this.setData({
      userInfo:app.globalData.userInfo
    })
    this.getActiveList();
  },
 


  getActiveList(){
    var that=this;
    wx.cloud.database().collection('active').orderBy('time','desc').get({
      success(res){
        console.log(res.data)
        that.setData({
          activeList:res.data
        })
      }
    })
  },

  //点击tab切换页面 
  onTabClick(e){
    var that=this;
    let index=e.currentTarget.dataset.index
    let tag=e.currentTarget.dataset.tag
    this.setData({
      tabIndex:index,
      tabTag:tag
    })
    console.log(this.data.tabTag)
  },

  //发布动态
  toPublish(){
    if(app.globalData.userInfo.length==0){
      wx.showToast({
        title: '请先登录',
        icon:'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/pubActive/pubActive',
    })
  },


})