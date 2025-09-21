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
const selectedProduct = ref(null)
const showDeleteDialog = ref(false)
const isDeleting = ref(false)

// Snackbar feedback
const snackbar = ref({ show: false, text: '', color: 'success' })

// Open delete modal
const openDeleteDialog = (product) => {
  selectedProduct.value = product
  showDeleteDialog.value = true
}

// Confirm delete
const confirmDelete = async () => {
  if (!selectedProduct.value) return
  isDeleting.value = true
  try {
    await $api.delete(`/product/${selectedProduct.value.id}/`)
    products.value = products.value.filter(p => p.id !== selectedProduct.value.id)

    snackbar.value = {
      show: true,
      text: `Product "${selectedProduct.value.product_name}" deleted successfully.`,
      color: 'success'
    }

    showDeleteDialog.value = false
  } catch (err) {
    console.error('Error deleting Product:', err)
    snackbar.value = {
      show: true,
      text: 'Error deleting product. Please try again.',
      color: 'error'
    }
  } finally {
    isDeleting.value = false
  }
}

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
  <!-- Delete Confirmation Modal -->
  <VDialog v-model="showDeleteDialog" max-width="400">
    <VCard>
      <VCardTitle class="text-h6">Confirm Delete</VCardTitle>

      <VCardText>
        Are you sure you want to delete
        <strong>{{ selectedProduct?.product_name }}</strong>?
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn text @click="showDeleteDialog = false">Cancel</VBtn>
        <VBtn color="error" :loading="isDeleting" @click="confirmDelete">
          Delete
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <!-- Snackbar Feedback -->
  <VSnackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    timeout="3000"
    location="top right"
  >
    {{ snackbar.text }}
  </VSnackbar>

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
        <div class="text-center py-6">Loading Products...</div>
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
            color="error"
            variant="text"
            size="small"
            @click="openDeleteDialog(item)"
          >
            <Icon icon="mdi:delete" width="18" height="18" />
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
  padding: 24px;
  background: #f9faff;
  min-block-size: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-block-end: 16px;
}

h2 {
  font-weight: 600;
}

.product-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
}
</style>
