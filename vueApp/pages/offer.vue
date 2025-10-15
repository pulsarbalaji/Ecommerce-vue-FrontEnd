<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()
const { $api } = useNuxtApp()

// Reactive state
const offers = ref([])
const loading = ref(true)
const page = ref(1)
const itemsPerPage = ref(10)
const totalOffers = ref(0)

// Table headers
const headers = [
  { title: 'Category Name', key: 'category_name' },
  { title: 'Product Name', key: 'product_name' },
  { title: 'Offer Name', key: 'offer_name' },
  { title: 'Percentage', key: 'offer_percentage' },
  { title: 'Status', key: 'is_active' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Delete confirmation
const deleteDialog = ref(false)
const selectedOffer = ref(null)

// ✅ Fetch offers with pagination
const fetchOffer = async () => {
  loading.value = true
  try {
    const response = await $api.get('offers/', {
      params: {
        page: page.value,
        page_size: itemsPerPage.value,
      },
    })

    const result = response.data.results
    offers.value = result.data || []
    totalOffers.value = response.data.count || 0
  } catch (err) {
    console.error('Error fetching offers:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchOffer)

// CRUD Actions
const goToAddOffer = () => router.push('/offerdata/add-offer')
const editOffer = offer => router.push(`/offerdata/edit-offer/${offer.id}`)
const viewOffer = offer => router.push(`/offerdata/view-offer/${offer.id}`)

const confirmDelete = offer => {
  selectedOffer.value = offer
  deleteDialog.value = true
}

const deleteOffer = async () => {
  if (!selectedOffer.value) return
  try {
    await $api.delete(`offers/${selectedOffer.value.id}/`)
    offers.value = offers.value.filter(o => o.id !== selectedOffer.value.id)
    deleteDialog.value = false
    selectedOffer.value = null
  } catch (err) {
    console.error('Error deleting offer:', err)
  }
}

// Status Chip Props
function getStatusChipProps(status) {
  return {
    color: status ? 'success' : 'error',
    text: status ? 'Active' : 'Inactive',
  }
}
</script>

<template>
  <div class="page-wrapper">
    <!-- Header -->
    <div class="page-header">
      <h2>Offers Details</h2>
      <VBtn color="primary" @click="goToAddOffer">+ Add Offer</VBtn>
    </div>

    <!-- ✅ Offers Table with built-in pagination -->
    <VDataTable
      :headers="headers"
      :items="offers"
      :loading="loading"
      :items-length="totalOffers"
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      class="elevation-1"
      density="comfortable"
      @update:page="fetchOffer"
      @update:items-per-page="fetchOffer"
      show-current-page
    >
      <!-- Loading -->
      <template #loading>
        <div class="text-center py-6">Loading offers...</div>
      </template>

      <!-- No Data -->
      <template #no-data>
        <div class="text-center py-6">No offers found.</div>
      </template>

      <!-- Status -->
      <template #item.is_active="{ item }">
        <VChip
          :color="getStatusChipProps(item.is_active).color"
          variant="tonal"
          size="small"
        >
          {{ getStatusChipProps(item.is_active).text }}
        </VChip>
      </template>

      <!-- Actions -->
      <template #item.actions="{ item }">
        <div class="flex justify-center gap-1">
          <VBtn icon color="primary" variant="text" size="small" @click="editOffer(item)">
            <Icon icon="mdi:pencil" width="18" height="18" />
          </VBtn>

          <VBtn icon color="error" variant="text" size="small" @click="confirmDelete(item)">
            <Icon icon="mdi:delete" width="18" height="18" />
          </VBtn>

          <VBtn icon color="secondary" variant="text" size="small" @click="viewOffer(item)">
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
          <strong>{{ selectedOffer?.offer_name }}</strong>?
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="deleteDialog = false">Cancel</VBtn>
          <VBtn color="error" @click="deleteOffer">Delete</VBtn>
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
