(function() {
  'use strict';

  angular
    .module('goGuardFe')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
