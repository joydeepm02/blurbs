<template>
  <div class="col-4">
    <LoginRegister />
    <Keywords />
    <Logout />
  </div>
</template>

<script>
import LoginRegister from './LoginRegister'
import Keywords from './Keywords'
import Logout from './Logout'

export default {
  name: 'Sidebar',
  components: {
    LoginRegister,
    Keywords,
    Logout
  },
}
</script>