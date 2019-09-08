'use strict';
var angular = require('angular');

require('../css/home.css')

function homeCtrl($scope, $sessionStorage, $state, $filter, LoginSvc, ApplicationSvc) {
  $scope.title = 'westlab';
  $scope.navBar = require('../includes/navbar.html');
  $scope.applicationData = {0: {}};
  $scope.applicantData = {}
  $scope.links = $state.get()
    .filter(x => x.name.startsWith('home.'))
    .map(x => {
      return {
        title: x.url.slice(1),
        link: $state.href(x.name)
      }
    });
    $scope.applicant = $sessionStorage.user;
    console.log($sessionStorage);
  // $scope.tableData = [
  //   ['#', 'Header', 'Header', 'Header', 'Header' ],
  //   ["1001","Lorem","ipsum","dolor","sit"],
  //   ["1002","amet","consectetur","adipiscing","elit"],
  //   ["1003","Integer","nec","odio","Praesent"],
  //   ["1003","libero","Sed","cursus","ante"],
  //   ["1004","dapibus","diam","Sed","nisi"],
  //   ["1005","Nulla","quis","sem","at"],
  //   ["1006","nibh","elementum","imperdiet","Duis"],
  //   ["1007","sagittis","ipsum","Praesent","mauris"],
  //   ["1008","Fusce","nec","tellus","sed"],
  //   ["1009","augue","semper","porta","Mauris"],
  //   ["1010","massa","Vestibulum","lacinia","arcu"],
  //   ["1011","eget","nulla","Class","aptent"],
  //   ["1012","taciti","sociosqu","ad","litora"],
  //   ["1013","torquent","per","conubia","nostra"]
  // ]

  // //SAM Equipments block
  //   $scope.equipments = 1;
  //   $scope.equipmentCount = function(){
  //     return Array($scope.equipments);
  //   }
  //   $scope.moreEqu = function(){
  //     $scope.equipments++ ;
  //     $scope.equipmentCount();
  //   }

  // //SAM Consumables block
  // $scope.consumables = 1;
  // $scope.consumeCount = function(){
  //   return Array($scope.consumables);
  // }
  // $scope.moreCon = function(){
  //   $scope.consumables++ ;
  //   $scope.consumeCount();
  // }

  //SAM Process block
  $scope.processes = {0: 1};
  $scope.procCount = function(index){
    let v = (typeof $scope.processes[index] !== 'undefined' && $scope.processes[index] > 0) ? $scope.processes[index] : 1;
    $scope.processes[index] = v;
    return Array(v);
  }
  $scope.morePro = function(index){
    $scope.processes[index]++ ;
    $scope.procCount(index);
  }

  //SAM Method block
  $scope.methods = 1;
  $scope.methodCount = function(){
    return Array($scope.methods);
  }
  $scope.moreMethod = function(){
    $scope.methods++ ;
    $scope.methodCount();
  }

  $scope.signout = signout;
  $scope.submitApplication = function(){
    ApplicationSvc.submitApp($scope.applicationData, $scope.applicantData);
  }

  function signout(){
    LoginSvc.logout()
    $state.go('login')
  }

}

var stateConfig = {
  name: 'home',
  url: '/home',
  templateUrl: require('./home.html'),
  controller: 'homeCtrl'
};

homeCtrl.$inject = [
  '$scope',
  '$sessionStorage',
  '$state',
  '$filter',
  'LoginSvc',
  'ApplicationSvc'
]

function routeConfig($stateProvider) {
  $stateProvider.state(stateConfig)
}

angular.module('WPA')
  .controller('homeCtrl', homeCtrl)
  .config([ '$stateProvider', routeConfig ])

module.exports = stateConfig;
