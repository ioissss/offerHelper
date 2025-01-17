
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

export function UploadFile(file, path, Funcs){
  wx.cloud.uploadFile({
    cloudPath:path,
    filePath:file,
    config:{
      env:'findwork-0gd79ch16a9fbc12'
    },
    success:res=>{
      Funcs.success && Funcs.success(res);
    },
    fail:error=>{
      Funcs.fail && Funcs.fail(error);
    }
  })
}