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

// Confirm delete
const confirmDelete = async () => {
  if (!selectedUser.value) return
  isDeleting.value = true
  try {
    await $api.delete(`/categories/${selectedUser.value.id}/`)
    users.value = users.value.filter(u => u.id !== selectedUser.value.id)

    snackbar.value = {
      show: true,
      text: `Category "${selectedUser.value.category_name}" deleted successfully.`,
      color: 'success'
    }

    showDeleteDialog.value = false
  } catch (err) {
    console.error('Error deleting category:', err)
    snackbar.value = {
      show: true,
      text: 'Error deleting category. Please try again.',
      color: 'error'
    }
  } finally {
    isDeleting.value = false
  }
}

// Table headers
const headers = [
  { title: 'Category Name', key: 'category_name' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Fetch categories from backend
const fetchUsers = async () => {
  try {
    const response = await $api.get('categories/')
    users.value = response.data.data
  } catch (err) {
    console.error('Error fetching categories:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)

// Navigation
const goTocategoryadd = () => {
  router.push('/categorydata/category-add')
}

const editUser = (user) => {
  router.push(`/categorydata/edit-category/${user.id}`)
}

const viewUser = (user) => {
  router.push(`/categorydata/view-category/${user.id}`)
}
</script>

<template>
  <!-- Delete Confirmation Modal -->
  <VDialog v-model="showDeleteDialog" max-width="400">
    <VCard>
      <VCardTitle class="text-h6">Confirm Delete</VCardTitle>

      <VCardText>
        Are you sure you want to delete
        <strong>{{ selectedUser?.category_name }}</strong>?
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
    <!-- Header with Add Category button -->
    <div class="page-header">
      <h2>Category Details</h2>
      <VBtn color="primary" @click="goTocategoryadd">
        + Add Category
      </VBtn>
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
            color="primary"
            variant="text"
            size="small"
            @click="editUser(item)"
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
