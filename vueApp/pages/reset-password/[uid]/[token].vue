<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { $api } = useNuxtApp()  // 👈 injected api instance

const form = ref({ password: '', confirmPassword: '' })
const snackbar = ref({ show: false, text: '', color: 'success' })
const isSubmitting = ref(false)

// password rules...
const passwordRules = [
  v => !!v || 'Password is required',
  v => v.length >= 8 || 'Password must be at least 8 characters',
  v => /[A-Z]/.test(v) || 'Must contain at least one uppercase letter',
  v => /[a-z]/.test(v) || 'Must contain at least one lowercase letter',
  v => /[0-9]/.test(v) || 'Must contain at least one number',
  v => /[!@#$%^&*(),.?":{}|<>]/.test(v) || 'Must contain at least one special character',
]

const confirmPasswordRules = [
  v => !!v || 'Confirm Password is required',
  v => v === form.value.password || 'Passwords must match',
]

const handleResetPassword = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    snackbar.value = { show: true, text: 'Passwords do not match!', color: 'error' }
    return
  }

  isSubmitting.value = true
  try {
    await $api.post('/set-password/', {
      uid: route.params.uid,
      token: route.params.token,
      password: form.value.password,
    })

    snackbar.value = { show: true, text: 'Password reset successfully!', color: 'success' }
    setTimeout(() => router.push('/login'), 2000)
  } catch (err) {
    console.error(err)
    snackbar.value = { show: true, text: 'Invalid or expired link.', color: 'error' }
  } finally {
    isSubmitting.value = false
  }
}

definePageMeta({ layout: 'blank' })
</script>


<template>
  <div class="auth-wrapper">
    <VCard class="auth-card">
      <div class="text-center my-6">
        <h1 class="title">🔑 Reset Your Password</h1>
        <p class="subtitle">Please enter your new password below. Make sure it’s strong and secure.</p>
      </div>

      <VCardText>
        <VForm @submit.prevent="handleResetPassword">
          <!-- New Password -->
          <VTextField
            v-model="form.password"
            label="Enter New Password"
            type="password"
            :rules="passwordRules"
            required
            class="mb-4"
          />

          <!-- Confirm Password -->
          <VTextField
            v-model="form.confirmPassword"
            label="Confirm New Password"
            type="password"
            :rules="confirmPasswordRules"
            required
            class="mb-6"
          />

          <VBtn block type="submit" :loading="isSubmitting" class="reset-btn">
            Reset Password 🔐
          </VBtn>
        </VForm>
      </VCardText>
    </VCard>

    <!-- Snackbar -->
    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
      location="top right"
    >
      {{ snackbar.text }}
    </VSnackbar>
  </div>
</template>

<style lang="scss">
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9faff;
  padding: 20px;
}

.auth-card {
  max-width: 480px;
  width: 100%;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
}

.mb-4 {
  margin-bottom: 20px !important;
}

.mb-6 {
  margin-bottom: 28px !important;
}

.reset-btn {
  background-color: #6366f1 !important;
  color: white !important;
  font-weight: 600;
  padding: 12px 0;
  border-radius: 8px;
  text-transform: none;
}
</style>
