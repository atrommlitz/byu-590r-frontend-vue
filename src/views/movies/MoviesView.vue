<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Movies</h1>
      </v-col>
    </v-row>

    <!-- Create Movie Button -->
    <v-row>
      <v-col>
        <v-btn color="primary" @click="openCreateDialog"> Create New Movie </v-btn>
      </v-col>
    </v-row>

    <!-- Movies Grid -->
    <v-row>
      <v-col v-for="movie in movies" :key="movie.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="mx-auto movie-card" max-width="400">
          <v-img :src="movie.file" class="movie-poster"></v-img>
          <v-card-title class="text-h6">{{ movie.title }}</v-card-title>
          <v-card-text>
            <div><strong>Year:</strong> {{ movie.year }}</div>
            <div><strong>Genre:</strong> {{ movie.genre }}</div>
            <div><strong>Length:</strong> {{ movie.movie_length }} minutes</div>
          </v-card-text>
          <v-card-actions>
            <v-btn icon @click="openEditDialog(movie)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="error" @click="openDeleteDialog(movie)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          {{ editedIndex === -1 ? 'New Movie' : 'Edit Movie' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="editedItem.title"
              label="Title"
              :rules="[(v) => !!v || 'Title is required']"
            ></v-text-field>
            <v-text-field
              v-model="editedItem.year"
              label="Year"
              type="number"
              :rules="[(v) => !!v || 'Year is required']"
            ></v-text-field>
            <v-text-field
              v-model="editedItem.genre"
              label="Genre"
              :rules="[(v) => !!v || 'Genre is required']"
            ></v-text-field>
            <v-text-field
              v-model="editedItem.movie_length"
              label="Length (minutes)"
              type="number"
              :rules="[(v) => !!v || 'Length is required']"
            ></v-text-field>
            <v-file-input
              v-model="editedItem.file"
              :rules="fileRules"
              accept="image/*"
              label="Movie Poster"
              prepend-icon="mdi-camera"
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title>Are you sure you want to delete this movie?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="deleteItemConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import movies from './movies'
export default movies
</script>
