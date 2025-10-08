<script setup lang="ts">
import avatar1 from '@images/avatars/avatar-1.png'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const { $api } = useNuxtApp()
const router = useRouter()

const handleLogout = async () => {
  try {
    // Send refresh token to backend for blacklisting
    if (auth.refreshToken) {
      await $api.post('/logout/', { refresh: auth.refreshToken })
    }

    // Clear session
    auth.clearAuth()

    // Redirect to login
    router.push('/login')
  } catch (err) {
    console.error('Logout failed:', err)
    auth.clearAuth()
    router.push('/login')
  }
}
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
    bordered
  >
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VImg :src="avatar1" />

      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <VListItem>
            <template #prepend>
              <VAvatar color="primary" variant="tonal">
                <VImg :src="avatar1" />
              </VAvatar>
            </template>
            <VListItemTitle class="font-weight-semibold">
              {{ auth.admin?.name || 'Admin' }}
            </VListItemTitle>
            <VListItemSubtitle>
              {{ auth.admin?.role || 'User' }}
            </VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem link>
            <template #prepend>
              <VIcon class="me-2" icon="bx-user" size="22" />
            </template>
            <VListItemTitle>Profile</VListItemTitle>
          </VListItem>

          <!-- 👉 Logout -->
          <VListItem @click="handleLogout">
            <template #prepend>
              <VIcon class="me-2" icon="bx-log-out" size="22" />
            </template>
            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
    </VAvatar>
  </VBadge>
</template>
