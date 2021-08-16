<template>
    <div class="update-birthday">
        <van-datetime-picker
            v-model="currentDate"
            type="date"
            title="选择年月日"
            :min-date="minDate"
            :max-date="maxDate"
            @cancel="$emit('close')"
            @confirm="onConfirm"
        />
    </div>
</template>

<script>
import {updateUserProfile} from '@/api/user.js'
import dayjs from 'dayjs'
export default {
    name: 'UpdateBirthday',
    props:{
        value:{
            type:String,
            required:true
        }
    },
    data() {
        return {
            minDate: new Date(1900, 0, 1),
            maxDate: new Date(),
            currentDate: new Date(this.value),
        };
    },

    mounted() {
        
    },

    methods: {
        async onConfirm(){
            // 请求提交更新用户生日
            // 更新父组件中的用户生日
            // 关闭弹出层
            this.$toast.loading({
                message:'保存中',
                forbidclick:true //禁止背景点击
            })
            // const data = `${this.currentDate.getFullYear()}`
            const data = dayjs(this.currentDate).format('YYYY-MM-DD')
            // 请求提交更新用户生日
            await updateUserProfile({
                birthday:data
            })
             
            // 更新成功 -> 修改父组件的name -> 关闭弹出层
            this.$emit('input',data)
            this.$emit('close')
            this.$toast.success('保存成功')
        }
    },
};
</script>

<style lang="less" scoped>

</style>