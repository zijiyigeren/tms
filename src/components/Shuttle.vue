<template>
    <div class="Shuttle" style="width:100%;">
        <div class="Shuttle_left" style="width:50%;">
            <p>未绑定 : </p>
            <div class="div1">
                <span v-for="item in dataL" :key="item.id" class="span1"
                @dblclick="storageDetail(item.id)">{{item.title}}_{{item.picname}}</span>
            </div>
        </div>
        <div class="Shuttle_right" style="width:50%;">
            <p>已绑定 : </p>
            <div class="div2">
                <span v-for="item in dataR" :key="item.id" class="span2"
                @dblclick="storageDetailRight(item.id)" 
                >{{item.title}}_{{item.picname}}</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        dataL:{
            type:Array
        },
        dataR:{
            type:Array
        }
    },
    components:{

    },
    data(){
        return {
            time: null,
        }
    },
    computed:{

    },
    methods:{
        storageDetail(id){
            console.log(id)
            this.$emit('id',id)
        },
        storageDetailRight(id){
            this.$emit('idRight',id)
        }
    },
    created(){
        
    },
    mounted(){
        
    }
}
</script>
<style scoped lang="">
*{
    box-sizing:content-box;
}
.Shuttle{
    width: 100%;
    height: 100%;
    display: flex;
}
.Shuttle_left{
    height: 100%;
    margin: 0 10px;
}
.Shuttle_left p{
    text-align: center;
    margin-bottom: 20px;
}
.Shuttle_left .div1{
    display: flex;
    height: 400px;
    flex-direction: column;
    text-align: center;
    overflow-y: auto;
    border: 1px solid #ccc;
    box-sizing: border-box;
}
 .Shuttle_left .span1{
    width: 100%;
    /* height: 30px; */
    
    line-height: 30px;
    display: block;
    text-align: center;
    cursor:pointer;
}
.Shuttle_right{
    height: 100%;
    margin: 0 10px;
}
.Shuttle_right p{
    text-align: center;
    margin-bottom: 20px;
}
.Shuttle_right .div2{
    display: flex;
    height: 400px;
    flex-direction: column;
    overflow-y: auto;
    border: 1px solid #ccc;
    box-sizing: border-box;
}
.Shuttle_right .span2{
    width: 100%;
    /* height: 30px; */
    line-height: 30px;
    display: block;
    text-align: center;
    cursor:pointer;
}
</style>