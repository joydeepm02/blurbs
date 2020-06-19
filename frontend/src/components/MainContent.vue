<template>
  <div class="col-8">
    <About />
    <Feed />
  </div>
</template>

<script>
import About from './About'
import Feed from './Feed'

export default {
  name: 'MainContent',
  components: {
    About,
    Feed
  },
}
</script>