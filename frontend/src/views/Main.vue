<template>
  <div class="main">
    <Navbar />
    <div class="row">
      <Sidebar />
      <MainContent />
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar.vue'
import MainContent from '../components/MainContent.vue'

export default {
  name: 'Main',
  components: {
    Navbar,
    Sidebar,
    MainContent
  }  
}
</script>