// pages/detail/detail.js

import Dialog from '@vant/weapp/dialog/dialog';
const DB = require("../../utils/db");
const UTIL = require("../../utils/utils");

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
    editMode:false,
    showMessagePanel:false,
    MessageTitle:"",
    placeholder:"",
    message:"",
    // 判断是否需要上传新文件
    newResumeFile:false,
    newImgFile:false,

    // 选择器
    pickerColumns:[],
    pickerTitle:"选择",
    showSelector:false,

    // 公司规模
    CompanySizeList:[
      "500以下",
      "500-1000",
      "1000-5000"
    ],  //公司规模

    // 企业性质
    enterpriseNatureList:[
      "私企","国企"
    ],  //企业性质
  },
  // -------------- 点击进度条 -----------------
  onClickStep(e){
    if(!this.data.editMode)
      return;
    const index = e.detail;
    this.setData({active:index});
  },

  // --------------- 弹出框框 -------------------
  onPickerCancel(e){
    this.setData({showSelector:false});
  },
  onPickerConfirm(e){
    if(this.data.pickerTitle === "公司规模")
      this.data.record.CompanySize.name = e.detail.value;
    else if(this.data.pickerTitle === "公司性质")
      this.data.record.enterpriseNature.name = e.detail.value;

    this.data.pickerTitle="";
    this.data.pickerColumns=[];
    this.setData({showSelector:false});
  },
  clickOnCompanySize(e){
    if(!this.data.editMode)
      return;
    this.data.pickerTitle="公司规模";
    this.setData({showSelector:true, pickerColumns:this.data.CompanySizeList});
  },
  clickOnCompanyNature(e){
    if(!this.data.editMode)
      return;
    this.data.pickerTitle = "公司性质";
    this.setData({showSelector:true, pickerColumns:this.data.enterpriseNatureList});
  },
  // --------------- 上传文件 -----------------
  isDocument(file) {
    // 获取文件路径的后缀名
    const supportedDocumentTypes = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx']; // 支持的文档类型
    const fileExtension = file.split('.').pop().toLowerCase(); // 提取后缀名并转为小写
  
    // 判断文件类型是否在支持的文档类型中
    return supportedDocumentTypes.includes(fileExtension);
  },
  // 从聊天选择文件
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
        this.setData({'record.resumeFile':resumeFile, newResumeFile:true});
      },
      fail:(e)=>{
        wx.showToast({
          title: '上传文件失败',
          icon:'error'
        })
      }
    });
  },
  // 删除简历文件
  deleteResumeFile(){
    // 从存储中删除文件
    wx.cloud.deleteFile({
      fileList:[this.data.record.resumeFile.path],
      success: res=>{
        wx.showToast({
          title: '删除成功',
          icon:'none'
        });
      },
      fail:error=>{
      }
    })
    // 置空
    let resumeFile = {
      'name':"",
      'path':""
    }
    this.setData({'record.resumeFile':resumeFile});
  },

  // ---------------- 上传岗位描述-图片 -----------------
  afterRead(event) {
    const { file } = event.detail;
    var fileList = [];
    fileList.push({
      url:file.url,
      name:"descImg",
      isImage:true,
      deletable:true
    });
    this.setData({'record.imgFile':fileList, newImgFile:true});
  },
  deleteImg(event){
    const index = event.detail.index;
    var fileList = this.data.record.imgFile;
    fileList.splice(index,1);
    this.setData({'record.imgFile':fileList});
  },

  // ----------------- 进入编辑模式 -----------------
  enterEditorMode(){
    this.setData({editMode:true});
  },

  async saveEdit(event){
    // 上传数据
    DB.UpdateOneRecord(this.data.record,()=>{});
    // 上传文件
    const openid = await UTIL.GetOpenid();
    // 上传简历
    if(this.data.newResumeFile){
      var Funcs = {
        'success':(res)=>{
          // 更新相应字段
          const db = wx.cloud.database();
          db.collection('records').where({
            '_openid':openid,
            'record.id':this.data.record.id,
          }).update({
            data:{
              'record.$.resumeFile.path':res.fileID
            }
          })
        },
        'fail':(error)=>{
          wx.showToast({
            title: '上传简历文件失败',
            icon:'error'
          });
        }
      }
      UTIL.UploadFile(this.data.record.resumeFile.path, 'resume/' + this.data.record.resumeFile.name + Math.random(), Funcs);
    }
    // 上传图片
    if(this.data.newImgFile){
      var Funcs = {
        'success':(res)=>{
          let imgs = [res.fileID];
          // 更新相应字段
          const db = wx.cloud.database();
          db.collection('records').where({
            '_openid':openid,
            'record.id':this.data.record.id,
          }).update({
            data:{
              'record.$.imgFile':imgs
            }
          })
        },
        'fail':(error)=>{
          wx.showToast({
            title: '上传图片失败',
            icon:'error'
          });
        }
      };
      UTIL.UploadFile(this.data.record.imgFile[0].url, 'image/' + Math.random(), Funcs);
    }
    this.setData({editMode:false, newImgFile:false, newResumeFile:false});
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

  ModifyCity(){
    if(!this.data.editMode)
      return;
    this.setData({
      MessageTitle:"城市",
      placeholder:"请输入城市",
      message:this.data.record.city,
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
    else if(this.data.MessageTitle === '城市'){
      this.setData({'record.city':this.data.message});
    }
    this.data.message="无";
    this.data.MessageTitle="";
    this.data.placeholder="";
    this.data.showMessagePanel = false;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var data = JSON.parse(options.data);
    DB.GetOneRecord(data.id,(res)=>{});
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