<template>
  <el-row class="tac">
    <el-col>
      <div class="menu-box">
        <div v-for="(item,index) in options" :key="index" :class="active==item.path ? 'menu-box-item-active' : 'menu-box-item'">
          <el-button type="text" v-if="!item.children || item.redirect" @click="addlist(item)" class="menu-box-item-btn">{{item.title}}</el-button>
          <el-dropdown v-if="item.children && !item.redirect" placement='top-start'>
            <el-button type="text">{{item.title}}</el-button>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(em,i) in item.children" :key="i">
                <el-button type="text" @click="addlist(em)">{{em.title}}</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ["options","active"],
  data() {
    return {
      activeIndex: "1",
      names : [],
      
    };
  },
  methods: {
    handleSelect(key, keyPath) {
        console.log(key, keyPath);
    },
    addlist(item) {
      if(window.sessionStorage.getItem("includePageNames")){
        this.names = window.sessionStorage.getItem("includePageNames").split(",")
      }else{
        this.names = []
      }
      this.names.push(item.name)
      let allNames = [...new Set(this.names)]
      window.sessionStorage.setItem("includePageNames", allNames)
      this.$emit("addlists", item);
    }
  }
};
</script>

<style lang="scss" scoped>
.menu-box {
  display: flex;
  align-items: center;
}
.menu-box-item {
  height: 50px;
  padding: 0 15px;
  border: none;
}
.menu-box-item-active {
  height: 50px;
  padding: 0 15px;
  border-bottom: 3px solid #e8e8e8;
}
.el-dropdown {
  height: 50px;
  .el-button {
    height: 50px;
  }
}
.menu-box-item-btn {
  display: block;
  height: 50px;
}
.el-button--text{
  color: #fff;
}
.el-dropdown-menu {
  background-color: rgb(9,65,98);
  padding: 5px 0;
  max-height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  .el-dropdown-menu__item {
    background-color: rgb(9,65,98);
    line-height:0;
    padding: 0;
    .el-button{
      padding:0;
    }
    .el-button--text {
      padding: 10px 60px 10px 20px;

    }
  }
}
/deep/ .popper__arrow {
  display: none !important;
}
.el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: #10557e;
}
.el-button--text:focus, .el-button--text:hover, .el-button--text:active {
  color: #fff;
}

</style>