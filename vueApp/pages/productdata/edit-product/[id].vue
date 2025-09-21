<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"

const { $api } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

// refs
const formRef = ref(null)
const categories = ref([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const isCancelling = ref(false)

// product image preview
const productImageUrl = ref(null)

// form state
const form = ref({
  product_name: "",
  product_description: "",
  category: null,
  product_image: null, // file
  price: "",
  stock_quantity: "",
  created_by: auth.admin?.user_id,
})

// snackbar
const snackbar = ref({ show: false, text: "", color: "success" })

// validation rules
const rules = {
  required: v => !!v || "This field is required",
  numeric: v => !isNaN(parseFloat(v)) || "Must be a number",
  integer: v => Number.isInteger(Number(v)) || "Must be an integer",
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

// fetch product
const fetchProduct = async () => {
  try {
    const res = await $api.get(`product/${route.params.id}/`)
    const data = res.data.data
    form.value.product_name = data.product_name
    form.value.product_description = data.product_description
    form.value.category = data.category
    form.value.price = data.price
    form.value.stock_quantity = data.stock_quantity
    form.value.created_by = data.created_by

    // fix absolute image path
    productImageUrl.value = data.product_image
      ? `${$api.defaults.baseURL}${data.product_image}`
      : null
  } catch (err) {
    snackbar.value = { show: true, text: "Error loading product.", color: "error" }
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchProduct()])
})

// handle update
const handleUpdateProduct = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  isSubmitting.value = true
  try {
    const payload = new FormData()
    payload.append("product_name", form.value.product_name)
    payload.append("product_description", form.value.product_description || "")
    payload.append("category", form.value.category)
    payload.append("price", form.value.price)
    payload.append("stock_quantity", form.value.stock_quantity)

    if (form.value.product_image instanceof File) {
      payload.append("product_image", form.value.product_image)
    }

    await $api.put(`product/${route.params.id}/`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    })

    snackbar.value = { show: true, text: "Product updated successfully!", color: "success" }
    setTimeout(() => router.push("/product"), 1200)
  } catch (err) {
    console.error("Error updating product:", err)
    snackbar.value = { show: true, text: "Error updating product.", color: "error" }
  } finally {
    isSubmitting.value = false
  }
}

// cancel
const handleCancel = () => {
  isCancelling.value = true
  setTimeout(() => {
    router.push("/product")
    isCancelling.value = false
  }, 800)
}
</script>

<template>
  <div class="form-wrapper">
    <VCard class="form-card">
      <div class="text-center my-4">
        <h2 class="form-title">Edit Product ✏️</h2>
      </div>

      <VCardText>
        <VForm v-if="!isLoading" ref="formRef" @submit.prevent="handleUpdateProduct">
          <VRow>
            <!-- Product Name -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="form.product_name"
                label="Product Name"
                :rules="[rules.required]"
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

            <!-- Product Image -->
            <VCol cols="12" md="6">
              

              <!-- Upload new -->
              <VFileInput
                v-model="form.product_image"
                accept="image/*"
                label="Upload New Image"
              />
            </VCol>

            <!-- Price -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="form.price"
                label="Price"
                type="number"
                :rules="[rules.required, rules.numeric]"
                required
              />
            </VCol>

            <!-- Stock Quantity -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="form.stock_quantity"
                label="Stock Quantity"
                type="number"
                :rules="[rules.required, rules.integer]"
                required
              />
            </VCol>

            <!-- Description -->
            <VCol cols="12" md="6">
              <VTextarea
                v-model="form.product_description"
                label="Description"
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
                Update Product
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
  background: #f9faff;
  padding: 20px;
}

.form-card {
  max-width: 7000px;
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

.image-preview {
  margin-bottom: 12px;
}

.preview-img {
  max-width: 180px;
  max-height: 180px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
}
</style>
