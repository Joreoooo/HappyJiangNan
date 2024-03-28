const app=getApp()
const util=require("../../utils/util")
Page({
  data: {
    images:[],
  },


  onLoad: function (options) {
    //获取从上个页面带来的数据
    this.setData({
      index:options.tapIndex
    })
    console.log("发表页面的index："+this.data.index)

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
  getPlace1(e){
    console.log("输入的地点1：",e.detail.value)
    this.setData({
      placeFrom:e.detail.value
    })
  },
  getPlace2(e){
    console.log("输入的地点2：",e.detail.value)
    this.setData({
      placeTo:e.detail.value
    })
  },
  getCost(e){
    console.log("输入的价格：",e.detail.value)
    this.setData({
      cost:e.detail.value
    })
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
            cloudPath:"home.images/"+time+i,//文件名
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
    wx.cloud.database().collection('home').add({
      data:{
        index:Number(this.data.index)+1,
        nickName:this.data.userInfo.nickName,
        avatarUrl:this.data.userInfo.avatarUrl,
        content:this.data.content,
        placeFrom:this.data.placeFrom,
        placeTo:this.data.placeTo,
        contentImg:this.data.images,
        cost:this.data.cost,
        time:util.formatTime(new Date()),
      },
      success(res){
        console.log('发表订单成功',res)
        wx.navigateBack({
          success(res){
            wx.showToast({
              title: '发布成功',
            })
          }
        })
      }
    })
  }
})