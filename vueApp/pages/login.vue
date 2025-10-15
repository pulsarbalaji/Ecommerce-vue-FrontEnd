<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const { $api } = useNuxtApp()
const router = useRouter()
const auth = useAuthStore()

const form = ref({
  email: '',
  password: '',
  remember: false,
})

const isPasswordVisible = ref(false)
const loading = ref(false)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('error')

const handleLogin = async () => {
  if (loading.value) return
  loading.value = true
  snackbar.value = false

  try {
    const response = await $api.post('adminlogin/', {
      email: form.value.email,
      password: form.value.password,
    })

    // ✅ Save auth data
    auth.setAuth(response.data.access, response.data.admin)

    // ✅ Redirect
    router.push('/dashboard')
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message)
    snackbarMessage.value =
      error.response?.data?.detail || 'Email or password is incorrect'
    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    loading.value = false
  }
}

definePageMeta({ layout: 'blank' })
</script>

<template>
  <div class="auth-wrapper">
    <div class="auth-container">

      <!-- ✅ Loading Overlay -->
      <div v-if="loading" class="loading-overlay">
        <VProgressCircular indeterminate color="primary" size="64" width="6" />
      </div>

      <!-- 👉 Auth Card -->
      <VCard
        class="auth-card"
        max-width="550"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
      >
        <!-- logo -->
        <VCardItem class="justify-center">
          <NuxtLink to="/" class="app-logo">
            <h1 class="app-logo-title">Ecommerce</h1>
          </NuxtLink>
        </VCardItem>

        <!-- welcome text -->
        <VCardText>
          <h4 class="text-h4 mb-1">Welcome to Admin Port of Ecommerce 👋🏻</h4>
          <p class="mb-0">Please sign in to your account and start the adventure.</p>
        </VCardText>

        <!-- form -->
        <VCardText>
          <VForm @submit.prevent="handleLogin">
            <VRow>
              <!-- Email -->
              <VCol cols="12">
                <VTextField
                  v-model="form.email"
                  label="Email or Username"
                  type="email"
                  placeholder="johndoe@email.com"
                  :disabled="loading"
                  autofocus
                />
              </VCol>

              <!-- Password -->
              <VCol cols="12">
                <VTextField
                  v-model="form.password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  :disabled="loading"
                />

                <div class="d-flex align-center justify-space-between flex-wrap my-6">
                  <VCheckbox v-model="form.remember" label="Remember me" :disabled="loading" />
                  <NuxtLink class="text-primary" to="/forgot-password">Forgot Password?</NuxtLink>
                </div>

                <VBtn
                  block
                  type="submit"
                  color="primary"
                  :loading="loading"
                  :disabled="loading"
                >
                  <template v-if="!loading">Login</template>
                  <template v-else>Logging in...</template>
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>

    <!-- ✅ Snackbar for Errors -->
    <VSnackbar
      v-model="snackbar"
      :color="snackbarColor"
      location="bottom center"
      timeout="3000"
      multi-line
      rounded="pill"
    >
      {{ snackbarMessage }}
    </VSnackbar>
  </div>
</template>

<style scoped>
.auth-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-block-size: 100vh;
  background: #f9faff;
  overflow: hidden;
}

.auth-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ✅ Loader Overlay */
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
