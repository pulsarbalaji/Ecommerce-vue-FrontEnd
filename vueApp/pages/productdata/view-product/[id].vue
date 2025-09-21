<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { VChip, VRating } from 'vuetify/components'
import { MEDIA_BASE_URL } from '@/utils/base_url'

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()

// State
const product = ref(null)
const loading = ref(true)
const error = ref(null)

// Go back
const goBack = () => {
  router.back()
}

// Fetch product details
const fetchProduct = async () => {
  try {
    const id = route.params.id
    const response = await $api.get(`/product/${id}/`)
    product.value = response.data.data
  } catch (err) {
    console.error('Error fetching product:', err)
    error.value = 'Failed to load product details.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProduct)
</script>

<template>
  <div class="page-wrapper">
    <VCard class="form-card">
      <div class="text-center my-4">
        <h2 class="form-title">View Product 👁️</h2>
      </div>

      <VCardText>
        <!-- Loading -->
        <div v-if="loading" class="py-6 text-center">Loading...</div>

        <!-- Error -->
        <div v-else-if="error" class="py-6 text-center text-red-500">
          {{ error }}
        </div>

        <!-- Product Details -->
        <div v-else-if="product">
          <!-- Product Image -->
          <div class="text-center mb-6">
            <img
              v-if="product.product_image"
              :src="MEDIA_BASE_URL + product.product_image"
              alt="Product Image"
              class="product-image"
            />
            <span v-else>No Image</span>
          </div>

          <VRow>
            <VCol cols="12" md="6">
              <p><strong>Product Name:</strong> {{ product.product_name }}</p>
            </VCol>

            <VCol cols="12" md="6">
              <p><strong>Category:</strong> {{ product.category_name }}</p>
            </VCol>

            <VCol cols="12" md="6">
  <div class="flex items-center">
    <strong>Availability:</strong>
    <VChip
      :color="product.is_available ? 'succuss' : 'error'"
      text-color="white"
      size="small"
      class="ml-2"
    >
      {{ product.is_available ? 'Available' : 'Out of Stock' }}
    </VChip>
  </div>
</VCol>


            <VCol cols="12" md="6">
              <p>
                <strong>Price:</strong>
                <span class="price">₹{{ product.price }}</span>
              </p>
            </VCol>

            <VCol cols="12" md="6">
              <p><strong>Stock Quantity:</strong> {{ product.stock_quantity }}</p>
            </VCol>

            <VCol cols="12" md="6">
              <p>
                <strong>Average Rating:</strong>
                <VRating
                  v-model="product.average_rating"
                  readonly
                  half-increments
                  color="amber"
                  size="20"
                />
                <span class="ml-2">({{ product.average_rating }})</span>
              </p>
            </VCol><VCol cols="12" md="6">
              <p><strong>Description:</strong> {{ product.product_description }}</p>
            </VCol>


          </VRow>
        </div>

        <!-- Back Button -->
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
.page-wrapper {
  padding: 24px;
  background: #f9faff;
  min-height: 100vh;
}

.form-card {
  max-width: 700px;
  margin: 0 auto;
}

.form-title {
  font-weight: 600;
}

.product-image {
  max-width: 250px;
  max-height: 250px;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
}

.price {
  font-weight: bold;
  font-size: 18px;
  color: #2e7d32;
}
</style>
