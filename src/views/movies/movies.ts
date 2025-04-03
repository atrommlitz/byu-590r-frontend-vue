import { defineComponent } from 'vue'
import type { Movie } from '../../services/MovieService'

export default defineComponent({
  name: 'MoviesView',

  data() {
    return {
      createDialog: false,
      editDialog: false,
      deleteDialog: false,
      valid: true,
      newMovie: {
        id: null,
        title: '',
        year: new Date().getFullYear(),
        genre: '',
        movie_length: 0,
        file: '',
      } as Movie,
      editedItem: {
        id: null,
        title: '',
        year: new Date().getFullYear(),
        genre: '',
        movie_length: 0,
        file: '',
      } as Movie,
      fileRules: [(v) => !!v || 'Poster is required'],
      errorMessage: '',
      currentFileName: '',
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

    openCreateDialog() {
      this.createDialog = true
      this.newMovie = {
        id: null,
        title: '',
        year: new Date().getFullYear(),
        genre: '',
        movie_length: 0,
        file: null,
      }
    },

    openEditDialog(movie: Movie) {
      this.editDialog = true
      this.currentFileName = movie.file ? movie.file.split('/').pop() || '' : ''
      this.editedItem = {
        id: movie.id,
        title: movie.title,
        year: movie.year,
        genre: movie.genre,
        movie_length: movie.movie_length,
        file: null,
      }
    },

    openDeleteDialog(movie: Movie) {
      this.editedIndex = this.movies.indexOf(movie)
      this.editedItem = Object.assign({}, movie)
      this.deleteDialog = true
    },

    closeCreateDialog() {
      this.createDialog = false
      this.errorMessage = ''
      this.newMovie = {
        id: null,
        title: '',
        year: new Date().getFullYear(),
        genre: '',
        movie_length: 0,
        file: null,
      }
    },

    closeEditDialog() {
      this.editDialog = false
      this.errorMessage = ''
      this.currentFileName = ''
      this.editedItem = {
        id: null,
        title: '',
        year: new Date().getFullYear(),
        genre: '',
        movie_length: 0,
        file: null,
      }
    },

    async saveNew() {
      const form = this.$refs.createForm as any
      if (form.validate()) {
        try {
          const movieData = {
            title: String(this.newMovie.title),
            year: Number(this.newMovie.year),
            genre: String(this.newMovie.genre),
            movie_length: Number(this.newMovie.movie_length),
            file: this.newMovie.file,
          }
          await this.$store.dispatch('movies/createMovie', movieData)
          await this.getMovies()
          this.closeCreateDialog()
        } catch (error) {
          console.error('Error creating movie:', error)
          this.errorMessage = error.message || 'Error creating movie'
        }
      }
    },

    async saveEdit() {
      const form = this.$refs.editForm as any
      if (form.validate()) {
        try {
          const movieData = {
            title: String(this.editedItem.title),
            year: Number(this.editedItem.year),
            genre: String(this.editedItem.genre),
            movie_length: Number(this.editedItem.movie_length),
            file: this.editedItem.file || undefined,
          }
          await this.$store.dispatch('movies/updateMovie', {
            id: this.editedItem.id,
            movieData,
          })
          await this.getMovies()
          this.closeEditDialog()
        } catch (error) {
          console.error('Error updating movie:', error)
          this.errorMessage = error.message || 'Error updating movie'
        }
      }
    },

    onNewMovieFileChange(event) {
      this.newMovie.file = null

      if (!event || !event.target || !event.target.files) return // Safety check

      const image = event.target.files || event.dataTransfer.files
      if (!image.length) return

      this.newMovie.file = image[0]
    },

    async deleteItemConfirm() {
      try {
        await this.$store.dispatch('movies/deleteMovie', this.editedItem.id)
        await this.getMovies()
        this.closeDelete()
      } catch (error) {
        console.error('Error deleting movie:', error)
        this.errorMessage = error.message || 'Error deleting movie'
      }
    },

    close() {
      this.$nextTick(() => {
        this.dialog = false
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.currentFileName = ''
        this.errorMessage = ''
      })
    },

    closeDelete() {
      this.$nextTick(() => {
        this.deleteDialog = false
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.errorMessage = ''
      })
    },
  },
})
