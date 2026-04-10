<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-4">
      <div class="card shadow">
        <div class="card-body">
          <h2 class="card-title text-center mb-4">🔐 Login</h2>

          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input
                id="username"
                v-model="credentials.username"
                type="text"
                class="form-control"
                required
                placeholder="Enter username"
              />
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input
                id="password"
                v-model="credentials.password"
                type="password"
                class="form-control"
                required
                placeholder="Enter password"
              />
            </div>

            <button type="submit" class="btn btn-primary w-100" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ loading ? 'Logging in...' : '🚀 Login' }}
            </button>
          </form>

          <hr class="my-4">

          <div class="text-center">
            <h6>Test Accounts:</h6>
            <div class="row g-2">
              <div class="col-6">
                <button class="btn btn-outline-primary btn-sm w-100" @click="quickLogin('admin', 'admin123')">
                  Admin
                </button>
              </div>
              <div class="col-6">
                <button class="btn btn-outline-success btn-sm w-100" @click="quickLogin('john', 'emp123')">
                  Employee
                </button>
              </div>
            </div>
            <small class="text-muted d-block mt-2">
              Customer: Register or contact admin
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "../helpers";

export default {
  data() {
    return {
      credentials: {
        username: '',
        password: ''
      },
      loading: false
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      try {
        console.log('Attempting login with:', this.credentials);
        const response = await login(this.credentials);
        console.log('Login response:', response);

        const user = response.data.user;
        console.log('User data:', user);

        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect based on role
        if (user.role === 'admin') {
          this.$router.push('/admin');
        } else if (user.role === 'employee') {
          this.$router.push('/employee');
        } else {
          this.$router.push('/');
        }

        this.$emit('login-success');
      } catch (error) {
        console.error('Login error details:', error);
        console.error('Error response:', error.response);
        console.error('Error message:', error.message);
        alert('Login failed: ' + (error.response?.data?.error || error.message || 'Unknown error'));
      } finally {
        this.loading = false;
      }
    },

    quickLogin(username, password) {
      this.credentials = { username, password };
      this.handleLogin();
    }
  }
};
</script>