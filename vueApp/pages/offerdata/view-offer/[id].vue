<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { VChip } from 'vuetify/components'
import { MEDIA_BASE_URL } from '@/utils/base_url'

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()

// State
const offer = ref(null)
const loading = ref(true)
const error = ref(null)

// Go back
const goBack = () => {
  router.back()
}

// Fetch offer details
const fetchOffer = async () => {
  try {
    const id = route.params.id
    const response = await $api.get(`/offers/${id}/`)
    offer.value = response.data.data
  } catch (err) {
    console.error('Error fetching offer:', err)
    error.value = 'Failed to load offer details.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchOffer)
</script>

<template>
  <div class="page-wrapper">
    <VCard class="form-card">
      <!-- Title -->
      <div class="text-center mb-6">
        <h2 class="form-title">View Offer 👁️</h2>
      </div>

      <VCardText>
        <!-- Loading -->
        <div v-if="loading" class="py-6 text-center">Loading...</div>

        <!-- Error -->
        <div v-else-if="error" class="py-6 text-center text-red-500">
          {{ error }}
        </div>

        <!-- Offer Details -->
        <div v-else-if="offer">
          <VRow dense>
            <VCol cols="12" sm="6">
              <p><strong>Offer Name:</strong> {{ offer.offer_name }}</p>
            </VCol>

            <VCol cols="12" sm="6">
              <p><strong>Category:</strong> {{ offer.category_name }}</p>
            </VCol>

            <VCol cols="12" sm="6">
              <p><strong>Product:</strong> {{ offer.product_name }}</p>
            </VCol>

            <VCol cols="12" sm="6">
              <p><strong>Offer Percentage:</strong> {{ offer.offer_percentage }}%</p>
            </VCol>

            <VCol cols="12" sm="6">
              <p><strong>Start Date:</strong> {{ offer.start_date }}</p>
            </VCol>

            <VCol cols="12" sm="6">
              <p><strong>End Date:</strong> {{ offer.end_date }}</p>
            </VCol>

            <VCol cols="12" sm="6">
              <div class="flex items-center">
                <strong>Status:</strong>
                <VChip
                  :color="offer.is_active ? 'success' : 'error'"
                  text-color="white"
                  size="small"
                  class="ml-2"
                >
                  {{ offer.is_active ? 'Active' : 'Inactive' }}
                </VChip>
              </div>
            </VCol>

            <VCol cols="12" sm="6" v-if="offer.created_at">
              <p><strong>Created On:</strong> {{ new Date(offer.created_at).toLocaleString() }}</p>
            </VCol>
         
          </VRow>
        </div>

        <!-- Back Button -->
        <VRow class="mt-6" justify="center">
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
  padding: 16px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.form-card {
  max-width: 720px;
  width: 100%;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.08);
}

.form-title {
  font-weight: 600;
  font-size: 22px;
  color: #333;
}

.offer-image {
  width: 100%;
  max-width: 260px;
  max-height: 260px;
  object-fit: contain;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: #fff;
  padding: 6px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
