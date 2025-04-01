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
    const formData = new FormData()
    formData.append('file', movieData.file)
    formData.append('title', movieData.title)
    formData.append('year', movieData.year.toString())
    formData.append('genre', movieData.genre)
    formData.append('movie_length', movieData.movie_length.toString())

    return axios
      .post(API_URL + 'movies', formData, {
        headers: authHeader('multipart'),
      })
      .then((response) => response.data.results)
  }

  getMovie(id) {
    return axios.get(API_URL + 'movies/' + id, { headers: authHeader() }).then((response) => {
      return response.data.results
    })
  }

  updateMovie(id, movieData) {
    const formData = new FormData()
    if (movieData.file && movieData.file instanceof File) {
      formData.append('file', movieData.file)
    }
    formData.append('title', movieData.title)
    formData.append('year', movieData.year.toString())
    formData.append('genre', movieData.genre)
    formData.append('movie_length', movieData.movie_length.toString())

    return axios
      .put(API_URL + `movies/${id}`, formData, {
        headers: {
          ...authHeader(),
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => response.data.results)
      .catch((error) => {
        console.error('Update movie error:', error)
        throw error
      })
  }

  deleteMovie(id) {
    return axios
      .delete(API_URL + `movies/${id}`, {
        headers: authHeader(),
      })
      .then((response) => response.data.results)
  }
}

const movieService = new MovieService()
export default movieService
