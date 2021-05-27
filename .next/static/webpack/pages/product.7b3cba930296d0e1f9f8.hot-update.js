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
  var data = Object(C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_1__["default"])([" query Product( $id: Int ! ){\n        productBy( productId: $id){\n            id\n            databaseId\n            averageRating\n            slug\n            description\n            image {\n                uri\n                title\n                srcSet\n                sourceUrl\n            }\n            name\n        }\n    }"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}






var Product = Object(next_router__WEBPACK_IMPORTED_MODULE_6__["useRouter"])(_c = function _c(props) {
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

product.getInitialProps = /*#__PURE__*/function () {
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

$RefreshReg$(_c, "Product$useRouter");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vcGFnZXMvcHJvZHVjdC5qcyJdLCJuYW1lcyI6WyJQcm9kdWN0IiwidXNlUm91dGVyIiwicHJvcHMiLCJjb25zb2xlIiwid2FybiIsInByb2R1Y3QiLCJnZXRJbml0aWFsUHJvcHMiLCJjb250ZXh0Iiwic2x1ZyIsInF1ZXJ5IiwiaWQiLCJwYXJzZUludCIsInNwbGl0IiwicG9wIiwiUFJPRFVDVFNfUVVFUlkiLCJncWwiLCJjbGllbnQiLCJ2YXJpYWJsZXMiLCJyZXMiLCJkYXRhIiwicHJvZHVjdEJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsT0FBTyxHQUFHQyw2REFBUyxNQUFHLFlBQUFDLEtBQUssRUFBSztBQUNsQ0MsU0FBTyxDQUFDQyxJQUFSLENBQWNGLEtBQWQ7QUFDQSxzQkFFSTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUZKO0FBSUgsQ0FOd0IsQ0FBekI7TUFBTUYsTzs7QUFRTkssT0FBTyxDQUFDQyxlQUFSO0FBQUEsOFNBQTBCLGlCQUFnQkMsT0FBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRVJDLGdCQUZRLEdBRUdELE9BRkgsQ0FFakJFLEtBRmlCLENBRVJELElBRlE7QUFHaEJFLGNBSGdCLEdBR1hGLElBQUksR0FBR0csUUFBUSxDQUFFSCxJQUFJLENBQUNJLEtBQUwsQ0FBWSxHQUFaLEVBQWtCQyxHQUFsQixFQUFGLENBQVgsR0FBeUNOLE9BQU8sQ0FBQ0UsS0FBUixDQUFjQyxFQUhoRDtBQUtoQkksMEJBTGdCLEdBS0NDLDJEQUxEO0FBQUE7QUFBQSxtQkFzQkpDLGdFQUFNLENBQUNQLEtBQVAsQ0FBYztBQUM1QkEsbUJBQUssRUFBRUssY0FEcUI7QUFFNUJHLHVCQUFTLEVBQUU7QUFBRVAsa0JBQUUsRUFBRkE7QUFBRjtBQUZpQixhQUFkLENBdEJJOztBQUFBO0FBc0JoQlEsZUF0QmdCO0FBQUEsNkNBMEJmO0FBQ0hiLHFCQUFPLEVBQUVhLEdBQUcsQ0FBQ0MsSUFBSixDQUFTQztBQURmLGFBMUJlOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQTFCOztBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWdDZXBCLHNFQUFmIiwiZmlsZSI6InN0YXRpYy93ZWJwYWNrL3BhZ2VzL3Byb2R1Y3QuN2IzY2JhOTMwMjk2ZDBlMWY5ZjguaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMaW5rIGZyb20gJ25leHQvbGluayc7XHJcbmltcG9ydCBMYXlvdXQgZnJvbSBcIi4uL2NvbXBvbmVudHMvTGF5b3V0XCI7XHJcbmltcG9ydCB7IHVzZVJvdXRlciAgfSBmcm9tICduZXh0L3JvdXRlcic7XHJcbmltcG9ydCBjbGllbnQgZnJvbSBcIi4uL2NvbXBvbmVudHMvQXBvbGxvQ2xpZW50XCI7XHJcbmltcG9ydCBncWwgZnJvbSAnZ3JhcGhxbC10YWcnO1xyXG5cclxuY29uc3QgUHJvZHVjdCA9IHVzZVJvdXRlciAoIHByb3BzICA9PiB7XHJcbiAgICBjb25zb2xlLndhcm4oIHByb3BzICk7XHJcbiAgICByZXR1cm4oXHJcbiAgICAgICBcclxuICAgICAgICA8ZGl2PlByb2R1Y3Q8L2Rpdj5cclxuICAgIClcclxufSk7XHJcblxyXG5wcm9kdWN0LmdldEluaXRpYWxQcm9wcyA9IGFzeW5jIGZ1bmN0aW9uKCBjb250ZXh0ICl7XHJcblxyXG4gICAgbGV0eyBxdWVyeTogeyBzbHVnIH0gfSA9IGNvbnRleHQ7XHJcbiAgICBjb25zdCBpZCA9IHNsdWcgPyBwYXJzZUludCggc2x1Zy5zcGxpdCggJy0nICkucG9wKCkgKSA6IGNvbnRleHQucXVlcnkuaWQ7XHJcblxyXG4gICAgY29uc3QgUFJPRFVDVFNfUVVFUlkgPSBncWxgIHF1ZXJ5IFByb2R1Y3QoICRpZDogSW50ICEgKXtcclxuICAgICAgICBwcm9kdWN0QnkoIHByb2R1Y3RJZDogJGlkKXtcclxuICAgICAgICAgICAgaWRcclxuICAgICAgICAgICAgZGF0YWJhc2VJZFxyXG4gICAgICAgICAgICBhdmVyYWdlUmF0aW5nXHJcbiAgICAgICAgICAgIHNsdWdcclxuICAgICAgICAgICAgZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgaW1hZ2Uge1xyXG4gICAgICAgICAgICAgICAgdXJpXHJcbiAgICAgICAgICAgICAgICB0aXRsZVxyXG4gICAgICAgICAgICAgICAgc3JjU2V0XHJcbiAgICAgICAgICAgICAgICBzb3VyY2VVcmxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuYW1lXHJcbiAgICAgICAgfVxyXG4gICAgfWA7XHJcblxyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgY2xpZW50LnF1ZXJ5KCh7XHJcbiAgICAgICAgcXVlcnk6IFBST0RVQ1RTX1FVRVJZLFxyXG4gICAgICAgIHZhcmlhYmxlczogeyBpZCB9XHJcbiAgICB9KSk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHByb2R1Y3Q6IHJlcy5kYXRhLnByb2R1Y3RCeVxyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb2R1Y3Q7Il0sInNvdXJjZVJvb3QiOiIifQ==