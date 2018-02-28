{
  let view = {
    el: '.page > main',
    init(){
      this.$el = $(this.el)
    },
    template: `
      <form class="form">
        <div class="row">
          <label>歌名</label>
          <input type="text" value="__name__" name="name">
        </div>
        <div class="row">
          <label>歌手</label>
          <input type="text" value="__singer__" name="singer">
        </div>
        <div class="row">
          <label>外链</label>
          <input type="text" value="__url__" name="url">
        </div>
        <div class="row">
          <label>封面外链</label>
          <input type="text" value="__cover__" name="cover">
        </div>
        <div class="row">
          <label>歌词</label>
          <textarea rows=20 cols=60 name="lyrics">__lyrics__</textarea>
        </div>
        <div class="row actions">
          <button type="submit">保存</button>
        </div>
      </form>
    `,
    render(data = {}){
      let placeholders = 'name singer url cover lyrics'.split(' ')
      let html = this.template
      placeholders.map((string)=>{
        html = html.replace(`__${string}__`, data[string] || '')
      })
      
      $(this.el).html(html)
      if(data.id){
        $(this.el).prepend('<h1>编辑歌曲</h1>')
      }else{
        $(this.el).prepend('<h1>新建歌曲</h1>')
      }
    },
    reset(){
      this.render()
    },
  }

  let model = {
    data: {
      name:'',
      singer:'',
      url: '',
      id: '',
      cover: '',
      lyrics:'',
    },
    create(data){
      var Song = AV.Object.extend('Song');
      var song = new Song()
      song.set('name',data.name)
      song.set('singer',data.singer)
      song.set('url',data.url)
      song.set('cover',data.cover)
      song.set('lyrics',data.lyrics)
      return song.save().then((newSong)=>{
        let {id, attributes} = newSong
        Object.assign(this.data, {
          id,
          name: attributes.name,
          singer: attributes.singer,
          url: attributes.url,
          cover: attributes.cover,
          lyrics: attributes.lyrics
        })
      }, (error)=>{
        
      })
    },
    update(data){
      var song = AV.Object.createWithoutData('Song', this.data.id);
      song.set('name', data.name)
      song.set('url', data.url)
      song.set('singer', data.singer)
      song.set('cover', data.cover)
      song.set('lyrics',data.lyrics)
      return song.save().then((response)=>{
        Object.assign(this.data, data)
        return response
      }) 
    },
  }
  
  let controller = {
    init(view, model){
      this.view = view
      this.view.init() 
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      window.eventHub.on('upload', (data)=>{
        this.model.data = {}
        this.view.render(data)
      })
      window.eventHub.on('select',(data)=>{
        this.model.data = data
        this.view.render(this.model.data)
      })
      window.eventHub.on('new',(data)=>{
        if(this.model.data.id){
          this.model.data = {}
        }else{
          return
        }   
        this.view.render(this.model.data)
      })
    },
    create(){
      let needs = 'name url singer cover lyrics'.split(' ')
      let data = {}
      needs.map((string)=>{
        data[string] = this.view.$el.find(`[name="${string}"]`).val()
      })
      this.model.create(data)
        .then(()=>{
          this.view.reset()
          let object = JSON.parse(JSON.stringify(this.model.data))
          window.eventHub.emit('create', object)
        })
    },
    update(){
      let needs = 'name url singer cover lyrics'.split(' ')
      let data = {}
      needs.map((string)=>{
        data[string] = this.view.$el.find(`[name="${string}"]`).val()
      })
      this.model.update(data)
        .then(()=>{
          data = JSON.parse(JSON.stringify(this.model.data))
          window.eventHub.emit('update', data)
        }) 
    },
    bindEvents(){
      this.view.$el.on('submit','form',(e)=>{
        e.preventDefault()

        if(this.model.data.id){
          this.update() 
        }else{
          this.create()
        }
      })
    }
  }

  controller.init(view, model)
}