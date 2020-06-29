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
    blurbs: JSON.parse(localStorage.getItem('blurbs')) || null,
    // Success and error messages
    success: false,
    success_message: null,
    error: false,
    error_message: null
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
    destroyCookie(state) {
      state.cookie = null
    },
    storeKeywords(state, keywords) {
      state.keywords = keywords
    },
    storeBlurbs(state, blurbs) {
      state.blurbs = blurbs
    },
    resetMessages(state) {
      state.success = false
      state.success_message = null
      state.error = false;
      state.error_message = null;
    }
  },
  actions: {
    retrieveToken(context, credentials) {
      context.commit('resetMessages')
      return new Promise((resolve, reject) => {
        axios.post('http://127.0.0.1:8000/auth/', {
          username: credentials.username,
          password: credentials.password
        })
        .then(response => {
          this.state.error = false
          this.state.error_message = null

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

                  // Store keywords in local storage (stringified)
                  localStorage.setItem('keywords', JSON.stringify(keywords))

                  // Calls storeKeywords mutation
                  context.commit('storeKeywords', keywords)

                  resolve(keywordResponse)

                  return new Promise((resolve, reject) => {
                    axios.get("http://127.0.0.1:8000/api/blurbs/view/", {
                      headers: {
                        'Authorization': `Token ${this.state.token}`
                      }
                    })
                    .then(blurbResponse => {
                      var userBlurbs = blurbResponse.data
                      // Store blurbs in local storage (stringified)
                      localStorage.setItem('blurbs', JSON.stringify(userBlurbs))

                      // Calls storeBlurbs mutation
                      context.commit('storeBlurbs', userBlurbs)

                      resolve(blurbResponse)
                    })
                    .catch(blurbError => {
                      reject(blurbError)
                    })
                  })
                })
                .catch(keywordError => {
                  reject(keywordError)
                })
              })
            })
            .catch(identificationError => {
              reject(identificationError)
            })
          })
        })
        .catch(error => {
          this.state.error = true
          this.state.error_message = "Your username or password was incorrect. Try again!"
          reject(error)
        })
      })
    },
    destroyToken(context) {
      context.commit('resetMessages')
      if (context.getters.loggedIn) {
        return new Promise((resolve, reject) => {
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
      context.commit('resetMessages')
      return new Promise((resolve, reject) => {
        axios.post('http://127.0.0.1:8000/api/users/create/', {
          first_name: data.firstname,
          last_name: data.lastname,
          email: data.email,
          username: data.username,
          password: data.password
        })
        .then(response => {
          this.state.success = true
          this.state.success_message = "Thank you for registering with Blurbs! You may now log in."
          resolve(response)
        })
        .catch(error => {
          this.state.error = true
          this.state.error_message = "The email or username provided may already be in use. Try again!"
          reject(error)
        })
      })
    },
    addKeyword(context, data) {
      context.commit('resetMessages')
      var conflict = false
      for(var keywordIndex in this.state.keywords) {
        if(data.keyword.toLowerCase() === this.state.keywords[keywordIndex].keyword.toLowerCase()) {
          this.state.error = true
          this.state.error_message = "A keyword with this term has already been created."
          conflict = true
        }
      }
      if(!conflict) {
        context.commit('resetMessages')
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

              // Store keywords in local storage (stringified)
              localStorage.setItem('keywords', JSON.stringify(keywords))

              // Calls storeKeywords mutation
              context.commit('storeKeywords', keywords)

              resolve(keywordResponse)
            })
            .catch(keywordError => {
              reject(keywordError)
            })
          })
        })
        .catch(error => {
          reject(error)
        })
      })
      }
    },
    deleteKeyword(context, keyword) {
      context.commit('resetMessages')
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
              reject(keywordError)
            })
          })
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getNewBlurb(context, keyword) {
      context.commit('resetMessages')
      var numberOfKeywords = Object.keys(this.state.keywords).length
      if(numberOfKeywords == 0) {
        this.state.error = true
        this.state.error_message = "Please provide search keywords to get more content."
      }
      else {
        context.commit('resetMessages')
        // Choose keyword at random
        var keywordIndex = Math.floor((Math.random()*numberOfKeywords))
        var searchFor = this.state.keywords[keywordIndex].keyword
        return new Promise((resolve, reject) => {
        axios.get("https://newsapi.org/v2/everything?q=" + searchFor + "&apiKey=59718915a52e49e195790e93dd55c3d2") // top-headlines
        .then(newsResponse => {
            var relevantArticles = newsResponse.data.articles
            var articleToAdd = null
            for(var articleIndex in relevantArticles) {
              var valid = true
              var article = relevantArticles[articleIndex]
              for(var blurbIndex in this.state.blurbs) {
                var blurb = this.state.blurbs[blurbIndex]
                if(blurb.link === article.url) {
                  valid = false
                  break
                }
              }
              if(valid) {
                articleToAdd = article
                break
              }
            }

            resolve(newsResponse)

            // Send the valid article to our backend to instantiate a Blurb object
            return new Promise((resolve, reject) => {
              axios.post('http://127.0.0.1:8000/api/blurbs/create/', {
                title: articleToAdd.title,
                source: articleToAdd.source.name,
                link: articleToAdd.url,
                image: articleToAdd.urlToImage,
                consumer: this.state.user.id
              },
              {
                headers: {
                  'Authorization': `Token ${this.state.token}`
                }
              })
              .then(blurbCreateResponse => {
                resolve(blurbCreateResponse)

                return new Promise((resolve, reject) => {
                  axios.get("http://127.0.0.1:8000/api/blurbs/view/", {
                    headers: {
                      'Authorization': `Token ${this.state.token}`
                    }
                  })
                  .then(blurbResponse => {
                    var userBlurbs = blurbResponse.data
                    // Store blurbs in local storage (stringified)
                    localStorage.setItem('blurbs', JSON.stringify(userBlurbs))

                    // Calls storeBlurbs mutation
                    context.commit('storeBlurbs', userBlurbs)

                    resolve(blurbResponse)
                  })
                  .catch(blurbError => {
                    reject(blurbError)
                  })
                })
              })
              .catch(blurbCreateError => {
                reject(blurbCreateError)
              })
            })
        })
        .catch(newsError => {
          reject(newsError)
        })
      })
      }
    }
  },
  modules: {
  }
})
