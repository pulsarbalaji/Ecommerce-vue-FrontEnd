<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()

// States
const category = ref(null)
const loading = ref(true)
const error = ref(null)

const goBack = () => {
  router.back() // go back to previous page
}

// Fetch category by ID
const fetchCategory = async () => {
  try {
    const id = route.params.id
    const response = await $api.get(`/categories/${id}/`)
    category.value = response.data.data
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
        <h2 class="form-title">View User 👁️</h2>
      </div>

      <VCardText>
        <div v-if="loading" class="py-6 text-center">Loading...</div>

        <div v-else-if="category">
          <VRow>
            <VCol cols="12" md="6">
              <p><strong>Category Name:</strong> {{ category.category_name }}</p>
            </VCol>
            <VCol cols="12" md="6">
              <p><strong>Description:</strong> {{ category.description }}</p>
            </VCol>
            <VCol cols="12" md="6">
              <p><strong>Created By:</strong> {{ category.created_by_name }}</p>
            </VCol>
          </VRow>
        </div>

        <VRow class="mt-6" justify="center" align="center">
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
.page-wrapper {
  padding: 24px;
  background: #f9faff;
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.actions {
  display: flex;
  gap: 8px;
}

.category-card {
  max-width: 600px;
  margin: 0 auto;
}

.detail-row {
  margin-bottom: 10px;
  font-size: 14px;
}
</style>
