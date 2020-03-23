<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <el-button type="text" @click="openAddChapter">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chanpterList">
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <div class="chanpterList-cnt">
          <div class="lacts">{{ chapter.title }}</div>
          <div class="racts">
            <el-button type="text" @click="openVideoDialog(chapter.id)">添加小节</el-button>
            <el-button type="text" @click="getChapterById(chapter.id)">编辑</el-button>
            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
          </div>
        </div>
        <!-- 小节 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <div class="chanpterList-cnt">
              <div class="lacts">{{ video.title }}</div>
              <div class="racts">
                <el-button type="text" @click="openVideoEditDialog(video.id)">编辑</el-button>
                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>

    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改小节的表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加小节">
      <el-form :model="video" label-width="120px">
        <el-form-item label="小节标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="小节排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right" />
        </el-form-item>

        <!-- 添加视频上传到阿里云服务器 -->
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/vidservice/vod/upload'"
            :limit="1"
            class="upload-demo"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，
                <br />支持3GP、ASF、AVI、DAT、DV、FLV、F4V、
                <br />GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、
                <br />MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、
                <br />SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import chapter from "@/api/chapter";
import video from "@/api/video";

const dialogChapter = {
  title: "",
  sort: 0,
  courseId: ""
}; //添加弹框章节的对象

const dialogVideo = {
  title: "",
  sort: 1,
  courseId: "",
  chapterId: ""
}; //添加弹框小节的对象

