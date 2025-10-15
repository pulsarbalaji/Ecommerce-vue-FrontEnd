<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()
const { $api } = useNuxtApp()

// State
const orders = ref([])
const loading = ref(true)

// Pagination
const page = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)

// Table headers
const headers = [
  { title: 'Order Number', key: 'order_number' },
  { title: 'Status', key: 'status' },
  { title: 'Payment Status', key: 'payment_status' },
  { title: 'Total Amount', key: 'total_amount' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Fetch orders from backend (with pagination)
const fetchOrders = async () => {
  loading.value = true
  try {
    const response = await $api.get('orderdetails/', {
      params: {
        page: page.value,
        page_size: itemsPerPage.value,
      },
    })

    orders.value = response.data.results || []
    totalItems.value = response.data.count || 0

    console.log('Fetched Orders:', response.data)
  } catch (err) {
    console.error('Error fetching orders:', err)
  } finally {
    loading.value = false
  }
}

// Fetch when mounted
onMounted(fetchOrders)

// Fetch again when page or items-per-page changes
watch([page, itemsPerPage], fetchOrders)

// Navigation
const viewOrder = (order) => {
  router.push(`/orderdetails/view-order/${order.id}`)
}
const updateStatus = (order) => {
  router.push(`/orderdetails/update-status/${order.id}`)
}

// Map order status to colors
const orderStatusColor = {
  pending: 'warning',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
  returned: 'error',
}

// Map payment status to colors
const paymentStatusColor = {
  pending: 'warning',
  success: 'success',
  failed: 'error',
  refunded: 'info',
}
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header">
      <h2>Order Details</h2>
    </div>

    <!-- Orders Table -->
    <VDataTable
      :headers="headers"
      :items="orders"
      :loading="loading"
      :items-per-page="itemsPerPage"
      :page="page"
      :items-length="totalItems"
      @update:page="page = $event"
      @update:items-per-page="itemsPerPage = $event"
      class="elevation-1"
      density="comfortable"
    >
      <!-- Loading -->
      <template #loading>
        <div class="text-center py-6">Loading orders...</div>
      </template>

      <!-- No Data -->
      <template #no-data>
        <div class="text-center py-6">No orders found.</div>
      </template>

      <!-- Status -->
      <template v-slot:[`item.status`]="{ item }">
        <VChip :color="orderStatusColor[item.status]" small dark>
          {{ item.status.charAt(0).toUpperCase() + item.status.slice(1) }}
        </VChip>
      </template>

      <!-- Payment Status -->
      <template v-slot:[`item.payment_status`]="{ item }">
        <VChip :color="paymentStatusColor[item.payment_status]" small dark>
          {{ item.payment_status.charAt(0).toUpperCase() + item.payment_status.slice(1) }}
        </VChip>
      </template>

      <!-- Actions -->
      <template v-slot:[`item.actions`]="{ item }">
        <div class="flex justify-center gap-1">
          <VBtn icon color="secondary" variant="text" size="small" @click="viewOrder(item)">
            <Icon icon="mdi:eye" width="18" height="18" />
          </VBtn>
          <VBtn icon color="secondary" variant="text" size="small" @click="updateStatus(item)">
            <Icon icon="mdi:reload" width="20" height="20" />
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
</style>
