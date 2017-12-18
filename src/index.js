import React from 'react';
import ReactDOMServer from 'react-dom/server';
import hypernova from 'hypernova';
import { extractCritical } from 'emotion-server'

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
const DATA_EMOTION_ID = 'hypernova-emotion-id'

function serialize(name, html, emotionIds, css) {
  const key = name.replace(/\W/g, '');
  const id = uuid();
  const markup = css
    ? `<style>${css}</style><div data-${DATA_KEY}="${key}" data-${DATA_ID}="${id}" data-${DATA_EMOTION_ID}="${emotionIds}">${html}</div>`
    : `<div data-${DATA_KEY}="${key}" data-${DATA_ID}="${id}" data-${DATA_EMOTION_ID}="${emotionIds}">${html}</div>`;
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
        const wrappedComponent = configureStore.server(localizedProps);
        const { html, ids, css } = extractCritical(ReactDOMServer.renderToString(React.createElement(wrappedComponent)));
        return serialize(cName, html, ids, css, localizedProps);
      };
    },

    client() {
      return configureStore.client();
    },
  });
};

export const renderMoreartyStatic = (name, component) => hypernova({
  server() {
    return props => ReactDOMServer.renderToStaticMarkup(React.createElement(component, props));
  },

  client() {},
});
