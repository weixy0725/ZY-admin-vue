<template>
  <div class="page">
    <el-row>
      <el-col :span="3" :offset="2">
        <el-row class="cover-img">
            <img>{{imgText}}</img>
        </el-row>
      </el-col>
      <el-col :span="16" :offset="1">
        <el-row>
          <el-col :span="24" >
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
            </el-select>
          </el-col>
          <el-col :span="4">
            <editorImage
              color="#1890ff"
              class="editor-upload-btn"
              name="上传封面"
              @successCBK="imageSuccessCBK"
              size="large"
              width="90%"
            />
            <!-- <el-button type="primary" plain size="large" style="width:90%" @click="dialogVisible=true">上传封面</el-button> -->
          </el-col>
          <el-col :span="4">
            <el-button type="primary" plain size="large" style="width:90%">编辑分类</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" size="large" style="width:100%">保存文章内容</el-button>
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
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" plain size="large" style="width:90%">编辑分类</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" size="large" style="width:100%" @click="saveArticle">保存文章内容</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20" :offset="2">
        <tinymce v-model="content" :height="600"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getTypes, getClassifications, saveArticle } from "@/api/writing";
import Tinymce from "@/components/Tinymce";
import editorImage from "@/components/Tinymce/components/EditorImage";
export default {
  name: "writing",
  components: { Tinymce, editorImage },
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
      imgText:"暂无封面"
    };
  },
  mounted() {
    this.getT();
  },
  methods: {
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
      getClassifications(params).then(response => {
        var res = response;
        if (res.result.code == 0) {
          this.classifications = res.array;
        }
      });
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
      saveArticle(formData).then(response => {
        var res = response;
        if (res.result.code === 0) {
          console.log("-----------------");
        }
      });
    },
    imageSuccessCBK(arr) {
      const _this = this;
      if (arr.length > 1) {
        this.$message.error("设置失败，封面图片只能设置一张！");
      }
      arr.forEach(v => {
        window.tinymce
          .get(_this.tinymceId)
          .insertContent(`<img class="wscnph" src="${v.url}" >`);
      });
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

.cover-img{
  border: 1px solid #e4e7ed;
  height: 175px;
  line-height: 100px;
  text-align: center;
  -webkit-box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  background: #fff;
  border-radius: 4px;
}
</style>
