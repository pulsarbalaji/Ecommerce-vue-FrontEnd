<script setup>
import { ref, onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"

const { $api } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

// refs
const formRef = ref(null)
const categories = ref([])
const products = ref([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const isCancelling = ref(false)

// offer image preview (if needed later)
const offerImageUrl = ref(null)

// form state
const form = ref({
  offer_name: "",
  offer_percentage: "",
  category: null,
  product: null,
  is_active: true,
  created_by: auth.admin?.user_id,
})

// snackbar
const snackbar = ref({ show: false, text: "", color: "success" })

// validation rules
const rules = {
  required: v => !!v || "This field is required",
  numeric: v => !isNaN(parseFloat(v)) || "Must be a number",
  percent: v => (v >= 0 && v <= 100) || "Must be between 0 and 100",
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

// ✅ fetch products filtered by category
const fetchProducts = async (categoryId) => {
  if (!categoryId) {
    products.value = []
    return
  }
  try {
    const res = await $api.get(`offers/category/${categoryId}/`)
    products.value = res.data.data
  } catch (err) {
    console.error("Error fetching products:", err)
  }
}

// fetch offer details
const fetchOffer = async () => {
  try {
    const res = await $api.get(`offers/${route.params.id}/`)
    const data = res.data.data

    form.value.offer_name = data.offer_name
    form.value.offer_percentage = data.offer_percentage
    form.value.category = data.category
    form.value.product = data.product
    form.value.is_active = data.is_active

    // preview image
    offerImageUrl.value = data.offer_image
      ? `${$api.defaults.baseURL}${data.offer_image}`
      : null

    // ✅ fetch product list for this offer’s category
    if (data.category) {
      await fetchProducts(data.category)
    }
  } catch (err) {
    console.error("Error fetching offer:", err)
    snackbar.value = { show: true, text: "Error loading offer.", color: "error" }
  } finally {
    isLoading.value = false
  }
}

// ✅ watch for category change dynamically
watch(
  () => form.value.category,
  async (newCategory) => {
    if (newCategory) {
      await fetchProducts(newCategory)
      form.value.product = null // reset product when category changes
    }
  }
)

onMounted(async () => {
  await fetchCategories()
  await fetchOffer()
})

// handle update
const handleUpdateOffer = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  isSubmitting.value = true
  try {
    const payload = new FormData()
    payload.append("offer_name", form.value.offer_name)
    payload.append("offer_percentage", form.value.offer_percentage)
    payload.append("category", form.value.category)
    payload.append("product", form.value.product)
    payload.append("is_active", form.value.is_active)

    if (form.value.offer_image instanceof File) {
      payload.append("offer_image", form.value.offer_image)
    }

    await $api.put(`offers/${route.params.id}/`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    })

    snackbar.value = { show: true, text: "Offer updated successfully!", color: "success" }
    setTimeout(() => router.push("/offer"), 1200)
  } catch (err) {
    console.error("Error updating offer:", err)
    snackbar.value = { show: true, text: "Error updating offer.", color: "error" }
  } finally {
    isSubmitting.value = false
  }
}

// cancel
const handleCancel = () => {
  isCancelling.value = true
  setTimeout(() => {
    router.push("/offer")
    isCancelling.value = false
  }, 800)
}
</script>

<template>
  <div class="form-wrapper">
    <VCard class="form-card">
      <div class="text-center my-4">
        <h2 class="form-title">Edit Offer ✏️</h2>
      </div>

      <VCardText>
        <VForm v-if="!isLoading" ref="formRef" @submit.prevent="handleUpdateOffer">
          <VRow>
            <!-- Offer Name -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="form.offer_name"
                label="Offer Name"
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
                :rules="[rules.required, rules.numeric, rules.percent]"
                required
              />
            </VCol>

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
              />
            </VCol>

            <!-- Product (filtered by category) -->
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

            <!-- Status -->
            <VCol cols="12" md="6">
              <VSwitch
                v-model="form.is_active"
                label="Active Status"
                color="success"
              />
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
                Update Offer
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
      timeout="3000"
      location="top right"
    >
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
  padding: 20px;
}

.form-card {
  max-width: 700px;
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

.action-btn {
  font-weight: 600;
  text-transform: none;
}
</style>
