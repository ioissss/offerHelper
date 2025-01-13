Component({
  options: {
    multipleSlots: true
  },
  properties: {
    // 必传参: tabs数组, 每项需要传一个包含属性名为label和属性名为id唯一值的对象
    tabs: {
      required: true,
      type: Array,
      value: () => {
        return [{
          label: "",
          id: ""
        }]
      }
    },
    // 非必传: 当前tab初始值
    activeTab: {
      type: Number,
      value: 0
    },
    // 非必传: 每一项的样式
    tabStyle: Object,
    // 非必传: 当前项的样式
    tabActiveStyle: Object,
    // 非必传: 可滑动tabs容器的样式
    tabsStyle: Object,
  },
  data: {
    paneStyle: "",
    paneActiveStyle: "",
    tabsConStyle: "",
    flag: false,
    // 为固定tabCon左滑的位置
    currentTab: "",
  },
  methods: {
    initTabs() {
      // 共三个参数的赋值过程
      // 思路: 
      // 1. 都需要经过对象转字符串过程
      // 2. 如果有普通每项, 则先将当前项的特殊样式与普通项样式合并, 再进行字符串处理
      this.setData({
        paneStyle: this.transferObjToStr(this.data.tabStyle),
        paneActiveStyle: this.data.tabStyle ? this.transferObjToStr(Object.assign(this.data.tabStyle, this.data.tabActiveStyle)) : this.transferObjToStr(this.data.tabActiveStyle),
        tabsConStyle: this.transferObjToStr(this.data.tabsStyle),
      })
    },
    switchTab(event) {
      // 切换方法: 设置当前项, 并传值
      this.setData({
        activeTab: event.currentTarget.dataset.index,
      })
      this.triggerEvent('switchTab', this.data.activeTab);
    },
    transferObjToStr(obj) {
      // 小程序中style不可以像VUE一样直接使用对象, 而传入的是对象, 这一步是将传入的style对象转换成组件中可以直接使用的字符串
      if (!obj) return "";
 
      let str = "";
      for (let key in obj) {
        str += `${key}: ${obj[key]};`;
      }
      return str;
    },
  },
  lifetimes: {
    attached() {
      this.initTabs();
    }
  },
  observers: {
    tabs: function (tabs) {
      // 将来可能会做tabs增删改的功能(我自己想的哈哈哈哈哈)这步的意思是头一次进入页面才需要判断有无activeTab
      // 单拿出来监听tabs: activeTab的设置, 必须得在tabs赋值之后
      if (this.data.flag) return;
      if (tabs.length > 0) {
        // 代表tabs赋值完毕
        this.setData({
          flag: true,
          // 自动定位当前tab
          currentTab: this.data.activeTab === 0 ? "" : this.data.tabs[this.data.activeTab].id
        })
      }
    }
  },
})