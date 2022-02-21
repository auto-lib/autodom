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

function add_obj(obj, ast, base) {

    base = base || '';

    Object.keys(ast).forEach(name => {

        if (name == 'props') {
            Object.keys(ast[name]).forEach(prop => {
                obj[base + prop] = ast.props[prop];
            });
        } else if (name == 'children') {

        } else
            obj[base + name] = ast[name];

    })

}

function add_child(obj, child, base, i) {
    obj = Object.assign(obj, get_obj(child, base + 'child' + i + '_'));
    obj[base + 'mount' + i] = new Function('_', '_.' + base + 'el.append(_.' + base + 'child' + i + '_el)');
    return obj;
}

function get_obj(ast, base) {

    base = base || '';

    let obj = {}

    obj[base + 'tag'] = ast.tag;
    obj[base + 'el'] = new Function('_', 'return document.createElement(_.' + base + 'tag)');

    if (ast.props) Object.keys(ast.props).forEach((name, i) => {

        let n = name == 'className' ? 'class' : name;
        let fn = '_.' + base + 'el.setAttribute("' + n + '","' + ast.props[name] + '")';
        obj[base + 'prop' + i] = new Function('_', fn);
    })

    if (typeof ast.children !== 'undefined') {
        if (Array.isArray(ast.children))
            ast.children.forEach((child, i) => {
                obj = add_child(obj, child, base, i);
            });
        else {
            if (typeof ast.children == 'object')
                obj = add_child(obj, ast.children, base, 0);
            else {
                let fn = '_.' + base + 'el.innerHTML = "' + ("" + ast.children) + '"';
                obj[base + 'text'] = new Function('_', fn);
            }
        }
    }

    return obj;
}

export function render(ast, root) {

    console.log('ast', ast);

    let obj = get_obj(ast);

    obj['root'] = root;
    obj['mount'] = _ => _.root.append(_.el);

    console.log('render obj', obj);

    auto(obj);
};

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function jsx(tag, props) {

    if (typeof tag !== 'string') {
        let obj = new tag();
        obj.props = props;
        let bound = new tag().render.bind(obj);
        let ret = bound();
        return ret;
    }

    let obj = {};


    obj['tag'] = tag;
    obj['props'] = {};

    Object.keys(props).forEach(name => {
        if (name != 'children') obj.props[name] = props[name];
        else
            obj['children'] = props[name];
    });

    return obj;

    // let ref = randomIntFromInterval(0, 1000).toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false });

    obj['tag'] = tag;
    obj['el'] = (_) => document.createElement(_.tag)
    obj['mount'] = () => {};

    Object.keys(props).forEach(name => {
        if (name != 'children') obj[name] = props[name];
        else {
            let children = props[name];
            if (Array.isArray(children)) {
                let i = 0;
                children.forEach(child => {
                    Object.keys(child).forEach(name => {
                        let ref = 'child' + i + '_' + name;
                        if (ref.indexOf('_el') > -1)
                            obj[ref] = new Function("_", "return document.createElement(_." + ref.replace('_el', '_tag') + ")");
                        else if (ref.indexOf('_mount') > -1)
                            obj[ref] = new Function("_", "_." + name.replace('mount', 'el') + ".append(_." + ref.replace('mount', 'el') + ')');
                        //     obj[ref] = new Function("_", fn);
                        //     console.log('ref', ref);
                        //     fn = '_.el.append(_.' + ref + ')';

                        //     //fn = '_.' + ref + '.append(_.' + ref.replace('child' + i + '_', '') + ')';
                        //     console.log('fn', fn);
                        //     obj[ref.replace('_el', '_mount')] = new Function('_', fn);
                        // } else
                        else obj[ref] = child[name];
                    })

                    i += 1;
                })
            }
        }
    });
    // console.log('obj', obj);

    return obj;

};

export function jsxs(tag, props) { return jsx(tag, props); }