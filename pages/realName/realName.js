const app=getApp()
let db=wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue_name:'',
    inputValue_stuId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo:app.globalData.userInfo
    })

  },

//获取要发送的消息
getInputValue_name(e){
  console.log(e.detail.value)
  this.setData({
    inputValue_name:e.detail.value
  })
},
getInputValue_stuId(e){
  console.log(e.detail.value)
  this.setData({
    inputValue_stuId:e.detail.value
  })
},

//发送消息
submit(){
  var that=this;
  if(this.data.inputValue_name!=''&&this.data.inputValue_stuId!=''){
    db.collection('userList').where({_openid:this.data.userInfo.openid}).update({
      data:{ 
        realName:this.data.inputValue_name,
        stuId:this.data.inputValue_stuId,
      },
      success(res){
        console.log('实名认证成功',res)
        wx.switchTab({
          url: '/pages/mine/mine',
          success: function (e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
            wx.showToast({
              title: '发布成功', 
            })
        }})
      }
    })
  }
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})