<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card shadow">
        <div class="card-body">
          <h2 class="card-title mb-4">➕ Create New Issue</h2>

          <form @submit.prevent="add">
            <div class="mb-3">
              <label for="issueCode" class="form-label">Issue Code</label>
              <input 
                id="issueCode"
                v-model="issueCode" 
                type="text"
                class="form-control form-control-lg"
                placeholder="e.g., ERROR-001"
                required
              />
            </div>

            <div class="mb-3">
              <label for="responseText" class="form-label">Response / Solution</label>
              <textarea 
                id="responseText"
                v-model="responseText" 
                class="form-control form-control-lg"
                rows="5"
                placeholder="Describe the solution..."
                required
              ></textarea>
            </div>

            <div class="mb-3">
              <label for="category" class="form-label">Category</label>
              <select 
                id="category"
                v-model="category"
                class="form-select form-select-lg"
                required
              >
                <option value="">-- Select Category --</option>
                <option value="Network">Network</option>
                <option value="Software">Software</option>
                <option value="Hardware">Hardware</option>
                <option value="Password">Password</option>
                <option value="Email">Email</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary btn-lg flex-grow-1">
                ✅ Create Issue
              </button>
              <router-link to="/" class="btn btn-secondary btn-lg flex-grow-1">
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
import { createWord } from "../helpers";

export default {
  data() {
    return {
      issueCode: "",
      responseText: "",
      category: ""
    };
  },
  methods: {
    async add() {
      if (!this.issueCode || !this.responseText || !this.category) {
        alert("Please fill all fields!");
        return;
      }
      await createWord(this.$data);
      alert("✅ Issue created successfully!");
      this.$router.push("/");
    }
  }
};
</script>