window.eventHub = {
  events: {
    // 空的hash，用来保存监听事件
  },
  emit(eventName, data){ // 发布。trigger，触发函数,用来触发事件
    for(let key in this.events){
    if(key === eventName){
        let fnList = this.events[key]
        fnList.map((fn)=>{
          fn.call(undefined, data)
        })
      }
    }
  },
  on(eventName, fn){  // 订阅。监听函数，用来绑定事件监听
    if(this.events[eventName] === undefined){
      this.events[eventName] = []
    }
    this.events[eventName].push(fn)
  }
}