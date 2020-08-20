<template>
  <section><!--{{power}}-->
    <div class="commonModule"
         v-loading="loading"
         element-loading-text="获取权限中..."
         element-loading-spinner="el-icon-loading"
    >
      <ul class="commonModule-ul">
        <li
          v-for="(item,ind) in ulList" :key="ind"
          v-if="power.includes(item.myRouter)"
          @click="goRouter(item.myRouter,ind)"
          @mouseover="changeActive(ind)"
          @mouseout="removeActive(ind)"
        >
          <i><!--上角标-->{{$store.state[item.myRouter] | maxNumber }}</i>
          <img :src="item.img">
          {{item.name}}<!--{{item.myRouter}}-->
        </li>
      </ul>
    </div>
  </section>
</template>
<script>
  import ulList from './modulesData'

  export default {
    name: 'common',
    data () {
      return {
        power: [],// ['...','...']
        list: [],// [{...},{...}]
        ulList: ulList,
        loading: false,
      }
    },
    created () {
      this.loading = true
      this.getUsualMenu()
    },
    mounted () {
    },
    filters: {
      maxNumber (value) {
        if (!value) {
          return ''
        }
        if (value == 0) {
          return ''
        }
        if (value > 99) {
          return '99+'
        } else {
          return value
        }
      }
    },
    methods: {
      /*
      * 获取当前登录人的常用模块
      * */
      getUsualMenu () {
        this.$api.systemPublicationpage.getUsualMenu()
          .then(res => {
            if (res.data.ok && res.data.data && res.data.data.length != 0) {
              res.data.data.forEach((item) => {
                this.power.push(item.name)
                this.$store.commit({
                  type: 'handleChange_superscript',
                  superscriptName: item.name,
                  superscriptTotal: item.total
                })
              })
              this.list = res.data.data
            } else {
              this.$message.error({message: '当前用户没有常用模块权限'})
            }
          })
          .catch(err => {
            this.$message.error({message: err.data.message})
          })
          .then(() => {
            this.loading = false
          })
      },
      changeActive (e) {
        this.ulList.forEach(imgID => {
          if (e === imgID.index) {
            imgID.img2 = imgID.img
            imgID.img = imgID.imgWhite
          }
        })
      },
      removeActive (e) {
        this.ulList.forEach(imgID => {
          if (e === imgID.index) {
            imgID.img = imgID.img2
          }
        })
      },
      /*
      * 功能: 缓存页面
      * 作者: liangxiaotong
      * */
      setFn (routerName) {
        let curName = routerName
        if (window.sessionStorage.getItem('includePageNames')) {
          let allNames = window.sessionStorage.getItem('includePageNames').split(',')
          allNames.forEach((item, index) => {
            if (item == curName) {
              allNames.splice(index, 1)
            }
          })
          allNames.push(curName)
          window.sessionStorage.setItem('includePageNames', allNames)
        }
      },
      goRouter (routerName, e) {
        this.setFn(routerName)

        this.ulList.forEach(imgID => {
          if (e == imgID.index) {
            imgID.img = imgID.img2
          }
        })

        this.list.forEach((item) => {
          if (routerName == item.name) {
            this.$EventBus.$emit('Crumbs', {
              // cache: true,
              // children: null,
              // component: item.component,
              // hidden: false,
              name: item.name,
              path: item.path,
              // redirect: null,
              title: item.title
            })
          }
        })
      },
    },
  }
</script>

<style scoped lang="less">
  .commonModule {
    width: 100%;
    height: auto;
    background: #fff;
    overflow-x: auto;
  }

  .commonModule-ul {
    display: flex;
    /*justify-content: space-around;*/
    width: auto;
    height: 156px;
    padding: 32px 0;
    margin: 0;
  }

  .commonModule-ul li {
    position: relative;
    width: 104px;
    height: 94px;
    background: rgb(255, 255, 255);
    box-shadow: 0 0 16px 0 rgba(199, 151, 249, 0.21);
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-left: 10px;

    /* 防止子项被压缩 */
    flex-shrink: 0;
    -webkit-flex-shrink: 0;
    -ms-flex-shrink: 0;

    i {
      font-size: 12px;
      position: absolute;
      top: -10px;
      right: -10px;
      display: inline-block;
      padding: 0 6px;
      background-color: rgba(255, 0, 0, .6);
      border-radius: 15px;
      font-style: normal;
      color: white;
      z-index: 2;
    }
  }

  .commonModule-ul li:hover {
    width: 104px;
    height: 94px;
    background: url(../../../../assets/img/backColor.png) no-repeat 50%;
    box-shadow: 0 0 16px 0 rgb(212, 212, 212);
    color: #fff;

    i {
      background-color: rgba(255, 0, 0, 1);
    }
  }

  .commonModule-ul li img {
    display: block;
    width: 34px;
    height: 34px;
    margin-bottom: 10px;
  }

</style>
