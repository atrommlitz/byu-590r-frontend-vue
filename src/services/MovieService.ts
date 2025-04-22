import axios from 'axios'
import API_URL from './env'
import authHeader from './auth-header'

console.log('API_URL being used:', API_URL)

export interface Movie {
  id: number | null
  title: string
  year: number
  genre: string
  movie_length: number
  file: string | File | null
  file_url?: string
  director_id?: number | null
  rating_id?: number | null
  director?: Director
  rating?: Rating
}

export interface Director {
  id: number | null
  full_name: string
  age: number | null
  history: string
  nationality: string
}

export interface Rating {
  id: number | null
  name: string
}

class MovieService {
  getAllMovies() {
    return axios
      .get(API_URL + 'movies', { headers: authHeader() })
      .then((response) => {
        // Return just the results array
        return response.data.results
      })
      .catch((error) => {
        console.error('API Error:', error)
        throw error
      })
  }

  createMovie(movieData) {
    const formData = new FormData()

    console.log('Creating movie with data:', movieData)

    // Always append these required fields
    formData.append('title', String(movieData.title))
    formData.append('year', String(movieData.year))
    formData.append('genre', String(movieData.genre))
    formData.append('movie_length', String(movieData.movie_length))
    formData.append('director_id', String(movieData.director_id))
    formData.append('rating_id', String(movieData.rating_id))

    // Only append file if it exists and is a File object
    if (movieData.file instanceof File) {
      formData.append('file', movieData.file)
    }

    return axios
      .post(API_URL + 'movies', formData, {
        headers: {
          ...authHeader(),
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('Create response:', response.data)
        if (response.data.success) {
          return response.data.results
        }
        throw new Error(response.data.message || 'Failed to create movie')
      })
      .catch((error) => {
        console.error('Create movie error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: error.config,
        })
        throw error
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

    formData.append('_method', 'PUT')

    // Always append these fields
    formData.append('title', String(movieData.title))
    formData.append('year', String(movieData.year))
    formData.append('genre', String(movieData.genre))
    formData.append('movie_length', String(movieData.movie_length))

    // Append director_id and rating_id if they exist
    if (movieData.director_id) {
      formData.append('director_id', String(movieData.director_id))
    }
    if (movieData.rating_id) {
      formData.append('rating_id', String(movieData.rating_id))
    }

    // Only append file if a new one is selected
    if (movieData.file instanceof File) {
      formData.append('file', movieData.file)
    }

    return axios
      .post(API_URL + `movies/${id}`, formData, {
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
        return response.data.results
      })
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

  getAllDirectors() {
    return axios
      .get(API_URL + 'directors', { headers: authHeader() })
      .then((response) => {
        return response.data.results
      })
      .catch((error) => {
        console.error('API Error:', error)
        throw error
      })
  }

  createDirector(directorData: Partial<Director>) {
    return axios
      .post(API_URL + 'directors', directorData, {
        headers: authHeader(),
      })
      .then((response) => {
        if (response.data.success) {
          return response.data.results
        }
        throw new Error(response.data.message || 'Failed to create director')
      })
      .catch((error) => {
        console.error('Create director error:', error)
        throw error
      })
  }
}

const movieService = new MovieService()
export default movieService
