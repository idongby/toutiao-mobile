<template>
    <div class="update-gender">
        <van-picker
            show-toolbar
            :columns="columns"
            :default-index="defaultIndex"
            @cancel="$emit('close')"
            @confirm="onConfirm"
            @change="onGenderChange"
        />
    </div>
</template>

<script>
import {updateUserProfile} from '@/api/user.js'
export default {
    name: 'UpdateGender',
    props:{
        value:{
            type:Number,
            required:true
        }
    },
    data() {
        return {
            columns: ['男', '女'], 
            defaultIndex:this.value,
        };
    },

    mounted() {
        
    },

    methods: {
        onGenderChange(picker,value,index){
            this.defaultIndex = index
            console.log(picker,value)
        },
        async onConfirm(){
            this.$toast.loading({
                message:'保存中',
                forbidclick:true //禁止背景点击
            })
            // 请求提交更新用户性别
                await updateUserProfile({
                    gender:this.defaultIndex
                })
             this.$toast.success('保存成功')
            // 更新成功 -> 修改父组件的name -> 关闭弹出层
            this.$emit('input',this.defaultIndex)
            this.$emit('close')
        }
    },
};
</script>

<style lang="scss" scoped>

</style>