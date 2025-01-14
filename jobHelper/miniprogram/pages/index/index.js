import {GetUserRecord,AddUserRecord} from '../../utils/db.js'

// pages/index/index.js
Page({

  data: {
    active:0,
    columns:[
      {
        'title':'公司',
        'key':'company'
      },
      {
        'title':'类型',
        'key':'type'
      },
      {
        'title':'岗位',
        'key':'jobType'
      },
      {
        'title':'状态',
        'key':'state'
      },
      {
        'title':'城市',
        'key':'city'
      },
      {
        'title':'日期',
        'key':'date'
      },
      {
        'title':'详情',
        'key':'detail',
        'type':'action'
      }
    ],
    dataList:[
      {'id':1,'company':"腾讯", 'type':"互联网",'jobType':"测试岗",'state':"已投递",'city':"北京",'date':"2025/1/14",'detail':11},
      // {'id':2,'content':222, 'content':222,'content':222,'content':222,'content':222,'content':222},
      {'id':2,'company':"华为", 'type':222,'jobType':222,'state':222,'city':222,'date':222,'detail':11},
      {'id':3,'company':"字节和心脏只有一个能跳动", 'type':333,'jobType':333,'state':333,'city':333,'date':333,'detail':11},
      {'id':4,'company':"百度", 'type':444,'jobType':444,'state':444,'city':444,'date':444,'detail':11},
      {'id':5,'company':"阿里巴巴", 'type':555,'jobType':555,'state':555,'city':555,'date':555,'detail':11},
    ],

    // tabs
    tabs:['a','b','c'],
    active_tab:1,
  },
// ----------- tab -------------
handleChange({detail}){
  this.setData({
    active_tab:Number(detail.index)
  });
},
onClickTabImage(e){
this.setData({active_tab:Number(e.currentTarget.dataset.index)});
},

  // ---------------- 自定义方法 ----------------
  onChange(event){
    this.setData({active:event.detail});
  },
  changeRows(){

  },
  handleRowLongPress(e) {
    if(!('rowkey' in e.detail))
      return;
    const { rowkey } = e.detail; // 获取当前行数据
  },
  handleClickExpand(e) {
    console.log(e);
    let str = '';
    const { type, index, item } = e.detail.value;
    if (type === 'name') {
        str = '点击了姓名';
    }
    else if (type === 'age') {
        str = '点击了年龄';
    }
    else if (type === 'sex') {
        str = '点击了性别';
    }
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    const params = {
      data:{},
      success:function(res){
        console.log(res);
        that.setData({
          dataList:res.data[0].record
        });
      },
      fail:function(res){
        wx.showToast({
          title: '网络不太好~',
          icon:'error'
        })
      }
    }
    GetUserRecord(params);
    // AddUserRecord(this.data.dataList);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})