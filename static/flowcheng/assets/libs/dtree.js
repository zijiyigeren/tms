layer.extend({
    dtree: '{/}layui_ext/dtree' // {/}的意思即代表采用自有路径，即不跟随 base 路径
}).use(['dtree', 'layer', 'jquery'], function() {
    var dtree = layui.dtree,
        layer = layui.layer,
        $ = layui.jquery;

    var DemoTree = dtree.render({
        elem: "#demoTree",
        data: demoTree,
        type: "all",
        initLevel: "1"
    });

    dtree.on("node('demoTree')", function(obj) {
        layer.msg(JSON.stringify(obj.param));
    });
});