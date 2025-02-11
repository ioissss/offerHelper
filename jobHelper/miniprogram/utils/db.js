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

// 创建新用户记录
export function AddUserRecord(userRecord){
  db.collection("records").add({
    data:{
      record:userRecord,
      userInfo:"",
    },
    success:function(res){
      wx.showToast({
        title: '用户创建成功',
        icon:'none'
      })
    },
    fail:function(res){
      wx.showToast({
        title: '创建用户失败',
        icon:'none'
      });
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
    },
    fail:function(res){
      console.log(res);
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
      },
      fail:function(error){
        wx.showToast({
          title: '删除失败',
          icon:'none'
        });
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

// 更新某条记录
export async function UpdateOneRecord(record, successFunc){
  wx.showToast({
    title: '数据上传中',
    icon:'loading'
  });
  const openID = await UTIL.GetOpenid();
  const _ = db.command;
  db.collection('records').where({
    '_openid':openID,
    'record.id':record.id
  }).update({
    data:{
      'record.$':record
    },
    success:function(res){
      successFunc();
      wx.hideToast();
    },
    fail:function(error){
      console.log(error);
      wx.hideToast();
      wx.showToast({
        title: '上传数据失败',
        icon:'error'
      });
    }
  })
}

// 获取某条记录
export async function GetOneRecord(id, successFunc){
  const openID = await UTIL.GetOpenid();
  const _ = db.command;
  db.collection('records').where({
    '_openid':openID,
  }).get({
    success:function(res){
      successFunc(res.data[0].record);
    },
    fail:function(error){
      wx.showToast({
        title: '获取数据失败',
        icon:'error'
      })
    }
  })
}

// 修改排序模式
export async function UpdateSortMode(sortMode){
  const openID = await UTIL.GetOpenid();
  const _ = db.command;
  db.collection('records').where({
    '_openid':openID
  }).update({
    data:{
      'sortMode':sortMode
    }
  })
}

// 修改面试提醒列表
export async function updateInterviewList(newList, Func){
  const openID = await UTIL.GetOpenid();
  const _ = db.command;
  db.collection('records').where({
    '_openid':openID
  }).update({
    data:{
      'interviewList':newList,
    },
    success:res=>{
      Func.success && Func.success(res);
    },
    fail:error=>{
      wx.showToast({
        title: '上传失败',
        icon:'error'
      });
      Func.fail && Func.fail(error);
    }
  })
}

// 上传用户名称，头像等信息
export async function uploadUserInfo(userInfo){
  const openID = await UTIL.GetOpenid();
  const _ = db.command;
  db.collection('records').where({
    '_openid':openID
  }).update({
    data:{
      'userInfo':userInfo,
    },
    success:res=>{
      Func.success && Func.success(res);
    },
    fail:error=>{
      Func.fail && Func.fail(error);
    }
  });
}

// 修改用户名称
export async function modifyUserName(userName, Func){
  const openID = await UTIL.GetOpenid();
  const _ = db.command;
  db.collection('records').where({
    '_openid':openID
  }).update({
    data:{
      'userInfo.nickName':userName,
    },
    success:res=>{
      Func.success && Func.success(res);
    },
    fail:error=>{
      Func.fail && Func.fail(error);
    }
  });
}

// 修改格言
export async function modifySayings(sayings, Func){
  const openID = await UTIL.GetOpenid();
  const _ = db.command;
  db.collection('records').where({
    '_openid':openID
  }).update({
    data:{
      'sayings':sayings,
    },
    success:res=>{
      Func.success && Func.success(res);
    },
    fail:error=>{
      Func.fail && Func.fail(error);
    }
  });
}