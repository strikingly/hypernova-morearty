import React from 'react';
import ReactDOMServer from 'react-dom/server';
import hypernova from 'hypernova';

// https://gist.github.com/jed/982883
function uuid() {
  return (
    [1e7] +
    -1e3 +
    -4e3 +
    -8e3 +
    -1e11
  ).replace(
    /[018]/g,
    x => (x ^ Math.random() * 16 >> x / 4).toString(16), // eslint-disable-line no-mixed-operators
  );
}

const DATA_KEY = 'hypernova-key';
const DATA_ID = 'hypernova-id';

function serialize(name, html) {
  const key = name.replace(/\W/g, '');
  const id = uuid();
  const markup = `<div data-${DATA_KEY}="${key}" data-${DATA_ID}="${id}">${html}</div>`;
  return `${markup}`;
}

export const renderMorearty = (name, component, configureStore) => {
  // allow one js bundle to export multiple instances
  let cName = name;
  if (name.indexOf('?::') !== -1) {
    cName = name.split('?::')[1];
  }

  return hypernova({
    server() {
      return (props) => {
        const propsString = JSON.stringify(props);
        const localizedProps = JSON.parse(propsString);
        const ctx = configureStore.server(localizedProps);
        const contents = ReactDOMServer.renderToString(React.createElement(ctx.bootstrap(component)));
        return serialize(cName, contents, localizedProps);
      };
    },

    client() {
      const ctx = configureStore.client();
      return ctx.bootstrap(component);
    },
  });
};

export const renderMoreartyStatic = (name, component) => hypernova({
  server() {
    return props => ReactDOMServer.renderToStaticMarkup(React.createElement(component, props));
  },

  client() {},
});
