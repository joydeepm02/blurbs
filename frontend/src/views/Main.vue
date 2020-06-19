<template>
  <div class="main">
    <Navbar />
    <div class="row">
        <Sidebar />
        <Feed />
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar.vue'
import Feed from '../components/Feed.vue'

export default {
  name: 'Main',
  components: {
    Navbar,
    Sidebar,
    Feed
  }  
}
</script>