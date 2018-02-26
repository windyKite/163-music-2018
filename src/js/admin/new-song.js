{
  let view = {
    el: '.page > aside > .newSong',
    template:`
      新建歌曲
    `,
    render(data){
      $(this.el).html(this.template)
    },
    active(){
      $(this.el).addClass('active')
    },
    deactive(){
      $(this.el).removeClass('active') 
    }
  }

  let model = {}
  let controller = {
    init(view, model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.view.active()
      window.eventHub.on('upload',(data)=>{
        this.view.active()
      })
      window.eventHub.on('select',(data)=>{
        this.view.deactive()
      })
      $(this.view.el).on('click',(e)=>{
        this.view.active()
        window.eventHub.emit('new')
      })
    },
    
  }

  controller.init(view, model)
}