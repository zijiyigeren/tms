<template>
    <div>
       
        <div class="currency_mssage_hint" :style="'display:'+visibleBtn">
            <div class="newsnotice_btn" ref="newsnotice_btn" @mousedown="move" @click="openList">
                <p class="el_icon_badge" @mousedown.stop @click.stop>{{newsList.length}}</p>
            </div>
        </div>
        <!-- <draggable class="draggable_box" :style="'display:'+visibleBtn" v-model="draggableList">
            <div class="newsnotice_btn" @mousedown="move" @click="openList">
                <i class="el-icon-bell"></i>
                <p class="el_icon_badge">{{badge}}</p>
            </div>
        </draggable> -->

        <div :style="'display:'+visibleList" class="newsnotice_card">
            <el-card class="card_box">
                <div slot="header" class="card_title">
                    <span style="font-weight: bold;">
                        消息通知
                        <el-button type="text" style="padding: 0;" @click="newsMore">更多 >></el-button>
                    </span>
                    <el-button type="text" class="card_title_close" @click="onClose"><i class="el-icon-close"></i></el-button>
                </div>
                <div v-if="newsList.length<1" class="card_nodata">
                    <img src="static/image/noData2.png" alt="暂无数据">
                    <span>暂无数据</span>
                </div>
                <div v-show="newsList.length>0" v-for="(item,i) in newsList" :key="i" class="card_item">
                    {{item.title}}
                </div>
            </el-card>
        </div>
    </div>
