<template>
    <div class="search-container">
        <!-- 搜索栏 -->
        <form action="/">
            <van-search 
                v-model="searchText" 
                placeholder="请输入搜索关键词" 
                show-action
                @search="onSearch(searchText)"
                @cancel="$router.back()"
                @focus="isResultShow = false"
            />
        </form>
        <!-- /搜索栏 -->

        <!-- 搜索结果 -->
        <search-result 
          v-if="isResultShow"
          :search-text="searchText"
        ></search-result>
        <!-- /搜索结果 -->

        <!-- 联想建议 -->
        <search-suggestion 
          v-else-if="searchText"
          :search-text="searchText"
          @search="onSearch"
        ></search-suggestion>
        <!-- /联想建议 -->

        <!-- 历史记录 -->
        <search-history
         v-else
         :search-histories="SearchHistories"
         @search="onSearch"
         @updata-histories="SearchHistories = $event"
        ></search-history>
        <!-- /历史记录 -->

        
    </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion.vue'
import SearchHistory from './components/search-history.vue'
import SearchResult from './components/search-result.vue'
import {setItem,getItem} from '@/utils/storage.js'
import {getSearchHistories} from '@/api/search.js'
import {mapState} from 'vuex'

export default {
    name: 'SearchIndex',
    components:{
        SearchSuggestion,
        SearchHistory,
        SearchResult
    },
    data() {
        return {
            searchText:'', //搜素输入框的内容
            isResultShow:false, //控制搜索结果的显示状态
            SearchHistories: [],  //搜索历史记录
        };
    },
    computed:{
        ...mapState(['user'])
    },
    watch:{
        // 监视搜索历史记录的变化，存储到本地
        SearchHistories(){
            setItem('search-histories',this.SearchHistories)
        }
    },
    created(){
        this.loadSearchHistories()
    },
    mounted() {
        
    },

    methods: {
        onSearch(searchText){
            // 把输入框设置为你要搜索的文本
            this.searchText = searchText

            const index = this.SearchHistories.indexOf(searchText)
            // 记录搜索历史记录
            if(index !== -1){
                //把重复项删除
                this.SearchHistories.splice(index,1)
            }
            // 把最新的搜索历史记录放到顶部
            this.SearchHistories.unshift(searchText)

            // 如果用户已登录，则把搜索历史记录存储到线上
            //    只要我们调用获取搜索结果的数据接口，后端会自动存储用户的搜索历史记录
            // 如果没有登录，则需要存储到本地
            // setItem('search-histories',this.SearchHistories)

           // 展示搜索结果
            this.isResultShow = true;
        },
        async loadSearchHistories(){
            // 因为后端帮我们存储的历史记录只有4条，比较少
            // 所以我们这里让后端返回的历史记录和本地的历史记录合并到一起
            let searchHistories = getItem('search-histories') || []
            if(this.user){
                const {data} = await getSearchHistories()
                // 合并数组：[...数组，...数组]
                // 把set转换为数组：[...set对象]
                // 数组去重：[...new Set([...数组,...数组])]
                searchHistories = [...new Set([
                    ...searchHistories,
                    ...data.data.keywords
                ])]
            }
            this.SearchHistories = searchHistories
        }
    },
};
</script>

<style lang="less" scoped>

</style>