export default {
  data() {
    return {
      id: "", //此id表示课程id  即courseId
      chapterVideoList: [], //存储章节和小节的数组
      dialogChapterFormVisible: false, //添加章节的表单
      dialogVideoFormVisible: false, //添加小节的表单
      chapter: dialogChapter,
      video: dialogVideo,

      BASE_API: process.env.BASE_API, // 接口API地址
      fileList: [] //上传文件列表
    };
  },
  created() {
    this.init();
    this.getChapterVideoListsById(this.id);
  },

  methods: {
    //删除阿里云视频之前
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //确认删除阿里云视频
    handleVodRemove(file, fileList) {
      console.log('====================='+file);
      video.removeAliyunVideo(this.video.videoSourceId).then(response => {
        console.log('=====================response'+response);
        this.$message({
          type: "success",
          message: "删除视频成功！"
        });
      });
    },

    //成功回调
    handleVodUploadSuccess(response, file, fileList) {
      this.video.videoSourceId = response.data.videoId;
    },
    //视图上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$message.warning("想要重新上传视频，请先删除已上传的视频");
    },

    //进行初始化操作
    init() {
      //获取路径里面id   //此id表示课程id
      if (this.$route.params && this.$route.params.id) {
        this.id = this.$route.params.id;
      }
    },
    //根据课程id查询此课程下的所有章节和小节
    getChapterVideoListsById(id) {
      chapter
        .getAllChapterVideoList(id)
        .then(res => {
          console.log(res);
          console.log(res);
          this.chapterVideoList = res.data.items;
        })
        .catch(err => {
          this.$message({
            type: "success",
            message: "数据加载失败！"
          });
        });
    },
    //上一步
    previous() {
      this.$router.push({ path: "/course/info/" + this.id });
    },
    //下一步
    next() {
      this.$router.push({ path: "/course/publish/" + this.id });
    },
    //添加和修改章节表单
    saveOrUpdate() {
      if (!this.chapter.id) {
        //添加章节
        this.saveChapter();
      } else {
        //修改章节
        this.updateChapter();
      }
    },
    //添加章节
    saveChapter() {
      //向服务器请求之前设置课程id
      this.chapter.courseId = this.id;
      chapter
        .addChapter(this.chapter)
        .then(res => {
          //1.关闭弹框
          this.dialogChapterFormVisible = false;
          //2.提示添加成功
          this.$message({
            type: "success",
            message: "章节添加成功！"
          });
          //3.刷新整个页面
          this.getChapterVideoListsById(this.id);
          //4.清空弹框的内容
          this.chapter = { ...dialogChapter };
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "章节添加失败！"
          });
        });
    },
    //修改章节
    updateChapter() {
      chapter
        .updateChapter(this.chapter)
        .then(res => {
          //1.关闭弹框
          this.dialogChapterFormVisible = false;
          //2.提示修改成功
          this.$message({
            type: "success",
            message: "章节修改成功！"
          });
          //3.刷新整个页面
          this.getChapterVideoListsById(this.id);
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "章节修改失败！"
          });
        });
    },
    //编辑章节,做数据回显
    getChapterById(id) {
      //alert(id)
      chapter.getChapterInfo(id).then(res => {
        //数据回显
        this.chapter = res.data.eduChapter;
        //弹框打开
        this.dialogChapterFormVisible = true;
      });
    },
    //删除章节
    removeChapter(chapterId) {
      this.$confirm("此操作将永久删除该章节, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          //调用方法进行删除
          //return 表示后面then还会执行
          console.log(res); //res值为confirm
          return chapter.deleteChapter(chapterId);
        })
        .then(res => {
          //刷新整个页面
          console.log(this.id); //课程courseId
          console.log("====zzz======");
          console.log(chapterId); //课程chapterId
          console.log(res); //res中data的值为空
          this.getChapterVideoListsById(this.id);

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
    },
    //添加章节，表单数据清空
    openAddChapter() {
      //弹框
      this.dialogChapterFormVisible = true;
      //表单数据清空
      this.chapter = { ...dialogChapter };
    },

    //===========================================
    //添加和修改小节表单
    saveOrUpdateVideo() {
      if (!this.video.id) {
        //添加小节
        this.saveVideo();
      } else {
        //修改小节
        this.updateVideo();
      }
    },
    //添加小节
    saveVideo() {
      //向服务器请求之前设置课程id
      this.video.courseId = this.id;
      //4.清空弹框的内容
      //this.chapter = { ...dialogChapter };
      video
        .addVideo(this.video)
        .then(res => {
          //1.关闭弹框
          this.dialogVideoFormVisible = false;
          //2.提示添加成功
          this.$message({
            type: "success",
            message: "小节添加成功！"
          });
          //3.刷新整个页面
          this.getChapterVideoListsById(this.id);
          //4.清空弹框的内容
          this.video = { ...dialogChapter };

          //5.清空之前添加的视频列表
          this.fileList = [];
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "小节添加失败！"
          });
        });
    },
    //修改小节
    updateVideo() {
      video
        .updateVideo(this.video)
        .then(res => {
          //1.关闭弹框
          this.dialogVideoFormVisible = false;
          //2.提示修改成功
          this.$message({
            type: "success",
            message: "小节修改成功！"
          });
          //3.刷新整个页面
          this.getChapterVideoListsById(this.id);
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "小节修改失败！"
          });
        });
    },
    //添加小节(点击事件)弹框
    openVideoDialog(chapterId) {
      //弹框
      this.dialogVideoFormVisible = true;

      //把章节id赋值
      this.video.title = "";
      this.video.sort = "";
      this.video.chapterId = chapterId;
    },
    //编辑小节弹框
    openVideoEditDialog(videoId) {
      //alert(videoId)
      video.getVideoInfo(videoId).then(res => {
        //数据回显
        this.video = res.data.eduVideo;
        //弹框打开
        this.dialogVideoFormVisible = true;
      });
    },
    //删除小节
    removeVideo(videoId) {
      this.$confirm("此操作将永久删除该小节, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //调用方法进行删除
          //return 表示后面then还会执行
          return video.deleteVideo(videoId);
        })
        .then(() => {
          //刷新整个页面
          console.log(videoId);

          this.getChapterVideoListsById(this.id);

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
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li {
  position: relative;
}
.chanpterList .chanpterList-cnt {
  clear: both;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chanpterList .lacts {
  float: left;
}
.chanpterList .racts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
.videoList .lacts {
  font-size: 16px;
}
</style>