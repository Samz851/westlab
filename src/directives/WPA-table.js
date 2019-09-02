'use strict';
function WPATable(){
  return {
    restrict: 'A',
    scope: {
      rows: '=data'
    },
    templateUrl: require('./WPA-table.html'),
    link: function(scope, element, attrs, controller, transcludeFn){
      var unwatch = scope.$watch('rows', (nv, ov) => {
        if ( !!nv ) {
          unwatch();
          launch();
        }
      })
      function launch() {
        scope.headers = scope.rows.shift();
        console.log(scope.headers, scope.rows)
      }
    }
  }
}

angular.module('WPA')
  .directive('wpatable', WPATable)

module.exports = {
  name: 'wpatable',
  directive: WPATable
}

