webpackHotUpdate_N_E("pages/index",{

/***/ "./pages/index.js":
/*!************************!*\
  !*** ./pages/index.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "./node_modules/react/jsx-dev-runtime.js");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral */ "./node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js");
/* harmony import */ var _components_Layout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/Layout */ "./components/Layout.js");
/* harmony import */ var _components_ApolloClient__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/ApolloClient */ "./components/ApolloClient.js");
/* harmony import */ var _components_Product__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../components/Product */ "./components/Product.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/index.js");
/* harmony import */ var graphql_tag__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! graphql-tag */ "./node_modules/graphql-tag/lib/index.js");





var _jsxFileName = "C:\\Users\\coolv\\OneDrive\\Desktop\\Plantisserie\\pages\\index.js",
    _this = undefined;

function _templateObject() {
  var data = Object(C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_3__["default"])(["query{\n        products(first: 20) {\n            nodes {\n                id\n                averageRating\n                slug\n                description\n                image {\n                    uri\n                    title\n                    srcSet\n                    sourceUrl\n                    mediaItemId\n                }\n            name\n            productTags {\n                nodes {\n                  productTagId\n                }\n              }\n            }\n        }\n}"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}






var PRODUCTS_QUERY = Object(graphql_tag__WEBPACK_IMPORTED_MODULE_8__["default"])(_templateObject());

var Index = function Index(props) {
  var products = props.products;
  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__["jsxDEV"])(_components_Layout__WEBPACK_IMPORTED_MODULE_4__["default"], {
    children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__["jsxDEV"])(react_bootstrap__WEBPACK_IMPORTED_MODULE_7__["Row"], {
      className: "product-container",
      children: products.length ? products.map(function (product) {
        return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__["jsxDEV"])(_components_Product__WEBPACK_IMPORTED_MODULE_6__["default"], {
          product: product
        }, product.image.mediaItemId, false, {
          fileName: _jsxFileName,
          lineNumber: 43,
          columnNumber: 46
        }, _this);
      }) : ''
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 41,
      columnNumber: 13
    }, _this)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 40,
    columnNumber: 9
  }, _this);
};

