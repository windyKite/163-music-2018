{
  let view = {
    el: '#page',
    init(){
      this.$el = $(this.el)
    },
    render(data){
      let {song} = data
      this.$el.find('.background').css(`background-image`,`url(${song.cover})`)
      this.$el.find('.cover').attr('src',song.cover)
      this.$el.find('audio').attr('src',song.url)
      this.$el.find('h1.songName')[0].textContent = song.name
      song.lyrics.split('\n').map((string)=>{
        let p = document.createElement('p')  
        let regex = /\[([\d:.]+)\](.+)/
        let matches = string.match(regex)
        if(matches){
          // console.log(matches)
          let time = matches[1]
          p.textContent = matches[2]
          let parts = time.split(':')
          let minutes = parts[0]
          let seconds = parts[1]
          let newTime = parseInt(minutes,10) * 60 + parseFloat(seconds,10)
          p.setAttribute('data-time', newTime)
        }else{
          p.textContent = string
        }
        this.$el.find('.lyrics > .lines').append(p)
      })
    },
    showLyrics(time){
      let allP = this.$el.find('.lyrics > .lines > p')
      for(let i = 0, len = allP.length; i < len;i++){
        if(i === allP.length - 1){

        }else{
          let prveTime = allP.eq(i).attr('data-time')
          let nextTime = allP.eq(i + 1).attr('data-time')
          if(prveTime <= time && time < nextTime){
            let pHeight = allP.eq(i).offset().top
            let linesHeight = this.$el.find('.lines').offset().top
            let height = pHeight - linesHeight
            this.$el.find('.lines').css('transform',`translateY(${-height + 35}px)`)
            allP.eq(i).addClass('active').siblings().removeClass('active')
            break
          }
        }
      }
    },
    play(){
      this.$el.find('.icon').hide()
      this.$el.find('.cover').removeClass('paused')
      this.$el.find('audio')[0].play()
    },
    paused(){
      this.$el.find('.icon').show()
      this.$el.find('.cover').addClass('paused')
      this.$el.find('audio')[0].pause()
    }
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
          this.view.paused()
        }else if(this.model.data.status === 'paused'){
          this.model.data.status = 'playing'
          this.view.play()
        }
      })
      this.view.$el.find('audio').on('timeupdate',(e)=>{
        let time = e.currentTarget.currentTime
        this.view.showLyrics(time)
      })
    }
  }

  controller.init(view, model)
}