<template>
  <div>
    <form action="#" @submit.prevent="getNewBlurb">
      <button class="btn btn-success">Get More Content</button>
    </form>
    <div class="row" v-for="i in Math.ceil(blurbs.length / 2)" v-bind:key="i">
      <div v-for="(blurb, index) in blurbs.slice((i - 1) * 2, i * 2)" v-bind:key="index" class="card m-3 shadow border border-primary">
        <img :src="`${blurb.image}`" class="card-img-top" alt="...">
        <div class="card-header">
          {{ blurb.source }}
        </div>
        <div class="card-body">
          <h5 class="card-title">{{ blurb.title }}</h5>
          <a target="_blank" :href="`${blurb.link}`" class="btn btn-primary">View</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'LiveFeed',
  computed: {
    ...mapState([
      'blurbs'
    ])
  },
  methods: {
    getNewBlurb() {
      this.$store.dispatch('getNewBlurb')
      .then(response => {
      })
    }
  }
}
</script>

<style>
.card-img-top {
    width: 100%;
    height: 10vw;
    object-fit: cover;
}
</style>
