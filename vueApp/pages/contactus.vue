<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()
const { $api } = useNuxtApp()

// Categories list
const users = ref([])   // <-- this is categories, keeping same name as your code
const loading = ref(true)
const selectedUser = ref(null)
const showDeleteDialog = ref(false)
const isDeleting = ref(false)

// Snackbar feedback
const snackbar = ref({ show: false, text: '', color: 'success' })

// Open delete modal
const openDeleteDialog = (user) => {
  selectedUser.value = user
  showDeleteDialog.value = true
}

// Table headers
const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Phone', key: 'phone' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Fetch categories from backend
const fetchUsers = async () => {
  try {
    const response = await $api.get('contactus/')
    users.value = response.data.data
  } catch (err) {
    console.error('Error fetching categories:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)

const viewUser = (user) => {
  router.push(`/contactusdata/view-contactus/${user.id}`)
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
    <!-- Header with Add Category button -->
    <div class="page-header">
      <h2>Contact Us Details</h2>
    </div>

    <!-- Category Table -->
    <VDataTable
      :headers="headers"
      :items="users"
      :loading="loading"
      class="elevation-1"
      density="comfortable"
    >
      <template #loading>
        <div class="text-center py-6">Loading Categories...</div>
      </template>

      <template #no-data>
        <div class="text-center py-6">No categories found.</div>
      </template>

      <!-- Actions Column -->
      <template v-slot:[`item.actions`]="{ item }">
        <div class="flex justify-center gap-1">
          <VBtn
            icon
            color="secondary"
            variant="text"
            size="small"
            @click="viewUser(item)"
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
