// import * as walk from 'acorn-walk';
// var walk = require('estree-walker').walk;

//import walk from 'estree-walk';

import { walk } from 'estree-walker';

function has_jsx(ast) {

    // walk(ast, {
    //     enter(node, parent, prop, index) {
    //       // some code happens
    //     },
    //     leave(node, parent, prop, index) {
    //       // some code happens
    //     }
    //   });

    // for (var key in node) {

    //     var child = node[key];
    //     if (child) {
    //         if (child.type) {
    //             if (child.type == 'JSXElement') return true;
    //             if (has_jsx(child)) return true;
    //         }
    //         if (Array.isArray(child)) {
    //             for (var i = 0; i < child.length; i++) {
    //                 if (has_jsx(child[i])) return true;
    //             }
    //         }
    //     }
    // }

    // return false;

    // estree-walk (not estree-walker)
    // let found = false;
    // walk(node, (child, stop) => {

    //     // console.log('child', child);
    //     if (is_jsx(child)) {
    //         stop();
    //         found = true;
    //     }

    // });


    // walk.simple(ast, {
    //     JSXElement: function(node) {
    //         return true
    //     }
    // }, {
    //     ...walk.base,
    //     JSXElement: () => {}
    // })

    return false;
}

function get_jsx(node) {
    return '{}';
}

function get_str(node, original) {
    return original.substring(node.start, node.end);
}

function is_jsx(node) {

    return node.type == 'JSXElement';
}

export function jsx(ast, original) {

    let jnodes = []

    console.time('jsx');

    walk(ast, {
        enter(node, parent, prop, index) {
            // some code happens
            if (node.type == 'JSXElement') {
                console.log('node', node);
                console.log('parent', parent);
                console.log('prop', prop);
                console.log('index', index);
                jnodes.push(node);
            }
        },
        leave(node, parent, prop, index) {
            // some code happens
        }
    });
    // estree-walk
    // for (var queue = [ast]; queue.length;) {
    //     var node = queue.pop()
    //         // handle `node` with a switch statement or whatever
    //         // then continue walking using step function:
    //     switch (node.type) {

    //         case 'JSXElement':
    //             jnodes.push(node)
    //     }
    //     walk.step(node, queue)
    // }

    // walk(ast, {
    //     JSXElement: node => jnodes.push(node)
    // })

    console.timeEnd('jsx');


    // remember https://stackoverflow.com/a/53035335

    let match = jnodes[2];

    let str = original.substring(0, match.start) + '{}' + original.substring(match.end, original.length - 1);
    // walk(ast, (child, stop) => {

    //     console.log('child', child);

    //     if (is_jsx(child)) {
    //         console.log('IS_JSX');
    //         str += get_jsx(child);
    //         stop();
    //     } else if (has_jsx(child)) {
    //         console.log("HAS_JSX");
    //         //str += jsx(child);
    //     } else {
    //         console.log("JUST_STR");
    //         str += get_str(child, original);
    //         stop();
    //     }

    // });

    return str;

    // let str = '';

    // for (var key in node) {

    //     var child = node[key];

    //     console.log('child', child);

    //     if (child) {

    //         if (child.type) {

    //             if (is_jsx(child)) {
    //                 console.log('IS_JSX');
    //                 str += get_jsx(node);
    //             } else if (has_jsx(child)) {
    //                 console.log("HAS_JSX");
    //                 str += jsx(node);
    //             } else {
    //                 console.log("JUST_STR");
    //                 str += get_str(node);
    //             }
    //         }
    //         if (Array.isArray(child)) {
    //             for (var i = 0; i < child.length; i++) {
    //                 jsx(child[i]);
    //             }
    //         }
    //     }
    // }

    // return str;

    // Object.keys(ast).forEach(name => {
    //     console.log(name);
    // })

    // for (var queue = [node]; queue.length && walking;) {
    //     node = queue.shift()

    //     // Skip a missing node
    //     if (!node) continue

    //     console.log(node);
    // }
    // acorn walk

    // var features = Object.create(null);

    // walk.simple(ast, {
    //         JSXElement: function(node) {
    //             console.log(node);
    //         },
    //     }, // https://github.com/acornjs/acorn/issues/829
    //     {
    //         ...walk.base,
    //         JSXElement: () => {}
    //     })

    // return features;
};