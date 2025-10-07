<script setup>
import { Icon } from '@iconify/vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { $api } = useNuxtApp()

// Categories list
const categories = ref([])
const loading = ref(true)

// Table headers
const headers = [
  { title: 'Category Name', key: 'category_name' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Delete dialog state
const deleteDialog = ref(false)
const selectedCategory = ref(null)

// Fetch categories from backend
const fetchCategories = async () => {
  try {
    const response = await $api.get('categories/')
    categories.value = response.data.data
    console.log('Fetched Categories:', response.data)
  } catch (err) {
    console.error('Error fetching categories:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchCategories)

// Navigate to Add Category form
const goToAddCategory = () => {
  router.push('/categorydata/category-add')
}

// Navigate to Edit Category form
const editCategory = (category) => {
  router.push(`/categorydata/edit-category/${category.id}`)
}

// Navigate to View Category page
const viewCategory = (category) => {
  router.push(`/categorydata/view-category/${category.id}`)
}

// Open delete confirmation dialog
const confirmDelete = (category) => {
  selectedCategory.value = category
  deleteDialog.value = true
}

// Delete category after confirmation
const deleteCategory = async () => {
  if (!selectedCategory.value) return
  try {
    await $api.delete(`categories/${selectedCategory.value.id}/`)
    categories.value = categories.value.filter(c => c.id !== selectedCategory.value.id)
    deleteDialog.value = false
    selectedCategory.value = null
  } catch (err) {
    console.error('Error deleting category:', err)
  }
}
</script>

<template>
  <div class="page-wrapper">
    <!-- Header with Add Category button -->
    <div class="page-header">
      <h2>Category Details</h2>
      <VBtn color="primary" @click="goToAddCategory">
        + Add Category
      </VBtn>
    </div>

    <!-- Category Table -->
    <VDataTable
      :headers="headers"
      :items="categories"
      :loading="loading"
      class="elevation-1"
      density="comfortable"
    >
      <template #loading>
        <div class="text-center py-6">Loading categories...</div>
      </template>

      <template #no-data>
        <div class="text-center py-6">No categories found.</div>
      </template>

      <!-- Actions Column -->
      <template v-slot:[`item.actions`]="{ item }">
        <div class="flex justify-center gap-1">
          <VBtn icon color="primary" variant="text" size="small" @click="editCategory(item)">
            <Icon icon="mdi:pencil" width="18" height="18" />
          </VBtn>
          <VBtn icon color="error" variant="text" size="small" @click="confirmDelete(item)">
            <Icon icon="mdi:delete" width="18" height="18" />
          </VBtn>
          <VBtn icon color="secondary" variant="text" size="small" @click="viewCategory(item)">
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
          <strong>{{ selectedCategory?.category_name }}</strong>?
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="deleteDialog = false">Cancel</VBtn>
          <VBtn color="error" @click="deleteCategory">Delete</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.page-wrapper {
  padding: 24px;
  background-color: rgb(var(--v-theme-background));
  color: rgb(var(--v-theme-on-background));
  min-block-size: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-block-end: 16px;
}

.page-header h2 {
  margin: 0;
  color: rgb(var(--v-theme-on-surface));
  font-weight: 600;
}
</style>
