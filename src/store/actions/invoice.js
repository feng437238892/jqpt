module.exports = {
  invoiceDetail(ctx, param){
    ctx.dispatch('resource', {
      url: `/qrcodes/${param.code}`,
      method:'GET',
      onSuccess: body => {
        param.onsuccess ? param.onsuccess(body) : null
      }
    })
  },
  submit(ctx, param){
    ctx.dispatch('resource', {
      url: '/saveSpeedInvoice',
      method:'POST',
      body: {
        hotel_id: param.hotel_id,
        hotel_name: param.hotel_name,
        invoice_type: param.invoice_type,
        invoice_content: param.invoice_content,
        room_no: param.room_no,
        contact_name: param.contact_name,
        contact_phone: param.contact_phone,
        remark: param.remark
      },
      onSuccess: body => {
        param.onsuccess ? param.onsuccess(body) : null
      }
    })
  },
  getInvoiceType(ctx, param){
    ctx.dispatch('resource', {
      url: `/invoicetypes/${param.hotel_id}`,
      method:'GET',
      onSuccess: body => {
        param.onsuccess ? param.onsuccess(body) : null
      }
    })
  },
}
