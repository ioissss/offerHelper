import {GetUserRecord,AddUserRecord} from '../../utils/db.js'
import {GetOpenID} from '../../utils/Login.js'
const LOGIN = require("../../utils/Login")
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
    isLoadingData:true,

    // tabs
    tabs:['a','b','c'],
    active_tab:1,

    // 增加记录
    showAddPanel:false,
    companyName:"",
    fileList:[],
    resumeFile:[],
    city:"",
    job:"",
    url:"",
    jobDesc:"",
    sector:"", //所属行业
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

  // 添加新记录
  goto(){
    this.setData({showAddPanel:true});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 登录
    var params = {
      'success':(res)=>{
        this.setData({dataList:res.data[0].record});
        this.setData({isLoadingData:false});
      },
      'fail':(res)=>{
        wx.showToast({
          title: '网络出错啦~',
          icon:'error'
        })
      }
    }
    LOGIN.Login(params);
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