<template>
  <div class="page">
    <el-row>
      <el-col :span="20" :offset="2">
        <el-input v-model="articleTitle" placeholder="文章标题" clearable size="large"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20" :offset="2">
        <el-input type="textarea" :rows="2" placeholder="文章概括" v-model="textarea"></el-input>
      </el-col>
    </el-row>
    <el-row v-if="typeId==2">
      <el-col :span="3" :offset="2">
        <el-select v-model="typeId" placeholder="请选择文章类型" @change="changeType" style="width:90%">
          <el-option
            v-for="item in types"
            :key="item.typeId"
            :label="item.type"
            :value="item.typeId"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="classificationId" placeholder="请选择具体分类" style="width:90%">
          <el-option
            v-for="item in classifications"
            :key="item.classificationId"
            :label="item.classification"
            :value="item.classificationId"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="isOriginal" placeholder="请选择原创/转载" style="width:90%">
          <el-option key="1" label="原创" value="1"></el-option>
          <el-option key="0" label="转载" value="0"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" plain size="large" style="width:90%">上传封面</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" plain size="large" style="width:90%">编辑分类</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" size="large" style="width:100%">保存文章内容</el-button>
      </el-col>
    </el-row>
    <el-row v-else>
      <el-col :span="4" :offset="2">
        <el-select v-model="typeId" placeholder="请选择文章类型" @change="changeType" style="width:90%">
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
        <el-select v-model="isOriginal" placeholder="请选择原创/转载" style="width:90%">
          <el-option key="1" label="原创" value="1"></el-option>
          <el-option key="0" label="转载" value="0"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" plain size="large" style="width:90%">编辑分类</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="large" style="width:100%" @click="saveArticle">保存文章内容</el-button>
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
import { getTypes, getClassifications,saveArticle} from "@/api/writing";
import Tinymce from "@/components/Tinymce";
export default {
  name: "writing",
  components: { Tinymce },
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
      textarea: ""
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

    saveArticle(){
      let formData = new FormData();
      if(this.articleTitle==""||this.textarea==""||this.typeId==""||this.classificationId==""||this.isOriginal==""||this.content==""){
        alert("不可为空");
      }
      formData.append('articleName',this.articleTitle);
      formData.append('articleSummarize',this.textarea);
      formData.append('typeId',this.typeId);
      formData.append('classificationId',this.classificationId);
      formData.append('isOriginal',this.isOriginal);
      formData.append('article',this.content);
      saveArticle(formData).then(response => {
        var res = response;
        if (res.result.code == 0) {
          console.log("-----------------");
        }
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
</style>