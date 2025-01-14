const db = wx.cloud.database();

// 查询某个用户的记录
export function GetUserRecord(e){
  db.collection('records').get({
    success:function(res){
      console.log(res);
    }
  })
}

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
