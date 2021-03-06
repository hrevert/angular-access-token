'use strict';
(function () {
    var accessTokenModule = angular.module('htAccessToken', []);

    accessTokenModule.factory('htAccessToken.manager', ['$window', function ($window) {

        var tokenService = {
            _hasToken: null,
            _timeoutID: null
        };

        tokenService.setToken = function (accessToken, expiresIn) {
            var accessTokenExpiry = Date.now() + expiresIn * 1000;
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

    /**
     * Alias for htAccessToken.manager
     */
    accessTokenModule.factory('htAccessTokenManager', ['htAccessToken.manager', function(htAccessTokenManager){
        return htAccessTokenManager;
    }]);

    accessTokenModule.factory('htAccessToken.interceptor', function ($q, $window, htAccessTokenManager) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if (htAccessTokenManager.hasToken()) {
                    config.headers.Authorization = 'Bearer ' + htAccessTokenManager.getToken();
                }
                return config;
            }
        };
    });
})();