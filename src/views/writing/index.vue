<template>
  <div class="page">
    <el-row>
      <el-col :span="3" :offset="2">
        <el-row class="cover-img">
          <span v-if="coverUrl==''">暂无图片</span>
          <img v-if="coverUrl!=''" :src="coverUrl">
        </el-row>
      </el-col>
      <el-col :span="16" :offset="1">
        <el-row>
          <el-col :span="24">
            <el-input v-model="articleTitle" placeholder="文章标题" clearable size="large"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-input type="textarea" :rows="2" placeholder="文章概括" v-model="textarea"></el-input>
          </el-col>
        </el-row>
        <el-row v-if="typeId==2">
          <el-col :span="4">
            <el-select
              v-model="typeId"
              placeholder="请选择文章类型"
              @change="changeType"
              style="width:90%"
            >
              <el-option
                v-for="item in types"
                :key="item.typeId"
                :label="item.type"
                :value="item.typeId"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="classificationId" placeholder="请选择具体分类" style="width:90%">
              <el-option
                v-for="item in classifications"
                :key="item.classificationId"
                :label="item.classification"
                :value="item.classificationId"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="isOriginal" placeholder="请选择原创/转载/.." style="width:90%">
              <el-option key="1" label="原创" value="1"></el-option>
              <el-option key="0" label="转载" value="0"></el-option>
              <el-option key="2" label="练习" value="2"></el-option>
              <el-option key="3" label="临摹" value="3"></el-option>
              <el-option key="4" label="学习" value="4"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <!-- <editorImage
              color="#1890ff"
              class="editor-upload-btn"
              name="上传封面"
              @successCBK="imageSuccessCBK"
              size="large"
              width="90%"
            />-->
            <el-button size="large" type="primary"  icon="el-icon-upload" style="background:#1890ff;width:90%" @click="toggleShow">设置封面</el-button>
            <my-upload
              field="img"
              @crop-success="cropSuccess"
              @crop-upload-success="cropUploadSuccess"
              @crop-upload-fail="cropUploadFail"
              v-model="show"
              :width="300"
              :height="256"
              :url="upload()"
              :params="params"
              :headers="headers"
              img-format="png"
            ></my-upload>
          </el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              plain
              size="large"
              style="width:90%"
              @click="dialogVisible = true"
            >编辑分类</el-button>
          </el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              size="large"
              style="width:100%"
              @click="saveArticle"
              v-if="isSave==true"
            >保存文章内容</el-button>
            <el-button
              type="primary"
              size="large"
              style="width:100%"
              @click="updateArticle"
              v-else
            >更新文章内容</el-button>
          </el-col>
        </el-row>
        <el-row v-else>
          <el-col :span="5">
            <el-select
              v-model="typeId"
              placeholder="请选择文章类型"
              @change="changeType"
              style="width:90%"
            >
              <el-option
                v-for="item in types"
                :key="item.typeId"
                :label="item.type"
                :value="item.typeId"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-select v-model="classificationId" placeholder="请选择具体分类" style="width:90%">
              <el-option
                v-for="item in classifications"
                :key="item.classificationId"
                :label="item.classification"
                :value="item.classificationId"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-select v-model="isOriginal" placeholder="请选择原创/转载/..." style="width:90%">
              <el-option key="1" label="原创" value="1"></el-option>
              <el-option key="0" label="转载" value="0"></el-option>
              <el-option key="4" label="学习" value="4"></el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-button
              type="primary"
              plain
              size="large"
              style="width:90%"
              @click="dialogVisible = true"
            >编辑分类</el-button>
          </el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              size="large"
              style="width:100%"
              @click="saveArticle"
              v-if="isSave==true"
            >保存文章内容</el-button>
            <el-button
              type="primary"
              size="large"
              style="width:100%"
              @click="updateArticle"
              v-else
            >更新文章内容</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20" :offset="2">
        <tinymce v-model="content" :height="600"/>
      </el-col>
    </el-row>
    <el-dialog title="管理分类" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <el-form label-position="left" label-width="80px" :model="formAddClassification">
        <el-form-item label="文章类型">
          <el-select
            v-model="formAddClassification.typeId"
            placeholder="请选择文章类型"
            @change="changeAddType"
            style="width:100%"
          >
            <el-option
              v-for="item in types"
              :key="item.typeId"
              :label="item.type"
              :value="item.typeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="具体分类">
          <el-input v-model="formAddClassification.classification"></el-input>
        </el-form-item>
        <el-form-item>
          <div style="float:right">
            <el-button @click="formAddClassification.classification=''">清 空</el-button>
            <el-button type="primary" @click="saveFun">新 增</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div class="line"></div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="编号" width="200">
          <template slot-scope="scope">{{ scope.row.classificationId }}</template>
        </el-table-column>
        <el-table-column label="具体分类" width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.classification" v-if="scope.$index==editFlagId"></el-input>
            <span v-else>{{ scope.row.classification }}</span>
          </template>
        </el-table-column>
        <el-table-column label="归属类型" width="200">
          <template slot-scope="scope">{{ scope.row.type }}</template>
        </el-table-column>
        <el-table-column fixed="right" width="160" label="操作">
          <template slot-scope="scope">
            <div v-if="scope.$index==editFlagId">
              <el-button
                type="success"
                size="mini"
                @click="updateFun(scope.row.classificationId,scope.row.classification)"
                plain
              >保存</el-button>
              <el-button type="info" size="mini" @click="editFlagId=-1" plain>取消</el-button>
            </div>
            <div v-else>
              <el-button type="primary" size="mini" @click="editFun(scope.$index)">编辑</el-button>
              <el-button
                type="warning"
                size="mini"
                @click="deleteFun(scope.row.classificationId)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import myUpload from "vue-image-crop-upload";
