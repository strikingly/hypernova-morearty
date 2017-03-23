import jsdom from 'jsdom';
import { assert } from 'chai';

import ExampleReactComponent from './components/ExampleReactComponent';
import { renderMorearty } from '..';

describe('renderMorearty', () => {
  let result;
  beforeEach(() => {
    result = renderMorearty('ExampleReactComponent', ExampleReactComponent)({ name: 'Desmond' });
  });

  it('exists', () => {
    assert.isFunction(renderMorearty);
    assert.equal(renderMorearty.length, 2);
  });

  it('has correct markup on server', () => {
    assert.isString(result);
    assert.match(result, /Hello Desmond/);
  });

  it('calls hypernova.client', (done) => {
    jsdom.env(result, (err, window) => {
      if (err) {
        done(err);
        return;
      }

      global.window = window;
      global.document = window.document;

      // Calling it again for the client.
      renderMorearty('ExampleReactComponent', ExampleReactComponent);

      delete global.window;
      delete global.document;

      done();
    });
  });
});
