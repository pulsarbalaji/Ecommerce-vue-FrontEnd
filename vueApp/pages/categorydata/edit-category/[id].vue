<script setup>
import { ref, onMounted, computed } from "vue"
const { $api } = useNuxtApp()
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

const form = ref({ category_name: "", description: "", category_image: null })
const existingImage = ref(null)
const isLoading = ref(true)
const isSubmitting = ref(false)
const isCancelling = ref(false)
const snackbar = ref({ show: false, text: "", color: "success" })

// ✅ Compute correct image URL without /api
const imageUrl = computed(() => {
  if (!existingImage.value) return null
  // remove trailing slash + /api
  const base = $api.defaults.baseURL.replace(/\/api\/?$/, "")
  const path = existingImage.value.replace(/^\//, "")
  return `${base}/${path}`
})

// Fetch category
onMounted(async () => {
  try {
    const response = await $api.get(`categories/${route.params.id}/`)
    form.value.category_name = response.data.data.category_name
    form.value.description = response.data.data.description
    existingImage.value = response.data.data.category_image
  } catch (err) {
    snackbar.value = { show: true, text: "Error loading category.", color: "error" }
  } finally {
    isLoading.value = false
  }
})

// Update category
const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const payload = new FormData()
    payload.append("category_name", form.value.category_name)
    payload.append("description", form.value.description)

    if (form.value.category_image) {
      const file = Array.isArray(form.value.category_image)
        ? form.value.category_image[0]
        : form.value.category_image
      payload.append("category_image", file)
    }

    await $api.put(`categories/${route.params.id}/`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    })

    snackbar.value = { show: true, text: "Category updated successfully!", color: "success" }
    setTimeout(() => router.push("/Category"), 1500)
  } catch (err) {
    snackbar.value = { show: true, text: "Error updating category.", color: "error" }
  } finally {
    isSubmitting.value = false
  }
}

// Cancel
const handleCancel = () => {
  isCancelling.value = true
  router.push("/Category")
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
              <VTextarea v-model="form.description" label="Description" rows="3" />
            </VCol>

            <VCol cols="12" md="6">
              <VFileInput v-model="form.category_image" accept="image/*" label="Update Category Image" />
            </VCol>

            <VCol cols="12" md="6" v-if="imageUrl">
              <div class="preview-box">
                <p class="mb-2">Current Image:</p>
                <img :src="imageUrl" alt="Category Image" class="preview-img" />
              </div>
            </VCol>
          </VRow>

          <VRow class="mt-6" justify="center" align="center">
            <VCol cols="auto">
              <VBtn type="button" color="secondary" variant="outlined" :loading="isCancelling" class="action-btn" @click="handleCancel">
                Cancel
              </VBtn>
            </VCol>
            <VCol cols="auto">
              <VBtn type="submit" color="primary" :loading="isSubmitting" class="action-btn">
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
<style>
.preview-img {
  width: 300px;      /* fixed width */
  height: 200px;     /* fixed height */
  object-fit: cover; /* crop nicely instead of stretching */
  border-radius: 8px;
  border: 1px solid #ddd;
}

</style>
