<template>
  <div class="form-wrapper">
    <VCard class="form-card">
      <div class="text-center my-4">
        <h2 class="form-title">Add Category Details</h2>
      </div>

      <VCardText>
        <VForm @submit.prevent="handleAddCategories">
          <VRow>
            <!-- Category Name -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="form.category_name"
                label="Category Name"
                :rules="[rules.required]"
                required
              />
            </VCol>

            <!-- Product Image -->
            <VCol cols="12" md="6">
              <VFileInput
                v-model="form.product_image"
                accept="image/*"
                label="Product Image"
                :rules="[rules.required, rules.imageType, rules.imageSize]"
                required
              />
            </VCol>

            <!-- Description -->
            <VCol cols="12" md="12">
              <VTextarea
                v-model="form.description"
                label="Description"
                rows="3"
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
import { ref, reactive } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"

const router = useRouter()
const { $api } = useNuxtApp()
const auth = useAuthStore()

const rules = reactive({
  required: v => !!v || "This field is required",
  imageType: v => {
    if (!v || (Array.isArray(v) && v.length === 0)) return true
    const file = Array.isArray(v) ? v[0] : v
    if (!file) return true
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    return validTypes.includes(file.type) || "Only JPEG, PNG or WEBP images are allowed"
  },
  imageSize: v => {
    if (!v || (Array.isArray(v) && v.length === 0)) return true
    const file = Array.isArray(v) ? v[0] : v
    if (!file) return true
    return file.size <= 2 * 1024 * 1024 || "Image must be less than 2MB"
  },
})


// ✅ Form state
const form = ref({
  created_by: auth.admin?.user_id,
  category_name: "",
  description: "",
  product_image: null,
})

const isSubmitting = ref(false)
const isCancelling = ref(false)

// ✅ Handle add category
const handleAddCategories = async () => {
  isSubmitting.value = true
  try {
    const payload = new FormData()
    payload.append("created_by", auth.admin?.user_id)
    payload.append("category_name", form.value.category_name)
    payload.append("description", form.value.description)

    const file = Array.isArray(form.value.product_image)
      ? form.value.product_image[0]
      : form.value.product_image

    if (file) {
      payload.append("product_image", file)
    }

    await $api.post("categories/", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    router.push("/Category")
  } catch (err) {
    console.error("Error adding category:", err)
  } finally {
    isSubmitting.value = false
  }
}

// ✅ Handle cancel
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
  max-inline-size: 720px;
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
