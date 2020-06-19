<template>
  <div v-if="loggedIn" class="card shadow border border-primary">
    <div class="card-body">
      <h5 class="card-title">Welcome back, {{ user.first_name }}!</h5>
      <h6 class="card-subtitle mb-2 text-muted">{{ user.username }}</h6>
      <form action="#" @submit.prevent="logout">
        <button type="submit" class="btn btn-primary">Logout</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Logout',
  methods: {
    logout() {
      this.$store.dispatch('destroyToken')
      .then(response => {
        // Clear out form fields (no page refresh)
        // Page refresh
        // this.$router.push({ name : 'Main' }) // or '/'
      })
    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    },
    ...mapState([
      'user'
    ])
  }
}
</script>