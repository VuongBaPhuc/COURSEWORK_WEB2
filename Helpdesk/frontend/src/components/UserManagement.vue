<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>👥 User Management</h2>
      <button class="btn btn-primary" @click="showCreateForm = true">
        ➕ Add New User
      </button>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user._id">
                <td>{{ user.name }}</td>
                <td><code>{{ user.username }}</code></td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="badge" :class="getRoleClass(user.role)">
                    {{ user.role }}
                  </span>
                </td>
                <td>
                  <span class="badge" :class="user.isActive ? 'bg-success' : 'bg-danger'">
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>{{ user.lastLogin ? formatDate(user.lastLogin) : 'Never' }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-warning me-1"
                    @click="editUser(user)"
                    v-if="user.role !== 'admin'"
                  >
                    ✏️
                  </button>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="deleteUser(user._id)"
                    v-if="user.role !== 'admin'"
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

    <!-- Create/Edit User Modal -->
    <div v-if="showCreateForm || editingUser" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingUser ? '✏️ Edit User' : '➕ Add New User' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="mb-3">
                <label class="form-label">Name *</label>
                <input v-model="userForm.name" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Username *</label>
                <input v-model="userForm.username" type="text" class="form-control" required :disabled="!!editingUser">
              </div>
              <div class="mb-3">
                <label class="form-label">Email *</label>
                <input v-model="userForm.email" type="email" class="form-control" required>
              </div>
              <div class="mb-3" v-if="!editingUser">
                <label class="form-label">Password *</label>
                <input v-model="userForm.password" type="password" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Role *</label>
                <select v-model="userForm.role" class="form-select" required>
                  <option value="employee">Employee</option>
                  <option value="customer">Customer</option>
                  <option value="admin" disabled>Admin</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? 'Saving...' : (editingUser ? '💾 Update' : '➕ Create') }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUsers, createUser, updateUser, deleteUser } from "../helpers";

export default {
  data() {
    return {
      users: [],
      showCreateForm: false,
      editingUser: null,
      saving: false,
      userForm: {
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'employee'
      }
    };
  },
  async created() {
    await this.loadUsers();
  },
  methods: {
    async loadUsers() {
      try {
        const response = await getUsers();
        this.users = response.data;
      } catch (error) {
        console.error('Error loading users:', error);
      }
    },

    editUser(user) {
      this.editingUser = user;
      this.userForm = {
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role
      };
    },

    closeModal() {
      this.showCreateForm = false;
      this.editingUser = null;
      this.userForm = {
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'employee'
      };
    },

    async saveUser() {
      this.saving = true;
      try {
        if (this.editingUser) {
          await updateUser(this.editingUser._id, this.userForm);
          alert('✅ User updated successfully!');
        } else {
          await createUser(this.userForm);
          alert('✅ User created successfully!');
        }
        await this.loadUsers();
        this.closeModal();
      } catch (error) {
        alert('❌ Failed to save user: ' + error.response?.data?.error);
      } finally {
        this.saving = false;
      }
    },

    async deleteUser(id) {
      if (confirm('Are you sure you want to deactivate this user?')) {
        try {
          await deleteUser(id);
          await this.loadUsers();
          alert('User deactivated successfully!');
        } catch (error) {
          alert('Failed to deactivate user: ' + error.response?.data?.error);
        }
      }
    },

    getRoleClass(role) {
      const classes = {
        'admin': 'bg-danger',
        'employee': 'bg-primary',
        'customer': 'bg-success'
      };
      return classes[role] || 'bg-secondary';
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    }
  }
};
</script>