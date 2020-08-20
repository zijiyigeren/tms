/** 初始化全局标签 **/
a{color: {{aFont}};}
a:hover{color: {{aFontHover}};}

/* 后台框架大布局 */
.layui-layout-admin .layui-header{background-color: {{adminHeader}};}

/* 按钮 */
.layui-btn-primary:hover{border-color: {{hover}};color: {{hover}};}
.layui-btn-group .layui-btn-primary:hover{color: {{theme}};}
.layui-btn-primary{border: 1px solid #dcdcdc;color: #646464;}
.layui-btn-normal{background-color: {{theme}};}

.layui-btn-sm{font-size: 14px;line-height: 28px;}

/* 表单 */
.layui-form-select dl dd.layui-this{background-color: {{theme}};}
.layui-form-checked, .layui-form-checked:hover{border-color: {{theme}};}
.layui-form-checked span, .layui-form-checked:hover span{background-color: {{theme}};}
.layui-form-checked i, .layui-form-checked:hover i{color: {{theme}};}
.layui-form-checkbox[lay-skin="primary"] span{background: none;}
.layui-form-checkbox[lay-skin="primary"]:hover i{border-color: {{theme}};}
.layui-form-checked[lay-skin="primary"] i{border-color: {{theme}}; background-color: {{theme}};}
.layui-form-onswitch{border-color: {{theme}}; background-color: {{theme}};}
.layui-form-radioed>i,.layui-form-radio>i:hover{color: {{theme}};}

.layui-input, .layui-select{height: 30px;line-height: 28px;}

/* 分页 */
.layui-laypage a:hover{color: {{hover}};}
.layui-laypage .layui-laypage-curr .layui-laypage-em{background-color: {{hover}};}
.layui-laypage select:focus{border-color: {{hover}} !important;}

/* 表格 */
.layui-table-edit:focus{border-color: {{theme}} !important;}

.layui-table tbody tr:hover, .layui-table thead tr, .layui-table-click, .layui-table-header, .layui-table-hover, .layui-table-mend, .layui-table-patch, .layui-table-tool, .layui-table-total, .layui-table-total tr, .layui-table[lay-even] tr:nth-child(even){background-color: #fafafa;}

/* 文件上传 */
.layui-upload-drag .layui-icon{font-size: 50px; color: {{theme}};}
.layui-upload-drag[lay-over]{border-color: {{theme}};}

/* 树 */
.layui-tree li .layui-tree-check:hover{color: {{theme}};}

/* 导航菜单 */
.layui-nav-tree .layui-nav-itemed:after{background-color: #5FB878;}
.layui-nav-child dd.layui-this{background-color: #5FB878;}
.layui-nav .layui-nav-child dd.layui-this a{background-color: {{adminSideThis}};}
.layui-nav-tree .layui-nav-child dd.layui-this a{background-color: {{adminSideThis}};}
.layui-nav-tree .layui-nav-bar{background-color: transparent;}
.layui-bg-blue .layui-nav-bar,
.layui-bg-blue .layui-this:after,
.layui-bg-blue .layui-nav-itemed:after{background-color: #93D1FF;}
.layui-bg-blue .layui-nav-child dd.layui-this{background-color: #1E9FFF;}
.layui-nav-tree.layui-bg-blue .layui-nav-title a,
.layui-nav-tree.layui-bg-blue .layui-nav-title a:hover, 
.layui-bg-blue .layui-nav-itemed>a{background-color: #007DDB !important;}

/* 面包屑 */
.layui-breadcrumb a:hover{color: {{theme}} !important;}

/* tab */
.layui-tab-brief > .layui-tab-title .layui-this{color: {{theme}};}
.layui-tab-card > .layui-tab-more .layui-this{color: {{theme}};}

/* 时间线 */
.layui-timeline-axis{color: {{theme}};}

/* 滑块 */
.layui-slider-input-btn i:hover{color: {{hover}};}