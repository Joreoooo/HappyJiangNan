let db=wx.cloud.database();
const app=getApp();
const util=require("../../utils/util")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:null
  },

  /**
   * 组件的初始数据
   */
  data: {
    isZan:0,
    zanNum:0
  },

  methods: {

    

    //点击头像进入他人主页
    toOther(){
      wx.navigateTo({
        url: '/pages/others/others?_openid='+this.properties.item._openid,
      })
    },

    //动态详情
    toDetail(){
      wx.navigateTo({
        url: '/pages/detail/detail?_id='+this.properties.item._id,
      })
    },

       //预览图片
   lookimage(e){
    console.log(e.currentTarget.dataset)
    wx.previewImage({
      current:e.currentTarget.dataset.id,//当前图片的链接
      urls: e.currentTarget.dataset.all//所有图片的链接
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
            wx.cloud.database().collection("active").doc(that.properties.item._id).remove()
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

    //点赞or取消点赞
    zan(e){
      var myInfo=app.globalData.userInfo
      //如果点过赞
      var zanList=this.properties.item.zanList
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
      db.collection('active').doc(this.properties.item._id).update({
        data:{
          zanList:zanList
        }
      })
      this.getZan();
    }, 

    getZan(){
      var that=this;
      this.setData({
        zanNum:this.properties.item.zanList.length,
        zanList:this.properties.item.zanList
      })
      //查看自己是否点过赞
      for(var i=0;i<this.properties.item.zanList.length;i++){
        //如果点过赞
        if(that.properties.item.zanList[i].openid==app.globalData.userInfo.openid){
          that.setData({
            isZan:1,
            zanIndex:Number(i),
          })
        }
      }
    },

  },
  ready:function(){
    //获取每条动态的点赞情况
    this.getZan();
    this.setData({
      userInfo:app.globalData.userInfo
    })

  },




})
