'use strict';

define(['angular'], function(angular) {
  return angular.module('portal.misc.controllers', [])

  /* AddToHomeController */
    .controller('AddToHomeController', [
      '$log', '$scope', '$timeout', 'PortalAddToHomeService',
      function($log, $scope, $timeout, PortalAddToHomeService) {
        $scope.addToHome = function() {
          if (!$scope.inHome
            && PortalAddToHomeService.canAddToHome($scope.fname)) {
            $scope.savingAddToHome = true;
            PortalAddToHomeService.addToHome($scope.fname).then(
              function() {
                // success
                $scope.inHome = true;
                $scope.successfullyAdded = true;
                return true;
              }).catch(function() {
                // failed
                $scope.addToHomeFailed = true;
              }
            );
          }
        };

        var checkInHome = function(fname) {
          PortalAddToHomeService.inHome(fname).then(function(data) {
            $scope.inHome = data;
            return data;
          }).catch(function() {
            $log.warn('could not check inHome for ' + fname);
          });
        };

        var init = function() {
          // default it to being in your home to avoid service loading lag
          $scope.inHome = true;

          if (PortalAddToHomeService.canAddToHome()) {
            if ($scope.fname) {
              // check if in home layout
              checkInHome($scope.fname);
            } else {
              $scope.$watch('fname', function() {
                // must be using 2 way binding, add a watch on the fname
                if ($scope.fname) {
                  checkInHome($scope.fname);
                }
              });
            }
          }
        };

        init();
      }])

    .controller('AppHeaderOptionsController', ['APP_OPTIONS',
      function(APP_OPTIONS) {
        var vm = this;

        // If an options template is specified, set scope variable
        if (APP_OPTIONS.optionsTemplateURL) {
          vm.optionsTemplate = require.toUrl(APP_OPTIONS.optionsTemplateURL);
        }
    }]);
});
