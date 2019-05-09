<template>
  <div class="page">
    <p class="top-tool">
      <el-input v-model="articleTitle" placeholder="文章标题" clearable size="large" style="width:30%"></el-input>
      <el-select v-model="typeId" placeholder="请选择文章类型" @change="changeType">
        <el-option v-for="item in types" :key="item.typeId" :label="item.type" :value="item.typeId"></el-option>
      </el-select>
      <el-select v-model="classificationId" placeholder="请选择具体分类">
        <el-option
          v-for="item in classifications"
          :key="item.classificationId"
          :label="item.classification"
          :value="item.classificationId"
        ></el-option>
      </el-select>
      <el-button type="primary" plain size="large">编辑分类</el-button>
      <el-button type="primary" size="large" style="float:right">保存文章内容</el-button>
    </p>
    <div class="writing-container">
      <tinymce v-model="content" :height="600"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getTypes, getClassifications } from "@/api/writing";
import Tinymce from "@/components/Tinymce";
export default {
  name: "writing",
  components: { Tinymce },
  computed: {},
  data() {
    return {
      content: `<h1 style="text-align: center;">开始编写内容……</h1>`,
      typeId: "",
      types: "",
      classifications: "",
      articleTitle: "",
      type: "",
      classification: "",
      articleId: "",
      classificationId: ""
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
        // }else if(res.result.code==1){
        //   this.$message({
        //     type: "warning",
        //     message: res.result.info
        //   });
        // }else if(res.result.code==-1){
        //   this.$message({
        //     type: "warning",
        //     message: res.result.developInfo
        //   });
        // }
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
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
}
.writing {
  &-container {
    margin-top: 1%;
    margin-left: 2.5%;
    width: 95%;
    height: 600px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.top-tool {
  display: inline-block;
  margin-left: 2.5%;
  width: 95%;
}
</style>