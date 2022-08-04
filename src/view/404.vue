<template>

  <el-result title="404" subTitle="抱歉，请求错误">
    <template slot="icon">
      <el-image style="width: 500px;"
        src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201710%2F15%2F20171015123654_cyWr4.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1644831927&t=dfc03ac07f3441b3deaed440bd8be51a"></el-image>
    </template>
    <template slot="extra">
      <el-button type="primary" size="medium" @click="$router.push('/index')">回到主页</el-button>
    </template>
  </el-result>
</template>
<script>
export default {
  name: "404"
}
</script>

<style scoped>

</style>
