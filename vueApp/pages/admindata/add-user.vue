<template>
  <div class="form-wrapper">
    <VCard class="form-card">
      <div class="text-center my-4">
        <h2 class="form-title">Add Admin User 👤</h2>
      </div>

      <VCardText>
        <VForm @submit.prevent="handleAddUser">
          <VRow>
            <VCol cols="12" md="6">
              <VTextField
                v-model="form.email"
                label="Email"
                type="email"
                required
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="form.fullName"
                label="Full Name"
                required
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField
                v-model="form.phone"
                label="Phone Number"
                type="tel"
                required
              />
            </VCol>
            <VCol cols="12" md="6">
              <VSelect
                v-model="form.role"
                :items="roles"
                label="Select Role"
                required
              />
            </VCol>
          </VRow>

          <!-- Action buttons -->
          <VRow class="mt-6" justify="center" align="center">
            <VCol cols="auto">
              <VBtn
                type="button"
                color="secondary"
                variant="outlined"
                :loading="isCancelling"
                class="action-btn"
                @click="handleCancel"
              >
                Cancel
              </VBtn>
            </VCol>

            <VCol cols="auto">
              <VBtn
                type="submit"
                color="primary"
                :loading="isSubmitting"
                class="action-btn"
              >
                Add User
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const { $api } = useNuxtApp()

// form state
const form = ref({
  email: "",
  fullName: "",
  phone: "",
  role: ""
})

const roles = ["Admin", "Manager", "Staff"]

const isSubmitting = ref(false)
const isCancelling = ref(false)

// handle add user
const handleAddUser = async () => {
  isSubmitting.value = true
  try {
    await $api.post("adminsdetails/", {
      email: form.value.email,
      full_name: form.value.fullName,
      phone: form.value.phone,
      role: form.value.role
    })
    router.push("/admin")
  } catch (err) {
    console.error(err)
  } finally {
    isSubmitting.value = false
  }
}

// handle cancel
const handleCancel = () => {
  isCancelling.value = true
  setTimeout(() => {
    router.push("/admin")
    isCancelling.value = false
  }, 800)
}
</script>

<style scoped>
.form-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f9faff;
  min-block-size: 60vh;
}

.form-card {
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 5%);
  inline-size: 100%;
  max-inline-size: 7020px;
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  margin-block-end: 12px;
}

.action-btn {
  font-weight: 600;
  min-inline-size: 140px;
  text-transform: none;
}
</style>
