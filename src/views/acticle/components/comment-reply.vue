<template>
    <div class="comment-reply">
        <!-- 头部信息 -->
        <van-nav-bar :title="`${comment.reply_count}条回复`">
            <van-icon slot="left" name="cross" @click="$emit('close')" />
        </van-nav-bar>
        <!-- /头部信息 -->

        <!-- 当前评论项 -->
        <comment-item
         :comment="comment"
        />
        <!-- /当前评论项 -->

        <!-- 所有评论回复 -->
        <van-cell title="所有回复" />
        <comment-list :source="comment.com_id" type="c" :list="commentList" />
        <!-- /所有评论回复 -->

        <!-- 底部区域 -->
        <div class="article-bottom">
            <van-button
              class="comment-btn"
              type="default"
              round
              size="small"
              @click="isPostShow = true"
            >
                写评论
            </van-button>
        </div>
        <!-- /底部区域 -->

        <!-- 发布评论 -->
        <van-popup
         v-model="isPostShow"
         position="bottom"
        >
          <post-comment :target="comment.com_id" :article-id="articleId" @post-success="onPostSuccess" />
        </van-popup>
        <!-- /发布评论 -->
    </div>
</template>

<script>
import commentItem from './comment-item.vue';
import CommentList from './comment-list.vue'
import PostComment from './post-comment.vue'
export default {
  components: { commentItem,CommentList,PostComment },
    name: 'CommentReply',
    props:{
        // 查看回复的评论项目
        comment:{
            type:Object,
            required: true
        },
        articleId:{
            type:[Number,String,Object],
            required:true
        }
    },
    data() {
        return {
            isPostShow:false,
            commentList:[], //评论的回复列表
        };
    },

    mounted() {
        
    },

    methods: {
        onPostSuccess(comment){
            // 将发布成功的评论放到评论列表的顶部
            this.commentList.unshift(comment)
            // 更新评论的回复数量
            this.comment.reply_count++
            // 关闭发布回复的弹出层
            this.isPostShow = false
            

        }
    },
};
</script>

<style lang="less" scoped>
.article-bottom {
  width: 100%;
  height: 40px;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content:center;
  /deep/ .van-button{
      width: 200px; 
      height: 30px;
      margin: 0 12px;
  }
}
</style>