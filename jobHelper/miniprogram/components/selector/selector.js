Component({
  properties: {
   title:{
    type: String,
    value: ""
   },
   nameList: {
    type: Array,
    value: [],
    observer: function(){
    //有的时候选项组是后端获取数据来的，初始化时可能为[]，所以这里使用obersver，当父组件中值改变时触发
     this.processData();
    }
   },
   nowId: {
    type: Number,
    value: -1
   },
   nowName: {
    type: String,
    value: "",
    observer: function(){
     this.setData({select: this. properties.nowName,
      selectId: this.properties.nowId,});
    }
   },
   placeholder: {
    type: String,
    value: ""
   }
  },
 
  /**
   * 页面的初始数据
   */
  data: {
   selectcontent: [],
   changable: false, //箭头切换
   select: undefined, //选中的值
   selectId: undefined, //选中的id
  },
  methods: {
  // 下拉框收起和展开
   startChange(e) {
    this.setData({
     changable: !this.data.changable
    })
   },
   // 选择数据后回显
   changecontent(e) {
    this.setData({
     select: e.currentTarget.dataset.datavalue.name,
     selectId: e.currentTarget.dataset.datavalue.id,
     changable: false
    })
    this.triggerEvent("handleChange", {selectId: this.data.selectId, select: this.data.select});//向父组件传参
   },
   //处理数据，复制一遍，因为子组件不能直接改变父组件的传进来的值。
   processData(){
    let options = [];
    let that = this;
    this.properties.nameList.forEach((item) => {
     options.push({
      id: item.id,
      name: item.name,
     });
    }); //forEach
    this.setData({
     selectcontent: options,
     select: that.properties.nowName,
     selectId: that.properties.nowId,
    });
   }
  }
 })
 