<template>
    <div class="search-suggestion">
       <van-cell
        icon="search"
        :title="str"
        v-for="(str,index) in suggestions"
        :key="index"
        @click="$emit('search',str)"
       >
        <div slot="title" v-html="highlight(str)"></div>
       </van-cell>
    </div>
</template>

<script>
import {getSearchSuggestions} from '@/api/search.js'
import {debounce} from 'lodash'

export default {
    name: 'SearchSuggestion',
    props:{
        searchText:{
            type:String,
            required:true
        }
    },
    data() {
        return {
            suggestions:[] //联想建议数据列表
        };
    },
    computed:{
        
    },
    watch:{
        // 属性名:要监视的数据的名称
        searchText:{
            // 当数据发生变化会执行handler 处理函数
            // debounce防抖处理
            handler:debounce(async function(){
                // 找到数据接口
                // 请求获取数据
                // 模板绑定展示
                const {data} = await getSearchSuggestions(this.searchText)
                this.suggestions = data.data.options
            },200),
            immediate:true
            //该回调将会在监听开始之后立即被调用
        }
    },
    mounted() {
        
    },

    methods: {
        highlight(str){
            // a /a/gi、 vue /vue/gi
            //正则表达式 / 中间的内容/ 都会当作正则匹配模式字符来对待
            // 错误的写法： /this.searchText/gi
            // RegExp,正则表达式的构造函数
            // 参数1：字符串
            // 参数2：匹配模式
            // 返回值：正则对象
            
            return str.replace(
                new RegExp(this.searchText,'gi'),
                `<span style="color:red">${this.searchText}</span>`
            )
        }
    },
};
</script>

<style lang="less" scoped>

</style>