'use strict';

define(['angular'], function(angular) {
  return angular.module('portal.main.services', [])

  .factory('mainService', ['$http', '$log', '$sessionStorage', 'miscService', 'SERVICE_LOC', 'APP_FLAGS', function($http, $log, $sessionStorage, miscService, SERVICE_LOC, APP_FLAGS) {
    var prom = $http.get(SERVICE_LOC.sessionInfo, {cache: true});
    var userPromise;

    var getUser = function() {
      if (userPromise) {
        return userPromise;
      }

      userPromise = prom.then(
          function(result, status) { // success function
            if(APP_FLAGS.loginOnLoad) {
              // quick check to make sure you are who your browser says you are
              if($sessionStorage.portal
                && $sessionStorage.portal.username
                && result.data.person.userName !== $sessionStorage.portal.username
                && result.data.person.originalUsername !== $sessionStorage.portal.username
                ) {
                  $log.warn('Thought they were ' + $sessionStorage.portal.username +
                   ' but session sent back ' + result.data.person.userName +'. Redirect!');
                  delete $sessionStorage.portal;
                  miscService.redirectUser(302, 'Wrong User than populated in session storage.');
              }
            }
            return result.data.person;
          }, function(data, status) { // failure function
            miscService.redirectUser(status, 'Get User Info');
          });
      return userPromise;
    };

    return {
      getUser: getUser,
    };
  }]);
});
