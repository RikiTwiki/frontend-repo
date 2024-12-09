<template>
    <nav class="navbar" :key="componentKey">
      <button @click="goTo('/')"
              :class="{ active: $route.path === '/' }">🏠 Home</button>
      <button v-if="!isAuthenticated"
              @click="goTo('/login')"
              :class="{ active: $route.path === '/login' }">🔑 Login</button>
      <button v-if="!isAuthenticated"
              @click="goTo('/register')"
              :class="{ active: $route.path === '/register' }">📝 Register</button>
      <button v-if="isAuthenticated"
              @click="logout"
              class="logout">🚪 Logout</button>
      <button v-if="isAuthenticated"
              @click="goTo('/add-room')"
              :class="{ active: $route.path === '/add-room' }">➕ Add Room</button>
      <button v-if="isAuthenticated"
              @click="goTo('/add-booking')"
              :class="{ active: $route.path === '/add-booking' }">📅 Add Booking</button>
      <button v-if="isAdmin"
              @click="goTo('/users')"
              :class="{ active: $route.path === '/users' }">👥 Users</button>
    </nav>
  </template>
  
  <script>
  export default {
    data() {
      return {
        componentKey: 0
      };
    },
    computed: {
      isAuthenticated() {
        return this.$store.getters.isAuthenticated;
      },
      isAdmin() {
        return this.$store.getters.isAdmin;
      },
    },
    methods: {
      handleStorageChange() {
        this.$store.dispatch('fetchAdminStatus').then(() => {
          this.forceRerender(); // Перерисовка после проверки статуса
        });
      },
      goTo(route) {
        this.$router.push(route);
      },
      logout() {
        this.$store.dispatch('logout');
        this.$router.push('/login');
        this.forceRerender(); // Перерисовка после выхода
      },
      forceRerender() {
        this.componentKey++;
      }
    },
    watch: {
      '$route': {
        immediate: true,
        handler() {
          this.$store.dispatch('fetchAdminStatus').then(() => {
            this.forceRerender(); // Перерисовка после смены маршрута
          });
        }
      }
    },
    created() {
      this.$store.dispatch('fetchAdminStatus');
      window.addEventListener('storage', this.handleStorageChange);
    },
    beforeUnmount() {
      window.removeEventListener('storage', this.handleStorageChange);
    },
  };
  </script>
  
  <style scoped>
  .navbar {
    display: flex;
    justify-content: center;
    gap: 15px;
    padding: 15px 20px;
    background-color: #2c3e50;
    border-radius: 10px;
    margin-bottom: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  button {
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #3498db;
  }
  button.active {
    background-color: #1abc9c;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
    transform: scale(1.05);
  }
  button.logout {
    background-color: #e74c3c;
  }
  button.logout:hover {
    background-color: #c0392b;
  }
  button:hover {
    background-color: #2980b9;
    transform: scale(1.05);
  }
  button:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
    transform: none;
  }
  .navbar button {
    text-transform: uppercase;
  }
  .navbar button:not(:disabled):hover {
    color: #f1c40f;
  }
  </style>  