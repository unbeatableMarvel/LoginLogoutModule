angular.module('chatting').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

         $stateProvider
         .state('user',{
         	url:'/home',
         	views:{
         		'content@':{
         			templateUrl:'applayout/templates/content.html'
         		},
         		footer:{
         			templateUrl:'applayout/templates/footer.html'
         		}
         	}


         });

$urlRouterProvider.otherwise('/home/login');

}]);
