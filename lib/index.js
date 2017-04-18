Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderMoreartyStatic = exports.renderMorearty = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _hypernova = require('hypernova');

var _hypernova2 = _interopRequireDefault(_hypernova);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// https://gist.github.com/jed/982883
function uuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (x) {
    return (x ^ Math.random() * 16 >> x / 4).toString(16);
  });
}

var DATA_KEY = 'hypernova-key';
var DATA_ID = 'hypernova-id';

function serialize(name, html) {
  var key = name.replace(/\W/g, '');
  var id = uuid();
  var markup = '<div data-' + DATA_KEY + '="' + String(key) + '" data-' + DATA_ID + '="' + String(id) + '">' + String(html) + '</div>';
  return '' + markup;
}

var renderMorearty = exports.renderMorearty = function renderMorearty(name, component, configureStore) {
  // allow one js bundle to export multiple instances
  var cName = name;
  if (name.indexOf('?::') !== -1) {
    cName = name.split('?::')[1];
  }

  return (0, _hypernova2['default'])({
    server: function () {
      function server() {
        return function (props) {
          var propsString = JSON.stringify(props);
          var localizedProps = JSON.parse(propsString);
          var wrappedComponent = configureStore.server(localizedProps);
          var contents = _server2['default'].renderToString(_react2['default'].createElement(wrappedComponent));
          return serialize(cName, contents, localizedProps);
        };
      }

      return server;
    }(),
    client: function () {
      function client() {
        var wrappedComponent = configureStore.client();
        return ctx.bootstrap(wrappedComponent);
      }

      return client;
    }()
  });
};

var renderMoreartyStatic = exports.renderMoreartyStatic = function renderMoreartyStatic(name, component) {
  return (0, _hypernova2['default'])({
    server: function () {
      function server() {
        return function (props) {
          return _server2['default'].renderToStaticMarkup(_react2['default'].createElement(component, props));
        };
      }

      return server;
    }(),
    client: function () {
      function client() {}

      return client;
    }()
  });
};