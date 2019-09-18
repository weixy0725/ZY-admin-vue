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
      <el-table-column align="center" label="留言编号" width="95">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="文章名称" width="110">
        <template slot-scope="scope">{{ scope.row.articleName }}</template>
      </el-table-column>
      <el-table-column label="文章类型" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.articleType}}
        </template>
      </el-table-column>
      <el-table-column label="留言内容" align="center">
        <template slot-scope="scope">{{ scope.row.message }}</template>
      </el-table-column>
      <el-table-column label="留言时间" width="110" align="center">
        <template slot-scope="scope">
            {{ scope.row.datetime }}
        </template>
      </el-table-column>
      <el-table-column label="留言IP" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.ip }}</template>
      </el-table-column>
      <el-table-column label="留言类型" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type==0" style="color:green">回复</span>
          <span v-if="scope.row.type==1">留言</span>
        </template>
      </el-table-column>
      <el-table-column label="留言状态" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state==0">正常</span>
          <span v-if="scope.row.state==1" style="color:red">已删除</span>
        </template>
      </el-table-column>
      <el-table-column label="留言人/回复人" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="留言邮箱/回复邮箱" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
       <el-table-column label="邮件发送状态" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isSend==0">未发送</span>
          <span v-if="scope.row.isSend==1" style="color:green">已发送</span>
          <span v-if="scope.row.isSend==2" style="color:red">发送失败</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.type==1&&scope.row.state==0" type="primary" size="mini" @click="editFun(scope.row.id,0,scope.row.articleId)">回复</el-button>
          <el-button v-if="scope.row.type==0&&scope.row.state==0" type="primary" size="mini" @click="sendMail(scope.row.id)">发送邮件</el-button>
          <el-button v-if="scope.row.state==0" type="warning" size="mini" @click="changeFun(scope.row.id,1)">删除</el-button>
          <el-button v-if="scope.row.state==1" type="info" size="mini" @click="changeFun(scope.row.id,0)">恢复</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="pagination-class">
      <el-col :span="4" :offset="10">
        <el-pagination
          background
          layout="sizes,total,prev,pager,next,jumper"
          :total="total"
          :current-page="pageNumber"
          :page-sizes="[10, 20, 30]"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </el-col>
    </el-row>
    <el-dialog title="回 复" :visible.sync="dialogVisible" width="50%" :modal-append-to-body="false">
      <el-input
        type="textarea"
        :autosize="{ minRows: 8, maxRows: 16}"
        placeholder="请输入内容"
        v-model="textarea"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save()">回 复</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList,changeMessage,saveMessage,sendToMail} from "@/api/message";

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
      pageSize: 10,
      textarea:'',
      messageId:'',
      saveType:'',
      articleId:'',
      dialogVisible:false
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
    editFun(messageId,type,articleId) {
      this.messageId=messageId;
      this.saveType=type;
      this.articleId=articleId;
      this.dialogVisible=true
    },
    save(){
        var parameters = {};
        parameters["id"] = this.messageId;
        parameters["articleId"] = this.articleId;
        parameters["type"] = this.saveType;
        parameters["message"] = this.textarea;
        saveMessage(parameters).then(res => {
        if (res.result.code == 0) {
           this.dialogVisible=false;
           this.textarea="";
           this.$message.success("回复成功");
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
    },
    changeFun(id,state) {
      this.$confirm("确定处理该留言?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        var parameters = {};
        parameters["id"] = id;
        parameters["state"] = state;
        changeMessage(parameters).then(res => {
          if (res.result.code == 0) {
            this.$message({
              type: "success",
              message: "变更留言状态成功！"
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
    },
    sendMail(id){
       this.$confirm("确定发送邮件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        var parameters = {};
        parameters["id"] = id;
        sendToMail(parameters).then(res => {
          if (res.result.code == 0) {
            this.$message({
              type: "success",
              message: "发送通知邮件成功！"
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
