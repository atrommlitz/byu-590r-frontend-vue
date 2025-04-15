import { defineComponent, ref, onMounted } from 'vue'
import type { Movie } from '../../services/MovieService'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'MoviesView',

  setup() {
    const store = useStore()
    const movies = ref<Movie[]>([])
    const createDialog = ref(false)
    const editDialog = ref(false)
    const deleteDialog = ref(false)
    const valid = ref(true)
    const newMovie = ref({
      id: null,
      title: '',
      year: new Date().getFullYear(),
      genre: '',
      movie_length: 0,
      file: null,
    })
    const editedItem = ref<Movie>({
      id: null,
      title: '',
      year: new Date().getFullYear(),
      genre: '',
      movie_length: 0,
      file: null,
      file_url: '',
      director_id: null,
      rating_id: null,
    })
    const fileRules = [(v) => !!v || 'Poster is required']
    const errorMessage = ref('')
    const currentFileName = ref('')
    const editedIndex = ref(-1)

    const fetchMovies = async () => {
      try {
        const response = await store.dispatch('movies/fetchMovies')
        console.log('Fetched movies:', response)
        movies.value = response
      } catch (error) {
        console.error('Error fetching movies:', error)
        errorMessage.value = 'Error loading movies'
      }
    }

    onMounted(async () => {
      console.log('Component mounted')
      await fetchMovies()
    })

    const openCreateDialog = () => {
      createDialog.value = true
      newMovie.value = {
        id: null,
        title: '',
        year: new Date().getFullYear(),
        genre: '',
        movie_length: 0,
        file: null,
      }
    }

    const openEditDialog = (movie) => {
      editedItem.value = {
        id: movie.id,
        title: movie.title,
        year: movie.year,
        genre: movie.genre,
        movie_length: movie.movie_length,
        file: null,
        file_url: movie.file,
        director_id: movie.director_id,
        rating_id: movie.rating_id,
      }
      editDialog.value = true
    }

    const openDeleteDialog = (movie) => {
      editedItem.value = { ...movie }
      deleteDialog.value = true
    }

    const closeCreateDialog = () => {
      createDialog.value = false
      errorMessage.value = ''
      newMovie.value = {
        id: null,
        title: '',
        year: new Date().getFullYear(),
        genre: '',
        movie_length: 0,
        file: null,
      }
    }

    const closeEditDialog = () => {
      editDialog.value = false
      editedItem.value = {
        id: null,
        title: '',
        year: new Date().getFullYear(),
        genre: '',
        movie_length: 0,
        file: null,
        file_url: '',
        director_id: null,
        rating_id: null,
      }
    }

    const saveNew = async () => {
      try {
        const movieData = {
          title: String(newMovie.value.title),
          year: Number(newMovie.value.year),
          genre: String(newMovie.value.genre),
          movie_length: Number(newMovie.value.movie_length),
          director_id: 1,
          rating_id: 1,
        }

        // Only add file if one was selected
        if (newMovie.value.file instanceof File) {
          movieData.file = newMovie.value.file
        }

        console.log('Creating new movie with data:', movieData)

        await store.dispatch('movies/createMovie', movieData)
        await fetchMovies()
        closeCreateDialog()
      } catch (error) {
        console.error('Error creating movie:', error)
        errorMessage.value = error.message || 'Error creating movie'
      }
    }

    const saveEdit = async () => {
      try {
        const movieData = {
          id: editedItem.value.id,
          title: String(editedItem.value.title),
          year: Number(editedItem.value.year),
          genre: String(editedItem.value.genre),
          movie_length: Number(editedItem.value.movie_length),
          director_id: editedItem.value.director_id ? Number(editedItem.value.director_id) : null,
          rating_id: editedItem.value.rating_id,
        }

        // Only add file if one was selected
        if (editedItem.value.file instanceof File) {
          movieData.file = editedItem.value.file
        }

        await store.dispatch('movies/updateMovie', movieData)
        await fetchMovies()
        editDialog.value = false
      } catch (error) {
        console.error('Error updating movie:', error)
      }
    }

    const onNewMovieFileChange = (event) => {
      newMovie.value.file = null

      if (!event || !event.target || !event.target.files) return // Safety check

      const image = event.target.files || event.dataTransfer.files
      if (!image.length) return

      newMovie.value.file = image[0]
    }

    const closeDelete = () => {
      deleteDialog.value = false
      editedItem.value = {
        id: null,
        title: '',
        year: new Date().getFullYear(),
        genre: '',
        movie_length: 0,
        file: null,
        file_url: '',
        director_id: null,
        rating_id: null,
      }
    }

    const deleteItemConfirm = async () => {
      try {
        await store.dispatch('movies/deleteMovie', editedItem.value.id)
        await fetchMovies()
        closeDelete()
      } catch (error) {
        console.error('Error deleting movie:', error)
        errorMessage.value = 'Error deleting movie'
      }
    }

    const handleImageError = (event) => {
      console.error('Image failed to load:', event)
      // Optionally set a fallback image
      event.target.src = '/path/to/fallback/image.jpg'
    }

    return {
      movies,
      createDialog,
      editDialog,
      deleteDialog,
      valid,
      newMovie,
      editedItem,
      fileRules,
      errorMessage,
      currentFileName,
      editedIndex,
      openCreateDialog,
      openEditDialog,
      openDeleteDialog,
      closeCreateDialog,
      closeEditDialog,
      saveNew,
      saveEdit,
      onNewMovieFileChange,
      deleteItemConfirm,
      closeDelete,
      handleImageError,
    }
  },
})
