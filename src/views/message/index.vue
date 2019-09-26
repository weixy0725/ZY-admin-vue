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
        <template slot-scope="scope">
          <div v-html="analyzeEmoji(scope.row.message)">{{analyzeEmoji(scope.row.message)}}
          </div>
          </template>
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
      <div :class="pBody?'OwO':'OwO OwO-open'" style="margin-top:5px;">
                    <div class="OwO-logo" @click="pBody=!pBody">
                        <span>_(:з」∠)_表情</span>
                    </div>
                    <div class="OwO-body">
                        <ul class="OwO-items OwO-items-show">
                            <li class="OwO-item" v-for="(oitem,index) in OwOlist" :key="'oitem'+index" @click="choseEmoji(oitem.title)">
                                <img :src="'http://39.105.221.186:80/'+oitem.url" alt="">
                            </li>
                        </ul>
                    </div>
      </div>
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
      dialogVisible:false,
      pBody:true,//表情打开控制
      OwOlist:[//表情包和表情路径
                   {'title':'微笑','url':'weixiao.gif'},
                   {'title':'嘻嘻','url':'xixi.gif'},
                   {'title':'哈哈','url':'haha.gif'},
                   {'title':'可爱','url':'keai.gif'},
                   {'title':'可怜','url':'kelian.gif'},
                   {'title':'挖鼻','url':'wabi.gif'},
                   {'title':'吃惊','url':'chijing.gif'},
                   {'title':'害羞','url':'haixiu.gif'},
                   {'title':'挤眼','url':'jiyan.gif'},
                   {'title':'闭嘴','url':'bizui.gif'},
                   {'title':'鄙视','url':'bishi.gif'},
                   {'title':'爱你','url':'aini.gif'},
                   {'title':'泪','url':'lei.gif'},
                   {'title':'偷笑','url':'touxiao.gif'},
                   {'title':'亲亲','url':'qinqin.gif'},
                   {'title':'生病','url':'shengbing.gif'},
                   {'title':'太开心','url':'taikaixin.gif'},
                   {'title':'白眼','url':'baiyan.gif'},
                   {'title':'右哼哼','url':'youhengheng.gif'},
                   {'title':'左哼哼','url':'zuohengheng.gif'},
                   {'title':'嘘','url':'xu.gif'},
                   {'title':'衰','url':'shuai.gif'},
                   {'title':'吐','url':'tu.gif'},
                   {'title':'哈欠','url':'haqian.gif'},
                   {'title':'抱抱','url':'baobao.gif'},
                   {'title':'怒','url':'nu.gif'},
                   {'title':'疑问','url':'yiwen.gif'},
                   {'title':'馋嘴','url':'chanzui.gif'},
                   {'title':'拜拜','url':'baibai.gif'},
                   {'title':'思考','url':'sikao.gif'},
                   {'title':'汗','url':'han.gif'},
                   {'title':'困','url':'kun.gif'},
                   {'title':'睡','url':'shui.gif'},
                   {'title':'钱','url':'qian.gif'},
                   {'title':'失望','url':'shiwang.gif'},
                   {'title':'酷','url':'ku.gif'},
                   {'title':'色','url':'se.gif'},
                   {'title':'哼','url':'heng.gif'},
                   {'title':'鼓掌','url':'guzhang.gif'},
                   {'title':'晕','url':'yun.gif'},
                   {'title':'悲伤','url':'beishang.gif'},
                   {'title':'抓狂','url':'zhuakuang.gif'},
                   {'title':'黑线','url':'heixian.gif'},
                   {'title':'阴险','url':'yinxian.gif'},
                   {'title':'怒骂','url':'numa.gif'},
                   {'title':'互粉','url':'hufen.gif'},
                   {'title':'书呆子','url':'shudaizi.gif'},
                   {'title':'愤怒','url':'fennu.gif'},
                   {'title':'感冒','url':'ganmao.gif'},
                   {'title':'心','url':'xin.gif'},
                   {'title':'伤心','url':'shangxin.gif'},
                   {'title':'猪','url':'zhu.gif'},
                   {'title':'熊猫','url':'xiongmao.gif'},
                   {'title':'兔子','url':'tuzi.gif'},
                   {'title':'喔克','url':'ok.gif'},
                   {'title':'耶','url':'ye.gif'},
                   {'title':'棒棒','url':'good.gif'},
                   {'title':'不','url':'no.gif'},
                   {'title':'赞','url':'zan.gif'},
                   {'title':'来','url':'lai.gif'},
                   {'title':'弱','url':'ruo.gif'},
                   {'title':'草泥马','url':'caonima.gif'},
                   {'title':'神马','url':'shenma.gif'},
                   {'title':'囧','url':'jiong.gif'},
                   {'title':'浮云','url':'fuyun.gif'},
                   {'title':'给力','url':'geili.gif'},
                   {'title':'围观','url':'weiguan.gif'},
                   {'title':'威武','url':'weiwu.gif'},
                   {'title':'话筒','url':'huatong.gif'},
                   {'title':'蜡烛','url':'lazhu.gif'},
                   {'title':'蛋糕','url':'dangao.gif'},
                   {'title':'发红包','url':'fahongbao.gif'}
                ]
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    choseEmoji:function(inner){
              this.textarea +='[' + inner + ']';
    },
    analyzeEmoji:function(cont){//编译表情替换成图片展示出来
              var pattern1 = /\[[\u4e00-\u9fa5]+\]/g;
                var pattern2 = /\[[\u4e00-\u9fa5]+\]/;
                var content = cont.match(pattern1);
                var str = cont;
                if(content){
                    for(var i=0;i<content.length;i++){
                        for(var j=0;j<this.OwOlist.length;j++){
                            if("["+this.OwOlist[j].title +"]" == content[i]){
                                var src = this.OwOlist[j].url;
                                break;
                            }
                        }
                        str = str.replace(pattern2,'<img src="http://39.105.221.186:80/'+src+'"/>');
                    }
                    // console.log(str);
                }
                return str;
    },
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
.OwO {
  position: relative;
  z-index: 1;
}

