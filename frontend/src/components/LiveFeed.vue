<template>
  <div>
    <div v-if="existsBlurbs">
      <div class="row" v-for="i in Math.ceil(blurbs.length / 2)" v-bind:key="i">
        <div v-if="!blurb.hidden" v-for="(blurb, index) in blurbs.slice((i - 1) * 2, i * 2)" v-bind:key="index" class="card m-3 shadow border border-primary">
          <div class="pickgradient">
            <img :src="`${blurb.image}`" class="card-img-top" alt="...">
          </div>
          <div class="card-header">
            {{ blurb.source }}
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ blurb.title }}</h5>
            <a target="_blank" :href="`${blurb.link}`" class="btn btn-outline-secondary mr-2" role="button">View</a>
            <button class="btn btn-outline-primary mr-2" role="button">Favorite</button>
            <button @click="deleteBlurb(blurb.id)" class="btn btn-outline-danger mr-2" role="button">Delete</button>
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
  methods: {
    deleteBlurb(blurbId) {
      this.$store.dispatch('deleteBlurb', {
        id: blurbId
      })
    },
  },
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

.pickgradient{
  position:relative;
  display:inline-block;
}
.pickgradient:after {
  content:'';
  position:absolute;
  left:0; top:0;
  width:100%; height:100%;
  display:inline-block;
  background: -moz-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%); /* FF3.6+ */
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(0,0,0,0.65)), color-stop(100%,rgba(0,0,0,0))); /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.6) 100%); /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.6) 100%); /* Opera 11.10+ */
  background: -ms-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.6) 100%); /* IE10+ */
  background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.6) 100%); /* W3C */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#a6000000', endColorstr='#00000000',GradientType=0 ); /* IE6-9 */
}
</style>
