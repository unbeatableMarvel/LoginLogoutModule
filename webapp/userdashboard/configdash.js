angular.module('chatting').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {


    let skipIfLoggedIn = ['$q', '$auth', '$location', function($q, $auth, $location) {
        let deferred = $q.defer();
        if ($auth.isAuthenticated()) {
            
            $location.path('/home/dashboard');
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }];

    let loginRequired = ['$q', '$location', '$auth', function($q, $location, $auth) {
        let deferred = $q.defer();
        if ($auth.isAuthenticated()) {
            deferred.resolve();
        } else {
            $location.path('/home/login');
        }
        return deferred.promise;
    }];



    $stateProvider
        .state('user.login', {

            url: '/login',
            views: {

                'midcontent@user': {

                    templateUrl: 'userlogin/template/login.html',
                    controller: 'loginctrl as login',

                     resolve: {
                                skipIfLoggedIn: skipIfLoggedIn
                                    /* passing skipIfLoggedIn function here enables skipping login view
                                     if the user is already authenticated*/
                            }
                }
            }


        })
        .state('user.register', {
            parent: 'user',
            url: '/register',
            views: {
                'midcontent@user': {
                    templateUrl: 'userregister/template/register.html',
                    controller: 'registerctrl as register',
                     resolve: {
                                skipIfLoggedIn: skipIfLoggedIn
                                    /* passing skipIfLoggedIn function here enables skipping login view
                                     if the user is already authenticated*/
                            }

                }
            }
        })
        .state('user.dashboard', {
            parent: 'user',
            url: '/dashboard',
            views: {
                'midcontent@user': {
                    templateUrl: 'userdashboard/templates/dashboard.html',
                    controller: 'dashboardctrl',
                     resolve: {
                                loginRequired: loginRequired
                                    /* passing loginRequired function here enables redirecting user
                                     to the login view if the user is not authenticated .
                                     This will prevent user form accessing this state*/
                            }

                }
            }
        });

}]);
