<template>
    <div class="article-container">
        <!-- 头部导航地方 -->
        <van-nav-bar
        class="app-nav-bar"
        title="文章详情"
        left-arrow
        @click-left="$router.back()"
        />
        <!-- /头部导航地方 -->
        <!-- 文章内容 -->
        <div class="article-wrap">
            <h1 class="title">{{article.title}}</h1>
            <van-cell center class="user-info">
                <div slot="title" class="name">{{article.aut_name}}</div>
                <van-image
                    class="avatar"
                    slot="icon"
                    round
                    fit="cover"
                    :src="article.aut_photo"
                />
                <div slot="label" class="pubdate">{{article.pubdate | relativeTime}}</div>
                <van-button
                class="follow-btn"
                :type="article.is_followed ? 'default' : 'info' "
                :icon="article.is_followed ? '' : 'plus'"
                round
                size="small"
                :loading="isFollowLoading"
                @click="onFollow"
                >{{article.is_followed ? '已关注' : '关注'}}</van-button>
            </van-cell>
            <div
            class="markdown-body" 
            v-html="article.content"
            ref="article-content"
            >
            </div>
            <!-- 文章评论列表 -->
            <comment-list
             :source="articleId"
             :list="commentList" 
             @uptate-total-count="totalCommentCount = $event"
             @reply-click="onReplyClick" />
            <!-- /文章评论列表 -->
        </div>
        <!-- /文章内容 -->

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
            <van-icon
              name="comment-o"
              :info="totalCommentCount"
              color="#777"
            />
            <van-icon 
              :color="article.is_collected ? 'orange' : '#777'"
              :name="article.is_collected ? 'star' : 'star-o'"
              @click="onCollect"
            />
            <van-icon
              :color="article.attitude === 1 ? 'red' : '#777'"
              :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
              @click="onLike"
            />
            <van-icon 
             name="share"
             color="#777"
            />
        </div>
        <!-- /底部区域 -->

        <!-- 发布评论 -->
        <van-popup
         v-model="isPostShow"
         position="bottom"
        >
          <post-comment
           :target="articleId"
           @post-success="onPostSuccess"
          />
        </van-popup>
        <!-- /发布评论 -->

        <!-- 评论回复 -->
        <van-popup
         v-model="isReplyShow"
         position="bottom"
        >
            <comment-reply v-if="isReplyShow" :comment="replyComment" :article-id="articleId" @close="isReplyShow = false" />
        </van-popup>
        <!--/ 评论回复 -->
    </div>
</template>

