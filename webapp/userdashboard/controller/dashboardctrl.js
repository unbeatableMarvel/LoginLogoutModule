angular.module('chatting').controller('dashboardctrl',['$scope','$auth','$state',function($scope,$auth,$state){


$scope.logout=function(){

	$auth.logout();

	$state.go('user.login');
}

}]);