<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card shadow">
        <div class="card-body">
          <h2 class="card-title mb-4">➕ Create New Issue</h2>

          <form @submit.prevent="createIssue">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="issueCode" class="form-label">Issue Code *</label>
                <input
                  id="issueCode"
                  v-model="issue.issueCode"
                  type="text"
                  class="form-control"
                  placeholder="e.g., NET-001"
                  required
                />
              </div>

              <div class="col-md-6 mb-3">
                <label for="category" class="form-label">Category *</label>
                <select v-model="issue.category" class="form-select" required>
                  <option value="">-- Select Category --</option>
                  <option value="Network">Network</option>
                  <option value="Software">Software</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Email">Email</option>
                  <option value="Password">Password</option>
                  <option value="Security">Security</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label for="title" class="form-label">Title *</label>
              <input
                id="title"
                v-model="issue.title"
                type="text"
                class="form-control"
                placeholder="Brief title of the issue"
                required
              />
            </div>

            <div class="mb-3">
              <label for="description" class="form-label">Description *</label>
              <textarea
                id="description"
                v-model="issue.description"
                class="form-control"
                rows="3"
                placeholder="Detailed description of the issue"
                required
              ></textarea>
            </div>

            <div class="mb-3">
              <label for="solution" class="form-label">Solution *</label>
              <textarea
                id="solution"
                v-model="issue.solution"
                class="form-control"
                rows="6"
                placeholder="Step-by-step solution"
                required
              ></textarea>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="difficulty" class="form-label">Difficulty</label>
                <select v-model="issue.difficulty" class="form-select">
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div class="col-md-6 mb-3">
                <label for="tags" class="form-label">Tags (comma separated)</label>
                <input
                  id="tags"
                  v-model="tagsString"
                  type="text"
                  class="form-control"
                  placeholder="wifi, connection, network"
                />
              </div>
            </div>

            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? 'Creating...' : '✅ Create Issue' }}
              </button>
              <router-link to="/admin" class="btn btn-secondary">
                ❌ Cancel
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createIssue } from "../helpers";

export default {
  data() {
    return {
      loading: false,
      tagsString: '',
      issue: {
        issueCode: '',
        title: '',
        description: '',
        solution: '',
        category: '',
        difficulty: 'Medium',
        tags: []
      }
    };
  },
  watch: {
    tagsString(newVal) {
      this.issue.tags = newVal.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
  },
  methods: {
    async createIssue() {
      if (!this.issue.issueCode || !this.issue.title || !this.issue.description ||
          !this.issue.solution || !this.issue.category) {
        alert('Please fill all required fields!');
        return;
      }

      this.loading = true;
      try {
        await createIssue(this.issue);
        alert('✅ Issue created successfully!');
        this.$router.push('/admin');
      } catch (error) {
        alert('❌ Failed to create issue: ' + error.response?.data?.error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>