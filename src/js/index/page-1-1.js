{
  let view = {
    el: 'section.recommendedSongList',
    init(){
      this.$el = $(this.el)
    },
  }

  let model ={}
  
  let controller = {
    init(){
      this.view = view 
      this.view.init()
      this.model = model
    }
  }
  
  controller.init(view, model)
}