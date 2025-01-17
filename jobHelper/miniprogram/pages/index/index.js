import {GetUserRecord,AddUserRecord,AddRecord,DeleteRecords} from '../../utils/db.js'
import {GetOpenID} from '../../utils/Login.js'
const LOGIN = require("../../utils/Login");
const UTIL = require('../../utils/utils')
import Dialog from '@vant/weapp/dialog/dialog';
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
        'key':'enterpriseNature',
        'type':'action'
      },
      {
        'title':'岗位',
        'key':'job'
      },
      {
        'title':'状态',
        'key':'state',
        'type':'action'
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
    resumeFile:"",
    city:"",
    job:"",
    url:"",
    jobDesc:"",
    sector:"", //所属行业
    selectIndex_EN:0,   //企业性质
    enterpriseNature:"私企",   //企业性质
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
    CompanySize:"500人以下",

    // 修改
    editorMode:false,
    selectedKeyList:[],
    showSelectBox:false,

    stateList:[
      {id:0,name:"未投递"},
      {id:1,name:"已投递"},
      {id:2,name:"笔试"},
      {id:3,name:"一面"},
      {id:4,name:"二面"},
      {id:5,name:"offer"}
    ],  //投递状态
    selectIndex_State:0,
    state:"未投递",
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
  },
  deleteImg(event){
    const index = event.detail.index;
    var fileList = this.data.fileList;
    fileList.splice(index,1);
    this.setData({fileList});
  },
  ENchange(event){
    this.data.enterpriseNature = this.data.enterpriseNatureList[event.detail.selectId];
    this.data.selectIndex_EN = event.detail.selectId;
  },
  stateChange(event){
    this.data.state = this.data.stateList[event.detail.selectId];
    this.data.selectIndex_State = event.detail.selectId;
  },
  companySizeChange(event){
    this.data.CompanySize = this.data.CompanySizeList[event.detail.selectId];
    this.data.selectIndex_CS = event.detail.selectId;
  },
  async addRecord(event, successFunc){
    if(this.data.companyName == ""){
      wx.showToast({
        title: '公司名称不能空~',
        icon:'error'
      });
      return;
    }
    // 内容添加到数据库
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 月份从0开始
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    var record = {
      company:this.data.companyName,
      city:this.data.city,
      detail:this.data.detail,
      jobType:this.data.jobType,
      jobDesc:this.data.jobDesc,
      job:this.data.job,
      sector:this.data.sector,
      enterpriseNature:this.data.enterpriseNatureList[this.data.selectIndex_EN],
      CompanySize:this.data.CompanySizeList[this.data.selectIndex_CS],
      state:this.data.stateList[this.data.selectIndex_State],
      id:this.data.dataList.length,
      imgFile:"",
      resumeFile:"",
      date:formattedDate
    };
    AddRecord(record,(res)=>{
        // 这里没有触发重新渲染
        let newList = [...this.data.dataList, record];
        this.setData({
          dataList:newList
        });
        // 重置之前的记录
        this.data.companyName="";
        this.data.city="";
        this.data.detail="";
        this.data.jobType="";
        this.data.jobDesc="";
        this.data.sector="";
        this.data.enterpriseNature="";
        this.data.CompanySize="";
        this.data.fileList=[];
        this.data.resumeFile=[];
    });
    this.setData({showAddPanel:false});

    // 上传文件，获取url
    const openid = await UTIL.GetOpenid();
    const resumeFile = this.data.resumeFile;
    if(resumeFile != ""){
      var Funcs = {
        'success':(res)=>{
          // 更新相应字段
          const db = wx.cloud.database();
          db.collection('records').where({
            '_openid':openid,
            'record.id':record.id,
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
      UTIL.UploadFile(resumeFile.path, 'resume/' + resumeFile.name + Math.random(), Funcs);
    }
    // 上传图片
    if(this.data.fileList.length > 0){
      var Funcs = {
        'success':(res)=>{
          let imgs = [res.fileID];
          // 更新相应字段
          const db = wx.cloud.database();
          db.collection('records').where({
            '_openid':openid,
            'record.id':record.id,
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
      }
      UTIL.UploadFile(this.data.fileList[0].url, 'image/' + Math.random(), Funcs);
    }
  },
  addRecordToDB(resumeFile,imageURL){

  },
  onClose(event){
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
    Dialog.confirm({
      title:'删除',
      message:'确认删除对应记录'
    }).then(()=>{
      DeleteRecords(this.data.selectedKeyList,(res)=>{
        let newList = this.data.dataList.filter(item => !this.data.selectedKeyList.includes(item['id']));
        this.setData({selectedKeyList:[],dataList:newList});
      });
    });
  },
  enterEditorMode(event){
    this.setData({showSelectBox:true, editorMode:true});
  },
  saveEdit(event){
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