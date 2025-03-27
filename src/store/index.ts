import { createStore } from 'vuex'
import { auth } from './auth.module'
import { user } from './user.module'
import { movies } from './movies.module'

const store = createStore({
  modules: {
    auth,
    user,
    movies,
  },
})

export default store
