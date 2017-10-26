<template>
  <div class="content">
    <div class="content-top">
      <div class="head-logo">
        <svg class="logo-icon">
          <use xlink:href ="#icon-logo"/>
        </svg> 
      </div>
      <Group gutter="0">
        <Cell title="开票类型" :value="invoiceType" @click.native="showAction('invoiceType')" link/>
        <XInput title="房间" v-model="roomNo" placeholder="房间号(多个请使用 , 隔开)"/>
      </Group>
      <!-- <Group>
        <XInput title="房间" v-model="roomNo" :class="{'placeholder-red': !hasRoomNo}" :placeholder="roomNoPlaceholder"/>
        <XInput title="联系人" v-model="contactName" :class="{'placeholder-red': !hasContactName}" :placeholder="contactNamePlaceholder"/>
        <XInput title="联系电话" v-model="contactPhone"  placeholder="请输入联系人手机号码"/>
        <XTextarea title="备注" v-model="remark"  placeholder="请输入你的备注信息"/>
      </Group> -->
    </div>
    
    <Dialog v-model="showDialog" confirmVal="我知道了" @onConfirm="dialogConfirm" confirm>
      <div>
        <p>{{dialogMsg}}</p>
      </div>
    </Dialog>
    <Actionsheet v-model="showActinSheet" :menu="actionList" @onClick="chooseAction" cancel />
    <div class="bottom-box">
        <div class="button-group">
            <XButton :disabled="!roomNo" class="x-button" value="下一步，选择发票抬头" default @click.native="nextStep"></XButton>
        </div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
  import tools from '@/assets/tools/tool.js'

  let symbols = ['`', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '[', '{', ']', '}', ';', ':', '"', '\'', '\\', '|', '<', '.', '>', '/', '?']

  module.exports = {
    name: 'Invoice',
    data(){
      return {
        type: '',
        showActinSheet: false,
        showDialog: false,
        dialogMsg: '',
        // hasRoomNo: true,
        // hasContactName: true,
        // roomNoPlaceholder: '房间号(多个请使用 , 隔开)',
        // contactNamePlaceholder: '请输入联系人姓名',
        invoiceType: '',
        // invoiceContent: '',
        roomNo: '',
        // contactName: '',
        // contactPhone: '',
        // remark: '',
        code: '',
        hotelId: '',
        hotelName: '',
        actionList: [],
        // typeList: ['公司·增值税普通发票','公司·增值税专用发票','个人·发票'],
        // contentList: ['qqq','www'],
        invoiceTypeList: []
      }
    },
    computed: {
      invoiceTypeNum() {
        let temp = '';
        switch (this.invoiceType) {
          case '公司·增值税普通发票':
            temp = '1';
            break;
          case '公司·增值税专用发票':
            temp = '2';
            break;
          case '个人·发票':
            temp = '3';
            break;
          default:
            temp = '1';
        }
        return temp;
      },
      typeList() {
        return this.invoiceTypeList.map(v => {
          if (v === '1') return '公司·增值税普通发票';
          if (v === '2') return '公司·增值税专用发票';
          if (v === '3') return '个人·发票';
        })
      }
    },
    watch: {
      hotelId() {
        this.getTypeList();
      },
      roomNo(newVal, oldVal) {
        for (let val of symbols) {
          if ([...newVal].find(v => v === val)) {
            this.$nextTick(() => {
              this.roomNo = oldVal.slice(0, newVal.length-1);
            })
          }
        }
      },
      invoiceType(newVal, oldVal) {
        if (newVal === 'cancel')
          this.invoiceType = oldVal;
      },
      typeList(list) {
        if (list.length > 0) {
          this.invoiceType = list[0];
        }
      }
      // contactPhone(newVal, oldVal) {
      //   if (isNaN(newVal)) {
      //     this.$nextTick(() => {
      //       this.contactPhone = oldVal;
      //     })
      //   }
      // }
    },
    methods: {
      ...mapActions([
        'goto',
        'invoiceDetail',
        'getInvoiceType',
        'submit'
      ]),
      dialogConfirm() {
        this.dialogMsg = '';
        this.showDialog = false;
      },
      showAction(type) {
        this.type = type;
        if (this.type === 'invoiceType') {
          this.actionList = this.typeList;
        } else if (this.type === 'invoiceContent') {
          // this.actionList = this.contentList;
        }
        this.showActinSheet = true;
      },
      chooseAction(val) {
        if (this.type === 'invoiceType') {
          this.invoiceType = val;
        } else if (this.type === 'invoiceContent') {
          // this.invoiceContent = val;
        }
      },
      getDetail() {
        this.invoiceDetail({
          code: this.code,
          onsuccess: body => {
            if (body.data) {
              this.hotelId = body.data.params.hotel_id;
              this.hotelName = body.data.params.hotel_name;
              this.roomNo = body.data.params.room_no;
            } else {
              this.dialogMsg = '获取数据为空!'
              this.showDialog = true;
            }
          }
        })
      },
      getTypeList() {
        this.getInvoiceType({
          hotel_id: this.hotelId,
          onsuccess: body => {
            if (body.data && body.data.invoice_type && Array.isArray(body.data.invoice_type)) {
              this.invoiceTypeList = body.data.invoice_type;
            } else {
              this.dialogMsg = '获取发票类型数据有误!'
              this.showDialog = true;
            }
          }
        })
      },
      nextStep() {
        
        if (!this.hotelId || !this.hotelName) {
          this.dialogMsg = '缺少参数，请重新扫码!'
          this.showDialog = true;
          return;
        }

        this.roomNo[this.roomNo.length - 1] === ',' && (this.roomNo = this.roomNo.slice(0, this.roomNo.length - 1));


        this.roomNo = this.roomNo.split(',').toString()

        this.submit({
          hotel_id: this.hotelId,
          hotel_name: this.hotelName,
          invoice_type: this.invoiceTypeNum,
          // invoice_content: this.invoice_content,
          room_no: this.roomNo,
          // contact_name: this.contactName,
          // contact_phone: this.contactPhone,
          // remark: this.remark,
          onsuccess: body => {
            if (body.data) {
              // window.open(body.data)
              location.href = body.data
            }
          }
        })
      }
    },
    mounted(){
      let params = tools.urlquery()

      if(params.code) {
        this.code = params.code;
        this.getDetail();
      } else if(params.hotel_id && params.hotel_name) {
        this.hotelId = params.hotel_id;
        this.hotelName = params.hotel_name;
      } else {
        this.dialogMsg = '缺少参数，请重新扫码!'
        this.showDialog = true;
      }
    }
  }

</script>

<style lang="less">
html, body {
  height: 100%;
}
.content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content-top {
  flex: 1
}

.head-logo {
  width: 100%;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  width: 173px;
  height: 50px;
}

.bottom-box {
    width: 100%;
    // position: fixed;
    // bottom: 5px;
}

.x-button {
  background-color: #08B49C;
}

.weui-dialog__btn_default {
  color: #25B8F1;
}

.placeholder-red {
  ::-webkit-input-placeholder { /* WebKit browsers */  
      color:    #f00;  
  }  
  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */  
    color:    #f00;  
    opacity:  1;  
  }  
  ::-moz-placeholder { /* Mozilla Firefox 19+ */  
    color:    #f00;  
    opacity:  1;  
  }  
  :-ms-input-placeholder { /* Internet Explorer 10+ */  
    color:    #f00;  
  }
}

</style>