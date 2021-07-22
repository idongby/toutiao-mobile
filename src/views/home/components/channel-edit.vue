<template>
    <div class="channel-edit">
        <van-cell center :border="false">
            <div slot="title" class="channel-title">我的频道</div>
            <van-button
             type="danger"            
             plain
             round
             size="mini"
             @click="isEdit = !isEdit"
            >{{isEdit ? '完成' : '编辑'}}</van-button>
        </van-cell>
        <van-grid :gutter="10">
            <van-grid-item
              class="grid-item"
              :class="{active: index === active}"
              :icon="(isEdit && index !== 0) ? 'clear' : ''"
              v-for="(channel,index) in userChannels"
              :key="index"
              :text="channel.name"
              @click="onUserChanelClick(channel,index)"
            />
        </van-grid>

        <!-- 频道推荐 -->
        <van-cell center :border="false">
            <div slot="title" class="channel-title">频道推荐</div>
        </van-cell>
        <van-grid :gutter="10">
            <van-grid-item
              class="grid-item"
              v-for="(channel,index) in recommendChannels"
              :key="index"
              :text="channel.name"
              @click="onAdd(channel)"
            />
        </van-grid>
    </div>
</template>

<script>
import {getAllChannels,addUserChannels,deleteUserChannel} from '@/api/channel.js'
import { mapState} from 'vuex'
import {setItem} from '@/utils/storage'
export default {
    name: 'ChannelEdit',
    props:{
        // user-channels,会自动转换为驼峰形式
        userChannels:{
            type:Array,
            required:true
        },
        active:{
            type:Number,
            required:true
        }
    },
    data() {
        return {
            allChannels:[], //所有频道数据列表
            isEdit:false //控制编辑的显示状态
        };
    },
    computed:{
        ...mapState(['user']),
        // 推荐的频道列表
        recommendChannels(){
            // 思路：所有频道 - 我的频道 = 剩下的推荐频道
            // filter方法：过滤数据，根据返回的布尔值，true来收集数据
            // filter方法查找满足条件的所有元素
            return this.allChannels.filter(channel =>{
                // 判断 channle 是否属于用户频道
                // find 方法查找满足条件的单个元素
                return !this.userChannels.find(userChannels =>{
                    // 找到满足该条件的元素
                    return userChannels.id === channel.id
                })
            })
        }
    },
    created(){
        this.loadAllChannels()
    },

    mounted() {
        
    },

    methods: {
        async loadAllChannels(){
            const {data} = await getAllChannels()
            this.allChannels = data.data.channels
        },
        async onAdd(channel){
            this.userChannels.push(channel)
            // 数据持久化
            if(this.user){
                //登录状态，存储到线上服务器
               const ddd = await addUserChannels({
                    channels:[
                        {id:channel.id,seq:this.userChannels.length}
                    ]
                })
                console.log(ddd)
            }else{
                //未登录，本地存储
                setItem('user-channels',this.userChannels) 

            }
        },
        onUserChanelClick(channel,index){
            // 编辑状态，删除频道
            // 非编辑状态，切换频道
            if(this.isEdit && index !== 0){
                // 编辑状态，删除频道
                this.deleteChannel(channel,index)
            }else{
                //非编辑状态，切换频道
                this.switchChannle(index)
            }
        },
        async deleteChannel(channel,index){
            // 如果删除的是当前激活频道之前的频道
            if(index <= this.active){
                // 更新激活频道的索引
                this.$emit('update-active', this.active - 1);
            }
            this.userChannels.splice(index,1)

            // 数据持久化
            if(this.user){
                // 登录了，持久化到线上
                await deleteUserChannel(channel.id)
            }else{
                // 没有登录，持久化到本地
                setItem('user-channels',this.userChannels)
            }
        },
        switchChannle(index){
            // 切换频道
            this.$emit('update-active',index)
            // 关闭弹出层
            this.$emit('close')
        }
    },
};
</script>

<style lang="less" scoped>
.channel-edit{
    padding-top: 54px;
    .channel-title{
        font-size: 16px;
        color: #333333;
    }
    .grid-item{
        width: 80px;
        height: 43px;
        /deep/ .van-grid-item__content{
            background-color: #f4f5f6;
            .van-grid-item__text{
                font-size: 14px;
                color: #222;
                margin-top: 0;
            }
        }
        /deep/ .van-grid-item__icon{
            position: absolute;
            right: -5px;
            top: -5px;
            font-size: 20px;
            color: #ccc;
        }
    }
    .active{
        /deep/ .van-grid-item__text{
            color: red !important;
        }
    }
}
</style>