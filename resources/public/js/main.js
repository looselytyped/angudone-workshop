"use strict";

;(function(app) {
  app.controller("TodosCtrl", [
    "$scope",
    function(scope) {
      var vm = this;
      vm.description = "This is our first TodosCtrl";
    }]);

})(angular.module("TodosApp", []));
