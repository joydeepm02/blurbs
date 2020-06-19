<template>
  <div>
    <form action="#" @submit.prevent="register">
      <div class="form-group">
        <label for="firstNameInput">First Name</label>
        <input v-model="firstname" type="text" class="form-control" id="firstNameInput" placeholder="First Name">
      </div>
      <div class="form-group">
        <label for="lastNameInput">Last Name</label>
        <input v-model="lastname" type="text" class="form-control" id="lastNameInput" placeholder="Last Name">
      </div>
      <div class="form-group">
        <label for="emailInput">Email address</label>
        <input v-model="email" type="email" class="form-control" id="emailInput" placeholder="Enter email">
      </div>
      <div class="form-group">
        <label for="registerUsernameInput">Username</label>
        <input v-model="username" type="text" class="form-control" id="registerUsernameInput" placeholder="Username">
      </div>
      <div class="form-group">
        <label for="registerPasswordInput">Password</label>
        <input v-model="password" type="password" class="form-control" id="registerPasswordInput" placeholder="Password">
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      firstname: '',
      lastname: '',
      email: '',
      username: '',
      password: ''
    }
  },
  methods: {
    register() {
      this.$store.dispatch('register', {
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        username: this.username,
        password: this.password
      })
      .then(response => {
        // Redirect to Login tab?
        // Clear out form fields (no page refresh)
        this.firstname = ''
        this.lastname = ''
        this.email = ''
        this.username = ''
        this.password = ''
        // Page refresh
        // this.$router.push('/') // or '/'
      })
    }
  },
}
</script>