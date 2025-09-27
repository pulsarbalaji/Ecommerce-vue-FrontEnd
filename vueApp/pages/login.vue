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

const handleLogin = async () => {
  try {
    const response = await $api.post('adminlogin/', {
      email: form.value.email,
      password: form.value.password,
    })

    // Save token in sessionStorage & user globally
    auth.setAuth(response.data.access, response.data.admin)

    // Redirect after login
    router.push('/dashboard')
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message)
    alert(error.response?.data?.detail || 'Invalid credentials')
  }
}

definePageMeta({ layout: 'blank' })
</script>
<template>
  <div class="auth-wrapper">
    <div class="auth-container">
      <!-- 👉 Top shape -->
      <VImg
        :src="authV1TopShape"
        class="text-primary auth-v1-top-shape d-none d-sm-block"
      />

      <!-- 👉 Bottom shape -->
      <VImg
        :src="authV1BottomShape"
        class="text-primary auth-v1-bottom-shape d-none d-sm-block"
      />

      <!-- 👉 Auth Card -->
      <VCard
        class="auth-card"
        max-width="550"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
      >
        <!-- logo -->
        <VCardItem class="justify-center">
          <NuxtLink to="/" class="app-logo">
            <div class="d-flex" v-html="logo" />
            <h1 class="app-logo-title">Ecommerce</h1>
          </NuxtLink>
        </VCardItem>

        <!-- welcome text -->
        <VCardText>
          <h4 class="text-h4 mb-1">Welcome to Admin Port of Ecommerce 👋🏻</h4>
          <p class="mb-0">Please sign-in to your account and start the adventure</p>
        </VCardText>

        <!-- form -->
        <VCardText>
          <VForm @submit.prevent="handleLogin">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="form.email"
                  autofocus
                  label="Email or Username"
                  type="email"
                  placeholder="johndoe@email.com"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="form.password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center justify-space-between flex-wrap my-6">
                  <VCheckbox v-model="form.remember" label="Remember me" />
                  <NuxtLink class="text-primary" to="/forgot-password">
                    Forgot Password?
                  </NuxtLink>
                </div>

                <VBtn block type="submit">Login</VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style scoped>
.auth-wrapper {
  display: flex;
  overflow: hidden; /* prevent scroll */
  align-items: center;
  justify-content: center;
  background: #f9faff; /* optional background */
  min-block-size: 100vh; /* full screen */
}

.auth-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
