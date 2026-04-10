<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="card shadow">
        <div class="card-body">
          <h2 class="card-title mb-4">✏️ Edit Issue</h2>

          <form @submit.prevent="updateData" v-if="word._id">
            <div class="mb-3">
              <label for="issueCode" class="form-label">Issue Code</label>
              <input 
                id="issueCode"
                v-model="word.issueCode" 
                type="text"
                class="form-control form-control-lg"
                required
              />
            </div>

            <div class="mb-3">
              <label for="responseText" class="form-label">Response / Solution</label>
              <textarea 
                id="responseText"
                v-model="word.responseText" 
                class="form-control form-control-lg"
                rows="5"
                required
              ></textarea>
            </div>

            <div class="mb-3">
              <label for="category" class="form-label">Category</label>
              <select 
                id="category"
                v-model="word.category"
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
              <button type="submit" class="btn btn-success btn-lg flex-grow-1">
                💾 Save Changes
              </button>
              <router-link to="/" class="btn btn-secondary btn-lg flex-grow-1">
                ❌ Cancel
              </router-link>
            </div>
          </form>

          <div v-else class="alert alert-warning">
            Loading...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getWord, updateWord } from "../helpers";

export default {
  data() {
    return {
      word: {}
    };
  },
  async created() {
    const res = await getWord(this.$route.params.id);
    this.word = res.data;
  },
  methods: {
    async updateData() {
      await updateWord(this.word._id, this.word);
      alert("✅ Issue updated successfully!");
      this.$router.push("/");
    }
  }
};
</script>