<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="文章编号" width="95">
        <template slot-scope="scope">{{ scope.row.articleId }}</template>
      </el-table-column>
      <el-table-column label="文章名称">
        <template slot-scope="scope">{{ scope.row.articleName }}</template>
      </el-table-column>
      <el-table-column label="文章类型" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column label="文章分类" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.classification }}</template>
      </el-table-column>
      <el-table-column label="文章属性" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isOriginal==0">转载</span>
          <span v-if="scope.row.isOriginal==1">原创</span>
          <span v-if="scope.row.isOriginal==2">练习</span>
          <span v-if="scope.row.isOriginal==3">临摹</span>
          <span v-if="scope.row.isOriginal==4">学习</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览次数" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.browseTimes }}</template>
      </el-table-column>
      <el-table-column label="留言数量" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.messageCount }}</template>
      </el-table-column>
      <el-table-column label="发布时间" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.datetime }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editFun(scope.row.articleId)">编辑</el-button>
          <el-button type="warning" size="mini" @click="deleteFun(scope.row.articleId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="pagination-class">
      <el-col :span="4" :offset="10">
        <el-pagination
          background
          layout="total,prev,pager,next,jumper"
          :total="total"
          :current-page="pageNumber"
          :page-sizes="[10, 20, 30]"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getList, deleteArticle } from "@/api/table";

export default {
  // filters: {
  //   statusFilter(status) {
  //     const statusMap = {
  //       published: 'success',
  //       draft: 'gray',
  //       deleted: 'danger'
  //     }
  //     return statusMap[status]
  //   }
  // },
  data() {
    return {
      list: null,
      listLoading: false,
      total: 0,
      pageNumber: 1,
      pageSize: 10
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.fetchData();
      console.log(`当前页: ${val}`);
    },

    fetchData() {
      this.listLoading = true;
      var parameters = {};
      // parameters["typeId"]=this.typeId;
      // if(this.classificationId!=0){
      //       parameters["classificationId"]=this.classificationId;
      // }
      parameters["pageIndex"] = this.pageNumber;
      parameters["pageSize"] = this.pageSize;
      getList(parameters).then(res => {
        if (res.result.code == 0) {
          this.list = res.array;
          this.total = res.object.count;
          this.listLoading = false;
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
    },
    editFun(articleId) {
      this.$router.push({
        name: "writing",
        query: {
          "articleId": articleId
        }
      });
    },
    deleteFun(articleId) {
      this.$confirm("确定删除该文章?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        var parameters = {};
        parameters["articleId"] = articleId;
        deleteArticle(parameters).then(res => {
          if (res.result.code == 0) {
            this.$message({
              type: "success",
              message: "删除文章成功！"
            });
            this.fetchData();
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
      });
    }
  }
};
</script>

<style>
.pagination-class {
  margin-top: 30px;
}
</style>
