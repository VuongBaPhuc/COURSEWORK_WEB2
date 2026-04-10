<template>
  <div>
    <h2>💬 Messages</h2>

    <div class="row">
      <!-- Messages List -->
      <div class="col-md-5">
        <div class="card">
          <div class="card-header">
            <h5>{{ isAdmin ? '📨 Received Messages' : '📤 Sent Messages' }}</h5>
          </div>
          <div class="card-body" style="max-height: 600px; overflow-y: auto;">
            <div
              v-for="message in messages"
              :key="message._id"
              class="message-item p-3 mb-2 border rounded cursor-pointer"
              :class="{ 'bg-light': selectedMessage?._id === message._id }"
              @click="selectMessage(message)"
            >
              <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                  <h6 class="mb-1">{{ message.subject }}</h6>
                  <small class="text-muted">
                    {{ isAdmin ? `From: ${message.from.name}` : `To: ${message.to.name}` }}
                  </small>
                </div>
                <div class="text-end">
                  <span class="badge" :class="getStatusClass(message.status)">
                    {{ message.status }}
                  </span>
                  <br>
                  <small class="text-muted">{{ formatDate(message.createdAt) }}</small>
                </div>
              </div>
              <div v-if="message.issueId" class="mt-1">
                <small class="text-info">📋 Related: {{ message.issueId.title }}</small>
              </div>
            </div>

            <div v-if="messages.length === 0" class="text-center text-muted py-4">
              No messages yet.
            </div>
          </div>
        </div>
      </div>

      <!-- Message Detail -->
      <div class="col-md-7">
        <div class="card">
          <div class="card-header">
            <h5 v-if="selectedMessage">{{ selectedMessage.subject }}</h5>
            <span v-else>Select a message to view</span>
          </div>
          <div class="card-body" v-if="selectedMessage">
            <div class="mb-3">
              <strong>From:</strong> {{ selectedMessage.from.name }} ({{ selectedMessage.from.role }})
              <br>
              <strong>To:</strong> {{ selectedMessage.to.name }} ({{ selectedMessage.to.role }})
              <br>
              <strong>Date:</strong> {{ formatDate(selectedMessage.createdAt) }}
              <br>
              <strong>Priority:</strong>
              <span class="badge" :class="getPriorityClass(selectedMessage.priority)">
                {{ selectedMessage.priority }}
              </span>
            </div>

            <div v-if="selectedMessage.issueId" class="mb-3 p-2 bg-light rounded">
              <strong>Related Issue:</strong>
              <br>
              {{ selectedMessage.issueId.title }} ({{ selectedMessage.issueId.issueCode }})
            </div>

            <div class="mb-4">
              <h6>Message:</h6>
              <div class="border p-3 rounded bg-light">
                {{ selectedMessage.content }}
              </div>
            </div>

            <!-- Admin Reply Section -->
            <div v-if="isAdmin && selectedMessage.status !== 'replied'" class="border-top pt-3">
              <h6>Reply:</h6>
              <form @submit.prevent="sendReply">
                <div class="mb-3">
                  <textarea
                    v-model="replyContent"
                    class="form-control"
                    rows="4"
                    placeholder="Type your reply here..."
                    required
                  ></textarea>
                </div>
                <button type="submit" class="btn btn-success" :disabled="replying">
                  {{ replying ? 'Sending...' : '📤 Send Reply' }}
                </button>
              </form>
            </div>

            <!-- Show Reply if exists -->
            <div v-if="selectedMessage.replyContent" class="border-top pt-3 mt-3">
              <h6>Admin Reply:</h6>
              <div class="border p-3 rounded bg-success bg-opacity-10">
                {{ selectedMessage.replyContent }}
              </div>
              <small class="text-muted">
                Replied on {{ formatDate(selectedMessage.repliedAt) }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMessages, replyMessage, markMessageAsRead } from "../helpers";
import { isAdmin } from "../helpers";

export default {
  data() {
    return {
      messages: [],
      selectedMessage: null,
      replyContent: '',
      replying: false
    };
  },
  computed: {
    isAdmin() {
      return isAdmin();
    }
  },
  async created() {
    await this.loadMessages();
  },
  methods: {
    async loadMessages() {
      try {
        const response = await getMessages();
        this.messages = response.data;
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    },

    async selectMessage(message) {
      this.selectedMessage = message;

      // Mark as read if it's unread and user is the recipient
      if (message.status === 'unread' && message.to._id === JSON.parse(localStorage.getItem('user'))._id) {
        try {
          await markMessageAsRead(message._id);
          message.status = 'read';
        } catch (error) {
          console.error('Error marking message as read:', error);
        }
      }
    },

    async sendReply() {
      if (!this.replyContent.trim()) return;

      this.replying = true;
      try {
        await replyMessage(this.selectedMessage._id, this.replyContent);
        this.replyContent = '';
        await this.loadMessages();
        alert('✅ Reply sent successfully!');
      } catch (error) {
        alert('❌ Failed to send reply: ' + error.response?.data?.error);
      } finally {
        this.replying = false;
      }
    },

    getStatusClass(status) {
      const classes = {
        'unread': 'bg-danger',
        'read': 'bg-warning',
        'replied': 'bg-success'
      };
      return classes[status] || 'bg-secondary';
    },

    getPriorityClass(priority) {
      const classes = {
        'low': 'bg-success',
        'normal': 'bg-primary',
        'high': 'bg-warning',
        'urgent': 'bg-danger'
      };
      return classes[priority] || 'bg-secondary';
    },

    formatDate(date) {
      return new Date(date).toLocaleString();
    }
  }
};
</script>

<style scoped>
.message-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.message-item:hover {
  background-color: #f8f9fa !important;
}
</style>