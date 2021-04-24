// index.js
// 获取应用实例
const app = getApp()
var QQMapWX = require("../../lib/qqmap-wx-jssdk.js");
var qqmapsdk;
var coors;
Page({
  data: {
    time:0,
    distance:0,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false

    setting:{
      skew: 0,
      rotate: 0,
      showLocation: false,
      showScale: true,
      subKey: 'HICBZ-NMZLS-DM4OW-6DYBT-SKO57-LEFZM',
      layerStyle: 1,
      enableZoom: true,
      enableScroll: true,
      enableRotate: false,
      showCompass: true,
      enable3D: false,
      enableOverlooking: false,
      enableSatellite: false,
      enableTraffic: false,
    },
    polyline:[],
    markers: [{
      latitude: 32.059352,
      longitude: 118.796623,
      iconPath:'../../assets/images/icon_start.png',width:48,height:48,
      anchor:{x:0.5,y:1}
    },
    {
      latitude: 39.90417,
      longitude: 116.40742,
      iconPath:'../../assets/images/icon_end.png',width:48,height:48,
      anchor:{x:0.45,y:1}
    }
  ],
  longitude: '118.796623',
  latitude: '35.059352'

  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  calRoute(){
    qqmapsdk.direction({
      mode:'driving',
      from:{latitude:32.059352,longitude:118.796623},
      to:{latitude:39.90417,longitude:116.40742},
      success:(res)=>{
        //console.log(res)
        var route = res.result.routes[0]

        coors = route.polyline
        //解压
        for (var i = 2; i < coors.length; i++) {
          coors[i] = coors[i - 2] + coors[i] / 1000000;
        }
        //console.log(coors)
        //划线 
        var b = [];
        for (var i = 0; i < coors.length; i = i + 2) {
          b[i / 2] = {
            latitude: coors[i],
            longitude: coors[i + 1]
          };
        //console.log(b[i / 2])
        }
        this.setData({
          polyline:[{
            points:b,
            color:"#5996ff",
            width:4,
            dottedLine:false,
          }],
          time : route.duration,
          distance:route.distance,
        })
      },
      fail:function(error){
        console.error(error);
      },
      compelete:function(res){
        console.log(res)
      }
    })
  },

  onLoad() {

    qqmapsdk = new QQMapWX({
      key:'HICBZ-NMZLS-DM4OW-6DYBT-SKO57-LEFZM'
    });
    this.mapctx = wx.createMapContext('map')

    this.calRoute()

    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
