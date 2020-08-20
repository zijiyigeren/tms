<template>
  <div style="width: 100%;height: 100%;">
    <span
      class="noPrint"
      style="display: inline-block;width: 1000px;text-align: right;">
      <input
        type="image"
        src="/static/image/printBTN.png"
        id="btn"
        title="打印"
        @click="handlePrint"
      /><span>打印</span>
    </span>
    <div ref="report" class="printTaskList" style="width: 100%;height: calc(100% - 50px);"></div>
  </div>
</template>

<script>
  import {copyform, getDDat, getHTML} from './print.js'

  export default {
    name: 'print',
    data () {
      return {
        resp: null,
        iframeWin: {},
        src: 'static/printTable2.html',
        state: '',
        contentHtml: '',
        ddat: {},
      }
    },
    methods: {
      handlePrint(){
        window.print()
      },
    },
    created () {
    },
    mounted () {
      let params = null
      params = JSON.parse(window.sessionStorage.getItem('printData'))
      this.ddat = params
      this.$nextTick(() => {
        this.$api.systemPublicationpage.printxls(params)
          .then(res => {
            this.resp = res.data.data
            this.$nextTick(() => {
              this.$api.mly.getTemplateHTMLstring('2417339022')
                .then(res => {
                  this.contentHtml = res.data.data.contentHtml.replace(/&nbsp;/ig, "");
                  this.$nextTick(() => {
                     this.$refs['report'].innerHTML = '<div style=\'page-break-after: always; position: relative; height: 1500px;width: 1000px;\'>' + this.contentHtml + '</div>'

                      var bot = document.querySelector('.botposet')
                      if(bot){
                        bot.style.position = 'absolute'
                        bot.style.bottom = '0'
                        bot.style.left = '50%'
                        bot.style.transform = 'translateX(-50%)'
                        bot.parentElement.classList.add('txt-center')
                        // 需求:右上角动态生成公司logo
                        var imgBot = document.createElement("img");
                        imgBot.style.position = 'absolute'
                        imgBot.style.top = '5px'
                        imgBot.style.right = '5px'
                        imgBot.alt="componyLogo.jpg";
                        imgBot.src="/static/image/componyLogo.jpg";
                        bot.parentElement.appendChild(imgBot);
                      }

                    getHTML(this.$refs['report'], this.contentHtml)
                    getDDat(this.resp)
                    copyform(this.$refs['report'])
                  })
                })
            })

          })
          .catch(err => {
            console.log(err)
          })
      })
    },
  }
</script>

<style lang="less">
  @import "./print.less";
</style>
<style scoped lang="less">
  #btn{
    outline: none;
  }
  @media print {
    .noPrint {
      display: none;
    }
  }
</style>
