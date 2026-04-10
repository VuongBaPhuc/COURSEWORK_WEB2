<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow">
          <div class="card-body text-center">
            <h1 class="display-4 mb-4">📖 Issue Details</h1>

            <div v-if="issue" class="text-start">
              <!-- Issue Header -->
              <div class="mb-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h2 class="mb-2">{{ issue.title }}</h2>
                    <div class="d-flex gap-2 flex-wrap">
                      <span class="badge bg-primary fs-6">{{ issue.issueCode }}</span>
                      <span class="badge bg-secondary">{{ issue.category }}</span>
                      <span class="badge" :class="getDifficultyClass(issue.difficulty)">
                        {{ issue.difficulty }}
                      </span>
                    </div>
                  </div>
                  <div class="text-muted small">
                    Created: {{ formatDate(issue.createdAt) }}
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div class="mb-4">
                <h4 class="text-primary mb-3">📋 Description</h4>
                <div class="border-start border-primary border-4 ps-3">
                  <p class="lead">{{ issue.description }}</p>
                </div>
              </div>

              <!-- Solution -->
              <div class="mb-4">
                <h4 class="text-success mb-3">✅ Solution</h4>
                <div class="bg-light p-4 rounded">
                  <pre class="mb-0" style="white-space: pre-wrap; font-family: inherit;">{{ issue.solution }}</pre>
                </div>
              </div>

              <!-- Tags -->
              <div v-if="issue.tags && issue.tags.length > 0" class="mb-4">
                <h5>🏷️ Tags</h5>
                <div class="d-flex gap-1 flex-wrap">
                  <span
                    v-for="tag in issue.tags"
                    :key="tag"
                    class="badge bg-info"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="d-flex gap-2 justify-content-center mt-5">
                <router-link to="/" class="btn btn-primary btn-lg">
                  🔍 Search More Issues
                </router-link>
                <button
                  v-if="isEmployee"
                  class="btn btn-warning btn-lg"
                  @click="contactAdmin"
                >
                  🆘 Contact Admin
                </button>
              </div>
            </div>

            <div v-else class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
              </div>
              <p class="mt-2">Loading issue details...</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Admin Modal -->
    <div v-if="showContactModal" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">🆘 Contact Administrator</h5>
            <button type="button" class="btn-close" @click="showContactModal = false"></button>
          </div>
          <div class="modal-body">
            <p class="mb-3">Need help with this issue? Send a message to the administrator.</p>
            <form @submit.prevent="sendMessage">
              <div class="mb-3">
                <label class="form-label">Subject</label>
                <input
                  v-model="messageForm.subject"
                  type="text"
                  class="form-control"
                  required
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Message</label>
                <textarea
                  v-model="messageForm.content"
                  class="form-control"
                  rows="4"
                  placeholder="Describe your issue in detail..."
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Priority</label>
                <select v-model="messageForm.priority" class="form-select">
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary" :disabled="sending">
                {{ sending ? 'Sending...' : '📤 Send Message' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getIssue, sendMessage } from "../helpers";
import { isEmployee } from "../helpers";

export default {
  data() {
    return {
      issue: null,
      showContactModal: false,
      sending: false,
      messageForm: {
        subject: '',
        content: '',
        issueId: '',
        priority: 'normal'
      }
    };
  },
  computed: {
    isEmployee() {
      return isEmployee();
    }
  },
  async created() {
    await this.loadIssue();
  },
  methods: {
    async loadIssue() {
      try {
        const response = await getIssue(this.$route.params.id);
        this.issue = response.data;
      } catch (error) {
        alert('Failed to load issue details');
        this.$router.push('/');
      }
    },

    contactAdmin() {
      this.messageForm = {
        subject: `Help needed: ${this.issue.title}`,
        content: '',
        issueId: this.issue._id,
        priority: 'normal'
      };
      this.showContactModal = true;
    },

    async sendMessage() {
      this.sending = true;
      try {
        await sendMessage(this.messageForm);
        alert('✅ Message sent successfully! Admin will respond soon.');
        this.showContactModal = false;
      } catch (error) {
        alert('❌ Failed to send message: ' + error.response?.data?.error);
      } finally {
        this.sending = false;
      }
    },

    getDifficultyClass(difficulty) {
      const classes = {
        'Easy': 'bg-success',
        'Medium': 'bg-warning',
        'Hard': 'bg-danger'
      };
      return classes[difficulty] || 'bg-secondary';
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    }
  }
};
</script>