const LOGIN = require('./Login')
const UTIL = require('./utils')

const db = wx.cloud.database();

// 查询某个用户的记录
export function GetUserRecord(params){
  db.collection('records').where({
    _openid: {
      $eq: params.openid,
    },
  }).get({
    success:function(res){
      params.success && params.success(res);
    },
    fail:function(res){
      params.fail && params.fail(res);
    }
  })
}

// 
export function AddUserRecord(userRecord){
  db.collection("records").add({
    data:{
      record:userRecord
    },
    success:function(res){
    },
    fail:function(res){
      console.log(res);
    }
  })
}

// 添加单条用户记录
export function AddRecord(record, successFunc){
  // 先获取_openID, 直接读取缓存
  var openid = wx.getStorageSync('openID');
  if(!(openid)){  //不存在openID
    wx.showToast({
      title: '您的登录状态已失效',
      icon:'error'
    });
    LOGIN.Login({});
    return;
  }

  const _ = db.command;
  db.collection('records').where({
    '_openid':openid,
  }).update({
    data:{
      'record':_.push(record)
    },
    success:function(res){
      successFunc(res);
      wx.showToast({
        title: '上传成功',
        icon:'success'
      });
    },
    fail:function(res){
      wx.showToast({
        title: '数据上传失败',
        icon:'error'
      });
    }
  })
}

// 删除多条用户记录
export async function DeleteRecords(keyList,successFunc){
  // 将ID变成整数
  for(var i=0;i<keyList.length;i++){
    keyList[i] = Number(keyList[i]);
  }
  const openID = await UTIL.GetOpenid();
  const _ = db.command;
  db.collection('records').where({
    '_openid':openID
  }).update(
    {
      data:{
        record:_.pull({
          id:_.in(keyList)
        })
      },
      success:function(res){
        successFunc(res);  //执行函数
      }
    }
  )
}

// 更新整个用户记录
export async function UpdateWholeRecords(newList,successFunc){
  const openID = await UTIL.GetOpenid();
  const _ = db.command;
  db.collection('records').where({
    '_openid':openID
  }).update({
    data:{
      record:newList
    },
    success:function(res){
      successFunc(res);
    }
  })
}