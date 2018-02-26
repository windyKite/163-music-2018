{
  let view = {
    el: '',
    init(){
      this.$el = $(this.el)
    }
  }

  let model = {
    data:{
      id: '',
      name: '',
      singer: '',
      url: ''
    },
    setSongId(id){
      this.data.id = id
    },
    getSong(id){
      var query = new AV.Query('Song');
      query.get(id).then((song)=>{
        Object.assign(this.data,song.attributes)
        console.log(this.data)
      }, function (error) {
        console.log(error)
      })
    }
  }

  let controller = {
    init(view, model){
      this.view = view 
      this.view.init()
      this.model = model
      this.getSongID()
      this.model.getSong(this.model.data.id)
    },
    getSongID(){
      let search = window.location.search
      if(search.indexOf('?' === 0)){
        search = search.substr(1)
      }

      let array = search.split('&').filter(v=>v)
      let id = ''

      for(let i = 0; i < array.length; i++){
        let kv = array[i].split('=')
        let key = kv[0]
        let value = kv[1]
        if(key === 'id'){
          id = value
        }
        break
      }
      this.model.setSongId(id)
      return id
    },
  }

  controller.init(view, model)
}