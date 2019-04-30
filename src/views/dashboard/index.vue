<template>
  <div class="dashboard-container">
   
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
 
  data() {
    return {     
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin-top: 3%;
    margin-left: 2.5%;
    width:95%;
    height:80%;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>