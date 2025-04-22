<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Movies</h1>
      </v-col>
    </v-row>

    <div class="movies-container">
      <v-btn class="create-movie-btn" @click="openCreateDialog"> Create New Movie </v-btn>

      <div class="movies-grid">
        <v-card v-for="movie in movies" :key="movie.id" class="movie-card">
          <v-img :src="movie.file" :alt="movie.title" cover>
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-row>
            </template>
          </v-img>

          <v-card-title>{{ movie.title }}</v-card-title>

          <v-card-text>
            <div><strong>Year:</strong> {{ movie.year }}</div>
            <div><strong>Genre:</strong> {{ movie.genre }}</div>
            <div><strong>Length:</strong> {{ movie.movie_length }} minutes</div>
            <div>
              <strong>Director:</strong>
              {{ movie.director ? movie.director.full_name : 'No Director' }}
            </div>
            <div><strong>Rating:</strong> {{ movie.rating ? movie.rating.name : 'No Rating' }}</div>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="flat" @click="openEditDialog(movie)">Edit</v-btn>
            <v-btn color="error" variant="flat" @click="openDeleteDialog(movie)"> DELETE </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>

    <!-- Create Dialog -->
    <v-dialog v-model="createDialog" max-width="400px">
      <v-card class="create-movie-dialog">
        <v-card-title>Create New Movie</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="newMovie.title" label="Title" dense required></v-text-field>

            <v-text-field
              v-model="newMovie.year"
              label="Year"
              type="number"
              dense
              required
            ></v-text-field>

            <v-text-field v-model="newMovie.genre" label="Genre" dense required></v-text-field>

            <v-text-field
              v-model="newMovie.movie_length"
              label="Length (minutes)"
              type="number"
              dense
              required
            ></v-text-field>

            <v-select
              v-model="newMovie.director_id"
              :items="directors"
              item-title="full_name"
              item-value="id"
              label="Director"
              dense
              required
            >
              <template v-slot:append-item>
                <v-list-item
                  title="Add New Director"
                  @click="openNewDirectorDialog"
                  class="add-director-item"
                >
                  <template v-slot:prepend>
                    <v-icon>mdi-plus</v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-select>

            <v-file-input
              v-model="newMovie.file"
              label="Movie Cover (Optional)"
              accept="image/*"
              :placeholder="newMovie.file ? newMovie.file.name : 'Select an image'"
              prepend-icon="$file"
              dense
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="flat" @click="saveNew">Save</v-btn>
          <v-btn color="error" variant="flat" @click="closeCreateDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="400px">
      <v-card class="edit-dialog">
        <v-card-title>Edit Movie</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="editedItem.title" label="Title" dense></v-text-field>

            <v-text-field v-model="editedItem.year" label="Year" type="number" dense></v-text-field>

            <v-text-field v-model="editedItem.genre" label="Genre" dense></v-text-field>

            <v-text-field
              v-model="editedItem.movie_length"
              label="Length (minutes)"
              type="number"
              dense
            ></v-text-field>

            <v-select
              v-model="editedItem.director_id"
              :items="directors"
              item-title="full_name"
              item-value="id"
              label="Director"
              dense
            >
              <template v-slot:append-item>
                <v-list-item
                  title="Add New Director"
                  @click="openNewDirectorDialog"
                  class="add-director-item"
                >
                  <template v-slot:prepend>
                    <v-icon>mdi-plus</v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-select>

            <!-- Current image preview -->
            <div v-if="editedItem.file_url" class="mb-4">
              <img
                :src="editedItem.file_url"
                alt="Current movie cover"
                style="max-width: 200px; height: auto"
              />
            </div>

            <!-- File input for new image -->
            <v-file-input
              v-model="editedItem.file"
              label="Change Movie Cover"
              accept="image/*"
              :placeholder="editedItem.file ? editedItem.file.name : 'Select new image'"
              prepend-icon="$file"
              dense
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="flat" @click="saveEdit">Save</v-btn>
          <v-btn color="error" variant="flat" @click="closeEditDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title>Delete Movie</v-card-title>
        <v-card-text>Are you sure you want to delete "{{ editedItem.title }}"?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="flat" @click="closeDelete">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="deleteItemConfirm">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- New Director Dialog -->
    <v-dialog v-model="newDirectorDialog" max-width="400px">
      <v-card>
        <v-card-title>Add New Director</v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <v-text-field
              v-model="newDirector.full_name"
              label="Full Name"
              :rules="[(v) => !!v || 'Full name is required']"
              required
            ></v-text-field>
            <v-text-field
              v-model="newDirector.age"
              label="Age"
              type="number"
              :rules="[(v) => !!v || 'Age is required']"
              required
            ></v-text-field>
            <v-text-field
              v-model="newDirector.history"
              label="History"
              :rules="[(v) => !!v || 'History is required']"
              required
            ></v-text-field>
            <v-text-field
              v-model="newDirector.nationality"
              label="Nationality"
              :rules="[(v) => !!v || 'Nationality is required']"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="flat" @click="saveNewDirector" :disabled="!valid"
            >Save</v-btn
          >
          <v-btn color="error" variant="flat" @click="closeNewDirectorDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import movies from './movies'
export default movies
</script>

<style scoped>
@import './movies.scss';
</style>
