(function() {
  'use strict';

  angular
    .module('goGuardFe')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })

      .state('team', {
        url: '/team',
        templateUrl: 'app/main/team.html',
        controller: 'MainController',
        controllerAs: 'main'
      })

      .state('game', {
        url: '/game',
        templateUrl: 'app/main/game.html',
        controller: 'MainController',
        controllerAs: 'main'
      })

      .state('player', {
        url: '/player',
        templateUrl: 'app/main/player.html',
        controller: 'MainController',
        controllerAs: 'main'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
