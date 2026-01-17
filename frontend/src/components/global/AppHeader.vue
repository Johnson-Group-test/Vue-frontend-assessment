<template>
  <header class="app-header">
    <div class="container">
      <router-link to="/">
        <h1 class="title">Campaign Dashboard</h1>
      </router-link>
      <nav>
        <router-link to="/">Dashboard</router-link>
        <router-link to="/campaigns">Campaigns</router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.title {
    color: #f0f0f0;
  }
.app-header {
  background: #1a1a1a;
  color: white;
  padding: 1rem 0;
  border-bottom: 2px solid #333;
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
}

.app-header nav {
  display: flex;
  gap: 1rem; 
}

.app-header nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.app-header nav a:hover,
.app-header nav a.router-link-active {
  background: #333;
}
/* Responsive */
@media (max-width: 640px) {
  .app-header .container {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .app-header h1 {
    font-size: 1.25rem;
  }
  
  .app-header nav {
    width: 100%;
    justify-content: center;
  }
  
  .app-header nav a {
    flex: 1;
    text-align: center;
  }
}
</style>