<template>
  <div class="col-4">
    <Login />
    <Logout />
  </div>
</template>

<script>
import Login from './Login'
import Logout from './Logout'

export default {
  name: 'Sidebar',
  components: {
    Login,
    Logout
  },
}
</script>