.OwO .OwO-logo {
  position: relative;
  border-radius: 4px;
  color: #444;
  display: inline-block;
  background: #fff;
  border: 1px solid #ddd;
  font-size: 13px;
  padding: 0 6px;
  cursor: pointer;
  height: 30px;
  box-sizing: border-box;
  z-index: 2;
  line-height: 30px;
}

.OwO .OwO-logo:hover {
  animation: a 5s infinite ease-in-out;
  -webkit-animation: a 5s infinite ease-in-out;
}

.OwO .OwO-body {
  position: absolute;
  background: #fff;
  border: 1px solid #ddd;
  z-index: 1;
  top: 29px;
  border-radius: 0 4px 4px 4px;
  display: none;
}

.OwO-open .OwO-body {
  display: block;
}

.OwO-open .OwO-logo {
  border-radius: 4px 4px 0 0;
  border-bottom: none;
}

.OwO-open .OwO-logo:hover {
  animation: none;
  -webkit-animation: none;
}

.OwO .OwO-items {
  max-height: 197px;
  overflow: scroll;
  font-size: 0;
  padding: 10px;
  z-index: 1
}

.OwO .OwO-items .OwO-item {
  background: #f7f7f7;
  padding: 5px 10px;
  border-radius: 5px;
  display: inline-block;
  margin: 0 10px 12px 0;
  transition: 0.3s;
  line-height: 19px;
  font-size: 20px;
  cursor: pointer;
}

.OwO .OwO-items .OwO-item:hover {
  background: #eee;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14),
    0 3px 1px -2px rgba(0, 0, 0, .2),
    0 1px 5px 0 rgba(0, 0, 0, .12);
  animation: a 5s infinite ease-in-out;
  -webkit-animation: a 5s infinite ease-in-out;
}

