<template>
  <div class="col-4">
    <LoginRegister />
    <Logout />
  </div>
</template>

<script>
import LoginRegister from './LoginRegister'
import Logout from './Logout'

export default {
  name: 'Sidebar',
  components: {
    LoginRegister,
    Logout
  },
}
</script>