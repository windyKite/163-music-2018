{
  let view = {
    el: '#page',
    init(){
      this.$el = $(this.el)
    },
    render(data){
      console.log(data)
      let {song} = data
      this.$el.find('.background').css(`background-image`,`url(${song.cover})`)
      this.$el.find('.cover').attr('src',song.cover)
      this.$el.find('audio').attr('src',song.url)
    },
  }

  let model = {
    data:{
      song:{
        id: '',
        name: '',
        singer: '',
        url: '',
        cover: '',
      },
      status: 'playing'
    },
    setSongId(id){
      this.data.song.id = id
    },
    getSong(id){
      var query = new AV.Query('Song');
      return query.get(id).then((song)=>{
        return Object.assign(this.data.song, song.attributes)
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
      this.model.getSong(this.model.data.song.id).then((song)=>{
        this.view.render(this.model.data)
      })
      this.bindEvents()
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
    bindEvents(){
      this.view.$el.on('click','main',(e)=>{
        if(this.model.data.status === 'playing'){
          this.model.data.status = 'paused'
          this.view.$el.find('.icon').show()
          this.view.$el.find('.cover').addClass('paused')
          myAudio.pause()
        }else if(this.model.data.status === 'paused'){
          this.model.data.status = 'playing'
          this.view.$el.find('.icon').hide()
          this.view.$el.find('.cover').removeClass('paused')
          myAudio.play()
        }
      })
    }
  }

  controller.init(view, model)
}