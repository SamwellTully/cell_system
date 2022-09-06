import { login, logout, getInfo, update } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const params = new URLSearchParams();
    params.append("username", userInfo.username);
    params.append("password", userInfo.password);
    return new Promise((resolve, reject) => {
      login(params).then(response => {
        const data = response.data
        console.log(data)
        commit('SET_TOKEN', data)
        setToken(data)
        resolve()
        console.log("check")
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  update({ commit }, info) {
    return new Promise((resolve, reject) => {
      const upPara = new URLSearchParams();
      upPara.append("institutionName", info.institutionName);
      upPara.append("userId", info.userId);
      upPara.append("institutionType", info.institutionType);
      upPara.append("institutionInstruction", info.institutionInstruction);
      upPara.append("institutionAddress", info.institutionAddress);
      upPara.append("institutionPostalCode", info.institutionPostalCode);
      upPara.append("userName", info.userName);
      upPara.append("userPhoneNum", info.userPhoneNum);
      upPara.append("userEmail", info.userEmail);
      upPara.append("userPrivileges", info.userPrivileges);
      update(upPara).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

