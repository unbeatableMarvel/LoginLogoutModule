/* Login controller -> responsible for authentication and hhaving $state, $auth as dependencies*/
angular.module('chatting')
    .controller('loginctrl', ['$auth', '$state', 'Flash','$log', function($auth, $state, Flash,$log) {
        let vm = this;
        vm.user = {};
        /* Login() function which will be actually called in the associated view for
        authentication of the user*/
        vm.login = function() {
            // console.log(vm.user);

            /* $auth.login() is a predefined function provided by satellizer
            for initiating authentication of the user . This returns a promise
            and accepts an object with all the required fields which needs to be
            sent to the api for authentication

            NOTE :- To change the login api endpoint/URI , please override
            $authProvider.loginUrl with new value in /auth/authmodule.js */
            $auth.login({
                // email of the user entered in the login form
                email: vm.user.email,
                // username of the user entered in the login form
                password: vm.user.password
            }).then(function(response) {
                $log.error('response --->', response);
                // redirects to a mentioned state if successfull
                $state.go('user.dashboard');
            }).catch(function(response) {
                $log.error('Login Failed ---->', response)
                let message = 'Login Failed ! UserName or Password does not match .';
                Flash.create('danger', message);
                // window.alert('Error: Login failed'); // alert msg on error
                // @Todo Logic to handle error
            });
            // $auth.login ends
        };
    }]);
