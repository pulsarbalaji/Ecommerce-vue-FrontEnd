<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()

// States
const order = ref(null)
const loading = ref(true)
const error = ref(null)

// Go back
const goBack = () => router.back()

// Download invoice
const downloadInvoice = async () => {
  if (!order.value) return

  try {
    const response = await $api.get(`/orderspdf/${order.value.id}/`, {
      responseType: 'blob', // important for PDF files
    })

    // Create a Blob from the response
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)

    // Create a temporary link to trigger download
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Invoice_${order.value.order_number}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()

    // Release the object URL
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Failed to download invoice:', err)
    alert('Failed to download invoice. Please try again.')
  }
}


// Fetch order by ID
const fetchOrder = async () => {
  try {
    const id = route.params.id
    const response = await $api.get(`/orderdetails/${id}/`)
    order.value = response.data.data
  } catch (err) {
    console.error('Error fetching order:', err)
    error.value = 'Failed to load order details.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrder)

// Status colors
const orderStatusColor = {
  pending: 'warning',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
  returned: 'warning',
}

const paymentStatusColor = {
  pending: 'warning',
  success: 'success',
  failed: 'error',
  refunded: 'info',
}

// Compute totals for summary row
const subtotal = computed(() => {
  return order.value
    ? order.value.items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
    : 0
})

const totalTax = computed(() => {
  return order.value
    ? order.value.items.reduce((sum, item) => sum + parseFloat(item.tax) * item.quantity, 0)
    : 0
})

const shippingCharge = computed(() => {
  return order.value ? parseFloat(order.value.shipping_cost) : 0
})

const totalAmount = computed(() => {
  return order.value ? parseFloat(order.value.total_amount) : 0
})
</script>

<template>
  <div class="form-wrapper">
    <VCard class="form-card">
      <div class="text-center my-4">
        <h2 class="form-title">Order Details 👁️</h2>
      </div>

      <VCardText>
        <div v-if="loading" class="py-6 text-center">Loading...</div>

        <div v-else-if="order">
          <VRow dense>
            <VCol cols="12" md="6">
              <p><strong>Order Number:</strong> {{ order.order_number }}</p>
            </VCol>
            <VCol cols="12" md="6">
              <p>
                <strong>Order Status:</strong>
                <VChip :color="orderStatusColor[order.status]" small dark>
                  {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
                </VChip>
              </p>
            </VCol>
            <VCol cols="12" md="6">
              <p><strong>Payment Method:</strong> {{ order.payment_method.toUpperCase() }}</p>
            </VCol>
            <VCol cols="12" md="6">
              <p>
                <strong>Payment Status:</strong>
                <VChip :color="paymentStatusColor[order.payment_status]" small dark>
                  {{ order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1) }}
                </VChip>
              </p>
            </VCol>
            <VCol cols="12" md="6">
              <p><strong>Customer Name:</strong> {{ order.customer_name }}</p>
            </VCol>
            <VCol cols="12" md="6">
              <p><strong>Ordered At:</strong> {{ new Date(order.ordered_at).toLocaleString() }}</p>
            </VCol>
            <VCol cols="12" md="6">
              <p><strong>Delivered At:</strong> {{ order.delivered_at ? new Date(order.delivered_at).toLocaleString() : '-' }}</p>
            </VCol>
          </VRow>

          <!-- Shipping & Billing -->
          <VRow class="mt-4">
            <VCol cols="12" md="6">
              <p><strong>Shipping Address:</strong> {{ order.shipping_address }}</p>
            </VCol>
            <VCol cols="12" md="6">
              <p><strong>Billing Address:</strong> {{ order.billing_address }}</p>
            </VCol>
          </VRow>

          <!-- Items Table -->
          <div class="mt-6">
            <h3>Items</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Tax</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in order.items" :key="item.product">
                  <td>{{ item.product_name }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>₹{{ item.price }}</td>
                  <td>₹{{ item.tax }}</td>
                  <td>₹{{ item.total }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th colspan="4" class="text-right">Subtotal:</th>
                  <th>₹{{ subtotal.toFixed(2) }}</th>
                </tr>
                <tr>
                  <th colspan="4" class="text-right">Tax:</th>
                  <th>₹{{ totalTax.toFixed(2) }}</th>
                </tr>
                <tr>
                  <th colspan="4" class="text-right">Shipping:</th>
                  <th>₹{{ shippingCharge.toFixed(2) }}</th>
                </tr>
                <tr>
                  <th colspan="4" class="text-right">Total Amount:</th>
                  <th>₹{{ totalAmount.toFixed(2) }}</th>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Buttons -->
          <VRow class="mt-6 gap-2" justify="center" align="center">

            <VCol cols="auto">
              <VBtn  type="button" color="secondary" variant="outlined" @click="goBack">
                Back
              </VBtn>
            </VCol>
            <VCol cols="auto">
              <VBtn color="primary"   @click="downloadInvoice">
                Download Invoice
              </VBtn>
            </VCol>
          </VRow>
        </div>

        <div v-else-if="error" class="py-6 text-center text-error">{{ error }}</div>
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
.form-wrapper {
  padding: 16px;
  min-block-size: 100vh;
}

.form-card {
  max-width: 900px;
  margin: 0 auto;
}

.form-title {
  font-weight: 600;
}

.mt-4 {
  margin-top: 16px;
}

.mt-6 {
  margin-top: 24px;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}

.items-table th,
.items-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.items-table th {
  background-color: #f0f0f0;
  font-weight: 600;
}

.items-table tfoot th {
  background-color: #fafafa;
  text-align: right;
}
</style>
