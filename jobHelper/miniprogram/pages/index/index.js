import {GetUserRecord,AddUserRecord,AddRecord,DeleteRecords} from '../../utils/db.js'
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
    showAddButton:true,
    showAddPanel:false,
    companyName:"",
    fileList:[],
    resumeFile:[],
    city:"",
    job:"",
    url:"",
    jobDesc:"",
    sector:"", //所属行业
    selectIndex_EN:0,   //企业性质
    enterpriseNature:"",   //企业性质
    enterpriseNatureList:[
      {id:0,name:"0"},
      {id:1,name:"1"},
      {id:2,name:"2"}
    ],  //企业性质

    CompanySizeList:[
      {id:0,name:"500以下"},
      {id:1,name:"500-1000"},
      {id:2,name:"1000-5000"}
    ],  //公司规模
    selectIndex_CS:0,
    CompanySize:"",

    // 修改
    editorMode:false,
    selectedKeyList:[],
    showSelectBox:false,

    // 数据表
    dataList:[]
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
  afterRead(event) {
    const { file } = event.detail;
    var fileList = [];
    fileList.push({
      url:file.url,
      name:"descImg",
      isImage:true,
      deletable:true
    });
    this.setData({fileList});
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    // wx.uploadFile({
    //   url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
    //   filePath: file.url,
    //   name: 'file',
    //   formData: { user: 'test' },
    //   success(res) {
    //     // 上传完成需要更新 fileList
    //     const { fileList = [] } = this.data;
    //     fileList.push({ ...file, url: res.data });
    //     this.setData({ fileList });
    //   },
    // });
  },
  deleteImg(event){
    const index = event.detail.index;
    var fileList = this.data.fileList;
    fileList.splice(index,1);
    this.setData({fileList});
  },
  ENchange(event){
    console.log(event);
  },
  addRecord(event, successFunc){
    // 内容添加到数据库
    var record = {
      company:this.data.companyName,
      city:this.data.city,
      detail:this.data.detail,
      jobType:this.data.jobType,
      jobDesc:this.data.jobDesc,
      sector:this.data.sector,
      enterpriseNature:this.data.enterpriseNature,
      CompanySize:this.data.CompanySize,
      id:this.data.dataList.length
    };
    AddRecord(record,(res)=>{
        // 这里没有触发重新渲染
        let newList = [...this.data.dataList, record];
        this.setData({
          dataList:newList
        });
    });
    this.setData({showAddPanel:false});
  },

  // 选中记录
  checkKey(event){
    this.data.selectedKeyList = event.detail.value;
  },
  // 删除记录
  deleteRecords(){
    if(this.data.selectedKeyList.length == 0)
      return;
    
    DeleteRecords(this.data.selectedKeyList,(res)=>{
      let newList = this.data.dataList.filter(item => !this.data.selectedKeyList.includes(item['id']));
      this.setData({selectedKeyList:[],dataList:newList});
    });
  },
  enterEditorMode(event){
    this.setData({showSelectBox:true, editorMode:true});
  },
  saveEdit(event){
    // 保存删除操作
    this.deleteRecords();
    // 保存换位操作

    this.setData({showSelectBox:false,editorMode:false});
  },
  
  // --------------- 上传文件 -----------------
  isDocument(file) {
    // 获取文件路径的后缀名
    const supportedDocumentTypes = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx']; // 支持的文档类型
    const fileExtension = file.split('.').pop().toLowerCase(); // 提取后缀名并转为小写
  
    // 判断文件类型是否在支持的文档类型中
    return supportedDocumentTypes.includes(fileExtension);
  },
  chooseFileFromMessage(){
    console.log("选择文件");
    wx.chooseMessageFile({
      count: 1,
      success:(e)=>{
        const files = e.tempFiles;
        const filename = files[0].name;
        const filePath = files[0].path;
        const fileType = files[0].type;
        if(!this.isDocument(filePath) || fileType !== "file"){
          wx.showToast({
            title: '不支持的文件类型',
            icon:'error'
          });
          return;
        }
        var resumeFile = {
          name:filename,
          path:filePath
        };
        this.setData({resumeFile});
      },
      fail:(e)=>{
        wx.showToast({
          title: '上传文件失败',
          icon:'error'
        })
      }
    })
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