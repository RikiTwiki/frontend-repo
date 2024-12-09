import { createStore } from 'vuex';

import axios from 'axios';

export default createStore({
  state: {
    authToken: localStorage.getItem('authToken'),
    isAdmin: false,
  },
  mutations: {
    setAuthToken(state, token) {
      state.authToken = token;
      localStorage.setItem('authToken', token);
    },
    clearAuthToken(state) {
      state.authToken = null;
      localStorage.removeItem('authToken');
    },
    setAdminStatus(state, status) {
      state.isAdmin = status;
    },

    setAuthState(state, isAuthenticated) {
        state.isAuthenticated = isAuthenticated;
    }

  },
  actions: {
    async fetchAdminStatus({ commit, state }) {
      if (state.authToken) {
        try {
          const response = await axios.get('/auth/admin', {
            headers: { Authorization: `Bearer ${state.authToken}` },
          });
          commit('setAdminStatus', response.data.isAdmin);
        } catch (error) {
          console.error("Error checking admin status:", error.message);
          commit('setAdminStatus', false);
        }
      } else {
        commit('setAdminStatus', false);
      }
    },
    logout({ commit }) {
      commit('clearAuthToken');
      commit('setAdminStatus', false);
    },

    updateAuthState({ commit }, isAuthenticated) {
        commit('setAuthState', isAuthenticated);
    }

  },
  getters: {
    isAuthenticated(state) {
      return !!state.authToken;
    },
    isAdmin(state) {
      return state.isAdmin;
    }
  }
});