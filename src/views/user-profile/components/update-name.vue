<template>
    <div class="update-name">
        <!-- 导航栏 -->
        <van-nav-bar
          title="修改昵称"
          left-text="取消"
          right-text="完成"
          @click-left="$emit('close')"
          @click-right="onConfirm"
        />
        <!-- /导航栏 -->

        <div class="name-field-wrap">
            <van-field
            v-model="localName"
            rows="1"
            type="textarea"
            maxlength="7"
            placeholder="请输入昵称"
            show-word-limit
        />
        </div>

        <!-- <button @click="$emit('update:gender',0)">修改gender</button> -->
    </div>
</template>

<script>
import {updateUserProfile} from '@/api/user.js'
export default {
    name: 'UpdateName',
    props:{
        value:{
            type:String,
            required:true
        },
        // gender:{
        //     type:Number
        // }
    },
    data() {
        return {
            localName:this.value,  //昵称
        };
    },
    created(){
        
    },
    mounted() {
        
    },

    methods: {
        async onConfirm(){
            this.$toast.loading({
                message:'保存中',
                forbidclick:true //禁止背景点击
            })
            try{
                // 请求提交更新用户昵称
                await updateUserProfile({
                    name:this.localName
                })
                this.$toast.success('保存成功')
                // 更新成功 -> 修改父组件的name -> 关闭弹出层
                this.$emit('input',this.localName)
                this.$emit('close')
            }catch(err){
                if(err && err.response && err.response.status === 409){
                    this.$toast.fail('昵称已存在')
                }
            }

        }
    },
};
</script>

<style lang="less" scoped>
.name-field-wrap{
    padding: 10px;
}
</style>