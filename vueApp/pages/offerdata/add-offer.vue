<template>
  <div class="form-wrapper">
    <VCard class="form-card">
      <div class="text-center my-4">
        <h2 class="form-title">Add Offer Details</h2>
      </div>

      <VCardText>
        <VForm ref="formRef" @submit.prevent="handleAddOffer">
          <VRow>
            <!-- Category -->
            <VCol cols="12" md="6">
              <VSelect
                v-model="form.category"
                :items="categories"
                item-title="category_name"
                item-value="id"
                label="Select Category"
                :rules="[rules.required]"
                required
                @update:model-value="fetchProducts"
              />
            </VCol>

            <!-- Product -->
            <VCol cols="12" md="6">
              <VSelect
                v-model="form.product"
                :items="products"
                item-title="product_name"
                item-value="id"
                label="Select Product"
                :disabled="!form.category"
                :rules="[rules.required]"
                required
              />
            </VCol>

            <!-- Offer Name -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="form.offer_name"
                label="Offer Name"
                type="text"
                :rules="[rules.required]"
                required
              />
            </VCol>

            <!-- Offer Percentage -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="form.offer_percentage"
                label="Offer Percentage (%)"
                type="number"
                :rules="[rules.required, rules.numeric]"
                required
              />
            </VCol>

            <!-- Active Switch -->
            <VCol cols="12" md="12">
              <VSwitch v-model="form.is_active" label="Active" />
            </VCol>
          </VRow>

          <!-- Buttons -->
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
                Add Offer
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <!-- Snackbar -->
    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="top right"
      timeout="3000"
      rounded="pill"
    >
      {{ snackbar.message }}
    </VSnackbar>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"

const router = useRouter()
const { $api } = useNuxtApp()
const auth = useAuthStore()

// refs
const formRef = ref(null)

// form state
const form = ref({
  category: null,
  product: null,
  offer_name: "",
  offer_percentage: "",
  is_active: true,
  created_by: auth.admin?.user_id,
})

// dropdown lists
const categories = ref([])
const products = ref([])

const isSubmitting = ref(false)
const isCancelling = ref(false)

// snackbar state
const snackbar = ref({
  show: false,
  message: "",
  color: "success",
})

// validation rules
const rules = {
  required: (v) => !!v || "This field is required",
  numeric: (v) => !isNaN(parseFloat(v)) || "Must be a number",
}

// fetch categories
const fetchCategories = async () => {
  try {
    const res = await $api.get("categories/")
    categories.value = res.data.data
  } catch (err) {
    console.error("Error fetching categories:", err)
  }
}

// fetch products based on category
const fetchProducts = async (categoryId) => {
  if (!categoryId) return
  try {
    const res = await $api.get(`offers/category/${categoryId}/`)
    products.value = res.data.data
  } catch (err) {
    console.error("Error fetching products:", err)
  }
}

// handle add offer
const handleAddOffer = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  isSubmitting.value = true
  try {
    const payload = {
      created_by: form.value.created_by,
      category: form.value.category,
      product: form.value.product,
      offer_name: form.value.offer_name,
      offer_percentage: form.value.offer_percentage,
      is_active: form.value.is_active,
    }

    await $api.post("offers/", payload)

    // ✅ Show success message
    snackbar.value = {
      show: true,
      message: "Offer added successfully!",
      color: "success",
    }

    // Redirect after short delay
    setTimeout(() => router.push("/offer-details"), 1200)
  } catch (err) {
    console.error("Error adding offer:", err)

    // ❌ Show error message
    snackbar.value = {
      show: true,
      message: err.response?.data?.detail || "Failed to add offer",
      color: "error",
    }
  } finally {
    isSubmitting.value = false
  }
}

// cancel button
const handleCancel = () => {
  isCancelling.value = true
  setTimeout(() => {
    router.push("/offer")
    isCancelling.value = false
  }, 800)
}

onMounted(fetchCategories)
</script>

<style scoped>
.form-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
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
