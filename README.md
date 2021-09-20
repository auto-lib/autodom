# autodom
Generate web ui elements from auto objects automatically

## background

auto objects are just json name/value pairs

```js
var obj = {
  name: 'karl',
  list: [1,2,3],
  func: (_) => _.name + _.list
}
```

the idea behind auto is to encapsulate the entire app inside this object
(which requires some explaining / motivation but i'll do this elsewhere).

my big issue is building a user interface for these apps (well in general
actually) and i thought it would be best if we try to have some kind of
automatic ui generation code that takes an auto object and builds the
interface there-from...

not sure how exactly this will look but a few things have come up so far:

1. auto have either name/value or name/function. name/value are the only modifiable parts (explained elsewhere).
so for this reason it should be the only input controls, where name/function will be the output...
2. we can detect the type of each value/function return value to decide what ui element to make

i think i'll start with just these two - some code that takes an object and then
produces a list of components, each one defined for a particular type. it will
look odd - just a row/column of elements.

## defining components

i've looked into this. i think jsx seems to make the most sense...

for example, let's say we want to build a component for the `name` key
above. since it's a string we define the component as a text box.

```html
<input value='karl'></input>
```

we can style it how we want. we also need to tie changes back to
the auto object. but how do we define this object? perhaps it
would be simplest (at least for now) to use htm which let's you
define html in a string without any transpilers

## htm

hmmm htm seems strange - it let's you define what object will
be created when you define a component using html

from the readme https://github.com/developit/htm

```js
import htm from 'htm';

function h(type, props, ...children) {
  return { type, props, children };
}

const html = htm.bind(h);

console.log( html`<h1 id=hello>Hello world!</h1>` );
// {
//   type: 'h1',
//   props: { id: 'hello' },
//   children: ['Hello world!']
// }
```

quite useful i think. though i will have to update
the dom myself... (and the library everyone seems
to use is snabbdom https://github.com/snabbdom/snabbdom)

## tagged template literals

ok who knew javascript was so cool https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates

turns out you can just use backticks to define a `template literal`

```js
let name = 'karl';
let str = `hello ${name}`;
```

and if you prepend the backtick thingy you can use a function to return
whatever you want...

```js
let name = 'karl';
let func = () => {};
let thin = func`hello ${name}`;
```

pretty amazing, actually...
