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
        <template slot-scope="scope">
          {{ scope.articleId }}
        </template>
      </el-table-column>
      <el-table-column label="文章名称">
        <template slot-scope="scope">
          {{ scope.articleName }}
        </template>
      </el-table-column>
      <el-table-column label="文章类型" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.type}}</span>
        </template>
      </el-table-column>
      <el-table-column label="文章分类" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.classification }}
        </template>
      </el-table-column>
      <el-table-column label="文章属性" width="110" align="center">
        <template slot-scope="scope" v-if="scope.isOriginal==0">
          转载
        </template>
        <template slot-scope="scope" v-if="scope.isOriginal==1">
          原创
        </template>
        <template slot-scope="scope" v-if="scope.isOriginal==2">
          练习
        </template>
        <template slot-scope="scope" v-if="scope.isOriginal==3">
          临摹
        </template>
      </el-table-column>
      <el-table-column label="浏览次数" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.browseTimes }}
        </template>
      </el-table-column>
       <el-table-column label="留言数量" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.messageCount }}
        </template>
      </el-table-column>
       <el-table-column label="发布时间" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.datetime }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini">编辑</el-button>
          <el-button type="warning" size="mini">删除</el-button>
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
import { getList } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: false,
      total:0,
      pageNumber: 1,
      pageSize: 10
    }
  },
  created() {
    //this.fetchData()
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

    // fetchData() {
    //   this.listLoading = true
    //   getList().then(response => {
    //     this.list = response.data.items
    //     this.listLoading = false
    //   })
    // }
  }
}
</script>

<style>
.pagination-class {
  margin-top: 30px;
}
</style>
