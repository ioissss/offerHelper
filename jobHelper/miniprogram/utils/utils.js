
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

// 删除fileList中所有文件
export function DeleteFile(fileList, Funcs){
  wx.cloud.deleteFile({
    fileList:fileList,
    success:res=>{
      Funcs.success(res);
    },
    fail:error=>{
      Funcs.fail(error);
    }
  })
}

export function FormattedDate(){
  const today = new Date();
  const year = String(today.getFullYear()).slice(-2); // 保留年份后两位
  const month = String(today.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${month}-${day}`;
  return formattedDate;
}

export function snowflakeId24(machineId = 1) {
  const epoch = 1700000000000; // 自定义起始时间（毫秒级），可修改
  const timestamp = Date.now() - epoch; // 41-bit 时间戳（从 epoch 开始计算）
  const random = Math.floor(Math.random() * 1000); // 3 位随机数，避免重复
  const id = (timestamp * 10000) + (machineId * 1000) + random; // 组合 24 位整数 ID

  return id;
}
