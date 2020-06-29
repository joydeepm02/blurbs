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
      <ul v-if="existsKeywords" class="list-group">
        <li v-for="(keywordObj, index) in keywords" v-bind:key="index" class="list-group-item d-flex justify-content-between align-items-center">
          {{ keywordObj.keyword }}
          <button @click="deleteKeyword(index)" type="button" class="close">
            <span aria-hidden="true">&times;</span>
          </button>
        </li>
      </ul>
      <small v-else class="text-muted">Add keywords to view more content.</small>
    </div>
    <div class="card-footer">
      <form action="#" @submit.prevent="getNewBlurb">
        <button class="btn btn-primary">Get More Content</button>
      </form>
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
    existsKeywords() {
      return this.$store.getters.existsKeywords
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
    },
    getNewBlurb() {
      this.$store.dispatch('getNewBlurb')
      .then(response => {
      })
    }
  }
}
</script>
