// pages/detail/detail.js

import Dialog from '@vant/weapp/dialog/dialog';
const DB = require("../../utils/db")

Page({

  data: {
    active:1,
    steps: [
      {
        text: '投递',
        desc:"25/1/13",
        inactiveIcon: 'star-o',
        activeIcon: 'success',
      },
      {
        text: '一面',
        desc:"25/1/13",
        inactiveIcon: 'star-o',
        activeIcon: 'success',
      },
      {
        text: '二面',
        inactiveIcon: 'star-o',
        activeIcon: 'success',
      },
      {
        text: 'offer',
        inactiveIcon: 'star-o',
        activeIcon: 'success',
      },
    ],
    fileList:[], //图片文件
    resumeFile:[], //简历文件
    editMode:false,
    showMessagePanel:false,
    MessageTitle:"",
    placeholder:"",
    message:""
  },
  // -------------- 点击进度条 -----------------
  onClickStep(e){
    if(!this.data.editMode)
      return;
    const index = e.detail;
    this.setData({active:index});
  },

  // --------------- 弹出框框 -------------------

  // --------------- 上传文件 -----------------
  isDocument(file) {
    // 获取文件路径的后缀名
    const supportedDocumentTypes = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx']; // 支持的文档类型
    const fileExtension = file.split('.').pop().toLowerCase(); // 提取后缀名并转为小写
  
    // 判断文件类型是否在支持的文档类型中
    return supportedDocumentTypes.includes(fileExtension);
  },
  chooseFileFromMessage(){
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


  // ---------------- 上传岗位描述-图片 -----------------
  afterRead(event) {
    const { file } = event.detail;
    console.log(file);
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

  // ----------------- 进入编辑模式 -----------------
  enterEditorMode(){
    this.setData({editMode:true});
  },

  saveEdit(event){
    // 上传数据
    DB.UpdateOneRecord(this.data.record);
    this.setData({editMode:false});
  },

  ModifyCompanyName(){
    if(!this.data.editMode)
      return;
    this.setData({
      MessageTitle:"公司名称",
      placeholder:"请输入公司名",
      message:this.data.record.company,
      showMessagePanel:true
    })
  },
  ModifyCompanyURL(){
    if(!this.data.editMode)
      return;
    this.setData({
      MessageTitle:"投递链接",
      placeholder:"请输入链接",
      message:this.data.record.url,
      showMessagePanel:true
    });
  },

  ModifyJob(){
    if(!this.data.editMode)
      return;
    this.setData({
      MessageTitle:"投递岗位",
      placeholder:"请输入投递岗位",
      message:this.data.record.job,
      showMessagePanel:true
    });
  },

  ModifyJobDesc(){
    if(!this.data.editMode)
      return;
    this.setData({
      MessageTitle:"岗位描述",
      placeholder:"请输入投递岗位",
      message:this.data.record.jobDesc,
      showMessagePanel:true
    });
  },

  ModifyNote(){
    if(!this.data.editMode)
      return;
    this.setData({
      MessageTitle:"备注",
      placeholder:"请输入备注",
      message:this.data.record.note,
      showMessagePanel:true
    });
  },

  confirmMessage(){
    // 修改数据
    if(this.data.MessageTitle === "公司名称"){
      this.setData({'record.company':this.data.message});
    }
    else if(this.data.MessageTitle === "投递链接"){
      this.setData({'record.url':this.data.message});
    }
    else if(this.data.MessageTitle === "投递岗位"){
      this.setData({'record.job':this.data.message});
    }
    else if(this.data.MessageTitle === "岗位描述"){
      this.setData({'record.jobDesc':this.data.message});
    }
    else if(this.data.MessageTitle === "备注"){
      this.setData({"record.note":this.data.message});
    }
    this.data.message="";
    this.data.MessageTitle="";
    this.data.placeholder="";
    this.data.showMessagePanel = false;
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var data = JSON.parse(options.data);
    this.setData({record:data});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.popover = this.selectComponent('#popover');
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