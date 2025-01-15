const db = require("./db"); 

// -------------- 登录 ---------------
export function Login(params){
  // 从本地缓存读取openID
  var openID = wx.getStorageSync('openID');
  if(openID){
    // 加载数据
    params.openid = openID;
    db.GetUserRecord(params);
    return;
  }
  // 从云端获取openID
  wx.cloud.callFunction({
    name:'getOpenid',
    complete:res=>{
      openID = res.result.openId;
      wx.setStorage({"key":"openID","data":res.result.openId});
      params.openid = openID;
      db.GetUserRecord(params);
    }
  });
  return openID;
}