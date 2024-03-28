const app=getApp()
const util=require("../../utils/util")
let id=''
let db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordId:'',
    inputValue:'',
    placeholder:'想跟TA说点什么...'
  },

  onLoad(options) {
    this.setData({
      userInfo:app.globalData.userInfo
    })
    console.log(options)
    this.setData({
      chatterOpenid:options._openid
    })
    //在userList里查询该用户，添加至聊天列表
    this.getChatterInfo();

    //获取聊天recordId
    setTimeout(()=>{
      this.getChatRecordId();
    },500)

    //利用定时器，就能实现实时加载聊天记录的功能
    let Interval=setInterval(()=>{
      //循环执行的内容
      this.getChatRecord()
    },2000);

    this.setData({
      interval:Interval
    })
  },

  //退出聊天页面之后要停止循环
  onUnload(){
  console.log("页面关闭了")
  //关定时器要用到之前设置的变量，所以前面要把设置的interval存到data里
  clearInterval(this.data.interval)
  },

  //获取聊天对象信息
  getChatterInfo(){
    var that=this;
    db.collection('userList').where({
      _openid:this.data.chatterOpenid
    }).get({
      success(res){
        console.log('获得该用户数据',res.data[0])
        that.setData({
          chatterInfo:res.data[0]
        })
      }
    })
  },

  //获取聊天recordId
  getChatRecordId(){
    var that=this;
    const _=wx.cloud.database().command
    db.collection('chat_record').where(
      _.or([
        {
          _openid:that.data.userInfo.openid,
          userB_openid:that.data.chatterInfo._openid
        },
        {
          userB_openid:that.data.userInfo.openid,
          _openid:that.data.chatterInfo._openid
        }
      ])
    ).orderBy('time','desc').get({
      success(res){
        console.log('聊天信息',res.data[0]) 
        if(res.data[0]==undefined){
          that.addChatList();
        }else{
          that.setData({
          chatList:res.data[0].record,
          recordId:res.data[0]._id
          })
        }
      }
    })
  },

  //获取聊天内容
  getChatRecord(){
    var that=this;
    const _=wx.cloud.database().command
    db.collection('chat_record').where({
      _id:that.data.recordId
    }).orderBy('time','desc').get({
      success(res){ 
        //太可怕了先注释掉。。。。。。。。。。。。。。。
        //console.log('聊天内容',res.data[0].record)
        that.setData({
          chatList:res.data[0].record,
        })
      }
    })
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
    console.log("被按到了")
    var that=this;
    if(this.data.inputValue!=''){
      db.collection('chat_record').doc(that.data.recordId).get({
        success(res){
          console.log(res)
          var record=res.data.record
          var msg={} 
          msg.text=that.data.inputValue
          msg.nickName=that.data.userInfo.nickName
          msg.avatarUrl=that.data.userInfo.avatarUrl
          msg.openid=that.data.userInfo.openid
          msg.time=util.formatTime(new Date())
          record.push(msg)
          console.log('要添加的消息',record)

          db.collection('chat_record').doc(that.data.recordId).update({
            data:{
              record:record
            },success(res){
              wx.showToast({
                title: '发送成功',
              })
              //发完消息要刷新一下页面，把新数据渲染出来
              //即再次调用获取聊天记录的函数
              that.getChatRecord();
              //并把发送框清空
              that.setData({
                inputValue:'',
                placeholder:'想跟TA说点什么...'
              })
            }
          })


        }
      })
    }
  },

  getOrder(){
    var that=this;  
    wx.cloud.database().collection('home').doc(id).get({
      success(res){
        console.log('通过_id找到的订单详情：',res.data)
        that.setData({
          chatterInfo:res.data
        })
      }
    })
  },
  addChatList(){
    var that=this;  
    wx.cloud.database().collection('chat_record').add({
      data:{
        //userA是自己，B是对方
        userA_openid:app.globalData.userInfo._openid,//没法按照userA_openid的名字存到数据库
        userA_avatar:app.globalData.userInfo.avatarUrl,
        userA_nickName:app.globalData.userInfo.nickName,

        userB_openid:that.data.chatterInfo._openid,
        userB_avatar:that.data.chatterInfo.avatarUrl,
        userB_nickName:that.data.chatterInfo.nickName,

        record:[],
        time:util.formatTime(new Date())
      },success(res){
        console.log("添加至聊天列表成功",res)
      }
    })
  }

  
})