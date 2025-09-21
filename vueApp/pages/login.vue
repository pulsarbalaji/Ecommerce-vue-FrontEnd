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
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
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
        max-width="460"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
      >
        <VCardItem class="justify-center">
          <NuxtLink
            to="/"
            class="app-logo"
          >
            <!-- eslint-disable vue/no-v-html -->
            <div
              class="d-flex"
              v-html="logo"
            />
            <h1 class="app-logo-title">
              Ecommerce
            </h1>
          </NuxtLink>
        </VCardItem>

        <VCardText>
          <h4 class="text-h4 mb-1">
            Welcome to Admin Port of Ecommerce 👋🏻
          </h4>
          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="handleLogin">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  :id="useId()"
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
                  :id="useId()"
                  v-model="form.password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password"
                  :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <!-- remember me checkbox -->
                <div class="d-flex align-center justify-space-between flex-wrap my-6">
                  <VCheckbox
                    :id="useId()"
                    v-model="form.remember"
                    label="Remember me"
                  />

                  <NuxtLink class="text-primary" to="/forgot-password">Forgot Password?</NuxtLink>


                </div>

                <!-- login button -->
                <VBtn
                  block
                  type="submit"
                >
                  Login
                </VBtn>
              </VCol>


             
              <!-- auth providers -->
              <VCol
                cols="12"
                class="text-center"
              >
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
