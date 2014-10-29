'use strict';
(function () {
    var oauth2Module = angular.module('HtOauth2', []);

    oauth2Module.factory('HtOauth2.accessTokenService', ['$window', function ($window) {

        var tokenService = {
            _hasToken: null,
            _timeoutID: null
        };

        tokenService.setToken = function (accessToken, accessTokenExpiry) {
            if (accessTokenExpiry <= Date.now()) {
                // @todo determine what is the best thing to do here
                return;
            }
            $window.localStorage.setItem('accessToken', accessToken);
            $window.localStorage.setItem('accessTokenExpiry', accessTokenExpiry);
            this._hasToken = true;
            if (this._timeoutID !== null) {
                $window.clearTimeout(this._timeoutID);
            }
            this._timeoutID = $window.setTimeout(function () {
                tokenService.removeToken();
            }, accessTokenExpiry - Date.now());
        };

        tokenService.getToken = function () {
            return $window.localStorage.getItem('accessToken');
        };

        tokenService.hasToken = function () {
            if (this.getToken() === null) {
                return false;
            }
            if (this._hasToken === null) {
                if ($window.localStorage.getItem('accessTokenExpiry') <= Date.now()) {
                    this._hasToken = false;
                } else {
                    this._hasToken = true;
                }
            }
            return this._hasToken;
        };

        tokenService.removeToken = function () {
            $window.localStorage.removeItem('accessToken');
            $window.localStorage.removeItem('accessTokenExpiry');
            this._hasToken = false;
            if (this._timeoutID !== null) {
                $window.clearTimeout(this._timeoutID);
            }
        };

        return tokenService;
    }]);

    oauth2Module.factory('HtOauth2.TokenInterceptor', function ($q, $window, accessTokenService) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if (accessTokenService.hasToken()) {
                    config.headers.Authorization = 'Bearer ' + accessTokenService.getToken();
                }
                return config;
            }
        };
    });
})();