<template>
  <div v-if="loggedIn" class="card shadow border border-primary">
    <div class="card-body">
      <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" id="pills-livefeed-tab" data-toggle="pill" href="#pills-livefeed" role="tab" aria-controls="pills-livefeed" aria-selected="true">Live Feed</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" id="pills-community-tab" data-toggle="pill" href="#pills-community" role="tab" aria-controls="pills-community" aria-selected="false">Community</a>
        </li>
      </ul>
      <div class="tab-content" id="pills-tabContent">
        <div class="tab-pane fade show active" id="pills-livefeed" role="tabpanel" aria-labelledby="pills-livefeed-tab">
          <LiveFeed />
        </div>
        <div class="tab-pane fade" id="pills-community" role="tabpanel" aria-labelledby="pills-community-tab">
          <Community />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LiveFeed from './LiveFeed'
import Community from './Community'

export default {
  name: 'Feed',
  components: {
    LiveFeed,
    Community
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    }
  }
}
</script>