<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card shadow">
        <div class="card-body">
          <h2 class="card-title mb-4">✏️ Edit Issue</h2>

          <form @submit.prevent="updateIssue" v-if="issue._id">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="issueCode" class="form-label">Issue Code *</label>
                <input
                  id="issueCode"
                  v-model="issue.issueCode"
                  type="text"
                  class="form-control"
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
                <label for="tags" class="form-label">Tags</label>
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
              <button type="submit" class="btn btn-success" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? 'Updating...' : '💾 Save Changes' }}
              </button>
              <router-link to="/admin" class="btn btn-secondary">
                ❌ Cancel
              </router-link>
            </div>
          </form>

          <div v-else class="alert alert-warning">
            Loading issue...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getIssue, updateIssue } from "../helpers";

export default {
  data() {
    return {
      loading: false,
      tagsString: '',
      issue: {}
    };
  },
  async created() {
    await this.loadIssue();
  },
  watch: {
    'issue.tags': {
      handler(newTags) {
        this.tagsString = newTags ? newTags.join(', ') : '';
      },
      immediate: true
    },
    tagsString(newVal) {
      this.issue.tags = newVal.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
  },
  methods: {
    async loadIssue() {
      try {
        const response = await getIssue(this.$route.params.id);
        this.issue = response.data;
      } catch (error) {
        alert('Failed to load issue: ' + error.response?.data?.error);
        this.$router.push('/admin');
      }
    },

    async updateIssue() {
      this.loading = true;
      try {
        await updateIssue(this.issue._id, this.issue);
        alert('✅ Issue updated successfully!');
        this.$router.push('/admin');
      } catch (error) {
        alert('❌ Failed to update issue: ' + error.response?.data?.error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>