import { defineComponent } from 'vue'
import { Movie } from '../../services/MovieService'

export default defineComponent({
  name: 'MoviesView',

  data() {
    return {
      dialog: false,
      deleteDialog: false,
      valid: true,
      editedIndex: -1,
      editedItem: {
        title: '',
        year: new Date().getFullYear(),
        genre: '',
        movie_length: '',
        file: null,
      },
      defaultItem: {
        title: '',
        year: new Date().getFullYear(),
        genre: '',
        movie_length: '',
        file: null,
      },
      fileRules: [
        (v) => !!v || 'Poster is required',
        (v) => !v || v.size < 2000000 || 'Poster size should be less than 2 MB!',
      ],
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

    openEditDialog(movie) {
      this.editedIndex = this.movies.indexOf(movie)
      this.editedItem = {
        id: movie.id,
        title: movie.title,
        year: movie.year,
        genre: movie.genre,
        movie_length: movie.movie_length,
        file: movie.file,
      }
      this.dialog = true
    },

    openDeleteDialog(movie) {
      this.editedIndex = this.movies.indexOf(movie)
      this.editedItem = Object.assign({}, movie)
      this.deleteDialog = true
    },

    async save() {
      if (this.$refs.form.validate()) {
        try {
          if (this.editedIndex > -1) {
            console.log('Updating movie:', this.editedItem)
            await this.$store.dispatch('movies/updateMovie', {
              id: this.editedItem.id,
              movieData: this.editedItem,
            })
          } else {
            await this.$store.dispatch('movies/createMovie', this.editedItem)
          }
          this.close()
          await this.getMovies()
        } catch (error) {
          console.error('Error saving movie:', error)
        }
      }
    },

    async deleteItemConfirm() {
      try {
        await this.$store.dispatch('movies/deleteMovie', this.editedItem.id)
        this.closeDelete()
        await this.getMovies()
      } catch (error) {
        console.error('Error deleting movie:', error)
      }
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.deleteDialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
  },
})
