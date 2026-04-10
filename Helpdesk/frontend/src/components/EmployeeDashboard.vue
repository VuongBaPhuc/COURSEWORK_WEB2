<template>
  <div>
    <h2>👨‍💼 Employee Dashboard</h2>

    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card text-center">
          <div class="card-body">
            <h3 class="text-primary">{{ totalIssues }}</h3>
            <p class="card-text">Total Issues</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card text-center">
          <div class="card-body">
            <h3 class="text-warning">{{ unreadMessages }}</h3>
            <p class="card-text">Unread Messages</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card text-center">
          <div class="card-body">
            <h3 class="text-info">{{ categoriesCount }}</h3>
            <p class="card-text">Categories</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h5>📋 Recent Issues</h5>
          </div>
          <div class="card-body">
            <div v-if="recentIssues.length === 0" class="text-center text-muted py-4">
              No issues available yet.
            </div>
            <div v-for="issue in recentIssues.slice(0, 5)" :key="issue._id" class="mb-3 p-3 border rounded">
              <div class="d-flex justify-content-between">
                <h6 class="mb-1">{{ issue.title }}</h6>
                <small class="text-muted">{{ issue.issueCode }}</small>
              </div>
              <p class="mb-1 text-muted small">{{ issue.description }}</p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="badge bg-secondary">{{ issue.category }}</span>
                <span class="badge" :class="getDifficultyClass(issue.difficulty)">
                  {{ issue.difficulty }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card">
          <div class="card-header">
            <h5>💬 Quick Actions</h5>
          </div>
          <div class="card-body">
            <router-link to="/employee/messages" class="btn btn-primary w-100 mb-2">
              📨 View Messages
              <span v-if="unreadMessages > 0" class="badge bg-danger ms-2">{{ unreadMessages }}</span>
            </router-link>

            <button class="btn btn-success w-100" @click="showContactAdmin = true">
              🆘 Contact Admin
            </button>
          </div>
        </div>

        <!-- Contact Admin Modal -->
        <div v-if="showContactAdmin" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5)">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">📞 Contact Administrator</h5>
                <button type="button" class="btn-close" @click="showContactAdmin = false"></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="sendMessage">
                  <div class="mb-3">
                    <label class="form-label">Subject</label>
                    <input v-model="messageForm.subject" type="text" class="form-control" required>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Message</label>
                    <textarea v-model="messageForm.content" class="form-control" rows="4" required></textarea>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Related Issue (optional)</label>
                    <select v-model="messageForm.issueId" class="form-select">
                      <option value="">-- Select Issue --</option>
                      <option v-for="issue in recentIssues" :key="issue._id" :value="issue._id">
                        {{ issue.issueCode }} - {{ issue.title }}
                      </option>
                    </select>
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
    </div>
  </div>
</template>

<script>
import { getIssues, getCategories, sendMessage, getUnreadCount } from "../helpers";

export default {
  data() {
    return {
      issues: [],
      categories: [],
      unreadMessages: 0,
      showContactAdmin: false,
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
    totalIssues() {
      return this.issues.length;
    },
    categoriesCount() {
      return this.categories.length;
    },
    recentIssues() {
      return this.issues.slice(0, 10);
    }
  },
  async created() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        console.log('Calling getIssues');
        const issuesRes = await getIssues();
        console.log('getIssues response:', issuesRes);
        this.issues = issuesRes.data;
        console.log('Issues loaded:', this.issues.length);
      } catch (error) {
        console.error('Error loading issues:', error);
      }

      try {
        const categoriesRes = await getCategories();
        this.categories = categoriesRes.data;
      } catch (error) {
        console.error('Error loading categories:', error);
      }

      try {
        const unreadRes = await getUnreadCount();
        this.unreadMessages = unreadRes.data?.count || 0;
      } catch (error) {
        console.error('Error loading unread:', error);
      }
    },

    async sendMessage() {
      console.log('Sending message:', this.messageForm);
      this.sending = true;
      try {
        const response = await sendMessage(this.messageForm);
        console.log('Message sent response:', response);
        alert('✅ Message sent successfully!');
        this.showContactAdmin = false;
        this.messageForm = { subject: '', content: '', issueId: '', priority: 'normal' };
        await this.loadData(); // Refresh unread count
      } catch (error) {
        console.error('Send message error:', error);
        alert('❌ Failed to send message: ' + (error.response?.data?.error || error.message));
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
    }
  }
};
</script>