'use strict';

function LoginSvc($http, $sessionStorage, WPAConstants){

  function login(team, password) {
    
    return $http.post(WPAConstants.loginUrl, {team: team, pass: password})
    .then(res => {
          let ret = res.data || {};
          if ( res.status == 200 ) {
            ret = res.data;
            $sessionStorage.user = ret.user;
            ret.message = 'Login successful';
            ret.authenticated = ret.success
          } else {
            ret = {
              authenticated: false,
              message: `${res.status} ${res.statusText}`
            }
          }
          return ret;
        })
        .catch(err => {
          return {
            authenticated: false,
            message: `${err.status} ${err.statusText}`
          }
        });

    // let auth = btoa(`${username}:${password}`)
    // return $http.get(WPAConstants.loginUrl, {
    //   headers: {
    //     'Authorization': 'Basic ' + auth
    //   }
    // })
    //   .then(res => {
    //     let ret = res.data || {};
    //     if ( res.status == 200 ) {
    //       ret = res.data;
    //       $sessionStorage.user = ret.user;
    //       ret.message = 'Login successful'
    //     } else {
    //       ret = {
    //         authenticated: false,
    //         message: `${res.status} ${res.statusText}`
    //       }
    //     }
    //     return ret;
    //   })
    //   .catch(err => {
    //     return {
    //       authenticated: false,
    //       message: `${err.status} ${err.statusText}`
    //     }
    //   })
  }

  function logout() {
    $sessionStorage.user = null;
  }

  return {
    login: login,
    logout: logout
  }

}

const serviceConfig = [
  '$http',
  '$sessionStorage',
  'WPAConstants',
  LoginSvc
]

angular.module('WPA')
  .factory('LoginSvc', serviceConfig)

module.exports = {
  name: 'LoginSvc',
  factory: serviceConfig
}
