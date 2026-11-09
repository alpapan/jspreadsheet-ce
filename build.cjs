module.exports = function (source) {
    let result = source.replace(/import\s+jSuites\s+from\s+(?:'|")jsuites(?:'|");?/gm, '');

    return result;
};
