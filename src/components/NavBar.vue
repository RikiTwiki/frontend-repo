<template>
    <nav class="navbar">
      <button @click="goTo('/')" :class="{ active: $route.path === '/' }">🏠 Home</button>
      <button
        v-if="!isAuthenticated"
        @click="goTo('/login')"
        :class="{ active: $route.path === '/login' }"
      >
        🔑 Login
      </button>
      <button
        v-if="!isAuthenticated"
        @click="goTo('/register')"
        :class="{ active: $route.path === '/register' }"
      >
        📝 Register
      </button>
      <button
        v-if="isAuthenticated"
        @click="logout"
        class="logout"
      >
        🚪 Logout
      </button>
      <button
        v-if="isAuthenticated"
        @click="goTo('/add-room')"
        :class="{ active: $route.path === '/add-room' }"
      >
        ➕ Add Room
      </button>
      <button
        v-if="isAuthenticated"
        @click="goTo('/add-booking')"
        :class="{ active: $route.path === '/add-booking' }"
      >
        📅 Add Booking
      </button>
      <button
        v-if="isAdmin"
        @click="goTo('/users')"
        :class="{ active: $route.path === '/users' }"
      >
        👥 Users
      </button>
    </nav>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        isAdmin: false, // Роль администратора
      };
    },
    computed: {
      // Проверяем, авторизован ли пользователь
      isAuthenticated() {
        return !!localStorage.getItem("authToken");
      },
    },
    async created() {
        await this.checkAdminStatus();

        // Добавляем слушатель для изменений в localStorage
        window.addEventListener("storage", this.handleStorageChange);
    },
    beforeUnmount() { // Заменено с beforeDestroy
        // Убираем слушатель при уничтожении компонента
        window.removeEventListener("storage", this.handleStorageChange);
    },
    
    methods: {
        async checkAdminStatus() {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
            const response = await axios.get("/auth/admin", {
                headers: { Authorization: `Bearer ${token}` },
            });
            this.isAdmin = response.data.isAdmin;
            } catch (error) {
            console.error("Error checking admin status:", error.message);
            this.isAdmin = false;
            }
        } else {
            this.isAdmin = false;
        }
      },
      handleStorageChange() {
        this.checkAdminStatus(); // Перепроверяем статус администратора
      },
      goTo(route) {
        this.$router.push(route);
      },
      logout() {
        localStorage.removeItem("authToken");
        this.isAdmin = false;
        this.$router.push("/login");
      },
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