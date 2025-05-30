<script lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import LoginView from './views/login/LoginView.vue'
import { mapState } from 'vuex'
import { ref } from 'vue'
export default {
  setup() {
    const theme = ref('dark')
    function changeTheme() {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
    }
    return { theme, changeTheme }
  },
  name: 'App',
  components: {
    LoginView,
    RouterLink,
    RouterView,
  },
  data: function () {
    return {
      profileDialog: false,
      profileIsUploading: false,
      verificationEmailLoading: false,
      showEmailNotVerifiedDialog: false,
      showChangeEmailTextField: false,
      changeEmail: false,
      successVerificationMessage: '',
      uploadErrorMessage: '',
      valid: false,
      changeEmailRules: [
        (value) => !!value || 'Required.',
        (value) => (value && value.length >= 3) || 'Min 3 characters',
        (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid email format'
        },
      ],
      profile: {
        avatar: '',
        name: '',
        title: '',
        icon: 'mdi-account-circle',
        color: 'info',
      },
      profilePictureImage: '',
      emailOfVerification: '',
    }
  },
  computed: {
    ...mapState({
      user() {
        return this.$store.state.user.user
      },
      auth() {
        return this.$store.state.auth
      },
      authUser() {
        return this.auth.user
      },
      isAuthenticated() {
        return this.auth.status.loggedIn && this.authUser.token !== undefined
      },
      title() {
        return 'Welcome ' + this.authUser.name + '!'
      },
      avatarURL() {
        return this.auth.user.avatar
      },
      profilePictureChangeLabel() {
        return 'Profile picture change22'
      },
    }),
  },
  updated() {
    if (this.isAuthenticated) {
      this.$router.push('/')
    }
  },
  created() {
    if (this.authUser) {
      this.getCurrentUser()
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
    },
    onAvatarChange(e) {
      var image = e.target.files || e.dataTransfer.files

      if (!image.length) return
      this.profileIsUploading = true
      this.uploadErrorMessage = ''
      this.$store
        .dispatch('user/uploadAvatar', image[0], { root: true })
        .then((response) => {
          if (response && response.avatar) {
            this.$store.commit('auth/uploadAvatarSuccess', response.avatar)
          }
          this.profileIsUploading = false
        })
        .catch((error) => {
          console.error('Upload error:', error)
          this.uploadErrorMessage = 'Failed to upload image. Please try again.'
          this.profileIsUploading = false
        })
    },
    removeAvatar() {
      this.profileIsUploading = true
      this.uploadErrorMessage = ''
      this.$store
        .dispatch('user/removeAvatar')
        .then((response) => {
          this.$store.commit('auth/uploadAvatarSuccess', response.avatar)
          this.profileIsUploading = false
        })
        .catch((error) => {
          console.log(error)
          this.uploadErrorMessage = 'Error removing profile picture. Please try again.'
          this.profileIsUploading = false
        })
    },
    getCurrentUser() {
      this.profile.name = this.authUser.name

      this.profile.title = this.title
      this.$store
        .dispatch('user/getUser')
        .then((response) => {
          if (response && response.avatar !== undefined) {
            this.$store.commit('auth/uploadAvatarSuccess', response.avatar)
          }
          if (response && !response.email_verified_at) {
            this.showEmailNotVerifiedDialog = true
          }
        })
        .catch((error) => {
          console.error('Error fetching user:', error)
        })
    },
    checkAuth(auth) {
      console.log('Authenticated!', auth)
    },
  },
}
</script>
<template>
  <v-app :theme="theme">
    <v-app-bar v-if="isAuthenticated">
      <v-spacer></v-spacer>
      <v-btn to="/" default>Home</v-btn>
      <v-btn to="about">About</v-btn>
      <v-btn to="movies">Movies</v-btn>
      <v-menu min-width="200px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar color="brown" size="large">
              <v-img icon v-bind="props" v-if="avatarURL" alt="Avatar" :src="avatarURL"></v-img>
              <v-icon v-bind="props" v-else :color="profile.color" :icon="profile.icon"></v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <h3>{{ profile.name }}</h3>
              <v-divider class="my-3"></v-divider>
              <v-btn
                :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
                @click="changeTheme"
                >Toggle Theme
              </v-btn>
              <v-btn @click="profileDialog = true">Profile </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn @click="logout()">Logout</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <div v-if="isAuthenticated">
          <RouterView />
        </div>
        <LoginView v-else :is-authenticated="isAuthenticated" @authenticate="checkAuth($event)" />
      </v-container>

      <v-dialog v-model="profileDialog">
        <v-form v-model="valid">
          <v-card>
            <v-card-title>Profile</v-card-title>
            <v-card-subtitle> Enter your profile options Here </v-card-subtitle>
            <v-card class="mx-auto" max-width="434" rounded="0">
              <v-img cover v-if="avatarURL" :src="avatarURL"></v-img>
              <v-icon v-else :color="profile.color" :icon="profile.icon"></v-icon>

              <v-file-input
                accept="image/*"
                :loading="profileIsUploading"
                :disabled="profileIsUploading"
                @change="onAvatarChange"
                :label="profilePictureChangeLabel"
                :rules="[
                  (value) =>
                    !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
                  (value) => !value || value.type.startsWith('image/') || 'File must be an image!',
                ]"
              ></v-file-input>
              <v-alert v-if="uploadErrorMessage" type="error" variant="tonal" class="mt-2">
                {{ uploadErrorMessage }}
              </v-alert>
            </v-card>
            <v-card-actions>
              <v-btn
                @click="removeAvatar"
                :disabled="profileIsUploading || !avatarURL"
                :loading="profileIsUploading"
              >
                Remove Profile Picture
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-main>
  </v-app>
</template>
