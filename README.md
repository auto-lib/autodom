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

## parsing ast

a primary function of this library
(i might split this out to a separate lib...)
is to take the ast generated by acorn
(ESTree format https://github.com/estree/estree)
and convert it into a program
that autodom can use.

so for example:

```jsx
let x = <div>hello</div>
```

we pass this as a string into `acorn`
and it gives us this ast. but we
need to produce something like:

```jsx
let x = {
  el_0: document.createElement('div'),
  el_1: document.createText('hello')
}
```

> not sure how this looks right now

but basically we replace any occurance
of JSX and put in these objects ...

> should have a set of tests that do this
> for all these cases

of course, how is the renderer suppose to
know how this should look ... i mean eventually
we pass it to a renderer

```js
autodom.render(x, document.getElementById('app'))
```

i suppose the renderer might expect an object,
expect that it's an auto object.

> in fact, it might simply be `auto(x)` !
> we put in the root element into the
> object as another dependency!

so then all autodom is doing is converting
jsx code into an auto object format ...

and then in the ast we detect `ReactDOM.render(obj,getElement...)`
and replace it with `obj.extend({ root: documen.get...})`
and then `auto(obj)`...

