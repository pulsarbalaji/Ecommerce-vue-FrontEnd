<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { MEDIA_BASE_URL } from '@/utils/base_url'

const router = useRouter()
const { $api } = useNuxtApp()

// Products list
const products = ref([])
const loading = ref(true)

// Table headers
const headers = [
  { title: 'Product Name', key: 'product_name' },
  { title: 'Product Image', key: 'product_image' },
  { title: 'Price', key: 'price' },
  { title: 'Stock Quantity', key: 'stock_quantity' },
  { title: 'Availability', key: 'is_available' },
  { title: 'Average Rating', key: 'average_rating' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Fetch products from backend
const fetchProducts = async () => {
  try {
    const response = await $api.get('product/')
    products.value = response.data.data
    console.log('Fetched Products:', response.data)
  } catch (err) {
    console.error('Error fetching products:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)

// Navigation
const goToProductAdd = () => {
  router.push('/productdata/add-product')
}

const editProduct = (product) => {
  router.push(`/productdata/edit-product/${product.id}`)
}

const viewProduct = (product) => {
  router.push(`/productdata/view-product/${product.id}`)
}
</script>

<template>
  <div class="page-wrapper">
    <!-- Header with Add Product button -->
    <div class="page-header">
      <h2>Product Details</h2>
      <VBtn color="primary" @click="goToProductAdd">
        + Add Product
      </VBtn>
    </div>

    <!-- Product Table -->
    <VDataTable
      :headers="headers"
      :items="products"
      :loading="loading"
      class="elevation-1"
      density="comfortable"
    >
      <template #loading>
        <div class="text-center py-6">Loading products...</div>
      </template>

      <template #no-data>
        <div class="text-center py-6">No products found.</div>
      </template>

      <!-- Product Image Column -->
      <template v-slot:[`item.product_image`]="{ item }">
        <img
          v-if="item.product_image"
          :src="MEDIA_BASE_URL + item.product_image"
          alt="Product"
          class="product-img"
        />
        <span v-else>No Image</span>
      </template>

      <!-- Availability Column -->
      <template v-slot:[`item.is_available`]="{ item }">
        <VChip
          :color="item.is_available ? 'success' : 'error'"
          text-color="white"
          size="small"
          class="font-medium"
        >
          {{ item.is_available ? 'Available' : 'Out of Stock' }}
        </VChip>
      </template>

      <!-- Actions Column -->
      <template v-slot:[`item.actions`]="{ item }">
        <div class="flex justify-center gap-1">
          <VBtn
            icon
            color="primary"
            variant="text"
            size="small"
            @click="editProduct(item)"
          >
            <Icon icon="mdi:pencil" width="18" height="18" />
          </VBtn>
          <VBtn
            icon
            color="secondary"
            variant="text"
            size="small"
            @click="viewProduct(item)"
          >
            <Icon icon="mdi:eye" width="18" height="18" />
          </VBtn>
        </div>
      </template>
    </VDataTable>
  </div>
</template>

<style scoped>
.page-wrapper {
  background-color: rgb(var(--v-theme-background));
  color: rgb(var(--v-theme-on-background));
  min-height: 100vh;
  padding: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.page-header h2 {
  color: rgb(var(--v-theme-on-surface));
  font-weight: 600;
  margin: 0;
}

.product-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
}
</style>
