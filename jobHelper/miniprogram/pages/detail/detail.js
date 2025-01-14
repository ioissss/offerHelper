// pages/detail/detail.js
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
  },
  // -------------- 点击进度条 -----------------
  onClickStep(e){
    const index = e.detail;
    this.setData({active:index});
  },

  // --------------- 弹出框框 -------------------

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var data = JSON.parse(options.data);
    this.setData({data});
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