<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const { $api } = useNuxtApp()

const route = useRoute()
const router = useRouter()
const user = ref(null)
const loading = ref(true)

const goBack = () => {
  router.back() // go back to previous page
}

onMounted(async () => {
  try {
    const response = await $api.get(`adminsdetails/${route.params.id}/`)
    user.value = response.data.data
  } catch (err) {
    console.error('Error loading user:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="form-wrapper">
    <VCard class="form-card">
      <div class="text-center my-4">
        <h2 class="form-title">View User 👁️</h2>
      </div>

      <VCardText>
        <div v-if="loading" class="py-6 text-center">Loading...</div>

        <div v-else-if="user">
          <VRow>
            <VCol cols="12" md="6">
              <p><strong>Full Name:</strong> {{ user.full_name }}</p>
            </VCol>
            <VCol cols="12" md="6">
              <p><strong>Email:</strong> {{ user.email }}</p>
            </VCol>
            <VCol cols="12" md="6">
              <p><strong>Phone:</strong> {{ user.phone }}</p>
            </VCol>
            <VCol cols="12" md="6">
              <p><strong>Role:</strong> {{ user.role }}</p>
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
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9faff;
  padding: 20px;
}
.form-card {
  max-width: 720px;
  width: 100%;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
}
.form-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
}
</style>