import { mapGetters } from "vuex";
import {
  getTypes,
  getClassifications,
  saveArticle,
  getArticle,
  updateArticle,
  updateClassification,
  addClassification,
  deleteClassification
} from "@/api/writing";
import Tinymce from "@/components/Tinymce";
import editorImage from "@/components/Tinymce/components/EditorImage";
export default {
  name: "writing",
  components: { Tinymce, editorImage,myUpload },
  computed: {},
  data() {
    return {
      content: `<p style="text-align: center;">开始编写内容……</p>`,
      typeId: "",
      types: "",
      classifications: "",
      articleTitle: "",
      type: "",
      classification: "",
      articleId: "",
      classificationId: "",
      isOriginal: "",
      textarea: "",
      coverUrl: "",
      isSave: true,
      tempclassificationId: "",
      dialogVisible: false,
      newClassification: "",
      formAddClassification: {
        typeId: "",
        classification: ""
      },
      tableData: [],
      editClassification: "",
      editFlagId: -1,
      uploadPictureURL:process.env.VUE_APP_BASE_API+"/articleManagement/uploadPictureCover",
      show: false,
			params: {
			},
			headers: {
			}
    };
  },
  created() {
    this.getT();
  },
  mounted() {
    this.getArticle();
  },
  watch: {
    typeId(val) {
      if (this.articleId != "" && this.articleId != undefined) {
        var params = {};
        params["typeId"] = this.typeId;
        getClassifications(params).then(response => {
          var res = response;
          if (res.result.code == 0) {
            this.classifications = res.array;
          }
        });
        this.classificationId = this.tempclassificationId + "";
      }
    }
  },

  methods: {
    upload(){
       return this.uploadPictureURL;
    },
    getT() {
      getTypes().then(response => {
        var res = response;
        console.log(res);
        if (res.result.code == 0) {
          this.types = res.array;
        }
      });
    },

    changeType() {
      var params = {};
      params["typeId"] = this.typeId;
      this.classification = "";
      this.classificationId = "";
      this.coverUrl = "";
      getClassifications(params).then(response => {
        var res = response;
        if (res.result.code == 0) {
          this.classifications = res.array;
        }
      });
    },

    changeAddType() {
      var params = {};
      params["typeId"] = this.formAddClassification.typeId;
      getClassifications(params).then(response => {
        var res = response;
        if (res.result.code == 0) {
          this.tableData = res.array;
        }
      });
    },
    handleClose() {
      this.dialogVisible = false;
    },
    saveArticle() {
      let formData = new FormData();
      if (
        this.articleTitle == "" ||
        this.textarea == "" ||
        this.typeId == "" ||
        this.classificationId == "" ||
        this.isOriginal == "" ||
        this.content == ""
      ) {
        alert("不可为空");
      }
      formData.append("articleName", this.articleTitle);
      formData.append("articleSummarize", this.textarea);
      formData.append("typeId", this.typeId);
      formData.append("classificationId", this.classificationId);
      formData.append("isOriginal", this.isOriginal);
      formData.append("article", this.content);
      if (this.coverUrl != "") {
        var spilt = this.coverUrl.split("/");
        formData.append("cover", spilt[spilt.length - 1]);
      }
      saveArticle(formData).then(response => {
        var res = response;
        if (res.result.code === 0) {
          this.$message.success("上传文章成功！");
          this.articleTitle = "";
          this.textarea = "";
          this.typeId = "";
          this.classificationId = "";
          this.isOriginal = "";
          this.content = "<p style='text-align: center;'>开始编写内容……</p>";
          this.coverUrl = "";
        }
      });
    },
    imageSuccessCBK(arr) {
      const _this = this;
      if (arr.length > 1) {
        this.$message.error("设置失败，封面图片只能设置一张！");
      }
      this.coverUrl = arr[0].url;
    },
    getArticle() {
      console.log(this.$route.query.articleId);
      this.articleId = this.$route.query.articleId;
      if (this.articleId != "" && this.articleId != undefined) {
        var params = {};
        params["articleId"] = this.articleId;
        getArticle(params).then(res => {
          if (res.result.code == 0) {
            this.isSave = false;
            this.articleTitle = res.object.articleName;
            this.textarea = res.object.articleSummarize;
            this.content = res.object.articleContent;
            this.isOriginal = res.object.isOriginal + "";
            if (res.object.cover != null && res.object.cover != "") {
              this.coverUrl = "http://39.105.221.186:80/" + res.object.cover;
            }
            this.tempclassificationId = res.object.classificationId;
            this.typeId = res.object.typeId;
          } else if (res.result.code == 1) {
            this.$message({
              type: "warning",
              message: res.result.info
            });
          } else if (res.result.code == -1) {
            this.$message({
              type: "warning",
              message: res.result.developInfo
            });
          }
        });
      }
    },
    updateArticle() {
      let formData = new FormData();
      if (
        this.articleTitle == "" ||
        this.textarea == "" ||
        this.typeId == "" ||
        this.classificationId == "" ||
        this.isOriginal == "" ||
        this.content == ""
      ) {
        alert("不可为空");
      }
      formData.append("articleId", this.articleId);
      formData.append("articleName", this.articleTitle);
      formData.append("articleSummarize", this.textarea);
      formData.append("typeId", this.typeId);
      formData.append("classificationId", this.classificationId);
      formData.append("isOriginal", this.isOriginal);
      formData.append("article", this.content);
      if (this.coverUrl != "") {
        var spilt = this.coverUrl.split("/");
        formData.append("cover", spilt[spilt.length - 1]);
      }
      updateArticle(formData).then(response => {
        var res = response;
        if (res.result.code === 0) {
          this.$message.success("更新文章成功！");
          this.articleId = "";
          this.articleTitle = "";
          this.textarea = "";
          this.typeId = "";
          this.classificationId = "";
          this.isOriginal = "";
          this.content = "";
          this.coverUrl = "";
        }
      });
    },
    editFun(index) {
      this.editFlagId = index;
    },
    updateFun(id, name) {
      if (name == "" || name == null) {
        this.$message.error("分类名不能为空！");
      } else {
        let formData = new FormData();
        formData.append("classificationId", id);
        formData.append("classification", name);
        updateClassification(formData).then(response => {
          var res = response;
          if (res.result.code === 0) {
            this.$message.success("更新具体分类成功！");
            this.changeAddType();
            this.editFlagId = -1;
          }
        });
      }
    },
    saveFun() {
      if (
        this.formAddClassification.classification == "" ||
        this.formAddClassification.classification == null
      ) {
        this.$message.error("分类名不能为空！");
      } else {
        let formData = new FormData();
        formData.append("typeId", this.formAddClassification.typeId);
        formData.append(
          "classification",
          this.formAddClassification.classification
        );
        addClassification(formData).then(response => {
          var res = response;
          if (res.result.code === 0) {
            this.$message.success("新增具体分类成功！");
            this.changeAddType();
            this.formAddClassification.classification = "";
          }
        });
      }
    },
    deleteFun(id) {
      this.$confirm("确定删除该分类?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        let formData = new FormData();
        formData.append("classificationId", id);
        deleteClassification(formData).then(response => {
          var res = response;
          if (res.result.code === 0) {
            this.$message.success("删除具体分类成功！");
            this.changeAddType();
          }
        });
      });
    },
      toggleShow() {
				this.show = !this.show;
			},
			cropSuccess(imgDataUrl, field){
				console.log('-------- crop success --------');
			},
			cropUploadSuccess(jsonData, field){
        console.log('-------- upload success --------');
        console.log(jsonData);
				this.coverUrl = "http://39.105.221.186:80/" + jsonData.object.url;
			},
			cropUploadFail(status, field){
				this.$message.error("封面上传失败！");
			}
  }
};
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
}

.el-row {
  margin-bottom: 20px;
  &:first-child {
    margin-top: 20px;
  }
  &:last-child {
    margin-bottom: 0;
  }
}

.cover-img {
  border: 1px solid #e4e7ed;
  height: 175px;
  line-height: 100px;
  text-align: center;
  -webkit-box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  background: #fff;
  border-radius: 4px;
  color: #cacbcc;
}

.cover-img img {
  height: 175px;
  width: 90%;
}

.line {
  width: 100%;
  height: 1px;
  border-top: solid #b2d1f7 1px;
}
</style>
