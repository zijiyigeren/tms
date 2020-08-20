<template>
  <div id="app">

    <a-locale-provider :locale="locale">
      <router-view></router-view>
    </a-locale-provider>

  </div>
</template>

<script>
  import 'jquery-ui/themes/base/all.css'
  import 'jquery-ui/ui/widgets/draggable'
  import 'jquery-ui/ui/widgets/resizable'
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  import moment from 'moment'
  import 'moment/locale/zh-cn'

  moment.locale('zh-cn')
  export default {
    name: 'App',
    data () {
      return {
        locale: zhCN,
      }
    }
  }
</script>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
    text-decoration: none;
    box-sizing: border-box;
    font-size: 14px;
  }

  li {
    list-style: none;
  }

  html,
  body {
    width: 100%;
    height: 100%;

  }

  #app {
    min-width: 1280px;
    height: 100%;

    display: flex;

  }

  .aside {
    width: 200px;
  }

  .showcont {
    flex: 1;
    overflow: auto;
  }

  .cont {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;

    .conttop {
      width: 100%;
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: rgb(9, 65, 98);
      font-size: 22px;
      font-weight: bold;
      color: #fff;
      padding: 0 10px;

      .contleft {
        height: 100%;
        display: flex;
        align-items: center;
        white-space: nowrap;

        img {
          margin-right: 10px;
        }
      }

      .contcenter {
        height: 100%;
        overflow: hidden;
      }

      .contright {
        display: flex;
        align-items: center;

        .el-divider--vertical {
          margin: 0;
        }

        .el-divider {
          height: 25px;
          background-color: rgba(245, 245, 245, 1);
        }

        .user-name {
          margin: 0 10px;
        }

        .logoutstyle {
          margin-left: 10px;
        }
      }
    }

    .title {
      width: 100%;
      height: 50px;
      background: #fff;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      overflow: hidden;
      font-size: 14px;

      .title-content {
        width: 100%;
        height: 100%;
        display: flex;
        display: -webkit-flex;
        overflow: hidden;

        p.hos {
          width: 50px;
          line-height: 50px;
          padding: 0 15px;
          margin: 0;
          border: none;
        }

        .label_btn {
          box-sizing: border-box;
          flex: 1;
          display: flex;
          overflow-x: auto;
          overflow-y: hidden;
        }
      }
    }
  }

  a {
    color: black;
  }

  .saveConfirm {
    max-height: 500px;
    overflow: auto !important;
  }

  .el-dialog .el-dialog__header {
    padding: 10px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    position: relative;
  }

  .divider-app {
    display: block;
    width: 3px;
    height: 16px;
    margin: 0;
    background: linear-gradient(0deg, rgba(96, 135, 254, 1), rgba(84, 183, 235, 1));
    position: absolute !important;
    top: 14px;
    left: 10px;
  }

  .el-dialog .el-dialog__header .el-dialog__title {
    margin-left: 10px;
  }

  .el-dialog .el-dialog__header .el-dialog__headerbtn {
    position: absolute;
    top: 13px;
    right: 10px;
  }

  .el-message-box .el-message-box__header {
    padding: 10px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    position: relative;
  }

  .divider-app {
    display: block;
    width: 3px;
    height: 16px;
    margin: 0;
    background: linear-gradient(0deg, rgba(96, 135, 254, 1), rgba(84, 183, 235, 1));
    position: absolute !important;
    top: 14px;
    left: 10px;
  }

  .el-dialog .el-dialog__header .el-dialog__title {
    margin-left: 10px;
  }

  .el-dialog .el-dialog__header .el-dialog__headerbtn {
    position: absolute;
    top: 13px;
    right: 10px;
  }

  .el-message-box .el-message-box__header {
    padding: 15px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    position: relative;
  }

  .divider-delete.el-divider--vertical {
    margin: 0;
  }

  .divider-delete.el-divider {
    background-color: rgb(50, 175, 240);
  }

  .divider-delete {
    width: 2px;
    height: 20px;
    position: absolute;
    top: 12px;
    left: 10px;
  }

  .el-message-box .el-message-box__header .el-message-box__headerbtn {
    position: absolute;
    top: 11px;
    right: 10px;
  }

  .el-button--primary[class*="bespoke"] {
    height: 30px !important;
    padding: 0 20px !important;
    background: linear-gradient(90deg, rgb(96, 157, 248), rgb(84, 183, 235)) !important;
    color: #fff !important;
    /*border: none !important;*/
  }

  .el-button--primary, .el-button--default, .el-button--info {
    height: 30px;
    border-radius: 4px;
    padding: 0 20px;
  }
  .el-button--primary{
    background: linear-gradient(90deg, rgb(96, 157, 248), rgb(84, 183, 235));
    border: none;
  }

  .el-button--info[class*=bespoke] {
    height: 30px !important;
    padding: 0 20px !important;
    background: #909399 !important;
    color: #fff !important;
  }

  .el-message {
    top: 55px !important;
  }

  /* 任务详情的弹框样式(很重要!!!!) */
  .taskDetail_dialog1 {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .el-dialog__body{
      padding: 10px;
      flex: 1;
      overflow: hidden;

      .div{
        .wrap{
          padding-right: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;

          .m-tabs{
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;

            .el-tabs__content{
              flex: 1;
              overflow: hidden;

              .el-tab-pane{
                height: 100%;
                overflow: auto;

                .m-SampleInfor,.m-InspecteItems{
                  height: 99%;
                  overflow: hidden;
                  display: flex;
                  flex-direction: column;

                  .m-target{
                    flex: 1;
                    overflow: hidden;
                  }
                }
                .m-InspecteItems{
                  .m-target{
                    flex: 1;
                    overflow: auto;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>

