{
  let view = {
    el: '#songList-container',
    template: `
      <ul class="songList">
 
      </ul>
    `,
    render(data){
      $(this.el).html(this.template)
      let {songs} = data
      let divList = songs.map((song)=>{
        return $(`<div class="liWrap"><li data-song-id="${song.id}">${song.name}</li></div>`)
      })
      $(this.el).find('ul').empty()
      divList.map((domDiv)=>{
        $(this.el).find('ul').append(domDiv)
      })

    },
    activeItem(li){
      let $liWrap = $(li.parentNode)
      $liWrap.addClass('active')
        .siblings('.active').removeClass('active')
    },
    clearActive(){
      $(this.el).find('.active').removeClass('active')
    }
  }

  let model = {
    data: {
      songs: [
        // 歌曲列表数组
      ]
    },
    find(){
      let query = new AV.Query('Song')
      return query.find().then((songs)=>{
        this.data.songs = songs.map((song)=>{
          return {
            id: song.id,
            name:song.attributes.name,
            url:song.attributes.url,
            singer:song.attributes.singer,
          }
        })
        return songs
      })
    },
  }
  let controller = {
    init(view, model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      this.bindEventHub()  
      this.getAllSongs()       
    },
    getAllSongs(){
      return this.model.find().then((songs)=>{
        this.view.render(this.model.data)
      }) 
    },
    bindEvents(){
      $(this.view.el).on('click','li',(e)=>{
        this.view.activeItem(e.currentTarget)
        songID = e.currentTarget.getAttribute('data-song-id')
        let data = this.model.data.songs.filter((song)=>{
          return song.id === songID          
        })[0]
        
        data = JSON.parse(JSON.stringify(data))
        window.eventHub.emit('select', data)
      })
    },
    bindEventHub(){
      window.eventHub.on('upload',()=>{
        this.view.clearActive()
      })
      window.eventHub.on('create',(data)=>{
        this.model.data.songs.push(data)
        this.view.render(this.model.data)
      })   
      window.eventHub.on('new',()=>{
        this.view.clearActive()        
      })
    }
  }

  controller.init(view, model)
}