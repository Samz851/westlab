'use strict';
var angular = require('angular');

require('../css/home.css')

function homeCtrl($scope, $sessionStorage, $state, $filter, LoginSvc, ApplicationSvc, $window, $timeout) {
  $scope.title = 'westlab';
  $scope.navBar = require('../includes/navbar.html');
  $scope.applicationData = {0: {}};
  $scope.applicantData = {};
  $scope.showResult = false;
  $scope.hideForConvert = false;
  $scope.links = $state.get()
    .filter(x => x.name.startsWith('home.'))
    .map(x => {
      return {
        title: x.url.slice(1),
        link: $state.href(x.name)
      }
    });
    $scope.applicant = $sessionStorage.user;
    //REMOVE FOR PROD
    $scope.applicantData = {
      contact: "Samer",
      email: "sam.otb@hotmail.ca",
      name: "Westlab",
      phone: "6137161317"
    }
    $scope.applicationData = {"0":{"name":"Method 1","samplesCount":200,"processes":{"0":{"processName":"Method1.Process1","equipment":{"1":"Brand1","2":"Branding2"},"consumables":{"1":"CONS1"},"staff":20,"space":1200,"workstations":5,"stools":20,"processT":3,"waitingT":1},"1":{"processName":"Method1.Process2","equipment":{"1":"SAM1","2":"SAM1"},"consumables":{"1":"dsw","2":"dsw"},"staff":20,"space":900,"workstations":4,"stools":10,"processT":1,"waitingT":1}}},"1":{"name":"Method 2","samplesCount":2000,"processes":{"0":{"processName":"Method2.Process1","equipment":{"1":"Brand1"},"consumables":{"1":"C"},"staff":20,"space":800,"workstations":5,"stools":20,"processT":2,"waitingT":2}}}}
    
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
  $scope.moreMethod = function(e){
    e.preventDefault();
    $scope.methods++ ;
    $scope.methodCount();
  }

  
  $scope.submitApplication = function(){
    ApplicationSvc.submitApp($scope.applicationData, $scope.applicantData).then(response => {
      console.log(response.data.success);
      if(response.data.success){
        $scope.showResult = true;
        for( var method in $scope.applicationData){
          console.log($scope.applicationData[method]);
          var spaceCount = 0;
          var totalProcessT = 0;
          var totalWaitingT = 0;

          for( var process in $scope.applicationData[method].processes){
            console.log($scope.applicationData[method].processes[process]);
            spaceCount += $scope.applicationData[method].processes[process].space;
            totalProcessT += $scope.applicationData[method].processes[process].processT;
            totalWaitingT += $scope.applicationData[method].processes[process].waitingT;
          };
          $scope.applicationData[method].spaceCount = spaceCount;
          $scope.applicationData[method].processT = totalProcessT;
          $scope.applicationData[method].waitingT = totalWaitingT;
        }

      }
    })
  }

  

$scope.printResult = function(e) {
  e.preventDefault();
   //$window.print();
   $scope.hideForConvert = true;

   (function makeScreenshot()
   {
       html2canvas(document.getElementById("wpa-page"), {scale: 2}).then(canvas =>
       {
           canvas.id = "canvasID";
           var main = document.getElementById("wpa-page");
           while (main.firstChild) { main.removeChild(main.firstChild); }
           $timeout(function() {
            main.appendChild(canvas);
            $window.print();
           },100)

       });
   })();
  // Save the PDF
  // doc.save($scope.applicantData.name + '-' + Date.now() + '.pdf');
  // var doc = new jsPDF();   

  // doc.html(document.getElementById('wl-results'), {
  //   callback: function (doc) {
  //     doc.save();
  //   }
  // });
  // html2canvas(document.getElementById('wl-results'), {
  //   onrendered: function (canvas) {
  //     var data = canvas.toDataURL();
  //     var docDefinition = {
  //       content: [{
  //         image: data,
  //         width: 500,
  //       }]
  //     };
  //     pdfMake.createPdf(docDefinition).download($scope.applicantData.name + '-' + Date.now() + '.pdf');
  //     document.body.appendChild(canvas);
  //   }
  // });






  // var printContents = document.getElementById('wl-results').innerHTML;
  // var popupWin = window.open('', '_blank', 'width=300,height=300');
  // popupWin.document.open();
  // popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
  // popupWin.document.close();
  // var pdf = new jsPDF('p', 'pt', 'letter');  
  //   var canvas = pdf.canvas  
  //   canvas.height = 72 * 15;  
  //   canvas.width = 72 * 15;  
  //   var html = $("#wl-results").html();  
  //   var options = {  
  //       pagesplit: true  
  //   };  
  //   html2pdf(html, pdf, function(pdf) {  
  //       pdf.save($scope.applicantData + '-' + Date.now() + '.pdf');  
  //   });
} 

$scope.newApplication = function(){
  $state.go('home', {}, {reload: true})
}

  
  $scope.signout = signout;
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
  'ApplicationSvc',
  '$window',
  '$timeout'
]

function routeConfig($stateProvider) {
  $stateProvider.state(stateConfig)
}

angular.module('WPA')
  .controller('homeCtrl', homeCtrl)
  .config([ '$stateProvider', routeConfig ])

module.exports = stateConfig;
