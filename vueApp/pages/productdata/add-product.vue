<template>
  <div class="form-wrapper">
    <VCard class="form-card">
      <div class="text-center my-4">
        <h2 class="form-title">Add Product Details</h2>
      </div>

      <VCardText>
        <VForm ref="formRef" @submit.prevent="handleAddProduct">
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
              <VFileInput
                v-model="form.product_image"
                accept="image/*"
                label="Product Image"
                :rules="[rules.required]"
                required
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
            <VCol cols="12" md="12">
              <VTextarea
                v-model="form.product_description"
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
                Add Product
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const { $api } = useNuxtApp()
const auth = useAuthStore()

// refs
const formRef = ref(null)

// form state
const form = ref({
  created_by: auth.admin?.user_id,
  product_name: "",
  product_description: "",
  category: null, 
  product_image: null,
  price: "",
  stock_quantity: "",
})

const categories = ref([]) // dropdown items

const isSubmitting = ref(false)
const isCancelling = ref(false)

// validation rules
const rules = {
  required: v => !!v || "This field is required",
  numeric: v => !isNaN(parseFloat(v)) || "Must be a number",
  integer: v => Number.isInteger(Number(v)) || "Must be an integer",
}

// fetch categories from backend
const fetchCategories = async () => {
  try {
    const res = await $api.get("categories/")
    categories.value = res.data.data
  } catch (err) {
    console.error("Error fetching categories:", err)
  }
}

onMounted(fetchCategories)

// handle add product
const handleAddProduct = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  isSubmitting.value = true
  try {
    const payload = new FormData()
    payload.append("created_by", auth.admin?.user_id)
    payload.append("product_name", form.value.product_name)
    payload.append("product_description", form.value.product_description || "")
    payload.append("category", form.value.category)
    payload.append("price", form.value.price)
    payload.append("stock_quantity", form.value.stock_quantity)
    payload.append("is_available", true)
    if (form.value.product_image) {
      payload.append("product_image", form.value.product_image)
    }

    await $api.post("product/", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    })

    router.push("/product")
  } catch (err) {
    console.error("Error adding product:", err)
  } finally {
    isSubmitting.value = false
  }
}

// handle cancel
const handleCancel = () => {
  isCancelling.value = true
  setTimeout(() => {
    router.push("/product")
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
  min-block-size: 60vh; /* removed bg */
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
