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
      console.log(res);
    },
    fail:function(res){
      console.log(res);
    }
  })
}

// 添加单条用户记录
export function AddRecord(record, openid){
  const _ = db.command;
  db.collection('records').where({
    '_openid':openid,
  }).update({
    data:{
      'record':_.push(record)
    },
    success:function(res){
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