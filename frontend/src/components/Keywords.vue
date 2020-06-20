<template>
  <div v-if="loggedIn" class="card mb-3 shadow border border-primary">
    <div class="card-body">
      <h5 class="card-title">
        Your Search Keywords
        <i class="fas fa-info-circle" title="These keywords will be used to narrow down your search results"></i>
      </h5>
      <form>
        <input class="form-control" type="text" placeholder="Add a Keyword" v-model="newKeyword">
      </form>
      <br>
      <ul class="list-group">
        <li v-for="(keyword, index) in keywords" v-bind:key="index" class="list-group-item">
          {{ keyword }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import About from './About'
import Feed from './Feed'

import { mapState } from 'vuex'

export default {
  name: 'MainContent',
  data() {
    return {
      newKeyword: ''
    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    ...mapState([
      'keywords'
    ])
  }
}
</script>