_c = Index;
Index.getInitialProps = /*#__PURE__*/Object(C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__["default"])( /*#__PURE__*/C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee() {
  var result;
  return C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _components_ApolloClient__WEBPACK_IMPORTED_MODULE_5__["default"].query({
            query: PRODUCTS_QUERY
          });

        case 2:
          result = _context.sent;
          return _context.abrupt("return", {
            products: result.products.productBy
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}));
/* harmony default export */ __webpack_exports__["default"] = (Index);

var _c;

$RefreshReg$(_c, "Index");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vcGFnZXMvaW5kZXguanMiXSwibmFtZXMiOlsiUFJPRFVDVFNfUVVFUlkiLCJncWwiLCJJbmRleCIsInByb3BzIiwicHJvZHVjdHMiLCJsZW5ndGgiLCJtYXAiLCJwcm9kdWN0IiwiaW1hZ2UiLCJtZWRpYUl0ZW1JZCIsImdldEluaXRpYWxQcm9wcyIsImNsaWVudCIsInF1ZXJ5IiwicmVzdWx0IiwicHJvZHVjdEJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBLElBQU1BLGNBQWMsR0FBR0MsMkRBQUgsbUJBQXBCOztBQXdCQSxJQUFNQyxLQUFLLEdBQUcsU0FBUkEsS0FBUSxDQUFFQyxLQUFGLEVBQWE7QUFBQSxNQUVmQyxRQUZlLEdBRUZELEtBRkUsQ0FFZkMsUUFGZTtBQUl2QixzQkFDSSxxRUFBQywwREFBRDtBQUFBLDJCQUNJLHFFQUFDLG1EQUFEO0FBQUssZUFBUyxFQUFDLG1CQUFmO0FBQUEsZ0JBQ01BLFFBQVEsQ0FBQ0MsTUFBVCxHQUNFRCxRQUFRLENBQUNFLEdBQVQsQ0FBYyxVQUFBQyxPQUFPO0FBQUEsNEJBQUkscUVBQUMsMkRBQUQ7QUFBMkMsaUJBQU8sRUFBR0E7QUFBckQsV0FBZUEsT0FBTyxDQUFDQyxLQUFSLENBQWNDLFdBQTdCO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBQUo7QUFBQSxPQUFyQixDQURGLEdBRUU7QUFIUjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREo7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQURKO0FBU0gsQ0FiRDs7S0FBTVAsSztBQWVOQSxLQUFLLENBQUNRLGVBQU4saVRBQXdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBQ0NDLGdFQUFNLENBQUNDLEtBQVAsQ0FBYztBQUFFQSxpQkFBSyxFQUFFWjtBQUFULFdBQWQsQ0FERDs7QUFBQTtBQUNkYSxnQkFEYztBQUFBLDJDQUdiO0FBQ0hULG9CQUFRLEVBQUVTLE1BQU0sQ0FBQ1QsUUFBUCxDQUFnQlU7QUFEdkIsV0FIYTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUF4QjtBQVFlWixvRUFBZiIsImZpbGUiOiJzdGF0aWMvd2VicGFjay9wYWdlcy9pbmRleC5mOTZmNjBmNzU5NmUzMWJlYzU3Ni5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExheW91dCBmcm9tICcuLi9jb21wb25lbnRzL0xheW91dCc7XHJcblxyXG5pbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvbXBvbmVudHMvQXBvbGxvQ2xpZW50JztcclxuXHJcbmltcG9ydCBQcm9kdWN0IGZyb20gJy4uL2NvbXBvbmVudHMvUHJvZHVjdCc7XHJcblxyXG5pbXBvcnQgeyBDYXJkLCBDb250YWluZXIsIENvbCwgUm93ICB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCc7XHJcblxyXG5pbXBvcnQgZ3FsIGZyb20gJ2dyYXBocWwtdGFnJztcclxuXHJcbmNvbnN0IFBST0RVQ1RTX1FVRVJZID0gZ3FsYHF1ZXJ5e1xyXG4gICAgICAgIHByb2R1Y3RzKGZpcnN0OiAyMCkge1xyXG4gICAgICAgICAgICBub2RlcyB7XHJcbiAgICAgICAgICAgICAgICBpZFxyXG4gICAgICAgICAgICAgICAgYXZlcmFnZVJhdGluZ1xyXG4gICAgICAgICAgICAgICAgc2x1Z1xyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICAgIGltYWdlIHtcclxuICAgICAgICAgICAgICAgICAgICB1cmlcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZVxyXG4gICAgICAgICAgICAgICAgICAgIHNyY1NldFxyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZVVybFxyXG4gICAgICAgICAgICAgICAgICAgIG1lZGlhSXRlbUlkXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5hbWVcclxuICAgICAgICAgICAgcHJvZHVjdFRhZ3Mge1xyXG4gICAgICAgICAgICAgICAgbm9kZXMge1xyXG4gICAgICAgICAgICAgICAgICBwcm9kdWN0VGFnSWRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbn1gO1xyXG5cclxuY29uc3QgSW5kZXggPSAoIHByb3BzICkgPT4ge1xyXG5cclxuICAgIGNvbnN0IHsgcHJvZHVjdHMgfSA9IHByb3BzO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPExheW91dD5cclxuICAgICAgICAgICAgPFJvdyBjbGFzc05hbWU9XCJwcm9kdWN0LWNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgeyBwcm9kdWN0cy5sZW5ndGggPyAoXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHMubWFwKCBwcm9kdWN0ID0+IDxQcm9kdWN0IGtleT17IHByb2R1Y3QuaW1hZ2UubWVkaWFJdGVtSWQgfSBwcm9kdWN0PXsgcHJvZHVjdCB9IC8+IClcclxuICAgICAgICAgICAgICAgICkgOiAnJ31cclxuICAgICAgICAgICAgPC9Sb3c+XHJcbiAgICAgICAgPC9MYXlvdXQ+XHJcbiAgICApXHJcbn07XHJcblxyXG5JbmRleC5nZXRJbml0aWFsUHJvcHMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjbGllbnQucXVlcnkoIHsgcXVlcnk6IFBST0RVQ1RTX1FVRVJZIH0gKTtcclxuICAgIFxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBwcm9kdWN0czogcmVzdWx0LnByb2R1Y3RzLnByb2R1Y3RCeVxyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgSW5kZXg7Il0sInNvdXJjZVJvb3QiOiIifQ==