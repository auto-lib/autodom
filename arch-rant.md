
# on the way rant

not sure how this should all look but let's
walk it through

## square example

the first thing you see in the react
documentation for beginners is a tutorial
about making a tic tac toe game.

here is the first piece of code of the
completed tut:

```jsx
class Square extends React.Component {
    render() {
      return (
        <button className="square">
          {this.props.value}
        </button>
      );
    }
  }
```

so `autodom` needs to turn this into
something. what should it look like?

primarily this means what do we replace
the jsx code with?

## two approaches

as i see it we can go two ways:

1. make an `autodom` object
2. some kind of configuration

what happens in react is you replace
everything with a function like `_jsx(...)`

```js
class Square extends React.Component {
  render() {
    return /*#__PURE__*/_jsx("button", {
      className: "square",
      children: this.props.value
    });
  }
}
```

> this is literally what babel produces
> (__PURE__ just means pure function...?)

it kind of looks like we could use the
same thing i.e. not parse everything
ourselves, just write our own `_jsx`
but that doesn't work for state:

so this

```jsx
let x = <div>Hello {name}</div>
```

turns into this

```js
let x = /*#__PURE__*/_jsxs("div", {
  children: ["Hello ", name]
});
```

hmmm ... actually that might work.
what is `_jsxs`?

> looks like it's just for when you have
> multiple children
> https://github.com/babel/babel/blob/193728405b6efc46a828e665510a265fc72b344c/packages/babel-plugin-transform-react-jsx/src/create-plugin.ts#L546

## why

what is the point of all this?

the point is that we ... hmmm ...

the point of all of this
is that we want to connect this jsx stuff
to a state object.

so let's say we have something like

```js
let show = <p>hello {name}</p>
```

now we can't really do it like that - 
what is `name`? does it come from
the outside i.e. the program,
or from a state object?

perhaps ... perhaps each object
is assumed to be bound to something ...
i mean ...

ok let's just start with

```js
let show = <p>hello</p>
```

fine. but where does it connect?

normally one goes

```js
ReactDOM.render(<show />, document.getElementById('root'))
```

> why are we following the react syntax?

## state syntax

it's still not clear how to connect a jsx
fragment with a piece of state.

we could use a naming convention:

```jsx
let show = <p>hello {$name}</p>
```

so we say that if a variable is
prepended with a `$` then it
will be part of some state object.

we could go a more `auto` like approach
by passing in `_` as a function:

```jsx
let show = (_) => <p>hello {_.name}</p>
```

this would then be converted into the
normal object format:

```js
let show = (_) => {
    el: document.createElement('p'),
    md: _ => _.el.setText('hello '+_.name)
}
```

