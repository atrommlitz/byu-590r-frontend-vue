import movieService from '../services/MovieService'

const initialState = {
  movies: [],
  movie: {
    title: '',
    year: new Date().getFullYear(),
    genre: '',
    file: '',
    movie_length: 0,
  },
}

export const movies = {
  namespaced: true,
  state: initialState,
  actions: {
    fetchMovies({ commit }) {
      return movieService.getAllMovies().then(
        (movies) => {
          commit('setMovies', movies)
          return Promise.resolve(movies)
        },
        (response) => {
          return Promise.resolve(response)
        }
      )
    },
    createMovie({ commit }, movieData) {
      return movieService.createMovie(movieData).then(
        (movie) => {
          commit('addMovie', movie)
          return Promise.resolve(movie)
        },
        (response) => {
          return Promise.resolve(response)
        }
      )
    },
    getMovie({ commit }, id) {
      return movieService.getMovie(id).then(
        (movie) => {
          commit('setMovie', movie)
          return Promise.resolve(movie)
        },
        (response) => {
          return Promise.resolve(response)
        }
      )
    },
    updateMovie({ commit }, { id, movieData }) {
      return movieService.updateMovie(id, movieData).then(
        (movie) => {
          commit('updateMovie', movie)
          return Promise.resolve(movie)
        },
        (response) => {
          return Promise.resolve(response)
        }
      )
    },
    deleteMovie({ commit }, id) {
      return movieService.deleteMovie(id).then(
        () => {
          commit('removeMovie', id)
          return Promise.resolve()
        },
        (response) => {
          return Promise.resolve(response)
        }
      )
    },
  },
  mutations: {
    setMovies(state, movies) {
      state.movies = movies
    },
    setMovie(state, movie) {
      state.movie = movie
    },
    addMovie(state, movie) {
      state.movies.push(movie)
    },
    updateMovie(state, movie) {
      const index = state.movies.findIndex((m) => m.id === movie.id)
      if (index !== -1) {
        state.movies.splice(index, 1, movie)
      }
    },
    removeMovie(state, id) {
      state.movies = state.movies.filter((movie) => movie.id !== id)
    },
  },
  getters: {
    getMovies: (state) => {
      return state.movies
    },
    getMovie: (state) => {
      return state.movie
    },
  },
}
