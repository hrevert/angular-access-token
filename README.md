angular-access-token
==============

Access Token module for [AngularJs](http://angularjs.org/). You can use this module if use the approach of [access tokens](http://en.wikipedia.org/wiki/Access_token) to store security credentials for a login session which identifies the user.This module is very useful if you consume `password` or `user credentials` grant of oauth2 for user authentication.  

## Installation
```
# Bower
bower install angular-access-token --save

# NPM
npm install angular-access-token --save
```

## Usage
```js
var app = angular.module('MyApp', ['htAccessToken']);

app.controller('LoginCtrl', ['htAccessToken.manager', function(accessTokenManager) {
    // store access token in local storage with expiry of 3600 seconds
    accessTokenManager.setToken('sadfsadf', 3600);
    console.log(accessTokenManager.hasToken()); // true
    console.log(accessTokenManager.getToken()); // sadfsadf
}]);

// for using token interceptor to automotically send token as Authorization header
app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('htAccessToken.interceptor');
});
```
