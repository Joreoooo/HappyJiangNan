const app=getApp()
const util=require("../../utils/util")
let id=''
let db=wx.cloud.database()
Page({

  data: {
    isZan:0,
    zanNum:0,
    inputValue:'',
    placeholder:'想给TA评论点什么...',
    commentNum:0
  },
  onLoad(options) {
    var that=this;
    this.setData({
      userInfo:app.globalData.userInfo,
      id:options._id
    })
    console.log(options)
    db.collection('active').doc(options._id).get({
      success(res){
        console.log(res.data)
        that.setData({
          item:res.data,
          commentList:res.data.commentList,
          commentNum:res.data.commentList.length
        })
      }
    })

    setTimeout(()=>{
        //获取每条动态的点赞情况
        this.getZan();
    },1000) 

  },

   //点击头像进入他人主页
   toOther(){
    wx.navigateTo({
      url: '/pages/others/others?_openid='+this.data.item._openid,
    })
  },

  //删除动态
  delete(){
    var that=this;
    wx.showModal({
      title:"确认删除",
      content:"确认删除后不可恢复",
      success(res){
        if(res.confirm==true){
          wx.cloud.database().collection("active").doc(that.data.id).remove()
          .then(res=>{
            wx.showToast({
              title: '已删除',
              icon:"none"
            })  
            wx.switchTab({
              url: '/pages/active/active',
              success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }})
          })

        }
      }
    })
  },

  getComment(){
    var that=this;
    db.collection('active').doc(this.data.id).get({
      success(res){
        console.log(res.data.commentList)
        that.setData({
          commentList:res.data.commentList,
          commentNum:res.data.commentList.length
        })
      }
    })
  },
  //点赞or取消点赞
  zan(e){
    var myInfo=app.globalData.userInfo
    //如果点过赞
    var zanList=this.data.item.zanList
    if(this.data.isZan==1){
      zanList.splice(this.data.zanIndex,1)
      this.setData({
        isZan:0
      })
    }else{//未点赞，添加点赞记录
      zanList.push(myInfo)
      this.setData({
        isZan:1
      })
    }
    console.log('new zanList',zanList)
    db.collection('active').doc(this.data.item._id).update({
      data:{
        zanList:zanList
      }
    })
    this.getZan();
  }, 

  getZan(){
    var that=this;
    this.setData({
      zanNum:that.data.item.zanList.length,
      zanList:that.data.item.zanList
    })
    //查看自己是否点过赞
    for(var i=0;i<this.data.item.zanList.length;i++){
      //如果点过赞
      if(that.data.item.zanList[i].openid==app.globalData.userInfo.openid){
        that.setData({
          isZan:1,
          zanIndex:Number(i),
        })
      }
    }
  },

    //获取要发送的消息
    getInputValue(e){
      console.log(e.detail.value)
      this.setData({
        inputValue:e.detail.value
      })
    },
  
    //发送消息
    submit(){
      var that=this;
      if(this.data.inputValue!=''){
        db.collection('active').doc(that.data.item._id).get({
          success(res){
            console.log(res)
            var commentList=res.data.commentList
            var msg={}
            msg.comment=that.data.inputValue
            msg.nickName=that.data.userInfo.nickName
            msg.avatarUrl=that.data.userInfo.avatarUrl
            msg.openid=that.data.userInfo.openid
            msg.time=util.formatTime(new Date())
            commentList.push(msg)
            console.log(111,commentList)
  
            db.collection('active').doc(that.data.item._id).update({
              data:{
                commentList:commentList
              },success(res){
                wx.showToast({
                  title: '发送成功',
                })
                //发完消息要刷新一下页面，把新数据渲染出来
                //即再次调用获取聊天记录的函数
                that.getComment();
                //并把发送框清空
                that.setData({
                  inputValue:'',
                  placeholder:'想给TA评论点什么...'
                })
              }
            })
  
  
          }
        })
      }
    },
  

  
})