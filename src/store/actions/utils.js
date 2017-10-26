import Vue from 'vue'
// import VueResource from 'vue-resource'
// Vue.use(VueResource)

import axios from 'axios'

import router from '../../router'

module.exports = {
  goto: (ctx, param) => {
      if (typeof param === 'number') {
        router.go(param)
      } else if (typeof param === 'string') {
        router.push(param)
      } else if (typeof param === 'object' && param.path) {
        router.push({
          path: param.path,
          query: {
            ...param.query
          },
          params: {
            ...param.params
          }
        })
      } else if (typeof param === 'object' && param.name) {
        router.push({
          name: param.name,
          query: {
            ...param.query
          },
          params: {
            ...param.params
          }
        })
      }
  },
  replaceto: (ctx, param) => {
    if (typeof param === 'string') {
        router.replace(param)
      } else if (typeof param === 'object' && param.path) {
        router.replace({
          path: param.path,
          query: {
            ...param.query
          },
          params: {
            ...param.params
          }
        })
      } else if (typeof param === 'object' && param.name) {
        router.replace({
          name: param.name,
          query: {
            ...param.query
          },
          params: {
            ...param.params
          }
        })
      }
  },
  resource: (ctx, param) => {
    let headers = param.headers || {};
    if (!param.url.match(/register/) && !param.url.match(/login/) ) {
      headers.Session = sessionStorage.getItem('session_id');
    }
    ctx.commit('LOADING', 1)

    axios({
      url: '/speed-invoice' + param.url,
      method: param.method || "GET",
      baseURL: param.baseURL || null,
      headers: headers,
      params: param.params || null,
      data: param.body || null,
      timeout: param.timeout || 5000,
    }).then(
      response => {
        ctx.commit('LOADING')
        if (+response.data.errcode === 0 || +response.status == 204) {
          param.onSuccess ? param.onSuccess(response.data, response.headers) : null
        } else {
          ctx.dispatch('showtoast', `code:${response.data.errcode} ${response.data.errmsg}`);
          param.onFail ? param.onFail(response) : null
        }
      }
    ).catch(
      error => {
        ctx.commit('LOADING')
        // console.log(error)

        for(let key in error) {
          console.log(key,error[key])
        }

        if (!error.response && error.code === 'ECONNABORTED') {
          ctx.dispatch('showtoast', '请求超时');
          return;
        }

        let status = error.response.status;

        //ErrorCallback
        if (status === 401) {
          ctx.dispatch('showtoast', '登录失效!');
        } else if (status === 400) {
          ctx.dispatch('showtoast', 'Bad Request');
        } else if (status === 404) {
          ctx.dispatch('showtoast', 'Not Found');
        } else if (status === 500) {
          ctx.dispatch('showtoast', 'Internal Server Error');
        } else {
          // console.log(error)
          ctx.dispatch('showtoast', 'Request Error');
        }
        if (param.url.match(/getInfo/) && param.onFail) {
          param.onFail({name: '获取失败'})
        }
      }
    )
  }
}