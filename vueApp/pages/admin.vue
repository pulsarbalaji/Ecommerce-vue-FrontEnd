<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()
const { $api } = useNuxtApp()

// Users list
const users = ref([])
const loading = ref(true)

// Table headers
const headers = [
  { title: 'Full Name', key: 'full_name' },
  { title: 'Email', key: 'email' },
  { title: 'Phone', key: 'phone' },
  { title: 'Role', key: 'role' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Delete dialog state
const deleteDialog = ref(false)
const selectedUser = ref(null)

// Fetch users from backend
const fetchUsers = async () => {
  try {
    const response = await $api.get('adminsdetails/')
    users.value = response.data.data
    console.log('Fetched Users:', response.data)
  } catch (err) {
    console.error('Error fetching users:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)

// Navigate to Add User form
const goToAddUser = () => {
  router.push('/admindata/add-user')
}

// Navigate to Edit User form
const editUser = (user) => {
  router.push(`/admindata/edit-user/${user.id}`)
}

// Navigate to View User page
const viewUser = (user) => {
  router.push(`/admindata/view-user/${user.id}`)
}

// Open delete confirmation dialog
const confirmDelete = (user) => {
  selectedUser.value = user
  deleteDialog.value = true
}

// Delete user after confirmation
const deleteUser = async () => {
  if (!selectedUser.value) return
  try {
    await $api.delete(`adminsdetails/${selectedUser.value.id}/`)
    users.value = users.value.filter(u => u.id !== selectedUser.value.id)
    deleteDialog.value = false
    selectedUser.value = null
  } catch (err) {
    console.error('Error deleting user:', err)
  }
}
</script>

<template>
  <div class="page-wrapper">
    <!-- Header with Add User button -->
    <div class="page-header">
      <h2>Admin Users</h2>
      <VBtn color="primary" @click="goToAddUser">
        + Add User
      </VBtn>
    </div>

    <!-- User Table -->
    <VDataTable
      :headers="headers"
      :items="users"
      :loading="loading"
      class="elevation-1"
      density="comfortable"
    >
      <template #loading>
        <div class="text-center py-6">Loading users...</div>
      </template>

      <template #no-data>
        <div class="text-center py-6">No users found.</div>
      </template>

      <!-- Actions Column -->
      <template v-slot:[`item.actions`]="{ item }">
        <div class="flex justify-center gap-1">
          <VBtn icon color="primary" variant="text" size="small" @click="editUser(item)">
            <Icon icon="mdi:pencil" width="18" height="18" />
          </VBtn>
          <VBtn icon color="error" variant="text" size="small" @click="confirmDelete(item)">
            <Icon icon="mdi:delete" width="18" height="18" />
          </VBtn>
          <VBtn icon color="secondary" variant="text" size="small" @click="viewUser(item)">
            <Icon icon="mdi:eye" width="18" height="18" />
          </VBtn>
        </div>
      </template>
    </VDataTable>

    <!-- Delete Confirmation Dialog -->
    <VDialog v-model="deleteDialog" max-width="400">
      <VCard>
        <VCardTitle class="headline">Confirm Deletion</VCardTitle>
        <VCardText>
          Are you sure you want to delete
          <strong>{{ selectedUser?.full_name }}</strong>?
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="deleteDialog = false">Cancel</VBtn>
          <VBtn color="error" @click="deleteUser">Delete</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
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