.OwO .OwO-body .OwO-bar {
  width: 100%;
  height: 30px;
  border-top: 1px solid #ddd;
  background: #fff;
  border-radius: 0 0 4px 4px;
  color: #444;
}

.OwO .OwO-body .OwO-bar .OwO-packages li {
  display: inline-block;
  line-height: 30px;
  font-size: 14px;
  padding: 0 10px;
  cursor: pointer;
  margin-right: 3px;
  text-align: center;
}

.OwO .OwO-body .OwO-bar .OwO-packages li:first-of-type {
  border-radius: 0 0 0 3px;
}

@-webkit-keyframes a {
  2% {
    -webkit-transform: translateY(1.5px) rotate(1.5deg);
    transform: translateY(1.5px) rotate(1.5deg)
  }

  4% {
    -webkit-transform: translateY(-1.5px) rotate(-.5deg);
    transform: translateY(-1.5px) rotate(-.5deg)
  }

  6% {
    -webkit-transform: translateY(1.5px) rotate(-1.5deg);
    transform: translateY(1.5px) rotate(-1.5deg)
  }

  8% {
    -webkit-transform: translateY(-1.5px) rotate(-1.5deg);
    transform: translateY(-1.5px) rotate(-1.5deg)
  }

  10% {
    -webkit-transform: translateY(2.5px) rotate(1.5deg);
    transform: translateY(2.5px) rotate(1.5deg)
  }

  12% {
    -webkit-transform: translateY(-.5px) rotate(1.5deg);
    transform: translateY(-.5px) rotate(1.5deg)
  }

  14% {
    -webkit-transform: translateY(-1.5px) rotate(1.5deg);
    transform: translateY(-1.5px) rotate(1.5deg)
  }

  16% {
    -webkit-transform: translateY(-.5px) rotate(-1.5deg);
    transform: translateY(-.5px) rotate(-1.5deg)
  }

  18% {
    -webkit-transform: translateY(.5px) rotate(-1.5deg);
    transform: translateY(.5px) rotate(-1.5deg)
  }

  20% {
    -webkit-transform: translateY(-1.5px) rotate(2.5deg);
    transform: translateY(-1.5px) rotate(2.5deg)
  }

  22% {
    -webkit-transform: translateY(.5px) rotate(-1.5deg);
    transform: translateY(.5px) rotate(-1.5deg)
  }

  24% {
    -webkit-transform: translateY(1.5px) rotate(1.5deg);
    transform: translateY(1.5px) rotate(1.5deg)
  }

  26% {
    -webkit-transform: translateY(.5px) rotate(.5deg);
    transform: translateY(.5px) rotate(.5deg)
  }

  28% {
    -webkit-transform: translateY(.5px) rotate(1.5deg);
    transform: translateY(.5px) rotate(1.5deg)
  }

  30% {
    -webkit-transform: translateY(-.5px) rotate(2.5deg);
    transform: translateY(-.5px) rotate(2.5deg)
  }

  32%,
  34% {
    -webkit-transform: translateY(1.5px) rotate(-.5deg);
    transform: translateY(1.5px) rotate(-.5deg)
  }

  36% {
    -webkit-transform: translateY(-1.5px) rotate(2.5deg);
    transform: translateY(-1.5px) rotate(2.5deg)
  }

  38% {
    -webkit-transform: translateY(1.5px) rotate(-1.5deg);
    transform: translateY(1.5px) rotate(-1.5deg)
  }

  40% {
    -webkit-transform: translateY(-.5px) rotate(2.5deg);
    transform: translateY(-.5px) rotate(2.5deg)
  }

  42% {
    -webkit-transform: translateY(2.5px) rotate(-1.5deg);
    transform: translateY(2.5px) rotate(-1.5deg)
  }

  44% {
    -webkit-transform: translateY(1.5px) rotate(.5deg);
    transform: translateY(1.5px) rotate(.5deg)
  }

  46% {
    -webkit-transform: translateY(-1.5px) rotate(2.5deg);
    transform: translateY(-1.5px) rotate(2.5deg)
  }

  48% {
    -webkit-transform: translateY(-.5px) rotate(.5deg);
    transform: translateY(-.5px) rotate(.5deg)
  }

  50% {
    -webkit-transform: translateY(.5px) rotate(.5deg);
    transform: translateY(.5px) rotate(.5deg)
  }

  52% {
    -webkit-transform: translateY(2.5px) rotate(2.5deg);
    transform: translateY(2.5px) rotate(2.5deg)
  }

  54% {
    -webkit-transform: translateY(-1.5px) rotate(1.5deg);
    transform: translateY(-1.5px) rotate(1.5deg)
  }

  56% {
    -webkit-transform: translateY(2.5px) rotate(2.5deg);
    transform: translateY(2.5px) rotate(2.5deg)
  }

  58% {
    -webkit-transform: translateY(.5px) rotate(2.5deg);
    transform: translateY(.5px) rotate(2.5deg)
  }

  60% {
    -webkit-transform: translateY(2.5px) rotate(2.5deg);
    transform: translateY(2.5px) rotate(2.5deg)
  }

  62% {
    -webkit-transform: translateY(-.5px) rotate(2.5deg);
    transform: translateY(-.5px) rotate(2.5deg)
  }

  64% {
    -webkit-transform: translateY(-.5px) rotate(1.5deg);
    transform: translateY(-.5px) rotate(1.5deg)
  }

  66% {
    -webkit-transform: translateY(1.5px) rotate(-.5deg);
    transform: translateY(1.5px) rotate(-.5deg)
  }

  68% {
    -webkit-transform: translateY(-1.5px) rotate(-.5deg);
    transform: translateY(-1.5px) rotate(-.5deg)
  }

  70% {
    -webkit-transform: translateY(1.5px) rotate(.5deg);
    transform: translateY(1.5px) rotate(.5deg)
  }

  72% {
    -webkit-transform: translateY(2.5px) rotate(1.5deg);
    transform: translateY(2.5px) rotate(1.5deg)
  }

  74% {
    -webkit-transform: translateY(-.5px) rotate(.5deg);
    transform: translateY(-.5px) rotate(.5deg)
  }

  76% {
    -webkit-transform: translateY(-.5px) rotate(2.5deg);
    transform: translateY(-.5px) rotate(2.5deg)
  }

  78% {
    -webkit-transform: translateY(-.5px) rotate(1.5deg);
    transform: translateY(-.5px) rotate(1.5deg)
  }

  80% {
    -webkit-transform: translateY(1.5px) rotate(1.5deg);
    transform: translateY(1.5px) rotate(1.5deg)
  }

  82% {
    -webkit-transform: translateY(-.5px) rotate(.5deg);
    transform: translateY(-.5px) rotate(.5deg)
  }

  84% {
    -webkit-transform: translateY(1.5px) rotate(2.5deg);
    transform: translateY(1.5px) rotate(2.5deg)
  }

  86% {
    -webkit-transform: translateY(-1.5px) rotate(-1.5deg);
    transform: translateY(-1.5px) rotate(-1.5deg)
  }

  88% {
    -webkit-transform: translateY(-.5px) rotate(2.5deg);
    transform: translateY(-.5px) rotate(2.5deg)
  }

  90% {
    -webkit-transform: translateY(2.5px) rotate(-.5deg);
    transform: translateY(2.5px) rotate(-.5deg)
  }

  92% {
    -webkit-transform: translateY(.5px) rotate(-.5deg);
    transform: translateY(.5px) rotate(-.5deg)
  }

  94% {
    -webkit-transform: translateY(2.5px) rotate(.5deg);
    transform: translateY(2.5px) rotate(.5deg)
  }

  96% {
    -webkit-transform: translateY(-.5px) rotate(1.5deg);
    transform: translateY(-.5px) rotate(1.5deg)
  }

  98% {
    -webkit-transform: translateY(-1.5px) rotate(-.5deg);
    transform: translateY(-1.5px) rotate(-.5deg)
  }

  0%,
  to {
    -webkit-transform: translate(0) rotate(0deg);
    transform: translate(0) rotate(0deg)
  }
}

