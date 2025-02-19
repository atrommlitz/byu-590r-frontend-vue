export default {
  name: 'LoginView',
  emits: ['authenticate'],

  data: function () {
    return {
      isAuthenticated: false,
      alertType: 'error',
      errorMsg: '',
      password: '',
      email: '',
      dialog: false,
      isLoading: false,
      emailRules: [
        (value) => !!value || 'Required.',
        (value) => (value && value.length >= 3) || 'Min 3 characters',
      ],
      passwordRules: [
        (value) => !!value || 'Required.',
        (value) => (value && value.length >= 8) || 'Min 8 characters',
      ],
      isFormValid: false,
      hardCodedEmailForDemo: 'spiderman@gmail.com',
      hardCodedPasswordForDemo: 'trees243',
    }
  },
  methods: {
    submitLogin() {
      if (!this.isFormValid) {
        return
      }

      this.errorMsg = ''
      if (
        this.hardCodedPasswordForDemo === this.password &&
        this.hardCodedEmailForDemo === this.email
      ) {
        this.alertType = 'success'
        this.errorMsg = 'Loging Success. Redirection!'
        this.loading = true
        setTimeout(() => {
          this.isAuthenticated = true
          this.$emit('authenticate', this.isAuthenticated)
        }, 1000)
      } else if (this.email === this.password) {
        this.alertType = 'warning'
        this.errorMsg = 'Your Username and password can not be the same!'
      } else {
        this.alertType = 'error'
        this.errorMsg = 'Login Failed! Can not Authenticate!'
      }
    },
    forgotPassword() {
      console.log('here')
    },
  },
}
