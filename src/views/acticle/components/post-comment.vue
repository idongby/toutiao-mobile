<template>
    <div class="post-comment">
        <van-field
            v-model.trim="message"
            autosize
            type="textarea"
            maxlength="50"
            placeholder="请输入留言"
            show-word-limit
        />
        <van-button
         size="mini"
         :disabled="!message"
         @click="onPost"
        >发布</van-button>
    </div>
</template>

<script>
import {addComment} from '@/api/comment.js'
export default {
    name: 'PostComment',
    props:{
        // 如果是发布文章评论，则传递文章id
        // 如果是发布评论回复，则传递评论id
        target:{
            type:[Number,String,Object],
            required:true
        },
        articleId:{
            type:[Number,String,Object],
            default:null
        }
    },
    components:{
       
    },
    data() {
        return {
            message:'' //输入框内容
        };
    },

    mounted() {
        
    },

    methods: {
        async onPost(){
            this.$toast.loading({
                message:'发布中',
                forbidClick:true //禁止背景点击
            })
            // 找到接口 
            // 封装请求方法
            // 请求提交数据
            const {data} = await addComment({
                target:this.target.toString(), //评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
                content:this.message, // 评论内容
                art_id:this.articleId ? this.articleId.toString() : null //文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
            })

            this.$emit('post-success',data.data.new_obj)
            // 处理响应
            this.$toast.success('发布成功')

            // 清空文本
            this.message = ''
        }
    },
};
</script>

<style lang="less" scoped>
.post-comment{
    padding: 14px;
    display: flex;
    align-items: center;
    .van-button{
        width: 50px;
    }
}
</style>