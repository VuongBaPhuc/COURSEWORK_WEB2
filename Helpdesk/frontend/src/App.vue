<template>
  <div class="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <router-link to="/" class="navbar-brand">📋 Helpdesk System</router-link>
        <div class="navbar-nav ms-auto">
          <router-link v-if="isAuthenticated" :to="dashboardLink" class="nav-link">Dashboard</router-link>
          <router-link v-if="isAuthenticated" :to="issuesLink" class="nav-link">Issues</router-link>
          <router-link v-if="isAuthenticated" to="/new" class="nav-link">New Issue</router-link>
          <router-link v-if="isAuthenticated && isAdmin" to="/admin/users" class="nav-link">Users</router-link>
          <button v-if="isAuthenticated" @click="handleLogout" class="btn btn-outline-light ms-3">🚪 Logout</button>
          <router-link v-else to="/login" class="nav-link">Login</router-link>
        </div>
      </div>
    </nav>

    <main class="py-5">
      <div class="container">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background-color: #f8f9fa;
}
</style>

<script>
import { logout, getCurrentUser, isAuthenticated, isAdmin, isEmployee, isCustomer } from './helpers';

export default {
  name: 'App',
  computed: {
    isAuthenticated() {
      return isAuthenticated();
    },
    isAdmin() {
      return isAdmin();
    },
    dashboardLink() {
      if (isAdmin()) return '/admin';
      if (isEmployee()) return '/employee';
      return '/';
    },
    issuesLink() {
      if (isAdmin()) return '/admin/issues';
      if (isEmployee()) return '/employee';
      return '/';
    }
  },
  methods: {
    handleLogout() {
      logout();
    }
  }
};
</script>