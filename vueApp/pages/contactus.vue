<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()
const { $api } = useNuxtApp()

// Contact Us list
const contacts = ref([])
const loading = ref(true)

// Table headers
const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Phone', key: 'phone' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Fetch contacts from backend
const fetchContacts = async () => {
  try {
    const response = await $api.get('contactus/')
    contacts.value = response.data.data
    console.log('Fetched Contact Us:', response.data)
  } catch (err) {
    console.error('Error fetching contact us:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchContacts)

// Navigate to View Contact page
const viewContact = (contact) => {
  router.push(`/contactusdata/view-contactus/${contact.id}`)
}
</script>

<template>
  <div class="page-wrapper">
    <!-- Header -->
    <div class="page-header">
      <h2>Contact Us Details</h2>
    </div>

    <!-- Contact Table -->
    <VDataTable
      :headers="headers"
      :items="contacts"
      :loading="loading"
      class="elevation-1"
      density="comfortable"
    >
      <template #loading>
        <div class="text-center py-6">Loading contact details...</div>
      </template>

      <template #no-data>
        <div class="text-center py-6">No contact details found.</div>
      </template>

      <!-- Actions Column -->
      <template v-slot:[`item.actions`]="{ item }">
        <div class="flex justify-center gap-1">
          <VBtn
            icon
            color="secondary"
            variant="text"
            size="small"
            @click="viewContact(item)"
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
</style>
