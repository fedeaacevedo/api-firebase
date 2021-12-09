import {
  createStore
} from "vuex";
import router from "../router";

export default createStore({
  state: {
    tareas: [],
    tarea: {
      id: "",
      nombre: "",
      categorias: [],
      estado: "",
      numero: 0,
    },
    user: null
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
    cargar(state, payload) {
      state.tareas = payload;
    },
    set(state, payload) {
      state.tareas.push(payload);
    },
    eliminar(state, payload) {
      state.tareas = state.tareas.filter((item) => item.id !== payload);
    },
    tarea(state, payload) {
      if (!state.tareas.find((item) => item.id === payload)) {
        router.push("/");
        return;
      }
      state.tarea = state.tareas.find((item) => item.id === payload);
    },
    update(state, payload) {
      state.tareas = state.tareas.map((item) =>
        item.id === payload.id ? payload : item
      );
      router.push("/");
    },
  },
  actions: {
    async ingresoUsuario({
      commit
    }, usuario) {
      try {
        const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBTxCI347sDFNqAP0tRv9UYuB3Awu6Wds0', {
          method: 'POST',
          body: JSON.stringify({
            email: usuario.email,
            password: usuario.password,
            returnSecureToken: true
          })
        })
        const userDB = await res.json()
        console.log('userDB', userDB)
        if (userDB.error) {
          return console.log(userDB.error);
        }
        commit('setUser', userDB)
        router.push('/')
      } catch (error) {
        console.log(error);
      }
    },

    async registrarUsuario({
      commit
    }, usuario) {
      try {
        const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBTxCI347sDFNqAP0tRv9UYuB3Awu6Wds0', {
          method: 'POST',
          body: JSON.stringify({
            email: usuario.email,
            password: usuario.password,
            returnSecureToken: true
          })
        })
        const userDB = await res.json()
        console.log(userDB);
        if (userDB.error) {
          console.log(userDB.error)
          return
        }
        commit('setUser', userDB)
        router.push('/')
      } catch (error) {
        console.log(error);
      }

    },
    async cargarLocalStorage({ commit, state }){
      try {
        const res = await fetch(
          `https://udemy-api-a64fe-default-rtdb.firebaseio.com/tareas/${state.user.localId}.json?auth=${state.user.idToken},`
        );
        const dataDB = await res.json();
        // console.log(dataDB);
        const arrayTareas = [];

        for (let id in dataDB) {
          // console.log(id);
          // console.log(dataDB[id]);
          arrayTareas.push(dataDB[id]);
        }

        console.log(arrayTareas);

        commit("cargar", arrayTareas);
      } catch (error) {
        console.log(error);
      }
    },
    async setTareas({
      commit, state
    }, tarea) {
      try {
        const res = await fetch(
          `https://udemy-api-a64fe-default-rtdb.firebaseio.com/tareas/${state.user.localId}/${tarea.id}.json?auth=${state.user.idToken}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(tarea),
          }
        );

        const dataDB = await res.json();
        console.log(dataDB);
      } catch (error) {
        console.log(error);
      }
      commit("set", tarea);
    },
    async deleteTareas({
      commit, state
    }, id) {
      try {
        const res = await fetch(`https://udemy-api-a64fe-default-rtdb.firebaseio.com/tareas/${state.user.localId}/${id}.json?auth=${state.user.idToken}`, {
          method: 'DELETE'
        })
        commit("eliminar", id);
      } catch (error) {
        console.log(error);
      }

    },
    setTarea({
      commit
    }, id) {
      commit("tarea", id);
    },
    async updateTarea({
      commit, state
    }, tarea) {
      try {
        const res = await fetch(
          `https://udemy-api-a64fe-default-rtdb.firebaseio.com/tareas/${state.user.localId}/${tarea.id}.json?auth=${state.user.idToken}`, {
            method: "PATCH",
            body: JSON.stringify(tarea),
          }
        );

        const dataDB = await res.json();
        commit("update", dataDB);
      } catch (error) {
        console.log(error);
      }

    },
  },
  modules: {},
});