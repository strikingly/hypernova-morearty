import { assert } from 'chai';

import ExampleReactComponent from './components/ExampleReactComponent';
import { renderMoreartyStatic } from '..';

describe('renderMoreartyStatic', () => {
  let result;
  beforeEach(() => {
    result = renderMoreartyStatic('ExampleReactComponent', ExampleReactComponent)({ name: 'Zack' });
  });

  it('exists', () => {
    assert.isFunction(renderMoreartyStatic);
    assert.equal(renderMoreartyStatic.length, 2);
  });

  it('has correct markup on server', () => {
    assert.isString(result);
    assert.match(result, /Hello Zack/);
  });
});
