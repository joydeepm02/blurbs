<template>
  <div v-if="loggedIn" class="card mb-3 shadow border border-primary">
    <div class="card-body">
      <h5 class="card-title">
        Your Search Keywords
        <i class="fas fa-info-circle" title="These keywords will be used to narrow down your search results"></i>
      </h5>
      <form @submit.prevent="addKeyword">
        <input class="form-control" type="text" placeholder="Add a Keyword" v-model="newKeyword">
      </form>
      <br>
      <ul class="list-group">
        <li v-for="(keywordObj, index) in keywords" v-bind:key="index" class="list-group-item">
          {{ keywordObj.keyword }}
          <button @click="deleteKeyword(index)" type="button" class="btn btn-sm btn-outline-danger">
            X
          </button>
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
  },
  methods: {
    addKeyword() {
      this.$store.dispatch('addKeyword', {
        keyword: this.newKeyword
      })
      .then(response => {
        // Clear out form fields (no page refresh)
        this.newKeyword = ''
        // Page refresh
        // this.$router.push({ name : 'Main' }) // or '/'
      })
    },
    deleteKeyword(keywordIndex) {
      this.$store.dispatch('deleteKeyword', {
        id: this.$store.state.keywords[keywordIndex].id
      })
    }
  }
}
</script>