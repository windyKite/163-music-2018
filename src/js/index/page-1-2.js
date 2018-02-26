{
  let view = {
    el: 'section.latestMusic',
    init(){
      this.$el = $(this.el)
    },
    render(data){
      let songs = data.songs
      songs.map((song)=>{
        let {id,name,singer,url} = song
        let $li = `
        <li>
        <a href="./song.html?id=${id}">
          <h3>${name}</h3>
          <p>${singer}</p>
          <svg class="icon" aria-hidden="true">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-bofang"></use>
          </svg>
        </a>
        </li>
        `
        let $ol = $('section.latestMusic > ol')
        $ol.append($li)
      })
    },
  }

  let model ={
    data:{
      songs:[]
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
      this.view.init()
      this.model = model
      this.model.find().then(()=>{
        this.view.render(this.model.data)
      })
    },
  }
    
  controller.init(view, model)
}