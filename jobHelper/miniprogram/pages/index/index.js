// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
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
        'title':'简历',
        'key':'resume'
      }
    ],
    dataList:[
      {'id':1,'company':111, 'type':111,'jobType':111,'state':111,'city':111,'resume':111},
      // {'id':2,'content':222, 'content':222,'content':222,'content':222,'content':222,'content':222},
      {'id':2,'company':222, 'type':222,'jobType':222,'state':222,'city':222,'resume':222},
      {'id':3,'company':333, 'type':333,'jobType':333,'state':333,'city':333,'resume':333},
      {'id':4,'company':444, 'type':444,'jobType':444,'state':444,'city':444,'resume':444},
      {'id':5,'company':555, 'type':555,'jobType':555,'state':555,'city':555,'resume':555},
    ]
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



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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