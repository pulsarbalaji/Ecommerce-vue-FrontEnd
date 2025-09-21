<script setup>
import VerticalNavSectionTitle from "@/@layouts/components/VerticalNavSectionTitle.vue";
import VerticalNavGroup from "@layouts/components/VerticalNavGroup.vue";
import VerticalNavLink from "@layouts/components/VerticalNavLink.vue";
</script>

<template>
  <nav>
    <!-- 👉 Dashboards -->
    <VerticalNavGroup :item="{ title: 'Dashboards', icon: 'bx-home-smile' }">
      <VerticalNavLink :item="{ title: 'Analytics', to: '/dashboard' }" />
    </VerticalNavGroup>

    <!-- 👉 Products -->
    <VerticalNavLink
      :item="{ title: 'Admin', icon: 'bx-group', to: '/admin' }"
    />

    <VerticalNavLink
      :item="{ title: 'Category', icon: 'bx-category', to: '/category' }"
    />
    <VerticalNavGroup :item="{ title: 'Products', icon: 'bx-box' }">
  <!-- Product Details -->
  <VerticalNavLink
    :item="{ title: 'Product Details', icon: 'bx-list-ui', to: '/product' }"
  />

  <!-- Add Stock -->
  <VerticalNavLink
    :item="{ title: 'Add Stock', icon: 'bx-plus-circle',  }"
  />
</VerticalNavGroup>

<VerticalNavGroup :item="{ title: 'Order', icon: 'bx-cart' }">
  <!-- Order Details -->
  <VerticalNavLink
    :item="{ title: 'Order Details', icon: 'bx-receipt', to: '/order' }"
  />

  <!-- Order Status -->
  <VerticalNavLink
    :item="{ title: 'Order Status', icon: 'bx-package' }"
  />
</VerticalNavGroup>
<VerticalNavLink
 :item="{ title: 'Customer Details', icon: 'bx-receipt', to: '/customer' }"
/>



    <!-- <VerticalNavGroup
      :item="{ title: 'Products', icon: 'bx-box' }"
    >
      <VerticalNavLink
        :item="{ title: 'All Products', to: '/products' }"
      />
      <VerticalNavLink
        :item="{ title: 'Add Product', to: '/products/add' }"
      />
    </VerticalNavGroup> -->

    <!-- 👉 Orders -->
    <!-- <VerticalNavGroup
      :item="{ title: 'Orders', icon: 'bx-cart' }"
    >
      <VerticalNavLink
        :item="{ title: 'All Orders', to: '/orders' }"
      />
      <VerticalNavLink
        :item="{ title: 'Pending Orders', to: '/orders/pending' }"
      />
    </VerticalNavGroup> -->

    <!-- 👉 Customers -->
    <!-- <VerticalNavGroup
      :item="{ title: 'Customers', icon: 'bx-user' }"
    >
      <VerticalNavLink
        :item="{ title: 'All Customers', to: '/customers' }"
      />
    </VerticalNavGroup> -->

    <!-- 👉 Settings -->
    <!-- <VerticalNavSectionTitle :item="{ heading: 'Settings' }" />
    <VerticalNavLink
      :item="{ title: 'Profile', icon: 'bx-user-circle', to: '/profile' }"
    />
    <VerticalNavLink
      :item="{ title: 'Account Settings', icon: 'bx-cog', to: '/account-settings' }"
    />
    <VerticalNavLink
      :item="{ title: 'Logout', icon: 'bx-log-out', to: '/logout' }"
    /> -->
  </nav>
</template>
