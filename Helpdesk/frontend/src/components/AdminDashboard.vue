<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>👑 Admin Dashboard</h2>
      <router-link to="/admin/issues/new" class="btn btn-primary">
        ➕ Create New Issue
      </router-link>
    </div>

    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h3 class="text-primary">{{ stats.totalIssues }}</h3>
            <p class="card-text">Total Issues</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h3 class="text-success">{{ stats.totalUsers }}</h3>
            <p class="card-text">Total Users</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h3 class="text-warning">{{ stats.unreadMessages }}</h3>
            <p class="card-text">Unread Messages</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h3 class="text-info">{{ stats.categoriesCount }}</h3>
            <p class="card-text">Categories</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header d-flex justify-content-between">
            <h5>📋 Issues Management</h5>
            <div>
              <button
                class="btn btn-sm btn-outline-primary me-2"
                @click="filter = 'all'"
                :class="{ active: filter === 'all' }"
              >
                All
              </button>
              <button
                class="btn btn-sm btn-outline-success me-2"
                @click="filter = 'active'"
                :class="{ active: filter === 'active' }"
              >
                Active
              </button>
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="filter = 'inactive'"
                :class="{ active: filter === 'inactive' }"
              >
                Inactive
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Difficulty</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="issue in filteredIssues" :key="issue._id">
                    <td><code>{{ issue.issueCode }}</code></td>
                    <td>{{ issue.title }}</td>
                    <td><span class="badge bg-secondary">{{ issue.category }}</span></td>
                    <td>
                      <span class="badge" :class="getDifficultyClass(issue.difficulty)">
                        {{ issue.difficulty }}
                      </span>
                    </td>
                    <td>
                      <span class="badge" :class="issue.isActive ? 'bg-success' : 'bg-danger'">
                        {{ issue.isActive ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                    <td>
                      <router-link
                        :to="'/admin/issues/edit/' + issue._id"
                        class="btn btn-sm btn-warning me-1"
                      >
                        ✏️
                      </router-link>
                      <button
                        class="btn btn-sm btn-danger"
                        @click="deleteIssue(issue._id)"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card mb-4">
          <div class="card-header">
            <h5>👥 Quick Actions</h5>
          </div>
          <div class="card-body">
            <router-link to="/admin/users" class="btn btn-success w-100 mb-2">
              👥 Manage Users
            </router-link>
            <router-link to="/admin/messages" class="btn btn-primary w-100 mb-2">
              💬 Messages
              <span v-if="stats.unreadMessages > 0" class="badge bg-danger ms-2">
                {{ stats.unreadMessages }}
              </span>
            </router-link>
            <router-link to="/admin/issues/new" class="btn btn-info w-100">
              ➕ New Issue
            </router-link>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h5>📊 Recent Activity</h5>
          </div>
          <div class="card-body">
            <div v-for="issue in recentIssues.slice(0, 3)" :key="issue._id" class="mb-2">
              <small class="text-muted">{{ issue.createdAt | formatDate }}</small>
              <div class="small">{{ issue.title }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getIssues, deleteIssue, getUsers, getUnreadCount } from "../helpers";

export default {
  data() {
    return {
      issues: [],
      users: [],
      stats: {
        totalIssues: 0,
        totalUsers: 0,
        unreadMessages: 0,
        categoriesCount: 0
      },
      filter: 'all'
    };
  },
  computed: {
    filteredIssues() {
      if (this.filter === 'active') return this.issues.filter(i => i.isActive);
      if (this.filter === 'inactive') return this.issues.filter(i => !i.isActive);
      return this.issues;
    },
    recentIssues() {
      return [...this.issues].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  },
  async created() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const [issuesRes, usersRes, unreadRes] = await Promise.all([
          getIssues(),
          getUsers(),
          getUnreadCount()
        ]);

        this.issues = issuesRes.data;
        this.users = usersRes.data;
        this.stats.unreadMessages = unreadRes.data?.count || 0;
        this.stats.totalIssues = this.issues.length;
        this.stats.totalUsers = this.users.length;
        this.stats.categoriesCount = [...new Set(this.issues.map(i => i.category))].length;
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    },

    async deleteIssue(id) {
      if (confirm('Are you sure you want to deactivate this issue?')) {
        try {
          await deleteIssue(id);
          await this.loadData();
          alert('Issue deactivated successfully!');
        } catch (error) {
          alert('Failed to deactivate issue: ' + error.response?.data?.error);
        }
      }
    },

    getDifficultyClass(difficulty) {
      const classes = {
        'Easy': 'bg-success',
        'Medium': 'bg-warning',
        'Hard': 'bg-danger'
      };
      return classes[difficulty] || 'bg-secondary';
    }
  },

  filters: {
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    }
  }
};
</script>