<template>
  <div v-if="!loggedIn" class="card shadow border border-primary">
    <div class="card-body">
      <h5 class="card-title">Blurbs</h5>
      <h6 class="card-subtitle mb-2 text-muted">Follow what matters.</h6>
      <p class="card-text">Blurbs provides you with a live feed of some of the most recent and relevant articles so you can follow what matters.</p>
      <p class="card-text">Powered by the <a target="_blank" href="https://newsapi.org/">NewsAPI</a>, Blurbs narrows down the content you see with keywords that you provide. It also condenses content such as large articles into bite-sized "Blurb" representations for easy consumption.</p>
      <p class="card-text">Best of all, Blurbs is free and open source! If you have suggestions or want to contribute, feel free to do so on our <a target="_blank" href="https://github.com/joydeepm02/blurbs">GitHub repository</a>.</p>
      <p class="card-text">Join today for free!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  components: {
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    }
  }
}
</script>