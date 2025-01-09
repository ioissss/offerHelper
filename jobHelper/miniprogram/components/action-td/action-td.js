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
      console.log(this.data.item);
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
  }
  }
})