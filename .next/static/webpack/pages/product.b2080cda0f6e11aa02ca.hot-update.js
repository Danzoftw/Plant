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
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_3__["jsxDEV"])("div", {
    children: "Product"
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 9,
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
            id = slug ? parseInt(slug.split('-').pop()) : context.query.mediaItemId;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vcGFnZXMvcHJvZHVjdC5qcyJdLCJuYW1lcyI6WyJQcm9kdWN0Iiwid2l0aFJvdXRlciIsInByb3BzIiwiZ2V0SW5pdGlhbFByb3BzIiwiY29udGV4dCIsInNsdWciLCJxdWVyeSIsImlkIiwicGFyc2VJbnQiLCJzcGxpdCIsInBvcCIsIm1lZGlhSXRlbUlkIiwiUFJPRFVDVFNfUVVFUlkiLCJncWwiLCJjbGllbnQiLCJ2YXJpYWJsZXMiLCJyZXMiLCJwcm9kdWN0IiwiZGF0YSIsInByb2R1Y3RCeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLElBQU1BLE9BQU8sR0FBR0MsOERBQVUsTUFBRyxZQUFBQyxLQUFLLEVBQUs7QUFDbkMsc0JBQ0k7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FESjtBQUdILENBSnlCLENBQTFCO01BQU1GLE87O0FBTU5BLE9BQU8sQ0FBQ0csZUFBUjtBQUFBLDhTQUEwQixpQkFBZ0JDLE9BQWhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVSQyxnQkFGUSxHQUVHRCxPQUZILENBRWpCRSxLQUZpQixDQUVSRCxJQUZRO0FBR2hCRSxjQUhnQixHQUdYRixJQUFJLEdBQUdHLFFBQVEsQ0FBRUgsSUFBSSxDQUFDSSxLQUFMLENBQVksR0FBWixFQUFrQkMsR0FBbEIsRUFBRixDQUFYLEdBQXlDTixPQUFPLENBQUNFLEtBQVIsQ0FBY0ssV0FIaEQ7QUFLaEJDLDBCQUxnQixHQUtDQywyREFMRDtBQUFBO0FBQUEsbUJBc0JKQyxnRUFBTSxDQUFDUixLQUFQLENBQWM7QUFDNUJBLG1CQUFLLEVBQUVNLGNBRHFCO0FBRTVCRyx1QkFBUyxFQUFFO0FBQUVSLGtCQUFFLEVBQUZBO0FBQUY7QUFGaUIsYUFBZCxDQXRCSTs7QUFBQTtBQXNCaEJTLGVBdEJnQjtBQUFBLDZDQTBCZjtBQUNIQyxxQkFBTyxFQUFFRCxHQUFHLENBQUNFLElBQUosQ0FBU0M7QUFEZixhQTFCZTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUExQjs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUErQmVuQixzRUFBZiIsImZpbGUiOiJzdGF0aWMvd2VicGFjay9wYWdlcy9wcm9kdWN0LmIyMDgwY2RhMGY2ZTExYWEwMmNhLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTGluayBmcm9tICduZXh0L2xpbmsnO1xyXG5pbXBvcnQgTGF5b3V0IGZyb20gJy4uL2NvbXBvbmVudHMvTGF5b3V0JztcclxuaW1wb3J0IHsgd2l0aFJvdXRlciB9IGZyb20gJ25leHQvcm91dGVyJztcclxuaW1wb3J0IGNsaWVudCBmcm9tIFwiLi4vY29tcG9uZW50cy9BcG9sbG9DbGllbnRcIjtcclxuaW1wb3J0IGdxbCBmcm9tICdncmFwaHFsLXRhZyc7XHJcblxyXG5jb25zdCBQcm9kdWN0ID0gd2l0aFJvdXRlciAoIHByb3BzICA9PiB7XHJcbiAgICByZXR1cm4oXHJcbiAgICAgICAgPGRpdj5Qcm9kdWN0PC9kaXY+XHJcbiAgICApXHJcbn0pO1xyXG5cclxuUHJvZHVjdC5nZXRJbml0aWFsUHJvcHMgPSBhc3luYyBmdW5jdGlvbiggY29udGV4dCApe1xyXG5cclxuICAgIGxldHsgcXVlcnk6IHsgc2x1ZyB9IH0gPSBjb250ZXh0O1xyXG4gICAgY29uc3QgaWQgPSBzbHVnID8gcGFyc2VJbnQoIHNsdWcuc3BsaXQoICctJyApLnBvcCgpICkgOiBjb250ZXh0LnF1ZXJ5Lm1lZGlhSXRlbUlkO1xyXG5cclxuICAgIGNvbnN0IFBST0RVQ1RTX1FVRVJZID0gZ3FsYHF1ZXJ5IFByb2R1Y3QoICRpZDogSW50ICEgKXtcclxuICAgICAgICBwcm9kdWN0QnkoIG1lZGlhSXRlbUlkOiAkaWQpe1xyXG4gICAgICAgICAgICBpZFxyXG4gICAgICAgICAgICBhdmVyYWdlUmF0aW5nXHJcbiAgICAgICAgICAgIHNsdWdcclxuICAgICAgICAgICAgZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgaW1hZ2Uge1xyXG4gICAgICAgICAgICAgICAgdXJpXHJcbiAgICAgICAgICAgICAgICB0aXRsZVxyXG4gICAgICAgICAgICAgICAgc3JjU2V0XHJcbiAgICAgICAgICAgICAgICBzb3VyY2VVcmxcclxuICAgICAgICAgICAgICAgIG1lZGlhSXRlbUlkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbmFtZVxyXG4gICAgICAgIH1cclxuICAgIH1gO1xyXG5cclxuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGNsaWVudC5xdWVyeSgoe1xyXG4gICAgICAgIHF1ZXJ5OiBQUk9EVUNUU19RVUVSWSxcclxuICAgICAgICB2YXJpYWJsZXM6IHsgaWQgfVxyXG4gICAgfSkpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBwcm9kdWN0OiByZXMuZGF0YS5wcm9kdWN0QnlcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2R1Y3Q7Il0sInNvdXJjZVJvb3QiOiIifQ==