<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>📝 Issues List</h2>
      <router-link to="/new" class="btn btn-primary btn-lg">
        + Add New Issue
      </router-link>
    </div>

    <div v-if="words.length === 0" class="alert alert-info text-center">
      No issues yet. Create your first one!
    </div>

    <div class="row">
      <div v-for="word in words" :key="word._id" class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ word.issueCode }}</h5>
            <p class="card-text">{{ word.responseText }}</p>
            <div class="badge bg-info mb-3">{{ word.category }}</div>
          </div>
          <div class="card-footer bg-light d-flex gap-2">
            <router-link 
              :to="'/edit/' + word._id" 
              class="btn btn-sm btn-warning flex-grow-1"
            >
              ✏️ Edit
            </router-link>
            <button 
              @click="remove(word._id)" 
              class="btn btn-sm btn-danger flex-grow-1"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getWords, deleteWord } from "../helpers";

export default {
  data() {
    return { words: [] };
  },
  async created() {
    const res = await getWords();
    this.words = res.data;
  },
  methods: {
    async remove(id) {
      if (confirm("Are you sure?")) {
        await deleteWord(id);
        this.words = this.words.filter(w => w._id !== id);
      }
    }
  }
};
</script>