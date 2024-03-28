const app=getApp()
const util=require("../../utils/util")
Page({
  data: {
    tabs:[{topic:'校内打听',desc:'这里可以打听校内的一切信息，校内求助、捞人、失物、拼车、找资料等等'},
    {topic:'表白墙',desc:'分享校园内的温暖美丽瞬间，一起表白身边的人和事，让校园充满爱吧！'},
    {topic:'分享新鲜事',desc:'校园生活多姿多彩，每天都有新滋味，快来快来分享新鲜事！'},
    {topic:'疫情防控',desc:'在疫情反复无常的今天，我们更要时刻关注防疫信息，快来一起交流防疫情报吧！'},
    {topic:'组队搞事',desc:'一个人是否常常觉得无聊孤单？快来加入我们！在这里有许多志趣相投的小伙伴等你一起愉快玩耍！'},
    {topic:'桌游',desc:'有缘相识，快快关注桌游话题，和五湖四海的桌游爱好者成为知己，一同打造我们的桌游之家。'},
    {topic:'此刻',desc:'分享你此刻的心情吧，有人说开心的事情说出去就会加倍，难过的事情说出去就会消散'}],
    images:[],
    topicStatus:0,
    topic:"请选择话题"
  },


  onLoad: function (options) {
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

  //选择发表话题
  chooseTopic(){
    if(this.data.topicStatus==0){
      this.setData({
        topicStatus:1
      })
    }else{
      this.setData({
        topicStatus:0
      })
    }
  },

  //选择话题
  onTabClick(e){
    console.log("已选择的话题：",e.currentTarget.dataset.tag)
    this.setData({
      topic:e.currentTarget.dataset.tag
    })
    this.chooseTopic();
  },
 

  //添加图片
  chooseImg(){
    let that=this;
    wx.chooseImage({
      count: 9,
      sizeType:['original','compressed'],
      sourceType:['album','camera'],
      success(res){
        console.log("已选图片的临时路径：",res.tempFilePaths)
        //获取时间戳
        let time=Date.now()
        //上传图片到云数据库中
        for(var i=0;i<res.tempFilePaths.length;i++){
          wx.cloud.uploadFile({
            cloudPath:"active.images/"+time+i,//文件名
            filePath:res.tempFilePaths[i]//文件
          })
          .then(res=>{
            that.setData({
              images:that.data.images.concat(res.fileID) 
            })
          })
        }
      }
    })
  },

  //删除图片
  deleteImage(e){
    console.log('删除的图片的原index：',e.currentTarget.dataset.index)
    this.data.images.splice(e.currentTarget.dataset.index,1)
    this.setData({
      images:this.data.images
    })
  },

  //发表订单
  submit(){
    wx.cloud.database().collection('active').add({
      data:{
        nickName:this.data.userInfo.nickName,
        avatarUrl:this.data.userInfo.avatarUrl,
        content:this.data.content,
        contentImg:this.data.images,
        tag:this.data.topic,
        zanList:[],
        commentList:[],
        time:util.formatTime(new Date()),
      },
      success(res){
        console.log('发表帖子成功',res)
        wx.switchTab({
          url: '/pages/active/active',
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
})