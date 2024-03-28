const app=getApp()
const util=require("../../utils/util")


let openid=""
let targetOpenid = ""
let db=wx.cloud.database()
Page({

  data: {
    zan:0, 
    customer:0,
    hisActive:[],
    isLike:0,
    fansNum:0,  
    allZan:0
  },

  onLoad(options) {
    var that=this;
    var db=wx.cloud.database();
    this.setData({
      userInfo:app.globalData.userInfo
    })

    console.log('该他人主页的openid为：',options._openid)
    //将从上个页面携带过来的openid赋值给全局变量openid
    // openid=options._openid
    targetOpenid =options._openid ;
    this.getActive();
    this.getUserInfo();
    setTimeout(()=>
    { 
      this.getLike();
      this.getInter();
    }, 1000) 


  },

  //检查自己是否关注过
  getLike(){
    var that=this;
    this.setData({
      fansNum:that.data.hisUserInfo[0].fans.length//获取粉丝数
    })
    console.log(that.data.hisUserInfo[0])
    for(var i=0;i<that.data.hisUserInfo[0].fans.length;i++){
      //如果有找到自己关注的记录
      if(that.data.hisUserInfo[0].fans[i].openid==app.globalData.userInfo.openid){
        that.setData({ 
          isLike:1, 
          likeIndex:Number(i) 
        })
      }
    }
  },

  //获取动态
  getActive(){
    var that=this;
    var db=wx.cloud.database();
    db.collection('active').where({
      _openid:targetOpenid
    }).orderBy('time','desc').get({
      success(res){
        console.log('查询到的该openid携带的动态数据',res.data)
        that.setData({
          hisActive:res.data,
          
        })       
      }
    })
    
  },
  //获取个人信息
  getUserInfo(){
    var that=this;
    var db=wx.cloud.database();
    console.log("该页面的openid！！！！！！",targetOpenid)
    db.collection('userList').where({
      _openid:targetOpenid
    }).get({
      success(res){
        console.log('他人信息:',res.data)
        that.setData({
          hisUserInfo:res.data 
        })
      }
    })

  },
  //获取点赞，访客
  getInter(){
    var that=this;
    wx.cloud.database().collection('userList').where({
      _openid:openid
    }).update({
      data:{ 
        customer:Number(that.data.hisUserInfo[0].customer)+1
      }
    })
    wx.cloud.database().collection('userList').where({
      _openid:openid
    }).get({ 
      success(res){
        console.log('getInfo',res) 
        that.setData({
          allZan:res.data[0].zan
        })
      }
    })
  },

  //关注
  like(e){
    var that=this;
    var fans=this.data.hisUserInfo[0].fans
    //先查看是否关注过
    //如果没有关注过添加至关注列表
    if(this.data.isLike==0){
      var myInfo=app.globalData.userInfo;
      fans.push(myInfo)
      this.setData({
        isLike:1,
      })
      console.log('new fans',fans)
    }else{//如果关注了，取消关注
      fans.splice(that.data.likeIndex,1)
      this.setData({
        isLike:0,
      })
      console.log('new fans',fans)
    }
    db.collection('userList').where({_openid:e.currentTarget.dataset.openid}).update({
      data:{
        fans:fans
      }
    })
    this.getLike();//获取最新的关注人数

  },

  //查看关注列表
  toFans(){
    wx.navigateTo({
      url: '/pages/fans/fans?_openid='+this.data.hisUserInfo[0]._openid,
    })
  }


})