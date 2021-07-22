<template>
    <div class="article-container">
        <van-nav-bar
        class="app-nav-bar"
        title="文章详情"
        left-arrow
        @click-left="$router.back()"
        />
        <h1 class="title">程序员不容易啊啊啊啊</h1>
        <van-cell center class="user-info">
            <div slot="title" class="name">天涯若比邻</div>
            <van-image
                class="avatar"
                slot="icon"
                round
                fit="cover"
                src="https://img01.yzcdn.cn/vant/cat.jpeg"
            />
            <div slot="label" class="pubdate">14小时前</div>
            <van-button
              class="follow-btn"
              type="info"
              icon="plus"
              round
              size="small"
            >关注</van-button>
        </van-cell>
        <div class="markdown-body">
            <p>测试</p>
            <p>你好</p>
        </div>
    </div>
</template>

<script>
import './github-markdown.css'
import {getArticleById} from '@/api/article.js'
// 在组件中获取动态路由参数：
//  方式一：this.$route.params.xxx
//  方式二：props传参，推荐
//  this.articleId
// 路由给props传的参数
export default {
    name: 'ArticleIndex',
    props:{
        articleId:{
            type:[String,Number,Object],
            required:true
        }
    },
    data() {
        return {
            
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
            console.log(data)
        }
    },
};
</script>

<style lang="less" scoped>
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
ul{
    
}
</style>