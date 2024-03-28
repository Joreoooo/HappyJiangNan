const app=getApp()
const util=require("../../utils/util")
Page({


  data: {
    realName:'',
    stuId:''
  },

  getUserProfile(){
    var that=this;
    wx.getUserProfile({
      desc: '授权用户信息',
      success(res){
        console.log(res)
        that.setData({
          userInfo:res.userInfo
        })
        wx.cloud.callFunction({
          name:'getUserOpenid'  
        }).then(res=>{
          console.log(res,111111)
          that.setData({
            ['userInfo.openid']:res.result.userInfo.openId
          })
          console.log(that.data.userInfo.openid)
          console.log(that.data)
          app.globalData.userInfo=that.data.userInfo
          wx.setStorageSync('userInfo', that.data.userInfo)
          //先在数据库中查询是否登陆过
          wx.cloud.database().collection('userList').where({_openid:res.result.openid}).get({
            success(res){
              if(res.data.length>0){
                console.log("曾经登陆过",res.data[0].realName,res.data[0].openid)
                
              }else{
                wx.cloud.database().collection('userList').add({
                  data:{
                  avatarUrl:that.data.userInfo.avatarUrl,
                  nickName:that.data.userInfo.nickName,
                  fans:[],
                  customer:0,
                  zan:0
                  }
                })
              }
            }
          })
        })
      }
    })
  },
  onShow() {
    var that=this;
    this.setData({
      userInfo:app.globalData.userInfo
    })
    
       //获取聊天recordId
       setTimeout(()=>{
        wx.cloud.database().collection('userList').where({_openid:that.data.userInfo.openid}).get({
          success(res){
              that.setData({
                realName:res.data[0].realName,
                stuId:res.data[0].stuId,
              }) 
            }
          })
      },500)



    this.getNum();
  },

  getNum(){
    var that=this;   
     //获取我的帖子数
    wx.cloud.database().collection('active').where({_openid:this.data.userInfo.openid}).get({
      success(res){
        console.log('my active:',res.data.length)
        that.setData({
          activeNum:res.data.length
        })
      }
    })
    //获取我的订单数
    wx.cloud.database().collection('home').where({_openid:this.data.userInfo.openid}).get({
      success(res){
        console.log('my order:',res.data.length)
        that.setData({
          orderNum:res.data.length
        })
      }
    })
  },

  toMyActive(){
    wx.navigateTo({
      url: '/pages/myActive/myActive',
    })
  },
  toMyOrder(){
    wx.navigateTo({
      url: '/pages/myOrder/myOrder',
    })
  },

  toOther(){
    wx.navigateTo({
      url: '/pages/others/others?_openid='+this.data.userInfo.openid,
    })
  },

  toGetMoney(){
    wx.navigateTo({
      url: '/pages/getMoney/getMoney?_openid='+this.data.userInfo.openid,
    })
  },
  toChongMoney(){
    wx.navigateTo({
      url: '/pages/chongMoney/chongMoney?_openid='+this.data.userInfo.openid,
    })
  },
  toQuestion(){
    wx.navigateTo({
      url: '/pages/question/question?_openid='+this.data.userInfo.openid,
    })
  },

  toRealName(){
    wx.navigateTo({
      url: '/pages/realName/realName',
    })
  }



})