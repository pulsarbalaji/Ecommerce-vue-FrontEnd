<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useNuxtApp } from "#app"

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()

const order = ref(null)
const loading = ref(true)
const updating = ref(false)
const error = ref(null)

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returned", label: "Returned" },
]

const fetchOrder = async () => {
  try {
    const id = route.params.id
    const response = await $api.get(`/orderdetails/${id}/`)
    order.value = response.data.data
  } catch (err) {
    console.error("Error fetching order:", err)
    error.value = "Failed to load order."
  } finally {
    loading.value = false
  }
}

const updateStatus = async () => {
  try {
    updating.value = true
    const id = route.params.id
    await $api.put(`/order-status/${id}/`, { order_status: order.value.status })
    alert("Order status updated successfully")
    router.push("/order") // go back to list
  } catch (err) {
    console.error("Failed to update status:", err)
    alert("Failed to update status")
  } finally {
    updating.value = false
  }
}

onMounted(fetchOrder)
</script>

<template>
  <div class="form-wrapper">
    <VCard class="form-card">
      <div class="text-center my-4">
        <h2 class="form-title">Update Order Status 🔄</h2>
      </div>

      <VCardText>
        <div v-if="loading" class="py-6 text-center">Loading...</div>
        <div v-else-if="error" class="py-6 text-center text-error">{{ error }}</div>

        <div v-else-if="order">
          <!-- Read-only details -->
          <VRow dense>
            <VCol cols="12" md="6">
              <p><strong>Order Number:</strong> {{ order.order_number }}</p>
            </VCol>
            <VCol cols="12" md="6">
              <p><strong>Customer:</strong> {{ order.customer_name }}</p>
            </VCol>
            <VCol cols="12" md="6">
              <p><strong>Payment Method:</strong> {{ order.payment_method }}</p>
            </VCol>
            <VCol cols="12" md="6">
              <p><strong>Payment Status:</strong> {{ order.payment_status }}</p>
            </VCol>
            <VCol cols="12" md="6">
              <p><strong>Total:</strong> ₹{{ order.total_amount }}</p>
            </VCol>
          </VRow>

          <!-- Editable Status -->
          <div class="mt-6">
            <VSelect
              v-model="order.status"
              :items="statusOptions"
              item-title="label"
              item-value="value"
              label="Order Status"
              outlined
              density="comfortable"
            />
          </div>

          <!-- Buttons -->
          <VRow class="mt-6 gap-2" justify="center" align="center">
            <VCol cols="auto">
              <VBtn type="button" color="secondary" variant="outlined" @click="router.back()">
                Cancel
              </VBtn>
            </VCol>
            <VCol cols="auto">
              <VBtn color="primary" :loading="updating" @click="updateStatus">
                Update Status
              </VBtn>
            </VCol>
          </VRow>
        </div>
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
  max-width: 700px;
  margin: 0 auto;
}
.form-title {
  font-weight: 600;
}
.mt-6 {
  margin-top: 24px;
}
</style>
