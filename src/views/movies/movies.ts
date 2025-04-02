import { defineComponent } from 'vue'
import type { Movie } from '../../services/MovieService'

export default defineComponent({
  name: 'MoviesView',

  data() {
    return {
      dialog: false,
      deleteDialog: false,
      valid: true,
      editedIndex: -1,
      editedItem: {
        id: null,
        title: '',
        year: new Date().getFullYear(),
        genre: '',
        movie_length: 0,
        file: null,
      } as Movie,
      defaultItem: {
        id: null,
        title: '',
        year: new Date().getFullYear(),
        genre: '',
        movie_length: 0,
        file: null,
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
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
      this.dialog = true
    },

    openEditDialog(movie: Movie) {
      this.editedIndex = this.movies.indexOf(movie)
      this.currentFileName = movie.file ? movie.file.split('/').pop() || '' : ''
      this.editedItem = {
        id: movie.id,
        title: movie.title,
        year: movie.year,
        genre: movie.genre,
        movie_length: movie.movie_length,
        file: null,
      }
      this.dialog = true
    },

    openDeleteDialog(movie: Movie) {
      this.editedIndex = this.movies.indexOf(movie)
      this.editedItem = Object.assign({}, movie)
      this.deleteDialog = true
    },

    async save() {
      const form = this.$refs.form as any
      if (form.validate()) {
        try {
          if (this.editedIndex > -1) {
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
          } else {
            const movieData = {
              title: String(this.editedItem.title),
              year: Number(this.editedItem.year),
              genre: String(this.editedItem.genre),
              movie_length: Number(this.editedItem.movie_length),
              file: this.editedItem.file,
            }
            await this.$store.dispatch('movies/createMovie', movieData)
          }
          await this.getMovies()
          this.close()
        } catch (error) {
          console.error('Error saving movie:', error)
          this.errorMessage = error.message || 'Error saving movie'
        }
      }
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
