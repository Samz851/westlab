'use strict';
var angular = require('angular');

require('../css/login.css')

function loginCtrl($scope, $sessionStorage, $state, $filter, LoginSvc) {
  $scope.progress = false;
  $scope.title = 'westlab'
  $scope.copyrightYear = new Date().getFullYear();
  LoginSvc.logout();
  $scope.submitForm = function(isValid){
    if ( isValid ) {
      $scope.progress = true;
      LoginSvc.login($scope.team, $scope.password)
        .then(res => {
          console.log(res);
          $scope.progress = false;
          if ( res.success ) {
            $state.go('home');
          } else {
            $scope.message = res.message;
          }
        })
        .catch(err => {
          $scope.progress = false;
          $scope.message = err;
        })
    }
  }


}

var stateConfig = {
  name: 'login',
  url: '/login',
  templateUrl: require('./login.html'),
  controller: 'loginCtrl'
};

loginCtrl.$inject = [
  '$scope',
  '$sessionStorage',
  '$state',
  '$filter',
  'LoginSvc'
]

function routeConfig($stateProvider) {
  $stateProvider.state(stateConfig)
}

angular.module('WPA')
  .controller('loginCtrl', loginCtrl)
  .config([ '$stateProvider', routeConfig ])

module.exports = stateConfig;
