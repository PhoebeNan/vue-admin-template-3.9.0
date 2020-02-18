<template>
  <div class="app-container">
    课程列表
    <!-- 表格 -->
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column prop="title" label="名称" width="80" />

      <el-table-column prop="price" label="价格" width="80" />

      <el-table-column prop="lessonNum" label="课时数" />

      <el-table-column prop="buyCount" label="购买人数" width="160" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import course from "@/api/course";

export default {
  //定义变量和初始值
  data() {
    return {
      listLoading: false, // 是否显示loading信息
      list: null, //每页数据list集合
      total: 0, //总记录数
      page: 1, //当前页
      limit: 10, //每页显示记录数
      searchObj: {} //条件封装对象
    };
  },
  //在页面渲染之前调用，调用具体的某个方法
  created() {
    //调用方法
    this.getAllCourse();
  },
  //写具体的方法调用
  methods: {
    //1 讲师列表
    getAllCourse() {
      course
        .getCourseList()
        .then(response => {
          //如果请求成功，返回状态码20000，执行then里面操作
          // console.log(response)
          //每页数据
          this.list = response.data.items;

          this.listLoading = false;
        })
        .catch(response => {
          //如果请求失败，执行catch里面操作
          console.log(response);
        });
    },
    //删除课程的方法
    removeDataById(id) {
      this.$confirm("此操作将永久删除该课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //调用方法进行删除
          //return 表示后面then还会执行
          course.deleteCourseId(id);
        })
        .then(() => {
          //刷新整个页面
          this.getAllCourse();
          console.log("删除成功!");
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(error => {
          console.log(error);
          console.log("已取消删除");
          //判断点击取消，还是删除失败
          if (error === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          } else {
            console.log("删除失败");
            this.$message({
              type: "error",
              message: "删除失败"
            });
          }
        });
    }
  }
};
</script>
<style scoped>
.myClassList .info {
  width: 450px;
  overflow: hidden;
}
.myClassList .info .pic {
  width: 150px;
  height: 90px;
  overflow: hidden;
  float: left;
}
.myClassList .info .pic a {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
.myClassList .info .pic img {
  display: block;
  width: 100%;
}
.myClassList td .info .title {
  width: 280px;
  float: right;
  height: 90px;
}
.myClassList td .info .title a {
  display: block;
  height: 48px;
  line-height: 24px;
  overflow: hidden;
  color: #00baf2;
  margin-bottom: 12px;
}
.myClassList td .info .title p {
  line-height: 20px;
  margin-top: 5px;
  color: #818181;
}
</style>