<template>
  <div id="app">
    <transition name="el-zoom-in-center" >
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {}
}
</script>

<style>

</style>
