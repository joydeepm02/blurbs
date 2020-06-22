import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

axios.defaults.xsrfHeaderName = "X-CSRFToken"
axios.defaults.xsrfCookieName = 'csrftoken'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // Get login token from locl storage OR initialize as null
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    cookie: localStorage.getItem('cookie') || null,
    keywords: JSON.parse(localStorage.getItem('keywords')) || null,
    blurbs: [],
  },
  getters: {
    loggedIn(state) {
      return state.token != null && state.user != null
    }
  },
  mutations: {
    retrieveToken(state, token) {
      state.token = token
    },
    destroyToken(state) {
      state.token = null
    },
    storeUser(state, user) {
      state.user = user
    },
    destroyUser(state) {
      state.user = null
    },
    storeCookie(state, cookie) {
      state.cookie = cookie
    },
    destroyCookie(state,) {
      state.cookie = null
    },
    storeKeywords(state, keywords) {
      state.keywords = keywords
    },
  },
  actions: {
    retrieveToken(context, credentials) {
      return new Promise((resolve, reject) => {
        axios.post('http://127.0.0.1:8000/auth/', {
          username: credentials.username,
          password: credentials.password
        })
        .then(response => {
          const token = response.data.token
          // Store token in local storage
          localStorage.setItem('token', token)
          context.commit('retrieveToken', token)

          const cookie = document.cookie.substring(document.cookie.indexOf('=')+1)
          // Store X-CSRFToken cookie value
          localStorage.setItem('cookie', cookie)
          // Calls retrieveToken mutation
          context.commit('storeCookie', cookie)

          resolve(response)

          // New promise to identify user
          return new Promise((resolve, reject) => {
            // Get current user with Authentication Token
            
            axios.get('http://127.0.0.1:8000/api/users/identify/', {
              headers: {
                'Authorization': `Token ${this.state.token}`
              }
            })
            .then(identificationResponse => {
              const user = {
                id : identificationResponse.data[0].id,
                first_name : identificationResponse.data[0].first_name,
                last_name : identificationResponse.data[0].last_name,
                username : identificationResponse.data[0].username,
                email : identificationResponse.data[0].email
              }
              // Store user in local storage (stringified)
              localStorage.setItem('user', JSON.stringify(user))

              // Calls storeUser mutation
              context.commit('storeUser', user)

              resolve(identificationResponse)

              return new Promise((resolve, reject) => {
                // Get keywords for current user with Authentication Token
                axios.get('http://127.0.0.1:8000/api/keywords/view/', {
                  headers: {
                    'Authorization': `Token ${this.state.token}`
                  }
                })
                .then(keywordResponse => {
                  const keywords = []
                  for (const index in keywordResponse.data) {
                    keywords.push(keywordResponse.data[index])
                  }
                  console.log(keywords)

                  // Store keywords in local storage (stringified)
                  localStorage.setItem('keywords', JSON.stringify(keywords))

                  // Calls storeKeywords mutation
                  context.commit('storeKeywords', keywords)

                  resolve(keywordResponse)
                })
                .catch(keywordError => {
                  console.log(keywordError)
                  reject(keywordError)
                })
              })
            })
            .catch(identificationError => {
              console.log(identificationError)
              reject(identificationError)
            })
          })
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },
    destroyToken(context) {
      if (context.getters.loggedIn) {
        return new Promise((resolve, reject) => {
          // console.log(`${this.state.cookie}`);
          axios.get('http://127.0.0.1:8000/api/api-auth/logout/', {
            headers: {
              'X-CSRFToken': `${this.state.cookie}`
            }
          })
          .then(response => {
            // Remove token from local storage
            localStorage.removeItem('token')
            // Calls destroyToken mutation
            context.commit('destroyToken')

            // Remove user from local storage
            localStorage.removeItem('user')
            // Calls destroyUser mutation
            context.commit('destroyUser')

            // Remove cookie from local storage
            localStorage.removeItem('cookie')
            // Calls destroyCookie mutation
            context.commit('destroyCookie')
            resolve(response)
          })
          .catch(error => {
            // Remove token from local storage
            localStorage.removeItem('token')
            // Calls destroyToken mutation
            context.commit('destroyToken')

            // Remove user from local storage
            localStorage.removeItem('user')
            // Calls destroyUser mutation
            context.commit('destroyUser')

            // Remove cookie from local storage
            localStorage.removeItem('cookie')
            // Calls destroyCookie mutation
            context.commit('destroyCookie')
            reject(error)
          })
        })
      }
    },
    register(context, data) {
      return new Promise((resolve, reject) => {
        axios.post('http://127.0.0.1:8000/api/users/create/', {
          first_name: data.firstname,
          last_name: data.lastname,
          email: data.email,
          username: data.username,
          password: data.password
        })
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },
    addKeyword(context, data) {
      return new Promise((resolve, reject) => {
        axios.post('http://127.0.0.1:8000/api/keywords/create/', {
          keyword: data.keyword,
          user: this.state.user.id
        },
        {
          headers: {
            'Authorization': `Token ${this.state.token}`
          }
        })
        .then(response => {
        resolve(response)
          // Retrieve keyword data to update frontend
          return new Promise((resolve, reject) => {

            axios.get('http://127.0.0.1:8000/api/keywords/view/', {
              headers: {
                'Authorization': `Token ${this.state.token}`
              }
            })
            .then(keywordResponse => {
              const keywords = []
              for (const index in keywordResponse.data) {
                keywords.push(keywordResponse.data[index])
              }
              console.log(keywords)

              // Store keywords in local storage (stringified)
              localStorage.setItem('keywords', JSON.stringify(keywords))

              // Calls storeKeywords mutation
              context.commit('storeKeywords', keywords)

              resolve(keywordResponse)
            })
            .catch(keywordError => {
              console.log(keywordError)
              reject(keywordError)
            })
          })
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },
    deleteKeyword(context, keyword) {
      return new Promise((resolve, reject) => {
        axios.delete('http://127.0.0.1:8000/api/keywords/delete/' + keyword.id, {
          headers: {
            'Authorization': `Token ${this.state.token}`
          }
        })
        .then(response => {
          resolve(response)
            // Retrieve keyword data to update frontend
            return new Promise((resolve, reject) => {
            axios.get('http://127.0.0.1:8000/api/keywords/view/', {
              headers: {
                'Authorization': `Token ${this.state.token}`
              }
            })
            .then(keywordResponse => {
              const keywords = []
              for (const index in keywordResponse.data) {
                keywords.push(keywordResponse.data[index])
              }

              // Store keywords in local storage (stringified)
              localStorage.setItem('keywords', JSON.stringify(keywords))

              // Calls storeKeywords mutation
              context.commit('storeKeywords', keywords)

              resolve(keywordResponse)
            })
            .catch(keywordError => {
              console.log(keywordError)
              reject(keywordError)
            })
          })
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },
    getNewBlurb(context, keyword) {
      // TODO
    }
  },
  modules: {
  }
})