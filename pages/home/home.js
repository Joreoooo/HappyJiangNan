const app=getApp()
Page({

  data: {
    tabs:[' 全部订单 ',' 悬赏令 ',' 失物招领 ',' 二手交易 '],
    tabIndex:0,
    pubIndex:''
  },

  onShow(options) {
    //获取个人数据
    this.setData({
      userInfo:app.globalData.userInfo
    })

    let db=wx.cloud.database();
    let that=this;
    //获取全部首页数据
    db.collection('home').orderBy('time','desc').get({
      success(res){
        console.log("all",res)
        that.setData({
          allList:res.data
        })
      }
    })

    //悬赏令
    db.collection('home').where({index:1}).orderBy('time','desc').get({
      success(res){
        console.log(res)
        that.setData({
          rewardList:res.data
        })
      }
    })
    //失物招领
    db.collection('home').where({index:2}).orderBy('time','desc').get({
      success(res){
        console.log(res)
        that.setData({
          lostList:res.data
        })
      }
    })
    //二手交易
    db.collection('home').where({index:3}).orderBy('time','desc').get({
      success(res){
        console.log(res)
        that.setData({
          secondList:res.data
        })
      }
    })



  },


  //点击tab切换页面 
  onTabClick(e){
    var that=this;
    //console.log(e.currentTarget.dataset.index)
    let index=e.currentTarget.dataset.index
    this.setData({
      tabIndex:index
    })
  },

  //跳转至发表新需求
  toPublish(){
    if(app.globalData.userInfo.length==0){
      wx.showToast({
        title: '请先登录',
        icon:'none'
      })
      return
    }
    var that=this;
    wx.showActionSheet({
      itemList: ['悬赏令','失物招领','二手交易'],
      success(res){
        console.log(res.tapIndex)
        wx.navigateTo({
          url: '/pages/pubOrder/pubOrder?tapIndex='+res.tapIndex,
        })
      }
    })

  }
})