<template>
  <div class="form-wrapper">
    <VCard class="form-card">
      <div class="text-center my-4">
        <h2 class="form-title">Add Category Details </h2>
      </div>

      <VCardText>
        <VForm @submit.prevent="handleAddCategories">
          <VRow>
            <VCol cols="12" md="6">
              <VTextField
                v-model="form.category_name"
                label="Category Name"
                required
              />
            </VCol>
            <VCol cols="12" md="6">
              <VFileInput
                v-model="form.product_image"
                accept="image/*"
                label="Product Image"
                :rules="[rules.required]"
                required
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextarea
                v-model="form.description"
                label="Description"
              />
            </VCol>
          
          </VRow>

          <!-- Action buttons -->
          <VRow class="mt-6" justify="center" align="center">
            <VCol cols="auto">
              <VBtn
                type="button"
                color="secondary"
                variant="outlined"
                :loading="isCancelling"
                class="action-btn"
                @click="handleCancel"
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
                Add Category
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { VTextarea } from "vuetify/components/VTextarea"
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const { $api } = useNuxtApp()
const auth = useAuthStore()

// form state
const form = ref({
  created_by:auth.admin?.user_id,
  category_name: "",
  description: "",
})


const isSubmitting = ref(false)
const isCancelling = ref(false)

// handle add user
const handleAddCategories = async () => {
  isSubmitting.value = true
  try {
    await $api.post("categories/", {
      created_by:auth.admin?.user_id,
      category_name: form.value.category_name,
      description: form.value.description,
    })
    router.push("/Category")
  } catch (err) {
    console.error(err)
  } finally {
    isSubmitting.value = false
  }
}

// handle cancel
const handleCancel = () => {
  isCancelling.value = true
  setTimeout(() => {
    router.push("/Category")
    isCancelling.value = false
  }, 800)
}
</script>

<style scoped>
.form-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f9faff;
  min-block-size: 60vh;
}

.form-card {
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 5%);
  inline-size: 100%;
  max-inline-size: 7020px;
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  margin-block-end: 12px;
}

.action-btn {
  font-weight: 600;
  min-inline-size: 140px;
  text-transform: none;
}
</style>
