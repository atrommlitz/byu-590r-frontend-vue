import { defineComponent } from 'vue'
import { Movie } from '../../services/MovieService'

export default defineComponent({
  name: 'MoviesView',

  data() {
    return {
      newMovie: {
        title: '',
        year: new Date().getFullYear(),
        genre: '',
        file: '',
        movie_length: 0,
      },
    }
  },

  computed: {
    movies() {
      return this.$store.state.movies.movies
    },
    isLoading() {
      return this.$store.state.movies.loading
    },
    error() {
      return this.$store.state.movies.error
    },
  },

  created() {
    this.getMovies()
  },

  methods: {
    async getMovies() {
      await this.$store.dispatch('movies/fetchMovies')
    },

    async handleSubmit() {
      try {
        await this.$store.dispatch('movies/createMovie', this.newMovie)
        // Reset form after successful submission
        this.newMovie = {
          title: '',
          year: new Date().getFullYear(),
          genre: '',
          file: '',
          movie_length: 0,
        }
        // Refresh movies list
        await this.getMovies()
      } catch (error) {
        console.error('Error creating movie:', error)
      }
    },
  },
})
