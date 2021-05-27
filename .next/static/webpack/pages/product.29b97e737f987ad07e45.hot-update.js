webpackHotUpdate_N_E("pages/product",{

/***/ "./pages/product.js":
/*!**************************!*\
  !*** ./pages/product.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral */ "./node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js");
/* harmony import */ var C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/link */ "./node_modules/next/link.js");
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _components_Layout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/Layout */ "./components/Layout.js");
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! next/router */ "./node_modules/next/router.js");
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _components_ApolloClient__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../components/ApolloClient */ "./components/ApolloClient.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! graphql-tag */ "./node_modules/graphql-tag/lib/index.js");





var _jsxFileName = "C:\\Users\\coolv\\OneDrive\\Desktop\\Plantisserie\\pages\\product.js",
    _this = undefined;

function _templateObject() {
  var data = Object(C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_1__["default"])(["query Product( $id: Int ! ){\n        productBy( mediaItemId: $id){\n            id\n            averageRating\n            slug\n            description\n            image {\n                uri\n                title\n                srcSet\n                sourceUrl\n                mediaItemId\n            }\n            name\n        }\n    }"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}






var Product = Object(next_router__WEBPACK_IMPORTED_MODULE_6__["withRouter"])(_c = function _c(props) {
  console.warn(props);
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__["jsxDEV"])("div", {
    children: "Product"
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 11,
    columnNumber: 9
  }, _this);
});
_c2 = Product;

Product.getInitialProps = /*#__PURE__*/function () {
  var _ref = Object(C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_2__["default"])( /*#__PURE__*/C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(context) {
    var slug, id, PRODUCTS_QUERY, res;
    return C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            slug = context.query.slug;
            id = slug ? parseInt(slug.split('-').pop()) : context.query.id;
            PRODUCTS_QUERY = Object(graphql_tag__WEBPACK_IMPORTED_MODULE_8__["default"])(_templateObject());
            _context.next = 5;
            return _components_ApolloClient__WEBPACK_IMPORTED_MODULE_7__["default"].query({
              query: PRODUCTS_QUERY,
              variables: {
                id: id
              }
            });

          case 5:
            res = _context.sent;
            return _context.abrupt("return", {
              product: res.data.productBy
            });

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

/* harmony default export */ __webpack_exports__["default"] = (Product);

var _c, _c2;

$RefreshReg$(_c, "Product$withRouter");
$RefreshReg$(_c2, "Product");

;
    var _a, _b;
    // Legacy CSS implementations will `eval` browser code in a Node.js context
    // to extract CSS. For backwards compatibility, we need to check we're in a
    // browser context before continuing.
    if (typeof self !== 'undefined' &&
        // AMP / No-JS mode does not inject these helpers:
        '$RefreshHelpers$' in self) {
        var currentExports = module.__proto__.exports;
        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;
        // This cannot happen in MainTemplate because the exports mismatch between
        // templating and execution.
        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.i);
        // A module can be accepted automatically based on its exports, e.g. when
        // it is a Refresh Boundary.
        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
            // Save the previous exports on update so we can compare the boundary
            // signatures.
            module.hot.dispose(function (data) {
                data.prevExports = currentExports;
            });
            // Unconditionally accept an update to this module, we'll check if it's
            // still a Refresh Boundary later.
            module.hot.accept();
            // This field is set when the previous version of this module was a
            // Refresh Boundary, letting us know we need to check for invalidation or
            // enqueue an update.
            if (prevExports !== null) {
                // A boundary can become ineligible if its exports are incompatible
                // with the previous exports.
                //
                // For example, if you add/remove/change exports, we'll want to
                // re-execute the importing modules, and force those components to
                // re-render. Similarly, if you convert a class component to a
                // function, we want to invalidate the boundary.
                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {
                    module.hot.invalidate();
                }
                else {
                    self.$RefreshHelpers$.scheduleUpdate();
                }
            }
        }
        else {
            // Since we just executed the code for the module, it's possible that the
            // new exports made it ineligible for being a boundary.
            // We only care about the case when we were _previously_ a boundary,
            // because we already accepted this update (accidental side effect).
            var isNoLongerABoundary = prevExports !== null;
            if (isNoLongerABoundary) {
                module.hot.invalidate();
            }
        }
    }

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/next/dist/compiled/webpack/harmony-module.js */ "./node_modules/next/dist/compiled/webpack/harmony-module.js")(module)))

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vcGFnZXMvcHJvZHVjdC5qcyJdLCJuYW1lcyI6WyJQcm9kdWN0Iiwid2l0aFJvdXRlciIsInByb3BzIiwiY29uc29sZSIsIndhcm4iLCJnZXRJbml0aWFsUHJvcHMiLCJjb250ZXh0Iiwic2x1ZyIsInF1ZXJ5IiwiaWQiLCJwYXJzZUludCIsInNwbGl0IiwicG9wIiwiUFJPRFVDVFNfUVVFUlkiLCJncWwiLCJjbGllbnQiLCJ2YXJpYWJsZXMiLCJyZXMiLCJwcm9kdWN0IiwiZGF0YSIsInByb2R1Y3RCeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLE9BQU8sR0FBR0MsOERBQVUsTUFBRyxZQUFBQyxLQUFLLEVBQUs7QUFDbkNDLFNBQU8sQ0FBQ0MsSUFBUixDQUFjRixLQUFkO0FBQ0Esc0JBRUk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FGSjtBQUlILENBTnlCLENBQTFCO01BQU1GLE87O0FBUU5BLE9BQU8sQ0FBQ0ssZUFBUjtBQUFBLDhTQUEwQixpQkFBZ0JDLE9BQWhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVSQyxnQkFGUSxHQUVHRCxPQUZILENBRWpCRSxLQUZpQixDQUVSRCxJQUZRO0FBR2hCRSxjQUhnQixHQUdYRixJQUFJLEdBQUdHLFFBQVEsQ0FBRUgsSUFBSSxDQUFDSSxLQUFMLENBQVksR0FBWixFQUFrQkMsR0FBbEIsRUFBRixDQUFYLEdBQXlDTixPQUFPLENBQUNFLEtBQVIsQ0FBY0MsRUFIaEQ7QUFLaEJJLDBCQUxnQixHQUtDQywyREFMRDtBQUFBO0FBQUEsbUJBc0JKQyxnRUFBTSxDQUFDUCxLQUFQLENBQWM7QUFDNUJBLG1CQUFLLEVBQUVLLGNBRHFCO0FBRTVCRyx1QkFBUyxFQUFFO0FBQUVQLGtCQUFFLEVBQUZBO0FBQUY7QUFGaUIsYUFBZCxDQXRCSTs7QUFBQTtBQXNCaEJRLGVBdEJnQjtBQUFBLDZDQTBCZjtBQUNIQyxxQkFBTyxFQUFFRCxHQUFHLENBQUNFLElBQUosQ0FBU0M7QUFEZixhQTFCZTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUExQjs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUErQmVwQixzRUFBZiIsImZpbGUiOiJzdGF0aWMvd2VicGFjay9wYWdlcy9wcm9kdWN0LjI5Yjk3ZTczN2Y5ODdhZDA3ZTQ1LmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGluayBmcm9tICduZXh0L2xpbmsnO1xyXG5pbXBvcnQgTGF5b3V0IGZyb20gJy4uL2NvbXBvbmVudHMvTGF5b3V0JztcclxuaW1wb3J0IHsgd2l0aFJvdXRlciB9IGZyb20gJ25leHQvcm91dGVyJztcclxuaW1wb3J0IGNsaWVudCBmcm9tIFwiLi4vY29tcG9uZW50cy9BcG9sbG9DbGllbnRcIjtcclxuaW1wb3J0IGdxbCBmcm9tICdncmFwaHFsLXRhZyc7XHJcblxyXG5jb25zdCBQcm9kdWN0ID0gd2l0aFJvdXRlciAoIHByb3BzICA9PiB7XHJcbiAgICBjb25zb2xlLndhcm4oIHByb3BzICk7XHJcbiAgICByZXR1cm4oXHJcbiAgICAgICBcclxuICAgICAgICA8ZGl2PlByb2R1Y3Q8L2Rpdj5cclxuICAgIClcclxufSk7XHJcblxyXG5Qcm9kdWN0LmdldEluaXRpYWxQcm9wcyA9IGFzeW5jIGZ1bmN0aW9uKCBjb250ZXh0ICl7XHJcblxyXG4gICAgbGV0eyBxdWVyeTogeyBzbHVnIH0gfSA9IGNvbnRleHQ7XHJcbiAgICBjb25zdCBpZCA9IHNsdWcgPyBwYXJzZUludCggc2x1Zy5zcGxpdCggJy0nICkucG9wKCkgKSA6IGNvbnRleHQucXVlcnkuaWQ7XHJcblxyXG4gICAgY29uc3QgUFJPRFVDVFNfUVVFUlkgPSBncWxgcXVlcnkgUHJvZHVjdCggJGlkOiBJbnQgISApe1xyXG4gICAgICAgIHByb2R1Y3RCeSggbWVkaWFJdGVtSWQ6ICRpZCl7XHJcbiAgICAgICAgICAgIGlkXHJcbiAgICAgICAgICAgIGF2ZXJhZ2VSYXRpbmdcclxuICAgICAgICAgICAgc2x1Z1xyXG4gICAgICAgICAgICBkZXNjcmlwdGlvblxyXG4gICAgICAgICAgICBpbWFnZSB7XHJcbiAgICAgICAgICAgICAgICB1cmlcclxuICAgICAgICAgICAgICAgIHRpdGxlXHJcbiAgICAgICAgICAgICAgICBzcmNTZXRcclxuICAgICAgICAgICAgICAgIHNvdXJjZVVybFxyXG4gICAgICAgICAgICAgICAgbWVkaWFJdGVtSWRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuYW1lXHJcbiAgICAgICAgfVxyXG4gICAgfWA7XHJcblxyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgY2xpZW50LnF1ZXJ5KCh7XHJcbiAgICAgICAgcXVlcnk6IFBST0RVQ1RTX1FVRVJZLFxyXG4gICAgICAgIHZhcmlhYmxlczogeyBpZCB9XHJcbiAgICB9KSk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHByb2R1Y3Q6IHJlcy5kYXRhLnByb2R1Y3RCeVxyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdDsiXSwic291cmNlUm9vdCI6IiJ9