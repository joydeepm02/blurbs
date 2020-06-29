<template>
  <div>
    <div v-if="existsBlurbs">
      <div class="row" v-for="i in Math.ceil(blurbs.length / 2)" v-bind:key="i">
        <div v-for="(blurb, index) in blurbs.slice((i - 1) * 2, i * 2)" v-bind:key="index" class="card m-3 shadow border border-primary">
          <img :src="`${blurb.image}`" class="card-img-top" alt="...">
          <div class="card-header">
            {{ blurb.source }}
          </div>
          <div class="card-body"> <!-- d-flex align-items-center"> -->
            <h5 class="card-title">{{ blurb.title }}</h5>
            <a target="_blank" :href="`${blurb.link}`" class="btn btn-outline-secondary mr-2" role="button">View</a>
            <button class="btn btn-outline-primary mr-2" role="button">Favorite</button>
            <button class="btn btn-outline-danger mr-2" role="button">Delete</button>
          </div>
        </div>
      </div>
    </div>
    <small v-else class="text-muted">It's empty in here...</small>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'LiveFeed',
  computed: {
    ...mapState([
      'blurbs'
    ]),
    existsBlurbs() {
      return this.$store.getters.existsBlurbs
    },
  },
}
</script>

<style>
.card-img-top {
    width: 100%;
    height: 10vw;
    object-fit: cover;
}
</style>
