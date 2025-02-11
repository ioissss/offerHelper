import {
  GetUserRecord,
  AddUserRecord,
  AddRecord,
  DeleteRecords
} from '../../utils/db.js'
import {
  GetOpenID
} from '../../utils/Login.js'
const LOGIN = require("../../utils/Login");
const UTIL = require('../../utils/utils');
const DB = require("../../utils/db");
import Dialog from '@vant/weapp/dialog/dialog';

var wxCharts = require('../../utils/dist/wxcharts');
var pieChart = null; //饼状图
var columnChart = null; //直方图
var ringChart = null; // 圆环

Page({

  data: {
    // 用户个人信息
    userInfo: "",

    active: 0,
    columns: [{
        'title': '公司',
        'key': 'company',
        'type': 'action'
      },
      {
        'title': '岗位',
        'key': 'job',
        'type': 'action'
      },
      {
        'title': '状态',
        'key': 'state',
        'type': 'action'
      },
      {
        'title': '城市',
        'key': 'city',
        'type': 'action'
      },
      {
        'title': '日期',
        'key': 'date',
        'type': 'action'
      },
      {
        'title': '添加提醒',
        'key': 'interview',
        'type': 'action'
      },
    ],
    isLoadingData: true,

    // tabs
    tabs: ['a', 'b', 'c', 'd'],
    active_tab: 1,

    // 增加记录
    showAddButton: true,
    showAddPanel: false,
    companyName: "",
    fileList: [],
    resumeFile: "",
    city: "空",
    job: "无",
    url: "",
    jobDesc: "无",
    sector: "无", //所属行业
    selectIndex_EN: 0, //企业性质
    enterpriseNature: "私企", //企业性质
    enterpriseNatureList: [{
        id: 0,
        name: "0"
      },
      {
        id: 1,
        name: "1"
      },
      {
        id: 2,
        name: "2"
      }
    ], //企业性质

    CompanySizeList: [{
        id: 0,
        name: "500以下"
      },
      {
        id: 1,
        name: "500-1000"
      },
      {
        id: 2,
        name: "1000-5000"
      }
    ], //公司规模
    selectIndex_CS: 0,
    CompanySize: "500人以下",

    // 修改
    editorMode: false,
    selectedKeyList: [],
    showSelectBox: false,

    stateList: [{
        id: 0,
        name: "未投递"
      },
      {
        id: 1,
        name: "已投递"
      },
      {
        id: 2,
        name: "笔试"
      },
      {
        id: 3,
        name: "一面"
      },
      {
        id: 4,
        name: "二面"
      },
      {
        id: 5,
        name: "三面"
      },
      {
        id: 6,
        name: "offer"
      }
    ], //投递状态
    selectIndex_State: 1,
    state: "已投递",
    // 状态数量
    stateNumList: [{
        id: 0,
        name: 1
      },
      {
        id: 1,
        name: 2
      },
      {
        id: 2,
        name: 3
      },
      {
        id: 3,
        name: 4
      }
    ],
    selectIndex_StateNum: 2,
    stateNum: {
      id: 2,
      name: 3
    }, //面试次数
    // 备注
    note: "无",

    // 所属行业
    industry: "",

    // 数据表
    dataList: [],
    userData: {},

    // 排序
    sortModeList: ['时间', '投递进度-快到慢', '投递进度-慢到快'],
    sortMode: "",
    showSortPanel: false,
    defaultIndex: 0,

    // 筛选 - 按 城市/状态/岗位/企业类型/公司名 筛选

    // 面试提醒
    interviewList: [], //面试提醒列表
    interviewListShow: [],
    showTimePanel: false,
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2050, 12, 30).getTime(),
    currentDate: new Date().getTime(),
    currentRowID: "",
    // 直方图
    isMainChartDisplay: true,
    // 修改用户信息
    showUserInfoPanel:false,

    // 鼓励语
    sayings:"111",
    nickName:"",
  },

  // 获取用户数据
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        // 将用户信息保存到云端
        DB.uploadUserInfo(res.userInfo, {});
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    });
  },
  // 修改用户个人信息
  modifyUserName(){
    this.setData({showUserInfoPanel:true});
  },
  showUserInfoPanelClose(e){
    this.setData({showUserInfoPanel:false});
    // 上传数据到服务器
    DB.modifyUserName(this.data.nickName);
    DB.modifySayings(this.data.sayings);
    wx.showToast({
      title: '已保存',
      icon:'none'
    });
    this.setData({nickName:this.data.nickName,sayings:this.data.sayings});
  },

  // ------------ 时间选择器 --------------
  onTimeInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
  onTimePanelConfirm(event) {
    if (this.data.currentRowID === "")
      return;
    // 添加一个提醒记录
    var newRecord = {
      ID: this.data.currentRowID,
      interviewDate: this.data.currentDate
    };
    // 先检查是否存在当前记录,存在则修改date,不存在则插入新元素
    var exited = false;
    this.data.interviewList.forEach(item => {
      if (item.ID === newRecord.ID) {
        item.interviewDate = newRecord.interviewDate;
        exited = true;
      }
    });
    if (!exited) {
      this.data.interviewList.push(newRecord);
    }
    this.setData({
      showTimePanel: false,
      interviewList: this.data.interviewList,
      currentRowID: ""
    });

    var Funcs = {
      success: res => {
        wx.showToast({
          title: '已保存',
          icon: 'none'
        });
      }
    }
    // 数据上传到服务器
    DB.updateInterviewList(this.data.interviewList, Funcs);
  },
  onTimePanelClose(event) {
    this.setData({
      showTimePanel: false,
      currentRowID: ""
    });
  },
  clickTableItem(event) {
    if (event.detail.value.type === "interview")
      this.setData({
        showTimePanel: true,
        currentRowID: event.detail.value.item.id
      });
  },

  // ------------ 面试提醒 ------------
  onFinishInterview(e) {
    const ID = e.currentTarget.dataset.id;
    var Funcs = {
      success: res => {
        // 修改列表
        const interviewListShowNew = this.data.interviewListShow.filter(item => item.id != ID);
        const interviewListNew = this.data.interviewList.filter(item => item.ID != ID);
        // 修改对应进度并上传至服务器
        this.data.dataList.forEach(item => {
          if (item.id === ID) {
            function isMatch(str) {
              const regex = /^.*面$/; // 匹配以任意字符开头并以 "面" 结尾的字符串
              return regex.test(str);
            }
            if (item.curStep === item.steps.length - 1)
              return;
            item.curStep = Number(item.curStep) + 1;
            item.state.name = item.steps[item.curStep].text;
            item.steps[item.curStep].desc = item.interviewDate;
            while (!isMatch(item.state.name) && item.state.name != item.steps[item.steps.length - 1].text) {
              item.curStep = Number(item.curStep) + 1;
              item.state.name = item.steps[item.curStep].text;
              item.steps[item.curStep].desc = item.interviewDate;
            }
            // 将记录上传到服务器
            DB.UpdateOneRecord(item, (res) => {});
          }
        });
        this.setData({
          interviewListShow: interviewListShowNew,
          interviewList: interviewListNew,
          dataList: this.data.dataList
        });
        wx.showToast({
          title: '真棒~',
          icon: 'none'
        });
      },
      fail: error => {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    }
    DB.updateInterviewList(this.data.interviewList, Funcs);
  },
  // ----------- tab -------------
  handleChange({
    detail
  }) {
    // 加载所有统计数据图
    if (detail.index === 0 && this.data.dataList.length !== 0) {
      this.Pie();
      this.Column();
      this.Ring();
    }
    // 重新加载面试提醒列表
    if (detail.index === 2 && this.data.interviewList.length !== 0) {
      const interviewID = this.data.interviewList.map(item => item.ID);
      const interviewListShow = this.data.dataList.filter(item => interviewID.includes(item.id));
      for (var i = 0; i < interviewListShow.length; ++i) {
        const timestamp = this.data.interviewList[i].interviewDate; // 示例时间戳，单位是毫秒
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours(); // 获取小时
        const minutes = date.getMinutes(); // 获取分钟
        const seconds = date.getSeconds(); // 获取秒

        // 格式化为 "YYYY-MM-DD HH:mm:ss"
        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

        interviewListShow[i]['interviewDate'] = formattedDate;
      }
      this.setData({
        interviewListShow: interviewListShow
      });
    }
    this.setData({
      active_tab: Number(detail.index)
    });
  },
  onClickTabImage(e) {
    this.setData({
      active_tab: Number(e.currentTarget.dataset.index)
    });
  },

  // ---------------- 自定义方法 ----------------
  onChange(event) {
    this.setData({
      active: event.detail
    });
  },
  handleRowLongPress(e) {
    if (!('rowkey' in e.detail))
      return;
    const {
      rowkey
    } = e.detail; // 获取当前行数据
  },
  handleClickExpand(e) {
    let str = '';
    const {
      type,
      index,
      item
    } = e.detail.value;
    if (type === 'name') {
      str = '点击了姓名';
    } else if (type === 'age') {
      str = '点击了年龄';
    } else if (type === 'sex') {
      str = '点击了性别';
    }
  },
  selectAll(e){
    this.data.selectedKeyList = [];
    this.data.dataList.forEach(item=>{
      this.data.selectedKeyList.push(item.id);
    });
    this.setData({selectedKeyList:this.data.selectedKeyList});
  },

  // --------------------- 打开排序面板 -----------------------
  openSortPanel(e) {
    // 设置默认选中项
    var defaultIndex = 0;
    if (this.data.userData.sortMode === "投递进度-快到慢")
      defaultIndex = 1;
    else if (this.data.userData.sortMode === "投递进度-慢到快")
      defaultIndex = 2;
    this.setData({
      defaultIndex: defaultIndex,
      showSortPanel: true
    });
  },
  // 根据sortMode对dataList进行排序操作
  sortByName(dataList, sortMode) {
    if (sortMode === "时间") {
      dataList.sort((a, b) => {
        // 假设当前年份是 2025
        const currentYear = new Date().getFullYear();
        // 将字符串 "MM-DD" 转换为 Date 对象，假设年份是当前年份
        const dateA = new Date(`${currentYear}-${a.date}`);
        const dateB = new Date(`${currentYear}-${b.date}`);
        return dateA - dateB; // 按照日期升序排序
      });
    } else if (sortMode === "投递进度-慢到快") {
      const statePriority = {
        "未投递": 0,
        "已投递": 1,
        "笔试": 2,
        "一面": 3,
        "二面": 4,
        "三面": 5,
        "四面": 6,
        "offer": 7
      };
      dataList.sort((a, b) => {
        // 首先根据 statePriority 排序
        if (statePriority[a.state.name] !== statePriority[b.state.name]) {
          return statePriority[a.state.name] - statePriority[b.state.name];
        }
        // 如果 state 相同且不是面试状态，则根据 date 排序
        const currentYear = new Date().getFullYear();
        const dateA = new Date(`${currentYear}-${a.date}`);
        const dateB = new Date(`${currentYear}-${b.date}`);
        return dateA - dateB; // 按日期升序排序
      });
    } else if (sortMode === "投递进度-快到慢") {
      const statePriority = {
        "未投递": 7,
        "已投递": 6,
        "笔试": 5,
        "一面": 4,
        "二面": 3,
        "三面": 2,
        "四面": 1,
        "offer": 0
      };
      dataList.sort((a, b) => {
        // 首先根据 statePriority 排序
        if (statePriority[a.state.name] !== statePriority[b.state.name]) {
          return statePriority[a.state.name] - statePriority[b.state.name];
        }
        // 如果 state 相同且不是面试状态，则根据 date 排序
        const currentYear = new Date().getFullYear();
        const dateA = new Date(`${currentYear}-${a.date}`);
        const dateB = new Date(`${currentYear}-${b.date}`);
        return dateA - dateB; // 按日期升序排序
      });
    }
    return dataList;
  },
  onSortModeConfirm(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    var newList = this.sortByName(this.data.dataList, value);
    this.setData({
      showSortPanel: false,
      sortMode: value,
      dataList: newList
    });
    // 保存排序模式到云端
    DB.UpdateSortMode(value);
  },

  onSortModeCancel() {
    this.setData({
      showSortPanel: false
    });
  },
  // 打开添加记录的面板
  openAddPanel(e) {
    // 创建进度条相关数据结构
    var NumberList = ['一', '二', '三', '四'];
    var stateList = [{
        name: '未投递',
        id: 0
      },
      {
        name: '已投递',
        id: 1
      },
      {
        name: '笔试',
        id: 2
      }
    ];
    for (var i = 0; i < this.data.stateNum.name; ++i) {
      stateList.push({
        id: i + 3,
        name: NumberList[i] + '面'
      });
    }
    stateList.push({
      'name': 'offer',
      id: this.data.stateNum.name + 3
    });
    this.setData({
      stateList,
      showAddPanel: true
    });
  },
  deleteImg(event) {
    const index = event.detail.index;
    var fileList = this.data.fileList;
    fileList.splice(index, 1);
    this.setData({
      fileList
    });
  },
  ENchange(event) {
    this.data.enterpriseNature = this.data.enterpriseNatureList[event.detail.selectId];
    this.data.selectIndex_EN = event.detail.selectId;
  },
  stateChange(event) {
    this.data.state = this.data.stateList[event.detail.selectId];
    this.data.selectIndex_State = event.detail.selectId;
  },
  companySizeChange(event) {
    this.data.CompanySize = this.data.CompanySizeList[event.detail.selectId];
    this.data.selectIndex_CS = event.detail.selectId;
  },
  stateNumChange(event) {

    this.data.stateNum = this.data.stateNumList[event.detail.selectId];
    this.data.selectIndex_StateNum = event.detail.selectId;
    // 创建进度条相关数据结构
    var NumberList = ['一', '二', '三', '四'];
    var stateList = [{
        name: '未投递',
        id: 0
      },
      {
        'name': '已投递',
        id: 1
      },
      {
        'name': '笔试',
        id: 2
      }
    ];
    for (var i = 0; i < Number(this.data.stateNum.name); ++i) {
      stateList.push({
        id: i + 3,
        name: NumberList[i] + '面'
      });
    }
    stateList.push({
      'name': 'offer',
      id: this.data.stateNum.name + 3
    });
    this.setData({
      stateList
    });
  },
  async addRecord(event, successFunc) {
    if (this.data.companyName == "") {
      wx.showToast({
        title: '公司名称不能空~',
        icon: 'error'
      });
      return;
    }
    // 内容添加到数据库
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 月份从0开始
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${month}-${day}`;

    var steps = [{
        'activeIcon': 'success',
        'desc': "",
        'inactiveIcon': 'star-o',
        'text': '已投递'
      },
      {
        'activeIcon': 'success',
        'desc': "",
        'inactiveIcon': 'star-o',
        'text': '笔试'
      }
    ];
    var numberList = ["一", "二", "三", "四"];
    for (var i = 0; i < this.data.stateNum.name; ++i) {
      steps.push({
        'activeIcon': 'success',
        'desc': "",
        'inactiveIcon': 'star-o',
        'text': numberList[i] + '面'
      })
    }
    steps.push({
      'activeIcon': 'success',
      'desc': "",
      'inactiveIcon': 'star-o',
      'text': 'offer'
    });

    for (var i = 0; i < this.data.selectIndex_State; ++i) {
      steps[i].desc = UTIL.FormattedDate();
    }

    var record = {
      company: this.data.companyName,
      city: this.data.city,
      detail: this.data.detail,
      jobType: this.data.jobType,
      jobDesc: this.data.jobDesc,
      job: this.data.job,
      sector: this.data.sector,
      enterpriseNature: this.data.enterpriseNatureList[this.data.selectIndex_EN],
      CompanySize: this.data.CompanySizeList[this.data.selectIndex_CS],
      state: this.data.stateList[this.data.selectIndex_State],
      id: UTIL.snowflakeId24(),
      imgFile: [],
      resumeFile: {
        'name': this.data.resumeFile.name,
        'path': ""
      },
      date: formattedDate,
      url: this.data.url,
      note: this.data.note,
      steps: steps,
      curStep: this.data.selectIndex_State - 1,
      industry: this.data.industry
    };
    const id = record.id;
    AddRecord(record, (res) => {
      let newList = [...this.data.dataList, record];
      this.setData({
        dataList: newList
      });
      // 重置之前的记录
      this.setData({
        companyName: "",
        city: "空",
        job: "",
        industry: "",
        jobType: "",
        jobDesc: "无",
        sector: "",
        enterpriseNature: "",
        CompanySize: "",
        fileList: [],
        resumeFile: [],
        note: "无",
        stateNum: {
          id: 2,
          name: 3
        },
        showAddPanel: false
      });
    });
    this.setData({
      showAddPanel: false
    });
    // 上传文件，获取url
    const openid = await UTIL.GetOpenid();
    const resumeFile = this.data.resumeFile;
    if (resumeFile != "") {
      var Funcs = {
        'success': (res) => {
          // 更新相应字段
          const db = wx.cloud.database();
          db.collection('records').where({
            '_openid': openid,
            'record.id': record.id,
          }).update({
            data: {
              'record.$.resumeFile.path': res.fileID
            }
          });
          for (var i = 0; i < this.data.dataList.length; ++i) {
            if (this.data.dataList[i].id == id) {
              this.data.dataList[i].resumeFile.path = res.fileID;
            }
          }
          this.setData({
            dataList: this.data.dataList // 通知小程序更新 dataList
          });
          wx.showToast({
            title: '文件已上传',
            icon: 'none'
          })
        },
        'fail': (error) => {
          console.log(error);
          wx.showToast({
            title: '上传简历文件失败',
            icon: 'error'
          });
        }
      }
      UTIL.UploadFile(resumeFile.path, 'resume/' + Math.random() + resumeFile.name, Funcs);
    }
    // 上传图片
    if (this.data.fileList.length > 0) {
      var that = this;
      var Funcs = {
        'success': (res) => {
          let imgs = [res.fileID];
          // 更新相应字段
          const db = wx.cloud.database();
          db.collection('records').where({
            '_openid': openid,
            'record.id': record.id,
          }).update({
            data: {
              'record.$.imgFile': imgs
            }
          });
          for (var i = 0; i < this.data.dataList.length; ++i) {
            if (this.data.dataList[i].id == id) {
              this.data.dataList[i].imgFile = imgs;
            }
          }
          this.setData({
            dataList: this.data.dataList // 通知小程序更新 dataList
          });
          wx.showToast({
            title: '图片已上传',
            icon: 'none'
          })
        },
        'fail': (error) => {
          wx.showToast({
            title: '上传图片失败',
            icon: 'error'
          });
        }
      }
      UTIL.UploadFile(this.data.fileList[0].url, 'image/' + Math.random() + '.png', Funcs);
    }
  },
  onClose(event) {
    this.setData({
      showAddPanel: false
    });
  },
  // 选中记录
  checkKey(event) {
    this.data.selectedKeyList = event.detail.value;
  },
  // 删除记录
  deleteRecords() {
    if (this.data.selectedKeyList.length == 0)
      return;
    Dialog.confirm({
      title: '删除',
      message: '确认删除对应记录'
    }).then((res) => {
      // TODO - 删除记录对应的文件
      var fileList = [];
      var listToDelete = [];
      this.data.dataList.forEach(item => {
        for (var j = 0; j < this.data.selectedKeyList.length; ++j) {
          if (item.id == this.data.selectedKeyList[j]) {
            listToDelete.push(item);
            break;
          }
        }
      });
      listToDelete.forEach(item => {
        let filePath = item.resumeFile.path;
        // 加入建立文件
        if (filePath !== '')
          fileList.push(filePath);
        // 加入图片文件
        fileList.push(...item.imgFile);
      });
      DB.DeleteRecords(this.data.selectedKeyList, (res) => {
        // 删除所有文件
        let Funcs = {
          success: res => {},
          fail: error => {}
        };
        UTIL.DeleteFile(fileList, Funcs);
        let newList = this.data.dataList.filter(item => !this.data.selectedKeyList.includes(item['id']));
        this.setData({
          selectedKeyList: [],
          dataList: newList
        });
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        });
      });
    });
  },
  enterEditorMode(event) {
    this.setData({
      showSelectBox: true,
      editorMode: true
    });
  },
  saveEdit(event) {
    // 保存换位操作
    this.setData({
      showSelectBox: false,
      editorMode: false
    });
    // 保存数据到服务器
    DB.UpdateWholeRecords(this.data.dataList, (res) => {
      wx.showToast({
        title: '已保存',
        icon: 'none'
      });
    })

  },

  // --------------- 上传文件 -----------------
  isDocument(file) {
    // 获取文件路径的后缀名
    const supportedDocumentTypes = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx']; // 支持的文档类型
    const fileExtension = file.split('.').pop().toLowerCase(); // 提取后缀名并转为小写

    // 判断文件类型是否在支持的文档类型中
    return supportedDocumentTypes.includes(fileExtension);
  },
  chooseFileFromMessage() {
    wx.chooseMessageFile({
      count: 1,
      success: (e) => {
        const files = e.tempFiles;
        const filename = files[0].name;
        const filePath = files[0].path;
        const fileType = files[0].type;
        if (!this.isDocument(filePath) || fileType !== "file") {
          wx.showToast({
            title: '不支持的文件类型',
            icon: 'error'
          });
          return;
        }
        var resumeFile = {
          name: filename,
          path: filePath
        };
        this.setData({
          resumeFile
        });
      },
      fail: (e) => {
        wx.showToast({
          title: '上传文件失败',
          icon: 'error'
        })
      }
    })
  },
  afterRead(res) {
    const {
      file
    } = res.detail;
    var fileList = [{
      url: file.tempFilePath,
      name: Math.random(),
    }];
    this.setData({
      fileList
    });
  },

  // 交换行
  swapEnd(e) {
    var newList = e.detail.value;
    this.setData({
      dataList: newList
    });
  },

  // 饼状图
  Pie(e) {
    // 从dataList中解析出统计数据
    const nameDict = {};
    this.data.dataList.forEach(item => {
      const name = item.state.name;
      if (nameDict[name]) {
        nameDict[name] += 1;
      } else {
        nameDict[name] = 1;
      }
    });

    const series = Object.keys(nameDict).map(name => ({
      name: name,
      data: nameDict[name]
    }))

    var windowWidth = 320;
    try {
      var res = wx.getWindowInfo();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    pieChart = new wxCharts({
      animation: true,
      canvasId: 'pieCanvas',
      type: 'pie',
      series: series,
      width: windowWidth,
      height: 300,
      dataLabel: true,
    });
  },
  // ---------------------- 直方图 -----------------------------
  backToMainChart: function () {
    this.setData({
      chartTitle: chartData.main.title,
      isMainChartDisplay: true
    });
    columnChart.updateData({
      categories: chartData.main.categories,
      series: [{
        name: '成交量',
        data: chartData.main.data,
        format: function (val, name) {
          return val.toFixed(2) + '万';
        }
      }]
    });
  },
  touchHandler: function (e) {

  },
  Column(e) {
    // 解析数据
    // 从dataList中解析出统计数据
    const nameDict = {};
    var offerNum = 0;
    this.data.dataList.forEach(item => {
      const name = item.state.name;
      if (nameDict[name]) {
        nameDict[name] += 1;
      } else {
        nameDict[name] = 1;
      }
      if (name === 'offer')
        ++offerNum;
    });
    // 提取 keys 和 values 到两个数组
    const categories = Object.keys(nameDict);
    const data = categories.map(name => nameDict[name]);
    var chartData = {
      main: {
        title: '统计结果',
        data: data,
        categories: categories
      }
    };

    var windowWidth = 220;
    try {
      var res = wx.getWindowInfo();
      windowWidth = res.windowWidth * 0.55;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    columnChart = new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      animation: true,
      categories: chartData.main.categories,
      series: [{
        name: '数量',
        data: chartData.main.data,
        format: function (val, name) {
          return val + '';
        }
      }],
      yAxis: {
        format: function (val) {
          return val + '';
        },
        title: '数量',
        min: 0
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 15
        }
      },
      width: windowWidth,
      height: 200,
    });
  },

  // ------------------------ 圆环 ------------------------
  touchHandler: function (e) {},
  updateData: function () {
    ringChart.updateData({
      title: {
        name: '80%'
      },
      subtitle: {
        color: '#ff0000'
      }
    });
  },
  Ring(e) {

    var windowWidth = 220;
    try {
      var res = wx.getWindowInfo();
      windowWidth = res.windowWidth * 0.5;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    // 从dataList中解析出统计数据
    const nameDict = {};
    var interview = 0;
    this.data.dataList.forEach(item => {
      const name = item.state.name;
      if (nameDict[name]) {
        nameDict[name] += 1;
      } else {
        nameDict[name] = 1;
      }
      if (name.includes('面') || name === 'offer')
        ++interview;
    });
    const series = Object.keys(nameDict).map(name => ({
      name: name,
      data: nameDict[name]
    }));

    // 计算面试率

    const interview_ratio = (interview * 100 / this.data.dataList.length).toFixed(1);
    ringChart = new wxCharts({
      animation: true,
      canvasId: 'ringCanvas',
      type: 'ring',
      extra: {
        ringWidth: 25,
        pie: {
          offsetAngle: -45
        }
      },
      title: {
        name: String(interview_ratio) + '%',
        color: '#7cb5ec',
        fontSize: 25
      },
      subtitle: {
        name: '面试率',
        color: '#666666',
        fontSize: 15
      },
      series: series,
      disablePieStroke: true,
      width: windowWidth,
      height: 200,
      dataLabel: false,
      legend: false,
      background: '#f5f5f5',
      padding: 0
    });
    ringChart.addEventListener('renderComplete', () => {});
    setTimeout(() => {
      ringChart.stopAnimation();
    }, 500);
  },

  // ------------------------- 解析统计数据 ------------------
  Init() {
    var recordNum = this.data.dataList.length; // 记录数量
    var interviewNum = 0;
    var offerNum = 0;
    var incomingInterviewNum = this.data.interviewList.length;
    // 正则表达式，用于匹配 "*面"（即任意字符 + "面"）
    let regex = /^.*面$/;

    // 统计数量
    offerNum = this.data.dataList.filter(item => item.state.name === "offer").length;

    interviewNum = this.data.dataList.filter(item => regex.test(item.state.name)).length;

    this.setData({
      interviewNum,
      offerNum,
      recordNum,
      incomingInterviewNum
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 登录
    var params = {
      'success': (res) => {
        // 如果是新用户，需要创建一个记录
        if (res.data.length === 0) {
          var newRecord = [];
          DB.AddUserRecord(newRecord);
        }
        this.setData({
          dataList: res.data[0].record,
          sortMode: res.data[0].sortMode,
          interviewList: res.data[0].interviewList,
          userInfo: res.data[0].userInfo,
          sayings:res.data[0].sayings,
          nickName:res.data[0].userInfo.nickName
        });
        this.Init();
      },
      'fail': (res) => {
        wx.showToast({
          title: '网络出错啦~',
          icon: 'error'
        });
      }
    };
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
  async onPullDownRefresh() {
    const openID = await UTIL.GetOpenid();
    var that = this;
    var params = {
      'openid': openID,
      'success': (res) => {
        that.setData({
          dataList: res.data[0].record
        });
        wx.showToast({
          title: '刷新成功',
          icon: 'none'
        })
        wx.stopPullDownRefresh();
      },
      'fail': (error) => {
        wx.showToast({
          title: '网络错误~',
          icon: 'error'
        });
        wx.stopPullDownRefresh();
      }
    }
    DB.GetUserRecord(params);
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