# hypernova-morearty

[Morearty](https://github.com/strikingly/moreartyjs) bindings for [Hypernova](https://github.com/airbnb/hypernova).

Much of the work is based on Airbnb's [hypernova-react](https://github.com/airbnb/hypernova-react) binding.

On the server, wraps the component in a function to render it to a HTML string given its props.

On the client, calling this function with your component scans the DOM for any server-side rendered instances of it. It then resumes those components using the server-specified props.

## Install

```sh
npm install hypernova-morearty
```

## Usage

Here's how to use it in your module:

```js
import { renderMorearty } from 'hypernova-morearty';
import MyComponent from './src/MyComponent.jsx';

export default renderMorearty(
  'MyComponent.hypernova.js', // this file's name (or really any unique name)
  MyComponent,
  {                           // configuration object to initialize the stores
    init: () => {

    },
    hydrate: (props) => {

    }
  }
);
```
