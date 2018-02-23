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
        <div class="row actions">
          <button type="submit">保存</button>
        </div>
      </form>
    `,
    render(data = {}){
      let placeholders = 'name singer url'.split(' ')
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
    },
    create(data){
      var Song = AV.Object.extend('Song');
      var song = new Song();
      song.set('name',data.name);
      song.set('singer',data.singer);
      song.set('url',data.url)
      return song.save().then((newSong)=>{
        let {id, attributes} = newSong
        Object.assign(this.data, {
          id,
          name: attributes.name,
          singer: attributes.singer,
          url: attributes.url
        })
      }, (error)=>{
        
      });
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
        this.view.render(data)
      })
      window.eventHub.on('select',(data)=>{
        this.model.data = data
        this.view.render(data)
      })
      window.eventHub.on('new',()=>{
        this.model.data = {}
        this.view.render()
      })
    },
    bindEvents(){
      this.view.$el.on('submit','form',(e)=>{
        e.preventDefault()
        let needs = 'name url singer'.split(' ')
        let data = {}
        needs.map((string)=>{
          data[string] = this.view.$el.find(`[name="${string}"]`).val()
        })
        this.model.create(data)
          .then(()=>{
            this.view.reset()
            let object = JSON.parse(JSON.stringify(this.model.data))
            window.eventHub.emit('create',object)
          })
      })
    }
  }

  controller.init(view, model)
}