//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    access_token_user:'',
    list: ''
  },
  
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  
  onLoad: function () {
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  getMyPage:function(){
    wx.navigateTo({
      url: 'detail',  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
      success: function () {
        wx.showToast({
          title: '跳转成功',
          icon: null,
          duration: 2000
        })
      },        //成功后的回调；
      fail: function () {
        wx.showToast({
          title: '跳转失败',
          icon: null,
          duration: 2000
        })
      },          //失败后的回调；
      complete: function () { }      //结束后的回调(成功，失败都会执行)
    })
  },


  houduanRequest: function () {

    var that = this;

    wx.login({//调用获取用户openId
      success: function (res) {
        console.log('获取临时code成功！' + res.code)

        //https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=？？？&secret=？？？"
        wx.request({
          url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx730f872b9c95e4b2&secret=efec9340a94a682d3546ed5da86ecea6',//自己请求的服务器的地址
          method: 'POST',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (req) {
            console.log('获取临时access_token成功！===========' + req.data.access_token)
           
            //https://api.weixin.qq.com/cgi-bin/user/info?access_token=？？？&openid=？？？&lang=zh_CN

            wx.request({
              url: 'https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + req.data.access_token + '&appid=wx730f872b9c95e4b2&lang=zh_CN',//返回数据中有subscribe，其为1则用户已关注，为0则没关注。
 //             url: 'https://api.weixin.qq.com/sns/userinfo?access_token=' + req.data.access_token + '&openid=wx730f872b9c95e4b2&lang=zh_CN',
              method: 'POST',
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (rea) {
                console.log('获取info成功！' + rea)

              }, fail: function (rea) {
                console.log('获取info失败！' + rea.errMsg)
              }
            })

          }, fail: function (req) {
            console.log('获取临时access_token失败！=========' + req.errMsg)
          }
        })

      }, fail: function (res) {
        console.log('获取临时code失败！' + res.errMsg)
      }
    })

    var that = this;
    wx.showToast({
      title: '成功',
      icon: null,
      duration: 2000
    })
    wx.request({
      url: 'http://192.168.25.102:8080/JFinalShop/admin/login/getUser',//自己请求的服务器的地址
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        "dtoName": that.data.userInfo
      },
      success: function (req) {
        var list = req.data;
        if (list == null) {
          wx.showToast({
            title: 'ErrorMessage',
            icon: 'false',   //图标
            duration: 1500  //提示的延迟的时间
          })
        } else {
          that.setData({
            list: list
          })
        }
      }
    })
  },

  changePage: function () {
    wx.navigateTo({
      url: 'mypage',  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
        success: function () {
          wx.showToast({
            title: '跳转成功',
            icon: null,
            duration: 2000
          })
         },        //成功后的回调；
        fail:function() {
          wx.showToast({
            title: '跳转失败',
            icon: null,
            duration: 2000
          })
         },          //失败后的回调；
        complete:function() { }      //结束后的回调(成功，失败都会执行)
      })
  },

  showTopTips: function (e) { //登录/注册提交事件
    if (userName == '') {
      app.toastShow(this, "请输入手机号", "error");
    } else if (userPassword == '') {
      app.toastShow(this, "请输入验证码", "error");
    } else {
      var that = this
      wx.login({//调用获取用户openId
        success: function (res) {
          var loginDevice = 'W'; //唯一标识 = W + 临时code值
          loginDevice = loginDevice + res.code //临时code值
          var appid = '1100310183560349'; //appid wxf79825c96701f981
          var timestamp = Date.parse(new Date());//获取当前时间戳 
          timestamp = timestamp / 1000;
          var version = '1.0'; //版本号
          var sign = 'erwlkrjlkwjelrjwlke'; //签名
          var timestamp = Date.parse(new Date());//获取当前时间戳 
          timestamp = timestamp / 1000;
          var loginChannel = '1003'; //登录渠道:1001 ios手机 1002 android手机 1003 微信小程序 1004 手机H5
          wx.request({
            method: "post",
            url: 'http://uat.*****.com/xiao***/user/baseInfo/userLogin', //仅为示例，并非真实的接口地址
            data: '{"appId": "' + appid + '", "timestamp": ' + timestamp + ', "version": "' + version + '", "sign": "' + sign + '", "mobile": "' + userName + '","validateCode":"' + userPassword + '","loginChannel":"' + loginChannel + '","loginDevice":"' + loginDevice + '",}@#@1100310183560349' //"validateWay": 1, "validateType": 2
            ,
            dataType: "json",
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              var userIdEnc = res.data.data.userIdEnc;  //用户唯一标识
              var loginDevice = res.data.data.loginDevice;
              wx.setStorageSync('userIdEnc', userIdEnc); //将userIdEnc存入本地缓存
              wx.setStorageSync('loginDevice', loginDevice);//将loginDevice存入本地缓存

              that.redirectToIndex();

              // that.setData({
              //   id_token: res.data.id_token,
              //   response: res
              // })
              // try {
              //   wx.setStorageSync('id_token', res.data.id_token)
              // } catch (e) {
              // }


              if (res.code == '0000') {
                console.log("注册成功");
                // wx.redirectTo({
                //   url: '../../pages/index/index',
                // })
              } else if (res.code == '1002') { //超时
                that.errorShow('超时');
              } else if (res.code == '1002') { //帐号冻结
                that.errorShow('帐号冻结');
              } else {  //失败
                that.errorShow('注册/登录失败');
              }

            },
            fail: function (res) {
              //console.log(res.data);
              console.log('is failed')
            }
          })



        }, fail: function (res) {
          console.log('获取临时code失败！' + res.errMsg)
        }
      })

    }
  },

})
