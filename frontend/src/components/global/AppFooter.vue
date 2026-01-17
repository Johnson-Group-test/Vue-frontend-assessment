<template>
  <footer class="app-footer">
    <div class="container">
      <p>&copy; {{ new Date().getFullYear() }} Johnson Group - Frontend Developer Assessment</p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: #f5f5f5;
  padding: 1rem 0;
  margin-top: auto;
  border-top: 1px solid #ddd;
}

.app-footer .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
  color: #666;
}
</style>