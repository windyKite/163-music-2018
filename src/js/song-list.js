{
  let view = {
    el: '#songList-container',
    template: `
      <ul class="songList">
        <div class="liWrap">
          <li>歌曲1</li>   
        </div>   
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
    }
  }
  let controller = {
    init(view, model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      window.eventHub.on('upload',()=>{
        this.view.clearActive()
      })
      window.eventHub.on('create',(data)=>{
        console.log(11)
        console.log(data)
        this.model.data.songs.push(data)
        console.log(22)
        console.log(this.model.data.songs)
        this.view.render(this.model.data)
      })
    }
  }

  controller.init(view, model)
}