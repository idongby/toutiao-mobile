<template>
    <div class="user-profile">
        <!-- 导航栏 -->
        <van-nav-bar
        class="app-nav-bar"
        title="个人信息"
        left-arrow
        @click-left="$router.back()"
        />
        <!-- /导航栏 -->

        <!-- 个人信息 -->
        <input type="file" hidden ref="file" accept="image/*" @change="onFileChange">
        <van-cell title="头像" is-link center @click="$refs.file.click()">
            <van-image
                width="30"
                height="30"
                round
                fit="cover"
                :src="user.photo"
            />
        </van-cell>
        <van-cell 
          title="昵称" 
          is-link 
          :value="user.name"
          @click="isEditNameShow = true"
        ></van-cell>
        <van-cell 
          title="性别" 
          is-link 
          :value="user.gender ? '女' : '男'"
          @click="isEditGenderShow = true"
        ></van-cell>
        <van-cell
         title="生日" 
         is-link 
         :value="user.birthday"
         @click="isEditBirthdayShow = true"
        ></van-cell>
        <!-- /个人信息 -->
        <!-- 昵称修改 -->
        <van-popup
         v-model="isEditNameShow"
         position="bottom"
         :style="{height:'100%'}"
        >
        <!-- 当你传递给子组件的数据既要使用又要修改，比如下面的这个name
            这种情况下用v-model比较好
            :name="user.name"
            @update-name="user.name = $event"
         -->
         <!-- 
             v-model="user.name"
                默认传递一个名字叫value 的数据
                :value="user.name"
                默认监听 input 事件 @input = "user.name = $event"
                本质上还是父子组件通信，它仅仅是简化了父组件的使用
          -->
          <!-- 
              如果有多个数据需要保持同步，使用.sync修饰符，
              :gender="user.gender"
              @update-gender="user.gender = $event"

              :gender.sync = "user.gender"
                :gender="user.gender"
                @update:gender="user.gender = $event"
                @update:属性名字="user.gender = $event"

             我们一般把最常用的数据设计为v-model绑定，
                 把不太常用的数据设计为.sync
           -->
            <update-name
              v-if="isEditNameShow"
              v-model="user.name"
              @close="isEditNameShow = false"
            />
        </van-popup>
        <!-- /昵称修改 -->

        <!-- 修改性别 -->
        <van-popup
         v-model="isEditGenderShow"
         position="bottom"
        >
            <update-gender
              v-model="user.gender"
              @close="isEditGenderShow = false"
            />
        </van-popup>
        <!-- /修改性别 -->

        <!-- 修改生日 -->
        <van-popup
         v-model="isEditBirthdayShow"
         position="bottom"
        >
            <update-birthday
              v-if="isEditBirthdayShow"
              v-model="user.birthday"
              @close="isEditBirthdayShow = false"
            />
        </van-popup>
        <!-- /修改生日 -->

        <!-- 修改头像 -->
        <van-popup
         class="update-photo-popup"
         v-model="isEditPhotoShow"
         position="bottom"
         style="height:100%"
        >
           <update-photo
             v-if="isEditPhotoShow"
             :file="previewImage"
             @close="isEditPhotoShow = false"
             @update-photo="user.photo = $event"
           />
        </van-popup>
        <!-- /修改头像 -->
    </div>
</template>

<script>
import {getUserProfile} from '@/api/user.js'
import UpdateName from './components/update-name.vue'
import UpdateGender from './components/update-gender.vue'
import UpdateBirthday from './components/updae-birthday.vue'
import UpdatePhoto from './components/update-photo.vue'
export default {
    name: 'UserProfile',
    components:{
        UpdateName,
        UpdateGender,
        UpdateBirthday,
        UpdatePhoto
    },
    data() {
        return {
            user:{}, //用户数据
            isEditNameShow:false, //控制昵称的修改状态
            isEditGenderShow:false, //控制性别的修改状态
            isEditBirthdayShow:false, //控制生日的修改状态
            isEditPhotoShow:false, //编辑头像的显示状态
            previewImage: null //上传预览图片
        };
    },
    created(){
        this.loadUserProfile()
    },
    mounted() {
        
    },

    methods: {
        async loadUserProfile(){
            const {data} = await getUserProfile()
            this.user = data.data
        },
        onFileChange(){
            // 展示弹出层
            this.isEditPhotoShow = true
            // 在弹出层里面预览图片
            const file = this.$refs.file.files[0]
            console.log(file)
            // const blob = window.URL.createObjectURL(this.$refs.file.files[0])
            this.previewImage = file

            // 清空 file 的value
            // 为了解决相同文件不触发 change事件的问题，所以需要手动清空
            this.$refs.file.value = ''
        }
    },
};
</script>

<style lang="less" scoped>
.van-popup{
    background-color: #f5f7f9;
}
.update-photo-popup{
    background-color: #000;
}
</style>