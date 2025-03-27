<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Movies</h1>
      </v-col>
    </v-row>

    <!-- Movies Grid -->
    <v-row>
      <v-col v-for="movie in movies" :key="movie.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="mx-auto movie-card" max-width="400">
          <v-img :src="movie.file" class="movie-poster"></v-img>
          <v-card-title class="text-h6">{{ movie.title }}</v-card-title>
          <v-card-text>
            <div class="text-subtitle-1"><strong>Year:</strong> {{ movie.year }}</div>
            <div class="text-subtitle-1"><strong>Genre:</strong> {{ movie.genre }}</div>
            <div class="text-subtitle-1">
              <strong>Length:</strong> {{ movie.movie_length }} minutes
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="error" @click="deleteMovie(movie.id)">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import movies from './movies'
export default movies
</script>