</template>
<script>
import base from '@/api/base.js';
import {mapState} from 'vuex';
import draggable from 'vuedraggable';
export default {
    components: {draggable},
    data () {
        return {
            badge: 12, // 消息个数
            visibleBtn: 'block', // 消息通知-按钮
            visibleList: 'none', // 消息通知-列表
            newsList: [], // 消息通知-列表数据
            socket: null, // weosocket-对象
            currentTime: 0, // 当前时间
            beyondTime: 0, // 超出时间
        }
    },
    created(){},
    destroyed: function() {
        //页面销毁时关闭长连接
        this.websocketClose();
    },
    mounted() {
        //页面刚进入时开启长连接
        this.webSocket();
    },
    methods: {
        move(e){
            let odiv = e.target;// 获取目标元素
            //计算出鼠标相对点击元素的位置,e.clientX获取的是鼠标的位置，OffsetLeft是元素相对于外层元素的位置
            let x = e.clientX - odiv.offsetLeft;
            let y = e.clientY - odiv.offsetTop;
            document.onmousemove = (e) => {
                // 获取拖拽元素的位置
                let left = e.clientX - x;
                let top = e.clientY - y;
                this.positionX = left;
                this.positionY = top;
                // 把拖拽元素 放到 当前的位置
                if (left <= 0) {
                    left = 0;
                } else if (left >= document.documentElement.clientWidth - odiv.offsetWidth){
                    //document.documentElement.clientWidth 屏幕的可视宽度
                    left = document.documentElement.clientWidth - odiv.offsetWidth;
                }

                if (top <= 0) {
                    top = 0;
                } else if (top >= document.documentElement.clientHeight - odiv.offsetHeight){
                    // document.documentElement.clientHeight 屏幕的可视高度
                    top = document.documentElement.clientHeight - odiv.offsetHeight;
                }
                odiv.style.left = left + "px";
                odiv.style.top = top + "px";
            }
            this.$refs['newsnotice_btn'].setAttribute('flag', 'false');
            this.currentTime = new Date().getTime();
            // 为了防止 火狐浏览器 拖拽阴影问题
            document.onmouseup = (e) => {
                // 鼠标抬起后 记录时间 超过200ms就是移动事件
                this.beyondTime = new Date().getTime();
                if( (this.beyondTime - this.currentTime) < 200){
                    this.$refs['newsnotice_btn'].setAttribute('flag', 'true');
                }
                document.onmousemove = null;
                document.onmouseup = null;
            }
        },
        // 初始化weosocket
        webSocket(){
            if (typeof (WebSocket) == 'undefined') {
                this.$message.warning('当前浏览器无法接收信息，请使用谷歌浏览器！');
            } else {
                let loginName = ''; // 用户信息
                if(this.$store.state.user.loginName) {
                    loginName = this.$store.state.user.loginName.loginName;
                } else if(
                    JSON.parse(localStorage.getItem("userInfo")) && 
                    JSON.parse(localStorage.getItem("userInfo")).loginName
                ) {
                    loginName = JSON.parse(localStorage.getItem("userInfo")).loginName;
                }
                if(loginName) {
                    const str = window.location.host;
                    // 实例化socket
                    // const socketUrl = 'ws://zxx.nat300.top/websocket/'+loginName;
                    let socketUrl = 'ws://'+str+'/websocket/'+loginName;
                    console.log(socketUrl,'socketUrl');
                    if(this.socket == null) {
                        this.socket = new WebSocket(socketUrl);
                        this.socket.onopen = this.websocketOnopen;
                        this.socket.onerror = this.websocketOnerror;
                        this.socket.onclose = this.websocketClose;
                    }
                } else {
                    this.$message.error('websocket请求失败，没有用户信息');
                }
            }
        },
        // 监听socket打开
        websocketOnopen() {
            console.log("WebSocket连接成功");
            if(this.socket) {
                this.socket.onmessage = this.websocketOnmessage;
            }
        },
        // 监听socket数据接收
        websocketOnmessage(e){
            // console.log(e.data,'数据接收');
            const data = JSON.parse(e.data);
            // console.log(data,'WebSocket数据');
            if(data && data.length > 0 ){
                // console.log(this.newsList, 'this.newsList');
                this.newsList = this.newsList;
                if(this.newsList.length > 0 ) {
                    // console.log('newsList',this.newsList);
                    let obj = null;
                    data.forEach((item,i) => {
                        let dataId = data[i].id;
                        let flag = false;
                        this.newsList.forEach((em,i) => {
                            let newsListId = this.newsList[i].id;
                            if(dataId == newsListId) {
                                flag = true;
                                return;
                            }
                        });
                        if(!flag){
                            obj = data[i];
                        }
                    });
                    if(obj){
                        this.$notify({
                            title: '消息通知',
                            message: obj.title,
                            duration: 10000,
                            type: 'warning'
                        });
                    }
                }
                this.newsList = data;
            }else{
                this.newsList = [];
            }
        },
        // 监听socket错误
        websocketOnerror(e) {
            if(this.socket) {
                this.socket.close();
            }
            console.log(e, '服务器错误，websocket无法接收信息');
        },
        // 监听socket关闭
        websocketClose(e){
            if(this.socket) {
                this.socket.close();
            }
            console.log("WebSocket已关闭");
            setInterval(() => {
                this.webSocket();
            }, 360000);
        },
        // 消息通知-按钮
        openList (){
            let isClick = this.$refs['newsnotice_btn'].getAttribute('flag')
            if(isClick ==='true') {
                this.visibleBtn = 'none';
                this.visibleList = 'block'
            }
            else {
                return false
            }
        },
        // 消息通知-更多
        newsMore() {
            let names = [];
            if(window.sessionStorage.getItem("includePageNames")){
                names = window.sessionStorage.getItem("includePageNames").split(",")
            }else{
                names = []
            }
            names.push('newsnotice')
            let allNames = [...new Set(names)]
            window.sessionStorage.setItem("includePageNames", allNames)
            this.$emit("addlists", {path: '/newsnotice',name:'newsnotice',title:'消息通知列表'});
            this.visibleBtn = 'block';
            this.visibleList = 'none';
            let btn  = document.querySelector('.newsnotice_btn');
            btn.setAttribute("style", "position: fixed;bottom: 5%;right: 5%;");
        },
        // 关闭列表
        onClose() {
            this.visibleBtn = 'block';
            this.visibleList = 'none';
            let btn  = document.querySelector('.newsnotice_btn');
            btn.setAttribute("style", "position: fixed;bottom: 5%;right: 5%;");
        },
    }
}
</script>
<style lang="less" scoped>
.draggable_box {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(90deg, rgb(96, 157, 248), rgb(84, 183, 235)) !important;
    position: fixed;
    bottom: 5%;
    right: 5%;
}
.newsnotice_btn {
    z-index: 2;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    // background: linear-gradient(90deg, rgb(96, 157, 248), rgb(84, 183, 235)) !important;
    background:url(/static/image/inforling1.jpg) no-repeat center;
    position: fixed;
    bottom: 5%;
    right: 5%;
    text-align: center;
    line-height: 60px;
}
.newsnotice_btn .el-icon-bell {
    color: #fff;
    font-size: 20px;
}
.el_icon_badge {
    height: 18px;
    padding: 0 6px;
    background: red;
    border-radius: 10px;
    color: #fff;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    white-space: nowrap;
    position: absolute;
    top: -5px;
    right: -5px;
}
/deep/ .newsnotice_card {
    width: 400px;
    height: 200px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 4px;
    position: fixed;
    bottom: 5%;
    right: 3%;
    overflow: hidden;
    z-index: 500;
    .card_box {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .el-card__header {
            padding: 10px;
            background-color: rgba(243,246,253,1);
            .card_title {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .card_title_close {
                padding: 0;
                .el-icon-close {
                    color: #409EFF;
                    font-size: 16px;
                    font-weight: bold;
                }
            }
        }
        .el-card__body {
            flex: 1;
            padding: 0;
            margin: 0;
            overflow-y: auto;
            .card_nodata {
                width: 100%;
                height: 100%;
                img {
                    display: block;
                    margin: 0 auto;
                }
                span {
                    display: block;
                    text-align: center;
                    font-size: 16px;
                    color: #989898;
                }
            }
            .card_item {
                padding: 10px;
                &:nth-child(even) {
                    background: #FAFAFA;
                }
            }
        }
    }
}
</style>
