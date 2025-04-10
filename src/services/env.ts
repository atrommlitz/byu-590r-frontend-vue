// const API_URL = 'http://127.0.0.1:8000/api/'
// export default API_URL
let API_URL = 'http://3.15.85.6:8888/api/'
if (import.meta.env.MODE === 'development') {
  API_URL = 'http://127.0.0.1:8000/api/'
}
export default API_URL
