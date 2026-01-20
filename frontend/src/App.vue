<template>
  <div id="app">
    <header class="app-header" role="banner">
      <div class="container">
        <h1>Campaign Dashboard</h1>
        <nav role="navigation" aria-label="Main navigation">
          <router-link
            to="/"
            aria-label="View all campaigns"
            :aria-current="$route.path === '/' ? 'page' : undefined"
          >
            Campaigns
          </router-link>
        </nav>
      </div>
    </header>
    
    <main class="app-main" role="main" id="main-content">
      <router-view />
    </main>
    
    <footer class="app-footer" role="contentinfo">
      <div class="container">
        <p>&copy; 2024 Johnson Group - Frontend Developer Assessment</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
</script>

<style scoped>
.app-header {
  background: var(--color-gray-900);
  color: var(--color-white);
  padding: 1rem 0;
  border-bottom: 2px solid var(--color-gray-800);
}

.app-header .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-white);
}

.app-header nav a {
  color: var(--color-white);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.app-header nav a:hover,
.app-header nav a.router-link-active {
  background: var(--color-gray-800);
}

.app-main {
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
}

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

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
