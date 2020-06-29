<template>
  <div class="main">
    <Navbar />
    <div v-show="success" class="alert alert-success" role="alert">
      {{ success_message }}
    </div>
    <div v-show="error" class="alert alert-danger" role="alert">
      {{ error_message }}
    </div>
    <div class="row">
      <Sidebar />
      <MainContent />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar.vue'
import MainContent from '../components/MainContent.vue'

export default {
  name: 'Main',
  components: {
    Navbar,
    Sidebar,
    MainContent
  },
  computed: {
    ...mapState([
      'success',
      'error',
      'success_message',
      'error_message'
    ])
  }
}
</script>
