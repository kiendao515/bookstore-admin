'use strict';

var KTLayoutAside = (function () {
  // Private properties
  var _body;
  var _element;
  var _offcanvasObject;

  // Private functions
  // Initialize
  var _init = function () {
    // Initialize mobile aside offcanvas
    _offcanvasObject = new KTOffcanvas(_element, {
      baseClass: 'aside',
      closeBy: 'kt_aside_close_btn',
      overlay: true,
      toggleBy: {
        target: 'kt_aside_mobile_toggle',
        state: 'active',
      },
    });
  };

  // Public methods
  return {
    init: function (id) {
      _element = KTUtil.getById(id);
      _body = KTUtil.getBody();

      if (!_element) {
        return;
      }

      // Initialize
      _init();
    },

    getElement: function () {
      return _element;
    },

    getBrandElementHeight: function () {
      var element = KTUtil.find(_element, '.aside-brand');
      var height = 0;

      if (element) {
        height = parseInt(KTUtil.css(element, 'height'));
      }

      return height;
    },

    getOffcanvas: function () {
      return _offcanvasObject;
    },

    isFixed: function () {
      return KTUtil.hasClass(_body, 'aside-fixed');
    },

    isMinimized: function () {
      return KTUtil.hasClass(_body, 'aside-fixed') && KTUtil.hasClass(_body, 'aside-minimize');
    },
  };
})();
window.KTLayoutAside = KTLayoutAside;

// Webpack support
if (typeof module !== 'undefined') {
  module.exports = KTLayoutAside;
}
