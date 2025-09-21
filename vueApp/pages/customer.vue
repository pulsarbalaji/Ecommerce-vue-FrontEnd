<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()
const { $api } = useNuxtApp()

// Customers list
const customers = ref([])
const loading = ref(true)
const selectedCustomer = ref(null)
const showDeleteDialog = ref(false)
const isDeleting = ref(false)

// Snackbar feedback
const snackbar = ref({ show: false, text: '', color: 'success' })

// Open delete modal
const openDeleteDialog = (customer) => {
  selectedCustomer.value = customer
  showDeleteDialog.value = true
}

// Table headers
const headers = [
  { title: 'Name', key: 'full_name' },
  { title: 'DOB', key: 'dob' },
  { title: 'Gender', key: 'gender' },
  { title: 'Address', key: 'address' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Fetch customers from backend
const fetchCustomers = async () => {
  try {
    const response = await $api.get('customerslist/')
    customers.value = response.data.data
  } catch (err) {
    console.error('Error fetching customers:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchCustomers)

// Navigation
const viewCustomer = (customer) => {
  router.push(`/customer-view/${customer.id}`)
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
      <h2>Customers</h2>
    </div>

    <!-- Customers Table -->
    <VDataTable
      :headers="headers"
      :items="customers"
      :loading="loading"
      class="elevation-1"
      density="comfortable"
    >
      <template #loading>
        <div class="text-center py-6">Loading Customers...</div>
      </template>

      <template #no-data>
        <div class="text-center py-6">No Customers found.</div>
      </template>

      <!-- Actions Column -->
      <template v-slot:[`item.actions`]="{ item }">
        <div class="flex justify-center gap-1">
          <VBtn
            icon
            color="secondary"
            variant="text"
            size="small"
            @click="viewCustomer(item)"
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
