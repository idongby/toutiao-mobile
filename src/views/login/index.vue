<template>
    <div  class="login-container">
        <van-nav-bar
        class="app-nav-bar"
        title="注册 / 登录"
        left-arrow
        @click-left="$router.back()"
        />

        <!-- 登录表单 -->
        <!-- 
            基于vant 的表单验证：
            1、使用van-form组件包裹所有的表单项 van-field
            2、给van-form绑定submit事件，当表单提交的时候会触发 submit事件
                只有表单验证通过，它才会调用submit方法
            3、使用Field 的rules属性定义校验规则
         -->
        <van-form @submit="onLogin" @failed="onFailed" ref="login-form" validate-first :show-error="false" :show-error-message="false">
            <van-field
                v-model="user.mobile"
                icon-prefix="toutiao"
                left-icon="shouji"
                center
                placeholder="请输入手机号"
                name="mobile"
                :rules="formRules.mobile"
            />
                <van-field
                    v-model="user.code"
                    clearable
                    icon-prefix="toutiao"
                    left-icon="yanzhengma"
                    center
                    placeholder="请输入验证码"
                    name="code"
                    :rules="formRules.code"
                >
                <template #button>
                    <van-count-down v-if="isCountDownShow" :time="1000 *60" format="SS s" @finish="isCountDownShow = false" />
                    <van-button v-else class="send-btn" size="mini" round @click.prevent="onSendSms" :loading="isSendSmsLoading">获取验证码</van-button>
                </template>
            </van-field>
            <div class="login-btn-wrap">
                <van-button class="login-btn" type="info" block>登录</van-button>
            </div>
        </van-form>
        
        <!-- /登录表单 -->
    </div>
</template>

<script>
import {login,sendSms} from '@/api/user'
// import {Toast} from 'vant'
// 这里可以不引用，使用this.$toast方法，toast在vue上注册了
export default { 
    name: 'LoginIndex',
    data() {
        return {
            user:{
                mobile:'',//手机号
                code:'' //验证码
            },
            formRules:{
                mobile:[
                    {required:true,message:'请输入手机号'},
                    {pattern:/^1[3|5|6|7|8|9]\d{9}$/,message:'请输入有效的手机号'}
                ],
                code:[
                    {required:true,message:'请输入验证码'},
                    {pattern:/^\d{6}$/,message:'验证码错误'}
                ]
            },
            isCountDownShow:false, //控制倒计时和发送的显示与隐藏
            isSendSmsLoading:false, //发送按钮的加载状态
        };
    },

    mounted() {
        
    },

    methods: {
        async onLogin(){
            // Toast.loading({
            this.$toast.loading({
                message: '登录中...',  //提示文本
                forbidClick: true,  // 禁止背景点击
                duration: 0 //展示时长（ms），值为0时，toast不会消失
            });
            // 1.找到数据接口
            // 2.封装请求方法
            // 3.请求调用登录
            try{
                const {data} = await login(this.user)
                this.$toast.success('登录成功')
                // 将后端返回的用户登录状态(token等数据)放到Vuex容器中
                this.$store.commit('setUser',data.data)

                // 登录成功,跳转回原来页面
                this.$router.back()  //先用这种方式,但是它不太好
            }catch(err){
                console.log(err)
                this.$toast.fail('登录失败，手机号或验证码错误')
            }

            // 4.处理响应结果
        },
        onFailed(error){
            if(error.errors[0]){
                this.$toast({
                    message:error.errors[0].message,
                    position:'top'
                })
            }
        },
        async onSendSms(){
            try{
                await this.$refs['login-form'].validate('mobile')
                // loading 状态,防止网络加载慢用户多次点击触发发送行为
                this.isSendSmsLoading = true //展示按钮
                // 验证通过，请求发送验证码
                await sendSms(this.user.mobile)

                // 短信发送出去了，隐藏发送按钮，显示倒数计时
                this.isCountDownShow = true
            }catch(err){
                // try 里面任何代码的错误都会进入catch
                // 不同的错误需要不同的提示，那就需要判断了
                let message = ''
                if(err && err.response && err.response.status === 429){
                    // 表单发送频繁的错误
                    message = '发送太频繁了，请稍后重试！'
                }else if (err.name === 'mobile'){
                    // 表单验证失败的错误提示
                    message = err.message
                }else{
                    message = '发送失败，请稍后重试！'
                }
                // toast提示用户错误信息
                this.$toast({
                    message,
                    position:'top'
                })
            }
            // 无论发送验证码成功还是失败,最后都要关闭发送按钮的loading状态
            this.isSendSmsLoading = false
            // 校验手机号
            // 验证通过 ->  请求发送验证码 ->  用户接受短信 -> 输入验证码 -> 请求登录
            // 请求发送验证码 -> 隐藏发送按钮，显示倒数计时
            // 倒计时结束 -> 隐藏倒计时按钮，显示发送按钮
        }
    },
};
</script>

<style lang="less" scoped>
.login-container{
    .send-btn {
        width:76px;
        height: 23px;
        background-color: #ededed;
        .van-button__text{
            color: #666666;
            font-size: 11px;
        }
    }
    .login-btn-wrap{
        padding: 26px 16px;
        .login-btn{
            background-color: #6db4fb;
            border: none;
            .van-button__text{
                font-size: 15px;
            }
        }
    }
}
</style>