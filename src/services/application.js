'use strict';

function ApplicationSvc($http, $sessionStorage, WPAConstants){

    function submitApp(application, applicant){
      console.log(arguments);
        return $http.post(WPAConstants.submitApp, {application: application, applicant: applicant })
    }

  return {
    submitApp: submitApp
  }

}

const serviceConfig = [
  '$http',
  '$sessionStorage',
  'WPAConstants',
  ApplicationSvc
]

angular.module('WPA')
  .factory('ApplicationSvc', serviceConfig)

module.exports = {
  name: 'ApplicationSvc',
  factory: serviceConfig
}