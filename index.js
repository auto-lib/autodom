// import * as walk from 'acorn-walk';
// var walk = require('estree-walker').walk;

//import walk from 'estree-walk';

import { walk } from 'estree-walker';
import auto from '@autolib/auto';

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

console.log('hello');

export function render(obj, root) {
    console.log('render');
    return;
    obj['root'] = root;
    obj['mount'] = _ => _.root.append(_.el);
    auto(obj);
};

export function jsx(tag, props, children) {

    console.log('tags');

    let obj = {};

    obj['el'] = document.createElement(tag);

    props.forEach(name => obj[name] = props[name]);

    console.log('obj', obj);

    return obj;

};