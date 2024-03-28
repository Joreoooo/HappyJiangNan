// app.js
App({
  globalData:{
    userInfo:[]
  },


  onLaunch(){
    console.log(111,this.globalData.userInfo)
    //云开发环境的初始化
    wx.cloud.init({
      // env:"cloud1-5ge7z2t52847cbb3"
      env:"cloud1-5ge7z2t52847c-8bq81ea30ed"
    })

    if(wx.getStorageSync('userInfo')){
      this.globalData.userInfo=wx.getStorageSync('userInfo')
    }

  },
 
  
})
