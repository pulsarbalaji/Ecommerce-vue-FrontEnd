<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { $api } = useNuxtApp()   // 👈 get injected axios

const form = ref({ email: '' })
const isSubmitting = ref(false)

const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
})

const emailRules = [
  v => !!v || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
]

const handleForgotPassword = async () => {
  isSubmitting.value = true
  try {
    await $api.post('forgot-password/', { email: form.value.email })
    snackbar.value = { show: true, text: 'Password reset link sent! Check your email.', color: 'success' }
    setTimeout(() => router.push('/login'), 2000)
  } catch (err) {
    console.error(err)
    snackbar.value = { show: true, text: 'Error sending reset link. Please try again.', color: 'error' }
  } finally {
    isSubmitting.value = false
  }
}

definePageMeta({ layout: 'blank' })
</script>


<template>
  <div class="auth-wrapper">

    <VCard class="auth-card">
      <div class="text-center my-4">
        <h1>Ecommerce</h1>
      </div>

      <VCardText>
        <h4 class="mb-1">Forgot Password?</h4>
        <p class="mb-4">Enter your email to reset your password</p>

        <VForm @submit.prevent="handleForgotPassword">
          <VTextField v-model="form.email" label="Email" type="email" :rules="emailRules" required />

          <VBtn block type="submit" :loading="isSubmitting" class="mt-4">
            Send Reset Link 📩
          </VBtn>
        </VForm>

        <div class="text-center mt-4">
          <span>Remembered your password?</span>
          <NuxtLink class="text-primary ms-1" to="/login">Sign in</NuxtLink>
        </div>
      </VCardText>
    </VCard>

    <!-- Snackbar -->
    <VSnackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="top right">
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
  overflow: hidden;
  /* Prevents scroll */
  padding: 0;
}

.auth-card {
  max-width: 460px;
  width: 100%;
}
</style>
