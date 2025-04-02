import axios from 'axios'
import API_URL from './env'
import authHeader from './auth-header'

export interface Movie {
  id: number | null
  title: string
  year: number
  genre: string
  movie_length: number
  file: string | null
}

class MovieService {
  getAllMovies() {
    return axios.get(API_URL + 'movies', { headers: authHeader() }).then((response) => {
      return response.data.results
    })
  }

  createMovie(movieData) {
    const formData = new FormData()

    // Check if file exists before appending
    if (movieData.file) {
      formData.append('file', movieData.file)
    }

    formData.append('title', String(movieData.title))
    formData.append('year', String(movieData.year))
    formData.append('genre', String(movieData.genre))
    formData.append('movie_length', String(movieData.movie_length))

    return axios
      .post(API_URL + 'movies', formData, {
        headers: {
          ...authHeader(),
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => response.data.results)
      .catch((error) => {
        console.error('Create movie error:', error.response?.data || error)
        throw error.response?.data || error
      })
  }

  getMovie(id) {
    return axios.get(API_URL + 'movies/' + id, { headers: authHeader() }).then((response) => {
      return response.data.results
    })
  }

  updateMovie(id, movieData) {
    console.log('MovieService updateMovie:', { id, movieData })
    const formData = new FormData()

    // Add _method field for Laravel method spoofing
    formData.append('_method', 'PUT')

    // Check if file exists before appending
    if (movieData.file) {
      formData.append('file', movieData.file)
    }

    // Ensure all fields are properly appended
    formData.append('title', String(movieData.title))
    formData.append('year', String(movieData.year))
    formData.append('genre', String(movieData.genre))
    formData.append('movie_length', String(movieData.movie_length))

    // Log the complete FormData
    for (const pair of formData.entries()) {
      console.log(`FormData: ${pair[0]}: ${pair[1]}`)
    }

    return axios
      .post(API_URL + `movies/${id}`, formData, {
        // Changed to POST with _method: PUT
        headers: {
          ...authHeader(),
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('Raw update response:', response.data)
        if (!response.data.success) {
          throw new Error(response.data.message || 'Update failed')
        }
        const updatedMovie = {
          ...movieData,
          id: Number(id),
          file: response.data.results.file,
        }
        console.log('Processed updated movie:', updatedMovie)
        return updatedMovie
      })
      .catch((error) => {
        console.error('Update movie error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText,
        })
        throw error.response?.data || error
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
