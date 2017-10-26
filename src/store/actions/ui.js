module.exports = {
  showtoast(ctx, text){
    ctx.commit('TOAST',
      {
        show: true,
        text: text ? text : '操作成功'
      }
    )
  }
}