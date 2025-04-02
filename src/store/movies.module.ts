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
        (error) => Promise.reject(error)
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
      console.log('Store updateMovie action:', { id, movieData })
      return movieService
        .updateMovie(id, movieData)
        .then((movie) => {
          console.log('Update successful, committing:', movie)
          commit('updateMovie', movie)
          return Promise.resolve(movie)
        })
        .catch((error) => {
          console.error('Store update error:', error)
          return Promise.reject(error)
        })
    },
    deleteMovie({ commit }, id) {
      return movieService.deleteMovie(id).then(
        () => {
          commit('deleteMovie', id)
          return Promise.resolve()
        },
        (error) => Promise.reject(error)
      )
    },
  },
  mutations: {
    setMovies(state, movies) {
      state.movies = [...movies]
    },
    setMovie(state, movie) {
      state.movie = movie
    },
    addMovie(state, movie) {
      state.movies.push(movie)
    },
    updateMovie(state, updatedMovie) {
      const index = state.movies.findIndex((movie) => movie.id === updatedMovie.id)
      if (index !== -1) {
        const updatedMovies = [...state.movies]
        updatedMovies[index] = { ...updatedMovie }
        state.movies = updatedMovies
      }
    },
    deleteMovie(state, movieId) {
      state.movies = state.movies.filter((movie) => movie.id !== movieId)
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
