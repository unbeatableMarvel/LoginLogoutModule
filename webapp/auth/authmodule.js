/* Overridden Interceptor of Satellizer for intercepting and authentication every request

===================DO NOT CHANGE Unless Required =========================================

*/
let SatellizerInterceptor = (function() {
    function Interceptor(SatellizerConfig, SatellizerShared, SatellizerStorage, $q, $rootScope) {
        let _this = this;
        this.SatellizerConfig = SatellizerConfig;
        this.SatellizerShared = SatellizerShared;
        this.SatellizerStorage = SatellizerStorage;

        /* request interceptor method  */
        this.request = function(config) {
            if (config.skipAuthorization) {
                return config;
            }

            if (_this.SatellizerShared.isAuthenticated()) {
                let tokenName = _this.SatellizerConfig.tokenPrefix ? [_this.SatellizerConfig.tokenPrefix, _this.SatellizerConfig.tokenName]
                .join('_') : _this.SatellizerConfig.tokenName;
                let token = _this.SatellizerStorage.get(tokenName);
                if (_this.SatellizerConfig.tokenHeader && _this.SatellizerConfig.tokenType) {
                    token = _this.SatellizerConfig.tokenType + ' ' + token;
                }

                /* Inclusion of all required tokens in the header
                Any custom header can be included by using config.headers here*/
                config.headers[_this.SatellizerConfig.tokenHeader] = token;
                config.headers["Authorization"] = token;
                /*config.headers['x-access-token'] = _this.SatellizerShared.getPayload()['auth-token'];*/
            }
            return config;
        };
        // request end

        /* responseError handler of the interceptor*/
        this.responseError = function(rejection) {
            if (rejection.status === 401 || rejection.status === 403) {
                $rootScope.$emit('member-unauthorized');
                // console.log('signin failed from interceptor handler');
            }
            return $q.reject(rejection);
        };
        // response end
    }
    // Interceptor function ends

    Interceptor.Factory = function(SatellizerConfig,
        SatellizerShared, SatellizerStorage, $q, $rootScope) {
        return new Interceptor(SatellizerConfig,
            SatellizerShared,
            SatellizerStorage,
            $q,
            $rootScope);
    };
    Interceptor.$inject = ['SatellizerConfig',
    'SatellizerShared',
    'SatellizerStorage',
    '$q',
    '$rootScope'
    ];
    return Interceptor;
}());
// Interceptor declaration change


// Injecting all the required dependencies into the interceptor declared above
SatellizerInterceptor.Factory.$inject = ['SatellizerConfig',
'SatellizerShared',
'SatellizerStorage',
'$q',
'$rootScope'
];

// Pushing the interceptor into $httpProvider
let SatellizerHttpProviderConfig = (function() {
    function HttpProviderConfig($httpProvider) {
        this.$httpProvider = $httpProvider;
        $httpProvider.interceptors.push(SatellizerInterceptor.Factory);
    }
    HttpProviderConfig.$inject = ['$httpProvider'];
    return HttpProviderConfig;
}());
// SatellizerHttpProviderConfig ends

/* sm-candidateprofile Module is in root folder in smcandidateprofile.js */
angular.module('chatting')
    // injecting the satellizer interceptor into module
    .factory('SatellizerInterceptor', SatellizerInterceptor)
    .config(['$authProvider', '$httpProvider', function($authProvider, $httpProvider) {
        /* Satellizer properties override needed for customization*/
        /* required login api endpoint*/
        $authProvider.loginUrl = '/api/user/login';
        /* required register api endpoint*/
        $authProvider.signupUrl = '/api/user/signup';
        /* local storage name prefix "satellizer_YOUR-TOKEN-NAME"*/
        $authProvider.tokenPrefix = 'satellizer';
        /* token header that needs to be injected in every request via interceptor*/
        $authProvider.tokenHeader = 'x-user-access-token';
        /* default -> "Bearer" reset to blank required*/
        $authProvider.tokenType = '';
        /*Token name that is returned from the server */
        $authProvider.tokenName = 'authToken';
        /* Turn off default interceptor provided by satellizer*/
        $authProvider.httpInterceptor = false;

        return new SatellizerHttpProviderConfig($httpProvider);
    }]);
