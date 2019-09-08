'use strict';
function WPAProcess(){
  return {
    restrict: 'A',
    scope: {
        applicationData: '='
    },
    templateUrl: require('./WPA-process.html'),
    link: function(scope, element, attrs, controller, transcludeFn){
        //SAM Equipments block
        scope.equipments = 1;
        scope.equipmentCount = function(){
        return Array(scope.equipments);
        }
        scope.moreEqu = function(){
        scope.equipments++ ;
        scope.equipmentCount();
        }

        //SAM Consumables block
        scope.consumables = 1;
        scope.consumeCount = function(){
        return Array(scope.consumables);
        }
        scope.moreCon = function(){
        scope.consumables++ ;
        scope.consumeCount();
        }

    }
  }
}

angular.module('WPA')
  .directive('wpaprocess', WPAProcess)

module.exports = {
  name: 'wpaprocess',
  directive: WPAProcess
}
