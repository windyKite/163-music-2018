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
        console.log('哈哈')
        console.log($(`<div class="liWrap"><li>${song.name}</li></div>`))
        return $(`<div class="liWrap"><li>${song.name}</li></div>`)
      })
      $(this.el).find('ul').empty()
      divList.map((domDiv)=>{
        $(this.el).find('ul').append(domDiv)
      })

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
      this.model.find().then((songs)=>{
        console.log(this.model.data.songs)
        this.view.render(this.model.data  )
      })
      this.view.render(this.model.data)
      window.eventHub.on('upload',()=>{
        this.view.clearActive()
      })
      window.eventHub.on('create',(data)=>{
        this.model.data.songs.push(data)
        this.view.render(this.model.data)
      })      
    }
  }

  controller.init(view, model)
}