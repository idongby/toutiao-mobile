<template>
    <div class="search-history">
       <van-cell
        title="搜素历史"
       >
        <div v-if="isDeleteShow">
            <!-- 
                prop 数据如果是引用类型（对象、数组）可以修改，
                注意这个修改值的是：user.name = 
                'Jack'、arr.push(123)、arr.splice(0,1)

                但是任何 prop 数据都不能重新赋值：xxx = xxx
                
                如果想让prop数据 = 
                新的数据：让父组件自己修改
             -->
            <span @click="$emit('updata-histories',[])">全部删除</span>
            &nbsp;&nbsp;
            <span @click="isDeleteShow = false">完成</span>
        </div>
        <van-icon
         v-else
         name="delete"
         @click="isDeleteShow = true"
        />
       </van-cell>
       <van-cell
         :title="history"
         v-for="(history,index) in SearchHistories"
         :key="index"
         @click="onDelete(history,index)"
         
       >
         <van-icon
          v-show="isDeleteShow"
          name="close"
        />
       </van-cell>
       
    </div>
</template>

<script>
// import {setItem} from '@/utils/storage.js'
export default {
    name: 'SearchHistory',
    props:{
        SearchHistories:{
            type:Array,
            required:true
        }
    },
    data() {
        return {
            isDeleteShow:false //删除的显示状态
        };
    },
    mounted() {
        
    },

    methods: {
        onDelete(history,index){
            // 如果是删除状态，则执行删除操作
            if(this.isDeleteShow){
                this.SearchHistories.splice(index,1)
                // 持久化处理
                // 1.修改本地存储的数据
                // 2.请求接口删除线上的数据
                // 无论是否登录都把数据持久化到本地
                // 如果已登录，则删除线上的历史数据
                //    使用的后台接口，没有单个删除功能，只有删除全部历史记录的功能
                // setItem('search-histories',this.SearchHistories)   
            }else{
                // 非编辑状态下，点击去搜索
                this.$emit('search',history)
            }

            
        }
    },
};
</script>

<style lang="less" scoped>

</style>