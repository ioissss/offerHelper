

export function GetOpenid(){
  return new Promise((resolve, reject)=>{
    // 本地获取
    var openid = wx.getStorageSync('openID');
    if(openid){
      resolve(openid);
      return;
    } 

    // 云端获取
    wx.cloud.callFunction({
      name:'getOpenid',
      complete:res=>{
        wx.setStorage({"key":"openID","data":res.result.openId});
        resolve(res.result.openId);
      }
    });
  });
}