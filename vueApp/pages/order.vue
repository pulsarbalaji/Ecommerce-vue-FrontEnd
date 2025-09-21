<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()
const { $api } = useNuxtApp()

// Orders list
const orders = ref([])
const loading = ref(true)
const selectedOrder = ref(null)
const showDeleteDialog = ref(false)
const isDeleting = ref(false)

// Snackbar feedback
const snackbar = ref({ show: false, text: '', color: 'success' })

// Open delete modal
const openDeleteDialog = (order) => {
  selectedOrder.value = order
  showDeleteDialog.value = true
}

// Table headers
const headers = [
  { title: 'Order Number', key: 'order_number' },
  { title: 'Status', key: 'status' },
  { title: 'Payment Status', key: 'payment_status' },
  { title: 'Total Amount', key: 'total_amount' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Fetch orders from backend
const fetchOrders = async () => {
  try {
    const response = await $api.get('orderdetails/')
    orders.value = response.data.data
  } catch (err) {
    console.error('Error fetching orders:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrders)

// Navigation
const viewOrder = (order) => {
  router.push(`/orderdetails/view-order/${order.id}`)
}

// Map order status to colors
const orderStatusColor = {
  pending: 'warning',      // yellow/orange
  processing: 'info',      // blue
  shipped: 'info',         // blue
  delivered: 'success',    // green
  cancelled: 'error',      // red
  returned: 'error',       // red
}

// Map payment status to UI-friendly colors
const paymentStatusColor = {
  pending: 'warning',
  success: 'success',
  failed: 'error',
  refunded: 'info',
}
</script>

<template>
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
    <!-- Header -->
    <div class="page-header">
      <h2>Order Details</h2>
    </div>

    <!-- Orders Table -->
    <VDataTable
      :headers="headers"
      :items="orders"
      :loading="loading"
      class="elevation-1"
      density="comfortable"
    >
      <template #loading>
        <div class="text-center py-6">Loading Orders...</div>
      </template>

      <template #no-data>
        <div class="text-center py-6">No Orders found.</div>
      </template>

      <!-- Status Column -->
      <template v-slot:[`item.status`]="{ item }">
        <VChip :color="orderStatusColor[item.status]" small dark>
          {{ item.status.charAt(0).toUpperCase() + item.status.slice(1) }}
        </VChip>
      </template>

      <!-- Payment Status Column -->
      <template v-slot:[`item.payment_status`]="{ item }">
        <VChip :color="paymentStatusColor[item.payment_status]" small dark>
          {{ item.payment_status.charAt(0).toUpperCase() + item.payment_status.slice(1) }}
        </VChip>
      </template>

      <!-- Actions Column -->
      <template v-slot:[`item.actions`]="{ item }">
        <div class="flex justify-center gap-1">
          <VBtn
            icon
            color="secondary"
            variant="text"
            size="small"
            @click="viewOrder(item)"
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
</style>
