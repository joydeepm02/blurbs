<template>
  <div v-if="!loggedIn" class="card shadow border border-primary">
    <div class="card-body">
      <h5 class="card-title">Login</h5>
      <form action="#" @submit.prevent="login">
        <div class="form-group">
          <label for="usernameInput">Username</label>
          <input v-model="username" type="text" class="form-control" id="usernameInput" aria-describedby="emailHelp" placeholder="Username">
        </div>
        <div class="form-group">
          <label for="passwordInput">Password</label>
          <input v-model="password" type="password" class="form-control" id="passwordInput" placeholder="Password">
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      this.$store.dispatch('retrieveToken', {
        username: this.username,
        password: this.password
      })
      .then(response => {
        // Clear out form fields (no page refresh)
        this.username = ''
        this.password = ''
        // Page refresh
        // this.$router.push({ name : 'Main' }) // or '/'
      })
    }
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    }
  }
}
</script>