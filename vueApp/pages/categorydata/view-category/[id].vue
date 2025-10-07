<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()

// States
const category = ref(null)
const loading = ref(true)
const error = ref(null)
const imageUrl = ref(null)

const goBack = () => {
  router.back()
}

// Fetch category by ID
const fetchCategory = async () => {
  try {
    const id = route.params.id
    const response = await $api.get(`/categories/${id}/`)
    category.value = response.data.data

    if (category.value.category_image) {
      imageUrl.value = `${$api.defaults.baseURL.replace('/api','')}${category.value.category_image}`
    }
  } catch (err) {
    console.error('Error fetching category:', err)
    error.value = 'Failed to load category details.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchCategory)
</script>

<template>
  <div class="form-wrapper">
    <VCard class="form-card">
      <div class="text-center my-4">
        <h2 class="form-title">View Category 👁️</h2>
      </div>

      <VCardText>
        <div v-if="loading" class="py-4 text-center">Loading...</div>
        <div v-else-if="error" class="py-4 text-center text-red-500">{{ error }}</div>

        <div v-else-if="category">
          <VRow dense> <!-- ✅ reduce spacing -->
            <VCol cols="12" sm="6">
              <p><strong>Category Name:</strong> {{ category.category_name }}</p>
            </VCol>

            <VCol cols="12" sm="6">
              <p><strong>Description:</strong> {{ category.description }}</p>
            </VCol>

            <VCol cols="12" sm="6">
              <p><strong>Created By:</strong> {{ category.created_by_name }}</p>
            </VCol>

            <!-- Show Image -->
            <VCol cols="12" sm="6" v-if="imageUrl">
              <p><strong>Category Image:</strong></p>
              <img :src="imageUrl" alt="Category Image" class="preview-img" />
            </VCol>
          </VRow>
        </div>

        <!-- Back Button -->
        <VRow class="mt-4" justify="center" align="center">
          <VCol cols="auto">
            <VBtn color="secondary" variant="outlined" @click="goBack">
              Back
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
.form-wrapper {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.form-card {
  max-width: 7200px;
  width: 100%;
  padding: 16px; /* ✅ smaller padding */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.form-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
}

p {
  margin: 6px 0; /* ✅ reduce spacing between text rows */
  font-size: 14px;
}

.preview-img {
  width: 100%;         /* ✅ responsive */
  max-width: 300px;    /* limit on large screens */
  height: auto;        /* keep aspect ratio */
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-top: 6px;
}
</style>
