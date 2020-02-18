<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0" />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar" />
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像</el-button>

        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调-->
        <image-cropper
          v-show="imagecropperShow"
          :key="imagecropperKey"
          :url="BASE_API+'/eduservice/alibabaoss/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacher from "@/api/teacher";

import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";

const defaultForm = {
  name: "",
  sort: 0,
  level: "",
  career: "",
  intro: "",
  avatar: ""
};

export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher: defaultForm,
      BASE_API: process.env.BASE_API, // 接口API地址
      imagecropperShow: false, // 是否显示上传组件
      imagecropperKey: 0 // 上传组件id
    };
  },
  watch: {
    $route(to, from) {
      console.log("watch $route");
      this.init();
    }
  },
  created() {
    this.init();
  },
  methods: {
    //上传文件成功后的回调函数
    cropSuccess(data) {
      console.log(data);
      this.imagecropperShow = false;
      //获取后台返回图片地址，显示到页面中
      this.teacher.avatar = data.imgUrl;
      //重新加载上传组件
      this.imagecropperKey = this.imagecropperKey + 1;
    },

    // 关闭上传组件
    close() {
      //点击×，关闭弹框
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    init() {
      //从路由上获取参数，
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id;
        //数据回显
        this.fetchDataById(id);
      } else {
        //添加表单数据清空
        this.teacher = { ...defaultForm };
      }
    },
    //保存或修改
    saveOrUpdate() {
      if (!this.teacher.id) {
        //没有id是保存
        this.saveTeacher();
      } else {
        this.updateTeacher();
      }
    },
    //保存教师
    saveTeacher() {
      //调用后台接口方法实现添加
      teacher
        .saveTeacher(this.teacher)
        .then(() => {
          return this.$message({
            type: "success",
            message: "添加成功"
          });
        })
        .then(() => {
          this.$router.push({
            path: "/teacher/list"
          });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "添加失败"
          });
        });
    },
    //修改教师
    updateTeacher() {
      teacher
        .editTeacher(this.teacher.id, this.teacher)
        .then(() => {
          return this.$message({
            type: "success",
            message: "修改成功"
          });
        })
        .then(() => {
          this.$router.push({
            path: "/teacher/list"
          });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "修改失败"
          });
        });
    },
    //根据id查询讲师
    fetchDataById(id) {
      teacher.getTeacherById(id).then(response => {
        this.teacher = response.data.teacher;
      });
    }
  }
};
</script>
