Component({
  options:{
  },
  properties:{
    item:{
      type:Object,
      value:{}
    },
    index:{
      type:Number
    },
    columns:{
      type:Object,
      value:{}
    }
  },
  data:{},
  methods:{
    handleClickItem(e) {
      const { type } = e.currentTarget.dataset;
      const { index, item } = this.data;
      this.triggerEvent('clickaction', {
          value: {
              type,
              index, item
          }
      });
      this.triggerEvent('onactionevent', {
          value: {
              type,
              index, item
          }
      });
      if(type != "interview")
        this.goto(item);
  },
  goto(item){
    let data = JSON.stringify(item);
    wx.navigateTo({
      url: '/pages/detail/detail?data=' + data,
    })
  }
  }
})