<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>🔍 Self-Service Portal</h2>
      <div class="d-flex gap-2">
        <input
          v-model="searchQuery"
          @input="debouncedSearch"
          type="text"
          class="form-control"
          placeholder="Search issues..."
          style="width: 300px;"
        />
        <select v-model="selectedCategory" @change="search" class="form-select">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
    </div>

    <!-- Search Results -->
    <div v-if="searchQuery || selectedCategory" class="mb-4">
      <h4>Search Results:</h4>
      <div v-if="searchResults.length === 0" class="alert alert-info">
        No issues found matching your search.
      </div>
    </div>

    <!-- Issues Grid -->
    <div class="row">
      <div
        v-for="issue in displayIssues"
        :key="issue._id"
        class="col-md-6 col-lg-4 mb-4"
      >
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title mb-0">{{ issue.title }}</h5>
              <span class="badge" :class="getDifficultyClass(issue.difficulty)">
                {{ issue.difficulty }}
              </span>
            </div>

            <p class="card-text text-muted small mb-2">{{ issue.description }}</p>

            <div class="mt-auto">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="badge bg-secondary">{{ issue.category }}</span>
                <small class="text-muted">{{ issue.issueCode }}</small>
              </div>

              <div class="d-flex gap-1 flex-wrap mb-3">
                <span
                  v-for="tag in issue.tags"
                  :key="tag"
                  class="badge bg-light text-dark small"
                >
                  #{{ tag }}
                </span>
              </div>

              <router-link
                :to="'/issue/' + issue._id"
                class="btn btn-primary btn-sm w-100"
              >
                📖 View Solution
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No issues message -->
    <div v-if="displayIssues.length === 0 && !searchQuery && !selectedCategory" class="text-center py-5">
      <div class="text-muted">
        <h4>👋 Welcome to Helpdesk</h4>
        <p>Search for solutions to common IT issues above.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getIssues, searchIssues, getCategories } from "../helpers";

export default {
  data() {
    return {
      issues: [],
      searchResults: [],
      categories: [],
      searchQuery: '',
      selectedCategory: '',
      searchTimeout: null
    };
  },
  computed: {
    displayIssues() {
      return this.searchQuery || this.selectedCategory ? this.searchResults : this.issues;
    }
  },
  async created() {
    await this.loadIssues();
    await this.loadCategories();
  },
  methods: {
    async loadIssues() {
      try {
        const response = await getIssues();
        this.issues = response.data;
      } catch (error) {
        console.error('Error loading issues:', error);
      }
    },

    async loadCategories() {
      try {
        const response = await getCategories();
        this.categories = response.data;
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    },

    debouncedSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.search();
      }, 300);
    },

    async search() {
      if (!this.searchQuery && !this.selectedCategory) {
        this.searchResults = [];
        return;
      }

      try {
        const params = {};
        if (this.searchQuery) params.q = this.searchQuery;
        if (this.selectedCategory) params.category = this.selectedCategory;

        const response = await searchIssues(params);
        this.searchResults = response.data;
      } catch (error) {
        console.error('Error searching issues:', error);
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
  }
};
</script>