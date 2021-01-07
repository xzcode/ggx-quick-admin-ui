export function makeModules(modulesFiles) {
    const keys = modulesFiles.keys();
    const modules = [];
    for (let i = 0; i < keys.length; i++) {
        const modulePath = keys[i];
        const value = modulesFiles(modulePath);
        const module = value.default;
        if (!module.name) {
            const pathArr = module.path.split('/');
            module.name = pathArr[pathArr.length - 1];
        }
        if (!module.meta) {
            module.meta = {};
        }
        if (!module.meta.permission) {
            module.meta.permission = module.name;
        }
        modules.push(module);
    }
    return modules;
}

export function makeStaticRoutes(data = []) {
    const root = [];
    for (let i = 0; i < data.length; i++) {
        const per = data[i];
        if (per.parentPath === '/') {
            root.push(per);
            data.splice(i--, 1);
        }
    }
    root.sort((a, b) => a.menuOrder - b.menuOrder);
    return root;
}
