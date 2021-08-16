<template>
    <div class="comment-list">
        <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        >
            <!-- <van-cell v-for="(comment,index) in list" :key="index" :title="comment.content" /> -->
            <comment-item
              v-for="(comment,index) in list"
              :key="index"
              :comment="comment"
              @reply-click="$emit('reply-click',$event)"
            />
        </van-list>
    </div>
</template>

<script>
import {getComment} from '@/api/comment.js'
import CommentItem from './comment-item.vue'
export default {
    name: 'CommentList',
    components:{
        CommentItem
    },
    props:{
        source:{
            type:[Number,String,Object],
            required:true
        },
        //评论的类型，a-对文章的评论，c-对评论（comment）的回复
        type:{
            type:String,
            default:'a'
        },
        list:{
            type:Array,
            // 数组或对象的默认值必须通过函数返回
            default:function(){
                return []
            }
        }
    },
    data() {
        return {
            // list: [],
            loading: false,
            finished: false,
            offset:null, // 获取下一页数据的页码
            limit:10  //每页大小
        };
    },

    mounted() {
        
    },

    methods: {
        async onLoad() {
            // 1.请求获取数据
            const {data} = await getComment({
                type:this.type, //评论的类型，a-对文章的评论，c-对评论（comment）的回复
                source:this.source.toString(), //源id，文章id或评论id
                offset:this.offset, //获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
                limit:this.limit //每页大小
            })
            this.$emit('uptate-total-count',data.data.total_count)
            // 2.把数据放到列表中
            const {results} = data.data
            this.list.push(...results)

            // 3.将本次的loading关闭
            this.loading = false

            // 4.判断是否还有数据
            if(results.length){
                //   如果有，更新获取下一页的页码
                this.offset = data.data.last_id
            }else{
                //   如果没有，则把 finished设置为true，不再触发加载更多
                this.finished = true
            }
            
            
        },
    },
};
</script>

<style lang="less" scoped>

</style>