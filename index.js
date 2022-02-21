import auto from '@autolib/auto';

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
};

export function jsxs(tag, props) { return jsx(tag, props); }