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
  var data = Object(C_Users_coolv_OneDrive_Desktop_Plantisserie_node_modules_babel_runtime_helpers_esm_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_1__["default"])(["query Product( $id: Int ! ){\n        productBy( productId: $id){\n            id\n            averageRating\n            slug\n            description\n            image {\n                uri\n                title\n                srcSet\n                sourceUrl\n                mediaItemId\n            }\n            name\n        }\n    }"]);

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
              product: res.data.image.productBy
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vcGFnZXMvcHJvZHVjdC5qcyJdLCJuYW1lcyI6WyJQcm9kdWN0Iiwid2l0aFJvdXRlciIsInByb3BzIiwiY29uc29sZSIsIndhcm4iLCJnZXRJbml0aWFsUHJvcHMiLCJjb250ZXh0Iiwic2x1ZyIsInF1ZXJ5IiwiaWQiLCJwYXJzZUludCIsInNwbGl0IiwicG9wIiwiUFJPRFVDVFNfUVVFUlkiLCJncWwiLCJjbGllbnQiLCJ2YXJpYWJsZXMiLCJyZXMiLCJwcm9kdWN0IiwiZGF0YSIsImltYWdlIiwicHJvZHVjdEJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsT0FBTyxHQUFHQyw4REFBVSxNQUFHLFlBQUFDLEtBQUssRUFBSztBQUNuQ0MsU0FBTyxDQUFDQyxJQUFSLENBQWNGLEtBQWQ7QUFDQSxzQkFFSTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUZKO0FBSUgsQ0FOeUIsQ0FBMUI7TUFBTUYsTzs7QUFRTkEsT0FBTyxDQUFDSyxlQUFSO0FBQUEsOFNBQTBCLGlCQUFnQkMsT0FBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRVJDLGdCQUZRLEdBRUdELE9BRkgsQ0FFakJFLEtBRmlCLENBRVJELElBRlE7QUFHaEJFLGNBSGdCLEdBR1hGLElBQUksR0FBR0csUUFBUSxDQUFFSCxJQUFJLENBQUNJLEtBQUwsQ0FBWSxHQUFaLEVBQWtCQyxHQUFsQixFQUFGLENBQVgsR0FBeUNOLE9BQU8sQ0FBQ0UsS0FBUixDQUFjQyxFQUhoRDtBQUtoQkksMEJBTGdCLEdBS0NDLDJEQUxEO0FBQUE7QUFBQSxtQkFzQkpDLGdFQUFNLENBQUNQLEtBQVAsQ0FBYztBQUM1QkEsbUJBQUssRUFBRUssY0FEcUI7QUFFNUJHLHVCQUFTLEVBQUU7QUFBRVAsa0JBQUUsRUFBRkE7QUFBRjtBQUZpQixhQUFkLENBdEJJOztBQUFBO0FBc0JoQlEsZUF0QmdCO0FBQUEsNkNBMEJmO0FBQ0hDLHFCQUFPLEVBQUVELEdBQUcsQ0FBQ0UsSUFBSixDQUFTQyxLQUFULENBQWVDO0FBRHJCLGFBMUJlOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEdBQTFCOztBQUFBO0FBQUE7QUFBQTtBQUFBOztBQStCZXJCLHNFQUFmIiwiZmlsZSI6InN0YXRpYy93ZWJwYWNrL3BhZ2VzL3Byb2R1Y3QuMTMxMzNjOGVjNTk0MmY2YjU2YmYuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMaW5rIGZyb20gJ25leHQvbGluayc7XHJcbmltcG9ydCBMYXlvdXQgZnJvbSAnLi4vY29tcG9uZW50cy9MYXlvdXQnO1xyXG5pbXBvcnQgeyB3aXRoUm91dGVyIH0gZnJvbSAnbmV4dC9yb3V0ZXInO1xyXG5pbXBvcnQgY2xpZW50IGZyb20gXCIuLi9jb21wb25lbnRzL0Fwb2xsb0NsaWVudFwiO1xyXG5pbXBvcnQgZ3FsIGZyb20gJ2dyYXBocWwtdGFnJztcclxuXHJcbmNvbnN0IFByb2R1Y3QgPSB3aXRoUm91dGVyICggcHJvcHMgID0+IHtcclxuICAgIGNvbnNvbGUud2FybiggcHJvcHMgKTtcclxuICAgIHJldHVybihcclxuICAgICAgIFxyXG4gICAgICAgIDxkaXY+UHJvZHVjdDwvZGl2PlxyXG4gICAgKVxyXG59KTtcclxuXHJcblByb2R1Y3QuZ2V0SW5pdGlhbFByb3BzID0gYXN5bmMgZnVuY3Rpb24oIGNvbnRleHQgKXtcclxuXHJcbiAgICBsZXR7IHF1ZXJ5OiB7IHNsdWcgfSB9ID0gY29udGV4dDtcclxuICAgIGNvbnN0IGlkID0gc2x1ZyA/IHBhcnNlSW50KCBzbHVnLnNwbGl0KCAnLScgKS5wb3AoKSApIDogY29udGV4dC5xdWVyeS5pZDtcclxuXHJcbiAgICBjb25zdCBQUk9EVUNUU19RVUVSWSA9IGdxbGBxdWVyeSBQcm9kdWN0KCAkaWQ6IEludCAhICl7XHJcbiAgICAgICAgcHJvZHVjdEJ5KCBwcm9kdWN0SWQ6ICRpZCl7XHJcbiAgICAgICAgICAgIGlkXHJcbiAgICAgICAgICAgIGF2ZXJhZ2VSYXRpbmdcclxuICAgICAgICAgICAgc2x1Z1xyXG4gICAgICAgICAgICBkZXNjcmlwdGlvblxyXG4gICAgICAgICAgICBpbWFnZSB7XHJcbiAgICAgICAgICAgICAgICB1cmlcclxuICAgICAgICAgICAgICAgIHRpdGxlXHJcbiAgICAgICAgICAgICAgICBzcmNTZXRcclxuICAgICAgICAgICAgICAgIHNvdXJjZVVybFxyXG4gICAgICAgICAgICAgICAgbWVkaWFJdGVtSWRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuYW1lXHJcbiAgICAgICAgfVxyXG4gICAgfWA7XHJcblxyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgY2xpZW50LnF1ZXJ5KCh7XHJcbiAgICAgICAgcXVlcnk6IFBST0RVQ1RTX1FVRVJZLFxyXG4gICAgICAgIHZhcmlhYmxlczogeyBpZCB9XHJcbiAgICB9KSk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHByb2R1Y3Q6IHJlcy5kYXRhLmltYWdlLnByb2R1Y3RCeVxyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvZHVjdDsiXSwic291cmNlUm9vdCI6IiJ9