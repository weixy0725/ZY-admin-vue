<template>
  <div class="dashboard-container">
    <el-row>
      <el-col :span="5" :offset="5">
        <div style="text-align:center">
        <img style="padding-top:5%" src="@/assets/edit-tools.png" @click="goWrite">
        <h4>写 作</h4>
        </div>
      </el-col>
      <el-col :span="5" :offset="5">
        <div style="text-align:center">
        <img class="" src="@/assets/checklist.png" @click="goTable()">
        <h4 style="padding-top:5%">文章管理</h4>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SvgIcon from "@/components/SvgIcon";
export default {
  name: "Dashboard",

  data() {
    return {};
  },
  methods:{
    goTable(){
       this.$router.push("/table/table");
    },
    goWrite(){
      this.$router.push("/writing/writing");
    }

  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin-top: 15%;
    margin-left: 2.5%;
    width: 95%;
    height: 80%;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>