<script>
import './github-markdown.css'
import {getArticleById,addCollect,deleteCollect,addLike,deleteLike} from '@/api/article.js'
import {ImagePreview} from 'vant'
import {addFollow,deleteFollow} from '@/api/user.js'
import CommentList from '../acticle/components/comment-list.vue'
import PostComment from './components/post-comment.vue'
import CommentReply from './components/comment-reply.vue'
// 在组件中获取动态路由参数：
//  方式一：this.$route.params.xxx
//  方式二：props传参，推荐
//  this.articleId
// 路由给props传的参数
export default {
    name: 'ArticleIndex',
    components:{
        CommentList,
        PostComment,
        CommentReply
    },
    props:{
        articleId:{
            type:[String,Number,Object],
            required:true
        }
    },
    data() {
        return {
            article:{}, //文章数据对象
            isFollowLoading:false, //关注用户的loading状态
            isCollectLoading:false, //收藏的loading状态
            isPostShow:false, // 控制发布评论的显示状态
            commentList:[], //文章评论
            totalCommentCount: 0, //评论总数据量
            isReplyShow:false,  //控制回复的显示状态
            replyComment:{}  //当前回复评论对象
        };
    },
    created(){
        this.loadArticle()
    },

    mounted() {
        
    },

    methods: {
        async loadArticle(){
            const {data} = await getArticleById(this.articleId)
            this.article = data.data
            
            // 数据改变影响视图更新（DOM数据）不是立即的
            // 所以如果需要在修改数据之后马上操作被该数据影响的视图DOM，
            // 需要把这个代码放到$nextTick 中
            // 得到所有的img 标签
            // this.$nextTick 是Vue 提供的一个方法
            this.$nextTick(() => {
                this.handlePerviewImage()
            })
            
        },
        handlePerviewImage(){
            // 1.获取文章内容的DOM 容器
            const articleContent = this.$refs['article-content']
            // 数据改变影响视图更新（DOM数据）不是立即的
            // 所以如果需要在修改数据之后马上操作被该数据影响的视图DOM，
            // 需要把这个代码放到$nextTick 中
            
            // this.$nextTick 是Vue 提供的一个方法

            // 2.得到所有的img 标签
            const imgs = articleContent.querySelectorAll('img')
            const imgPaths = [] //收集所有的图片路径

            // 3.循环 img 列表，给 img 注册点击事件
            imgs.forEach((img,index) => {
                imgPaths.push(img.src)
                img.onclick = function(){
                    // 4.在事件处理函数中调用 ImagePreview()预览
                    ImagePreview({
                        images:imgPaths, // 预览图片路径列表
                        startPosition:index // 起始位置
                    });
                }
            })
        },
        async onFollow(){
            this.isFollowLoading = true
            if(this.article.is_followed){
                // 已关注，取消关注 
                await deleteFollow(this.article.aut_id)
            }else{
                // 没有关注，添加关注
                await addFollow(this.article.aut_id)
            }
            this.article.is_followed = !this.article.is_followed
            this.isFollowLoading = false
        },
        async onCollect(){
            this.$toast.loading({
                message:'操作中...',
                forbidClick:true, //禁止背景点击
            })
            if(this.article.is_collected){
                // 已收藏，取消收藏 
                await deleteCollect(this.articleId)
            }else{
                // 没有收藏，添加收藏
                await addCollect(this.articleId)
            }
            this.article.is_collected = !this.article.is_collected
            this.$toast.success(`${this.article.is_collected ? '' : '取消'}收藏成功`)
        },
        async onLike(){
            this.$toast.loading({
                message:'操作中...',
                forbidClick:true, //禁止背景点击
            })
            if(this.article.attitude === 1){
                // 已点赞，取消点赞 
                await deleteLike(this.articleId)
                this.article.attitude = -1
            }else{
                // 没有点赞，添加点赞
                await addLike(this.articleId)
                this.article.attitude = 1
            }
            this.$toast.success(`${this.article.attitude ? '' : '取消'}点赞成功`)
        },
        onPostSuccess(comment){
            // console.log(comment)
            // 把发布成功的评论数据对象放到评论列表顶部
            // xx.unshift(comment)
            this.commentList.unshift(comment)

            // 更新评论的总数量
            this.totalCommentCount++

            // 把评论弹窗隐藏掉
            this.isPostShow = false
        },
        onReplyClick(comment){
            console.log(comment)
            this.replyComment = comment

            // 展示回复内容
            this.isReplyShow = true
        }
    },
};
</script>

<style lang="less" scoped>
.article-wrap{
 position: fixed;   
 left: 0;
 right: 0;
 top: 46px;
 bottom: 44px;
 overflow-y:auto;
}
.title{
    font-size: 20px;
    color: #3a3a3a;
    padding: 14px;
    background-color: #fff;
    margin: 0;
}
.user-info{
    .avatar{
        width: 35px;
        height: 35px;
        margin-right: 8px;
    }
    .name{
        font-size: 12px;
        color: #333333;
    }
    .pubdate{
        font-size: 12px;
        color: #b4b4b4;
    }
    .follw-btn{
        width: 85px;
        height: 29px;
    }
}
.markdown-body{
    padding: 14px;
    background-color: #fff;
}
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
      width: 150px;
      height: 30px;
      margin: 0 12px;
  }
  .van-icon{
      font-size: 24px;
      margin: 0 12px;
  }
}
</style>