@keyframes a {
  2% {
    -webkit-transform: translateY(1.5px) rotate(1.5deg);
    transform: translateY(1.5px) rotate(1.5deg)
  }

  4% {
    -webkit-transform: translateY(-1.5px) rotate(-.5deg);
    transform: translateY(-1.5px) rotate(-.5deg)
  }

  6% {
    -webkit-transform: translateY(1.5px) rotate(-1.5deg);
    transform: translateY(1.5px) rotate(-1.5deg)
  }

  8% {
    -webkit-transform: translateY(-1.5px) rotate(-1.5deg);
    transform: translateY(-1.5px) rotate(-1.5deg)
  }

  10% {
    -webkit-transform: translateY(2.5px) rotate(1.5deg);
    transform: translateY(2.5px) rotate(1.5deg)
  }

  12% {
    -webkit-transform: translateY(-.5px) rotate(1.5deg);
    transform: translateY(-.5px) rotate(1.5deg)
  }

  14% {
    -webkit-transform: translateY(-1.5px) rotate(1.5deg);
    transform: translateY(-1.5px) rotate(1.5deg)
  }

  16% {
    -webkit-transform: translateY(-.5px) rotate(-1.5deg);
    transform: translateY(-.5px) rotate(-1.5deg)
  }

  18% {
    -webkit-transform: translateY(.5px) rotate(-1.5deg);
    transform: translateY(.5px) rotate(-1.5deg)
  }

  20% {
    -webkit-transform: translateY(-1.5px) rotate(2.5deg);
    transform: translateY(-1.5px) rotate(2.5deg)
  }

  22% {
    -webkit-transform: translateY(.5px) rotate(-1.5deg);
    transform: translateY(.5px) rotate(-1.5deg)
  }

  24% {
    -webkit-transform: translateY(1.5px) rotate(1.5deg);
    transform: translateY(1.5px) rotate(1.5deg)
  }

  26% {
    -webkit-transform: translateY(.5px) rotate(.5deg);
    transform: translateY(.5px) rotate(.5deg)
  }

  28% {
    -webkit-transform: translateY(.5px) rotate(1.5deg);
    transform: translateY(.5px) rotate(1.5deg)
  }

  30% {
    -webkit-transform: translateY(-.5px) rotate(2.5deg);
    transform: translateY(-.5px) rotate(2.5deg)
  }

  32%,
  34% {
    -webkit-transform: translateY(1.5px) rotate(-.5deg);
    transform: translateY(1.5px) rotate(-.5deg)
  }

  36% {
    -webkit-transform: translateY(-1.5px) rotate(2.5deg);
    transform: translateY(-1.5px) rotate(2.5deg)
  }

  38% {
    -webkit-transform: translateY(1.5px) rotate(-1.5deg);
    transform: translateY(1.5px) rotate(-1.5deg)
  }

  40% {
    -webkit-transform: translateY(-.5px) rotate(2.5deg);
    transform: translateY(-.5px) rotate(2.5deg)
  }

  42% {
    -webkit-transform: translateY(2.5px) rotate(-1.5deg);
    transform: translateY(2.5px) rotate(-1.5deg)
  }

  44% {
    -webkit-transform: translateY(1.5px) rotate(.5deg);
    transform: translateY(1.5px) rotate(.5deg)
  }

  46% {
    -webkit-transform: translateY(-1.5px) rotate(2.5deg);
    transform: translateY(-1.5px) rotate(2.5deg)
  }

  48% {
    -webkit-transform: translateY(-.5px) rotate(.5deg);
    transform: translateY(-.5px) rotate(.5deg)
  }

  50% {
    -webkit-transform: translateY(.5px) rotate(.5deg);
    transform: translateY(.5px) rotate(.5deg)
  }

  52% {
    -webkit-transform: translateY(2.5px) rotate(2.5deg);
    transform: translateY(2.5px) rotate(2.5deg)
  }

  54% {
    -webkit-transform: translateY(-1.5px) rotate(1.5deg);
    transform: translateY(-1.5px) rotate(1.5deg)
  }

  56% {
    -webkit-transform: translateY(2.5px) rotate(2.5deg);
    transform: translateY(2.5px) rotate(2.5deg)
  }

  58% {
    -webkit-transform: translateY(.5px) rotate(2.5deg);
    transform: translateY(.5px) rotate(2.5deg)
  }

  60% {
    -webkit-transform: translateY(2.5px) rotate(2.5deg);
    transform: translateY(2.5px) rotate(2.5deg)
  }

  62% {
    -webkit-transform: translateY(-.5px) rotate(2.5deg);
    transform: translateY(-.5px) rotate(2.5deg)
  }

  64% {
    -webkit-transform: translateY(-.5px) rotate(1.5deg);
    transform: translateY(-.5px) rotate(1.5deg)
  }

  66% {
    -webkit-transform: translateY(1.5px) rotate(-.5deg);
    transform: translateY(1.5px) rotate(-.5deg)
  }

  68% {
    -webkit-transform: translateY(-1.5px) rotate(-.5deg);
    transform: translateY(-1.5px) rotate(-.5deg)
  }

  70% {
    -webkit-transform: translateY(1.5px) rotate(.5deg);
    transform: translateY(1.5px) rotate(.5deg)
  }

  72% {
    -webkit-transform: translateY(2.5px) rotate(1.5deg);
    transform: translateY(2.5px) rotate(1.5deg)
  }

  74% {
    -webkit-transform: translateY(-.5px) rotate(.5deg);
    transform: translateY(-.5px) rotate(.5deg)
  }

  76% {
    -webkit-transform: translateY(-.5px) rotate(2.5deg);
    transform: translateY(-.5px) rotate(2.5deg)
  }

  78% {
    -webkit-transform: translateY(-.5px) rotate(1.5deg);
    transform: translateY(-.5px) rotate(1.5deg)
  }

  80% {
    -webkit-transform: translateY(1.5px) rotate(1.5deg);
    transform: translateY(1.5px) rotate(1.5deg)
  }

  82% {
    -webkit-transform: translateY(-.5px) rotate(.5deg);
    transform: translateY(-.5px) rotate(.5deg)
  }

  84% {
    -webkit-transform: translateY(1.5px) rotate(2.5deg);
    transform: translateY(1.5px) rotate(2.5deg)
  }

  86% {
    -webkit-transform: translateY(-1.5px) rotate(-1.5deg);
    transform: translateY(-1.5px) rotate(-1.5deg)
  }

  88% {
    -webkit-transform: translateY(-.5px) rotate(2.5deg);
    transform: translateY(-.5px) rotate(2.5deg)
  }

  90% {
    -webkit-transform: translateY(2.5px) rotate(-.5deg);
    transform: translateY(2.5px) rotate(-.5deg)
  }

  92% {
    -webkit-transform: translateY(.5px) rotate(-.5deg);
    transform: translateY(.5px) rotate(-.5deg)
  }

  94% {
    -webkit-transform: translateY(2.5px) rotate(.5deg);
    transform: translateY(2.5px) rotate(.5deg)
  }

  96% {
    -webkit-transform: translateY(-.5px) rotate(1.5deg);
    transform: translateY(-.5px) rotate(1.5deg)
  }

  98% {
    -webkit-transform: translateY(-1.5px) rotate(-.5deg);
    transform: translateY(-1.5px) rotate(-.5deg)
  }

  0%,
  to {
    -webkit-transform: translate(0) rotate(0deg);
    transform: translate(0) rotate(0deg)
  }
}

</style>
