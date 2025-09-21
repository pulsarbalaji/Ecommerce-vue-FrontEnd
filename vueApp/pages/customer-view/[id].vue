<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()

// States
const customer = ref(null)
const loading = ref(true)
const error = ref(null)

// Go back to previous page
const goBack = () => {
  router.back()
}

// Fetch customer by ID
const fetchCustomer = async () => {
  try {
    const id = route.params.id
    const response = await $api.get(`/customerslist/${id}/`)
    customer.value = response.data.data
  } catch (err) {
    console.error('Error fetching customer:', err)
    error.value = 'Failed to load customer details.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchCustomer)
</script>

<template>
  <div class="form-wrapper">
    <VCard class="form-card">
      <div class="text-center my-4">
        <h2 class="form-title">View Customer 👁️</h2>
      </div>

      <VCardText>
        <div v-if="loading" class="py-6 text-center">Loading...</div>

        <div v-else-if="customer">
          <VRow>
            <VCol cols="12" md="6">
              <p><strong>Full Name:</strong> {{ customer.full_name }}</p>
            </VCol>
            <VCol cols="12" md="6">
              <p><strong>Address:</strong> {{ customer.address }}</p>
            </VCol>
            <VCol cols="12" md="6">
              <p><strong>Date of Birth:</strong> {{ customer.dob }}</p>
            </VCol>
            <VCol cols="12" md="6">
              <p><strong>Gender:</strong> {{ customer.gender }}</p>
            </VCol>
            <VCol cols="12" md="6" v-if="customer.profile_image">
              <p><strong>Profile Image:</strong></p>
              <img :src="customer.profile_image" alt="Profile" width="100" class="rounded-md" />
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
.form-wrapper {
  padding: 24px;
  background: #f9faff;
  min-height: 100vh;
}

.form-card {
  max-width: 700px;
  margin: 0 auto;
  padding: 16px;
}

.form-title {
  font-weight: 600;
}

img.rounded-md {
  border-radius: 8px;
  object-fit: cover;
}
</style>
