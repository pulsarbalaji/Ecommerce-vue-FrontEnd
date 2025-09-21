<script setup>
import { ref, onMounted } from 'vue'
const { $api } = useNuxtApp()
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const form = ref({ category_name: '', description: '' })
const isLoading = ref(true)
const isSubmitting = ref(false)
const snackbar = ref({ show: false, text: '', color: 'success' })

// Fetch user data
onMounted(async () => {
  try {
    const response = await $api.get(`categories/${route.params.id}/`)
    form.value = response.data.data
  } catch (err) {
    snackbar.value = { show: true, text: 'Error loading user.', color: 'error' }
  } finally {
    isLoading.value = false
  }
})

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    await $api.put(`categories/${route.params.id}/`, form.value)
    snackbar.value = { show: true, text: 'Category updated successfully!', color: 'success' }
    setTimeout(() => router.push('/Category'), 1500)
  } catch (err) {
    snackbar.value = { show: true, text: 'Error updating user.', color: 'error' }
  } finally {
    isSubmitting.value = false
  }
}
const isCancelling = ref(false)
const handlecancel =()=> {
  isCancelling.value =true
  router.push('/Category')
  isCancelling.value = false
}
</script>
<template>
  <div class="form-wrapper">
    <VCard class="form-card">
      <div class="text-center my-4">
        <h2 class="form-title">Edit Category ✏️</h2>
      </div>

      <VCardText>
        <VForm v-if="!isLoading" @submit.prevent="handleSubmit">
          <VRow>
            <VCol cols="12" md="6">
              <VTextField v-model="form.category_name" label="Category Name" required />
            </VCol>
            <VCol cols="12" md="6">
              <VTextarea v-model="form.description" label="Description"   />
            </VCol>
          </VRow>
<VRow class="mt-6" justify="center" align="center">
  <VCol cols="auto">
    <VBtn
      type="button"
      color="secondary"
      variant="outlined"
      :loading="isCancelling"
      class="action-btn"
      @click="handlecancel"
    >
      Cancel
    </VBtn>
  </VCol>

  <VCol cols="auto">
    <VBtn
      type="submit"
      color="primary"
      :loading="isSubmitting"
      class="action-btn"
    >
      Update Category
    </VBtn>
  </VCol>
</VRow>

        </VForm>
      </VCardText>
    </VCard>

    <VSnackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="top right">
      {{ snackbar.text }}
    </VSnackbar>
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
  max-width: 7020px;
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
.submit-btn {
 background-color: #10b981 !important;
  color: white !important;
  font-weight: 100;
  padding: 12px 0;
  border-radius: 8px;
  text-transform: none;
}
</style>
