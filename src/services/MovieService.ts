import axios from 'axios'
import API_URL from './env'
import authHeader from './auth-header'

class MovieService {
  getAllMovies() {
    return axios.get(API_URL + 'movies', { headers: authHeader() }).then((response) => {
      return response.data.results
    })
  }

  createMovie(movieData) {
    return axios.post(API_URL + 'movies', movieData, { headers: authHeader() }).then((response) => {
      return response.data.results
    })
  }

  getMovie(id) {
    return axios.get(API_URL + 'movies/' + id, { headers: authHeader() }).then((response) => {
      return response.data.results
    })
  }

  updateMovie(id, movieData) {
    return axios
      .put(API_URL + 'movies/' + id, movieData, { headers: authHeader() })
      .then((response) => {
        return response.data.results
      })
  }

  deleteMovie(id) {
    return axios.delete(API_URL + 'movies/' + id, { headers: authHeader() }).then((response) => {
      return response.data.results
    })
  }
}

const movieService = new MovieService()
export default movieService
