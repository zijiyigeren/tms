<template>
  <!-- 自动代码生成 功能 -->
  <!--背景色-->
  <div style="background: #e3e3e3;padding: 12px;">
    <!--区分-->
    <div style="background: #FFFFFF;padding: 24px 20px 0 20px;">
      <a-form :form="form" layout="inline" style="margin-bottom: 24px;"
              v-bind="{
                 // labelCol: {span: 7},
                 // wrapperCol: {span: 14},
              }">
        <a-form-item label="表名">
          <a-input placeholder="请输入表名" autocomplete="off"
                   v-decorator="[
                     'tableName',
                     {initialValue: ''}
                   ]"
          />
        </a-form-item>
        <a-form-item label="表类型">
          <a-select style="width: 200px;"
                    v-decorator="[
                      'tableType',
                      {initialValue: ''}
                    ]"
          >
            <a-select-option value="">请选择</a-select-option>
            <a-select-option value="1">单表</a-select-option>
            <a-select-option value="2">主表</a-select-option>
            <a-select-option value="3">附表</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-bind="{
             // wrapperCol: {span: 24},
          }">
          <a-button type="primary" icon="search"
                    @click="handleSubmit">查询
          </a-button>
          <a-button type="primary" icon="undo"
                    style="transform: translateX(20%)"
                    @click="handleReset">重置
          </a-button>
        </a-form-item>
      </a-form>
      <div style="margin-bottom: 18px;">
        <a-button type="primary" icon="plus"
                  @click="openModal">新增
        </a-button>
        <a-button @click="codeGenerateModal">代码生成</a-button>

        <!--<a-button type="primary" icon="plus">自定义按钮</a-button>
        <a-button type="primary" icon="plus">JS增强</a-button>
        <a-button type="primary" icon="plus">Java增强</a-button>
        <a-button type="primary" icon="plus">从数据库导入表单</a-button>
        -->
        <a-dropdown v-if="selectedRows.length !== 0">
          <a-button style="margin-left: 8px">批量操作
            <a-icon type="down"/>
          </a-button>
          <a-menu slot="overlay">
            <a-menu-item key="1">
              <a-icon type="delete"/>
              删除
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        已选择&nbsp;<a-button type="link" style="padding: 0;">{{selectedRows.length}}</a-button>&nbsp;项
        <a-button type="link" style="padding: 0;margin-left: 24px;"
                  @click="restSelectedRow"
        >清空
        </a-button>
      </div>
      <a-table
        bordered
        :columns="columns1"
        :dataSource="dataSource"
        :rowSelection="rowSelection"
        :pagination="false"
        :loading="loading1"
      >
        <template slot="indexs" slot-scope="text, record, index">
          {{ index + 1 }}
        </template>
        <template slot="tableType" slot-scope="text, record, index">
          <div v-if="text == 1">单表</div>
          <div v-if="text == 2">主表</div>
          <div v-if="text == 3">附表</div>
        </template>
        <template slot="isDbSynch" slot-scope="text, record, index">
          <div v-if="text == 'Y'" style="color: limegreen;">已同步</div>
          <div v-else style="color: red;">未同步</div>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <a-button type="link" style="padding: 0;"
                    @click="listByHeadId(record)">编辑
          </a-button>
          <a-divider type="vertical"/>
          <a-dropdown>
            <span class="ant-dropdown-link">
              <a-button type="link" style="padding: 0;">更多<a-icon type="down"/></a-button>
            </span>
            <a-menu slot="overlay">

              <template v-if="record.isDbSynch != 'Y'">
                <a-menu-item key="1"
                             @click="showDoDbSynch(record)">同步数据库
                </a-menu-item>
              </template>
              <template v-else>
                <a-menu-item key="11" @click="">功能测试</a-menu-item>
                <a-menu-item key="12" @click="configurationAddress(record)">配置地址</a-menu-item>
              </template>

              <a-menu-item key="2"
                           @click="()=>{
                              $message.success('复制成功')
                           }">复制视图
              </a-menu-item>
              <a-menu-item key="3"
                           @click="removeRecord(record.id)">移除
              </a-menu-item>
              <a-menu-item key="4"
                           @click="headDelete(record.id)">删除
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </a-table>
      <a-pagination
        size="small"
        style="padding:10px 8px;text-align: right"
        :total="50"
        showSizeChanger
        showQuickJumper
        :showTotal="(total, range) => `${range[0]}-${range[1]} 共 ${total} 条`"
        @change="handlePagChange"
      />
    </div>

    <a-modal v-model="visible" @ok="addAll"
             v-bind="{
             'width': '90%',
             'title': title,
             'destroyOnClose': true,
             }">
      <a-form :form="configForm" layout="inline"
              v-bind="{
                labelCol: {span: 6},
                wrapperCol: {span: 18},
              }">
        <a-row style="border-bottom: 1px solid #E8E8E8;padding: 12px 0;">
          <a-col :span="24">
            <a-row>
              <a-col :span="8">
                <a-form-item label="表名" style="width: 100%;">
                  <a-input placeholder="请输入表名"
                           autocomplete="off"
                           v-decorator="[
                              'tableName',
                              {
                                initialValue: rowData.tableName ? rowData.tableName:'',
                                rules: [{ required: true, message: '请填写表名 !' }]
                              }
                           ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="表描述" style="width: 100%;">
                  <a-input placeholder="请输入表描述" autocomplete="off"
                           v-decorator="[
                              'tableTxt',
                              {
                                initialValue: rowData.tableTxt ? rowData.tableTxt : '',
                                rules: [{ required: true, message: '请填写表描述 !' }]
                              }
                           ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="表类型" style="width: 100%;">
                  <a-select style="width: 100%;" placeholder="请选择表类型"
                            @change="handleSelectChange"
                            v-decorator="[
                          'tableType',
                          {initialValue: rowData.tableType ? rowData.tableType+'' : '1'}
                        ]"
                  >
                    <a-select-option value="1">单表</a-select-option>
                    <a-select-option value="2">主表</a-select-option>
                    <a-select-option value="3">附表</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-if="hiddenFlg1">
              <a-col v-bind="{
                        push:17,
                        span:4
                      }">
                <a-form-item style="width: 100%;"
                             :wrapper-col="24">
                  <a-radio-group
                    v-decorator="[
                       'relationType',
                       {initialValue:'0'}
                    ]">
                    <a-radio value="0">一对一</a-radio>
                    <a-radio value="1">一对多</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col v-bind="{
                        push:17,
                        span:3
                     }"
              >
                <a-form-item label="序号" style="width: 100%;">
                  <a-input-number style="width: 100%;"
                                  v-bind="{
                    min:1 ,
                    max:100
                  }"
                                  v-decorator="[
                   'tabOrderNum',
                   {initialValue:'1'}
                 ]"
                  ></a-input-number>
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
        </a-row>

        <a-row style="border-bottom: 1px solid #E8E8E8;padding: 12px 0;">
          <a-col :span="24">
            <a-row>
              <a-col :span="8">
                <a-form-item label="表单分类" style="width: 100%">
                  <a-select placeholder="请选择表单分类"
                            v-decorator="[
                              'formCategory',
                              {initialValue: rowData.formCategory?rowData.formCategory:'bdfl_ptbd',}
                            ]">
                    <a-select-option value="bdfl_include">导入表单</a-select-option>
                    <a-select-option value="bdfl_ptbd">普通表单</a-select-option>
                    <a-select-option value="bdfl_fzbd">复杂表单</a-select-option>
                    <a-select-option value="bdfl_vipbd">VIP表单</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="主键策略" style="width: 100%">
                  <a-select placeholder="请选择主键策略"
                            v-decorator="[
                              'idType',
                              {initialValue: rowData.idType?rowData.idType:'UUID'}
                            ]">
                    <a-select-option value="NATIVE">自增长方式</a-select-option>
                    <a-select-option value="SEQUENCE">SEQUENCE(序列方式)</a-select-option>
                    <a-select-option value="UUID">UUID(36位唯一编码)</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="查询模式" style="width: 100%">
                  <a-select placeholder="请选择查询模式"
                            v-decorator="[
                              'queryMode',
                              {initialValue:rowData.queryMode?rowData.queryMode:'single'}
                            ]">
                    <a-select-option value="group">组合查询</a-select-option>
                    <a-select-option value="single">表单查询</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
        </a-row>

        <a-row style="border-bottom: 1px solid #E8E8E8;padding: 12px 0;">
          <a-col :span="24">
            <a-row>
              <a-col :span="8">
                <a-form-item label="主题模板" style="width: 100%;">
                  <a-select placeholder="请选择表单风格" value="">
                    <a-select-option value="">默认主题</a-select-option>
                    <a-select-option value="1">ERP主题(一对多)</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="表单风格" style="width: 100%;">
                  <a-select placeholder="请选择表单风格"
                            v-decorator="[
                                'formTemplate',
                                {initialValue:rowData.formTemplate?rowData.formTemplate:'1'}
                            ]">
                    <a-select-option value="99">自适应</a-select-option>
                    <a-select-option value="1">一列</a-select-option>
                    <a-select-option value="2">两列</a-select-option>
                    <a-select-option value="3">三列</a-select-option>
                    <a-select-option value="4">四列</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="滚动条" style="width: 100%;">
                  <a-select v-decorator="[
                              'scroll',
                              {initialValue:rowData.scroll?rowData.scroll:'0'}
                            ]">
                    <a-select-option value="0">无</a-select-option>
                    <a-select-option value="1">有</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
        </a-row>

        <a-row style="padding: 12px 0;">
          <a-col :span="24">
            <a-row>
              <a-col :span="8">
                <a-form-item label="显示复选框" style="width: 100%;">
                  <a-select v-decorator="[
                              'isCheckbox',
                              {initialValue: rowData.isCheckbox?rowData.isCheckbox:'N'}
                            ]">
                    <a-select-option value="Y">是</a-select-option>
                    <a-select-option value="N">否</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="是否分页" style="width: 100%;">
                  <a-select v-decorator="[
                              'isPage',
                              {initialValue: rowData.isPage?rowData.isPage:'N'}
                            ]">
                    <a-select-option value="Y">是</a-select-option>
                    <a-select-option value="N">否</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="是否树" style="width: 100%;">
                  <a-select v-decorator="[
                               'isTree',
                                {initialValue: rowData.isTree?rowData.isTree:'N'}
                            ]">
                    <a-select-option value="Y">是</a-select-option>
                    <a-select-option value="N">否</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
        </a-row>

      </a-form>
      <a-tabs defaultActiveKey="1" tabPosition="top">
        <a-tab-pane tab="数据库属性" key="1">
          <PaneDataBase :editData="editData">
            <template slot-scope="dataInSlot">
              {{ getSlotData2(dataInSlot) }}
            </template>
          </PaneDataBase>
        </a-tab-pane>
        <a-tab-pane tab="页面属性" key="2">
          <!--{{dataSource2[2]}}-->
          <a-table :columns="columns2" bordered
                   :dataSource="dataSource2"
                   :pagination="false"
          >
            <template slot="indexs" slot-scope="text, record, index">{{ index+1 }}</template>
            <template
              v-for="col3 in ['dbFieldName', 'dbFieldTxt', 'fieldLength', 'fieldExtendJson', 'fieldValueRuleCode']"
              :slot="col3"
              slot-scope="text, record, index"
            >
              <a-input style="margin: -5px 0"
                       v-if="col3 != 'dbFieldName' && col3 != 'dbFieldTxt'"
                       :disabled="record['dbFieldName'] == 'id' ? true : false"
                       autocomplete="off"
                       v-model="text"
                       @change="e => handleChange(e.target.value, record, col3)"
              />
              <a-input style="margin: -5px 0"
                       v-else
                       v-model="text"
                       disabled="true"
                       autocomplete="off"
                       @change="e => handleChange(e.target.value, record, col3)"
              />
            </template>
            <template slot="fieldShowType" slot-scope="text, record, index">
              <a-select style="width: 100%"
                        :disabled="record['dbFieldName']=='id'?true:false"
                        :defaultValue="text"
                        @change="value => handleSelectedChange(record,'fieldShowType',value)"
              >
                <!-- :defaultValue="text" -->
                <a-select-option value="text">文本框</a-select-option>
                <a-select-option value="password">密码</a-select-option>
                <a-select-option value="radio">单选框</a-select-option>
                <a-select-option value="checkbox">多选框</a-select-option>
                <a-select-option value="date">日期(yyyy-MM-dd)</a-select-option>
                <a-select-option value="datetime">日期(yyyy-MM-dd HH:mm:ss)</a-select-option>
                <a-select-option value="file">文件</a-select-option>
                <a-select-option value="image">图片</a-select-option>
                <a-select-option value="textarea">多行文本</a-select-option>
                <a-select-option value="list">下拉框</a-select-option>
                <a-select-option value="list_multi">下拉多选框</a-select-option>
                <a-select-option value="sel_search">下拉搜索框</a-select-option>
                <a-select-option value="sel_tree">自定义树控件</a-select-option>
                <a-select-option value="cat_tree">分类字典树</a-select-option>
                <a-select-option value="popup">popup弹出框</a-select-option>
                <a-select-option value="umeditor">富文本编辑器</a-select-option>
                <a-select-option value="sel_depart">部门选择器</a-select-option>
                <a-select-option value="sel_user">用户选择器</a-select-option>
              </a-select>
            </template>
            <template slot="queryMode" slot-scope="text, record, index">
              <a-select style="width: 100%"
                        :disabled="record['dbFieldName']=='id'?true:false"
                        :defaultValue="text"
                        @change="value => handleSelectedChange(record,'queryMode',value)"
              >
                <a-select-option value="single">普通查询</a-select-option>
                <a-select-option value="group">范围查询</a-select-option>
              </a-select>
            </template>
            <template
              v-for="col4 in ['isShowForm','isShowList','isQuery']"
              :slot="col4"
              slot-scope="text, record, index"
            >
              <a-checkbox
                :checked="text ? (record['dbFieldName']=='id' ? false : true) : false"
                :disabled="record['dbFieldName']=='id' ? true : false"
                @change="changeChecked(record, col4)"
              />
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane tab="校验字段" key="3">
          <!--{{dataSource2[2]}}-->
          <div style="height: 300px;overflow: auto;">
            <a-table :columns="columns3" bordered
                     style="width: 115%"
                     :dataSource="dataSource2"
                     :pagination="false"
            >
              <template slot="indexs" slot-scope="text, record, index">{{ index+1 }}</template>
              <template
                v-for="col6 in ['dbFieldName', 'dbFieldTxt', 'fieldHref', 'dictTable', 'dictField','dictText']"
                :slot="col6"
                slot-scope="text, record, index"
              >
                <a-input style="margin: -5px 0"
                         v-if="col6 != 'dbFieldName' && col6 != 'dbFieldTxt'"
                         :value="text"
                         :disabled="record['dbFieldName']=='id' ? true : false"
                         autocomplete="off"
                         @change="e => handleChange(e.target.value, record, col6)"
                />
                <a-input style="margin: -5px 0"
                         v-else
                         :value="text"
                         disabled="true"
                         autocomplete="off"
                         @change="e => handleChange(e.target.value, record, col6)"
                />
                <!--              @change="e => handleChange(e.target.value, record.key, col6)"-->
              </template>
              <template slot="fieldValidType" slot-scope="text, record, index">
                <a-select style="width: 100%"
                          :disabled="record['dbFieldName']=='id'?true:false"
                          :defaultValue="text"
                          @change="value => handleSelectedChange(record,'fieldValidType',value)"
                >
                  <a-select-option value="">空</a-select-option>
                  <a-select-option value="only">唯一校验</a-select-option>
                  <a-select-option value="n6-16">6-16位数字</a-select-option>
                  <a-select-option value="*6-16">6-16位任意数字</a-select-option>
                  <a-select-option value="url">网址</a-select-option>
                  <a-select-option value="e">电子邮件</a-select-option>
                  <a-select-option value="m">手机号码</a-select-option>
                  <a-select-option value="p">邮件编码</a-select-option>
                  <a-select-option value="s">字母</a-select-option>
                  <a-select-option value="n">数字</a-select-option>
                  <a-select-option value="z">整数</a-select-option>
                  <a-select-option value="s6-18">6-18位数字</a-select-option>
                  <a-select-option value="money">金额</a-select-option>
                </a-select>
              </template>
              <template slot="fieldMustInput" slot-scope="text, record, index">
                <a-checkbox
                  :checked="text=='0'?false:true"
                  :disabled="record['dbFieldName']=='id'?true:false"
                  @change="changeChecked(record, 'fieldMustInput')"
                />
              </template>
            </a-table>
          </div>
        </a-tab-pane>
        <a-tab-pane tab="外键" key="4">
          <!--{{dataSource2[2]}}-->
          <a-table :columns="columns4" bordered
                   :dataSource="dataSource2"
                   :pagination="false"
          >
            <template slot="indexs" slot-scope="text, record, index">{{ index+1 }}</template>
            <template
              v-for="col7 in ['dbFieldName', 'dbFieldTxt', 'mainTable', 'mainField']"
              :slot="col7"
              slot-scope="text, record, index"
            >
              <a-input style="margin: -5px 0"
                       v-if="col7 != 'dbFieldName' && col7 != 'dbFieldTxt'"
                       autocomplete="off"
                       :value="text"
                       :disabled="record['dbFieldName']=='id'? true : false"
                       @change="e => handleChange(e.target.value, record, col7)"
              />
              <a-input style="margin: -5px 0"
                       v-else
                       :value="text"
                       disabled="true"
                       autocomplete="off"
                       @change="e => handleChange(e.target.value, record, col7)"
              />
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane tab="索引" key="5">
          <PaneIndex :indexData="indexData">
            <template slot-scope="dataInSlot">
              {{ getSlotData(dataInSlot) }}
            </template>
          </PaneIndex>
        </a-tab-pane>
      </a-tabs>
    </a-modal>

    <a-modal v-model="codeGeneration"
             v-bind="{
        'title': codeGenerateTitle,
        'width': '88%',
        'destroyOnClose': true,
      }"
             @ok="handleCodeGeneration"
    >
      <a-form :form="codeGenerationForm"
              v-bind="{
                'labelCol': {span: 5},
                'wrapperCol': {span: 17},
              }"
      >
        <a-form-item label="代码生成目录">
          <!--<input type="text" v-model="kk3">-->
          <a-input-search v-decorator="[
            'projectPath',
            {
              rules: [{ required: true, message: '请选择代码生成目录 !' }],
              // initialValue: '',
              initialValue: 'E:/workspace-ui/jeecg-boot-framework/jeecg-boot-module-system',
            }
          ]">
            <a-button slot="enterButton" icon="folder-open" @click="showConfirm">浏览</a-button>
          </a-input-search>
        </a-form-item>
        <a-form-item label="代码分层样式">
          <a-select style="width: 100%" disabled="true"
                    @change=""
                    v-decorator="[
                      'packageStyle',
                      {initialValue: 'service'}
                    ]">
            <a-select-option value="service">业务分层</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="功能说明">
          <a-input v-decorator="[
            'ftlDescription',
            {initialValue: ''}
          ]" autocomplete="off"/>
        </a-form-item>
        <a-form-item label="表单类型">
          <a-select style="width: 100%"
                    v-decorator="[
                      'jformType',
                      {initialValue: '1'}
                    ]">
            <a-select-option value="1">单表</a-select-option>
            <a-select-option value="2">主表</a-select-option>
            <a-select-option value="3">附表</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="表名">
          <a-input v-decorator="[
            'tableName',
            {
              rules: [{ required: true, message: '请输入表名 !' }],
              initialValue: ''
            }
          ]" autocomplete="off"/>
        </a-form-item>
        <a-form-item label="实体类名(大驼峰式)">
          <a-input v-decorator="[
            'entityName',
            {
              rules: [
                { required: true, message: '请输入实体类名 !' },
                // { validator: compareToFirstPassword }
              ],
              initialValue: ''
            }
          ]" autocomplete="off"/>
        </a-form-item>
        <a-form-item label="包名(小写)">
          <a-input v-decorator="[
            'entityPackage',
            {
              rules: [{ required: true, message: '请输入包名 !' }],
              initialValue: ''
            }
          ]" autocomplete="off"/>
        </a-form-item>
        <a-form-item label="页面风格">
          <a-select style="width: 100%"
                    @change=""
                    v-decorator="[
                      'jspMode',
                      {
                        initialValue: '',
                        rules: [{ required: true, message: '请选择页面风格 !' }],
                      }
                    ]">
            <a-select-option v-for="(item,index) in jspModeList"
                             :key="index"
                             :value="item.code"
            >{{item.note}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="需要生成的代码">
          <a-checkbox-group
            v-decorator="[
              'codeTypes',
              {initialValue: []}
            ]"
          >
            <a-checkbox value="controller">controller</a-checkbox>
            <a-checkbox value="service">service</a-checkbox>
            <a-checkbox value="dao">dao</a-checkbox>
            <a-checkbox value="mapper">mapper.xml</a-checkbox>
            <a-checkbox value="entity">entity</a-checkbox>
            <a-checkbox value="vue">vue</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </a-form>

      <a-card title="子表信息" v-if="subFlg">
        <!--<a-form :form="codeGenerationChildrenForm"
                layout="inline"
                v-bind="{
                  'labelCol': {span: 8},
                  'wrapperCol': {span: 16},
                }">
          <template v-for="(item,index) in subList">
            <a-form-item label="子表名">
              <a-input v-decorator="[
            'tableName',
            {
              //rules: [{ required: true, message: '请输入子表名 !' }],
              initialValue: ''
            }
          ]" autocomplete="off"/>
            </a-form-item>
            <a-form-item label="子表实体">
              <a-input v-decorator="[
            'entityName',
            {
              //rules: [{ required: true, message: '请输入子表实体 !' }],
              initialValue: ''
            }
          ]" autocomplete="off"/>
            </a-form-item>
            <a-form-item label="功能说明">
              <a-input v-decorator="[
            'tableTxt',
            {
              //rules: [{ required: true, message: '请输入功能说明 !' }],
              initialValue: ''
            }
          ]" autocomplete="off"/>
            </a-form-item>
          </template>
        </a-form>-->
        <a-table :columns="subColumns" :dataSource="subList" :pagination="false">
          <template slot="tableName" slot-scope="text, record, index">
            <a-input v-model="text" disabled="true"/>
          </template>
          <template slot="entityName" slot-scope="text, record, index">
            <a-input v-model="text" disabled="true"/>
            <!--
                     @change="e => handleChange(e.target.value, record, 'entityName')"-->
          </template>
          <template slot="ftlDescription" slot-scope="text, record, index">
            <a-input v-model="text" @change="e => handleChange(e.target.value, record, 'ftlDescription')"/>
          </template>
        </a-table>
      </a-card>
    </a-modal>

    <a-modal title="同步数据库" v-model="show1" @ok='handleDoDbSynch'>
      <a-form :form="formShow1">
        <a-form-item>
          <a-radio-group
            v-decorator="['type',{initialValue: 'normal'}]"
          >
            <a-radio value="normal"
                     :style="{
                        display: 'block',
                        height: '30px',
                        lineHeight: '30px',
                     }"
            >普通同步(保留表数据)
            </a-radio>
            <a-radio value="force"
                     :style="{
                        display: 'block',
                        height: '30px',
                        lineHeight: '30px',
                     }"
            >强制同步(删除表,重新生成)
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal :title="configAddressTitle" v-model="show2"
             v-bind="{
                okText: '复制',
                cancelText: '关闭'
             }"
             @ok="()=>{
                $message.success('复制成功')
             }">
      /online/cgformList/c704e93607d6459ebfbd6fd5bfec6901
    </a-modal>

    <a-modal v-model="show3"
             v-bind="{
                keyboard: false,
                maskClosable: false,
                closable: false,
                footer: null,
             }">
      <div style="font-size: 18px;">
        <i class="el-icon-question" style="color: orange;font-size: 24px;"></i>
        提示
      </div>
      <p style="margin-left: 38px;font-size: 14px;margin-top: 8px;">
        逻辑删除只会删除表单配置,物理删除会删除对应的数据库表,请确认删除方式？
      </p>
      <div style="text-align: right;">
        <a-button @click="show3 = false">取消操作</a-button>
        <a-button type="primary" @click="">逻辑删除</a-button>
        <a-button type="primary" @click="">物理删除</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import AFormItem from "ant-design-vue/es/form/FormItem";
  import AInputSearch from "ant-design-vue/es/input/Search";

  /* 页面 _ 数据库属性 */
  import PaneDataBase from './components/paneDataBase'
  import PaneIndex from './components/paneIndex'

  const defaultFields = [
    {
      id: new Date().getTime(),
      dbFieldName: 'id',// 字段名称
      dbFieldTxt: '主键',// 字段描述
      dbLength: '36',//字段长度
      dbPointLength: '0',// 小数点
      dbDefaultVal: '',// 默认值
      dbType: 'string',// 字段类型
      dbIsKey: 1,// 主键

      dbIsNull: 0,// 空值
      isShowForm: 0,// 表单显示
      isShowList: 0,// 列表显示
      fieldShowType: "text",// 控件类型
      fieldLength: '120',// 控件长度
      isQuery: 0,// 查询
      queryMode: "single",// 查询类型
      fieldExtendJson: '',// 扩展参数
      fieldValueRuleCode: '',// 添值规则
      fieldHref: '',// 字段Href
      fieldValidType: '',// 验证规则
      fieldMustInput: 0,// 校验必填
      dictTable: '',// 字典Table
      dictText: '',// 字典Text
      dictField: '',// 字典code
      mainField: '',// 主表字段
      mainTable: '',// 主表名
    },
    {
      id: new Date().getTime(),
      dbFieldName: 'version',// 字段名称
      dbFieldTxt: '版本',// 字段描述
      dbLength: '32',//字段长度
      dbPointLength: '0',// 小数点
      dbDefaultVal: 1,// 默认值
      dbType: 'int',// 字段类型
      dbIsKey: 0,// 主键
      dbIsNull: 1,// 空值

      isShowForm: 0,// 表单显示
      isShowList: 0,// 列表显示
      fieldShowType: "text",// 控件类型
      fieldLength: '120',// 控件长度
      isQuery: 0,// 查询
      queryMode: "single",// 查询类型
      fieldExtendJson: '',// 扩展参数
      fieldValueRuleCode: '',// 添值规则

      fieldHref: '',// 字段Href
      fieldValidType: '',// 验证规则
      fieldMustInput: 0,// 校验必填
      dictTable: '',// 字典Table
      dictText: '',// 字典Text
      dictField: '',// 字典code
      mainField: '',// 主表字段
      mainTable: '',// 主表名
    },
    {
      id: new Date().getTime(),
      dbFieldName: 'create_by',// 字段名称
      dbFieldTxt: '创建人',// 字段描述
      dbLength: '50',//字段长度
      dbPointLength: '0',// 小数点
      dbDefaultVal: '',// 默认值
      dbType: 'string',// 字段类型
      dbIsKey: 0,// 主键
      dbIsNull: 1,// 空值

      isShowForm: 0,// 表单显示
      isShowList: 0,// 列表显示
      fieldShowType: "text",// 控件类型
      fieldLength: '120',// 控件长度
      isQuery: 0,// 查询
      queryMode: "single",// 查询类型
      fieldExtendJson: '',// 扩展参数
      fieldValueRuleCode: '',// 添值规则

      fieldHref: '',// 字段Href
      fieldValidType: '',// 验证规则
      fieldMustInput: 0,// 校验必填
      dictTable: '',// 字典Table
      dictText: '',// 字典Text
      dictField: '',// 字典code
      mainField: '',// 主表字段
      mainTable: '',// 主表名
    },
    {
      id: new Date().getTime(),
      dbFieldName: 'create_time',// 字段名称
      dbFieldTxt: '创建时间',// 字段描述
      dbLength: '20',//字段长度
      dbPointLength: '0',// 小数点
      dbDefaultVal: '',// 默认值
      dbType: 'date',// 字段类型
      dbIsKey: 0,// 主键
      dbIsNull: 1,// 空值

      isShowForm: 0,// 表单显示
      isShowList: 0,// 列表显示
      fieldShowType: "date",// 控件类型
      fieldLength: '120',// 控件长度
      isQuery: 0,// 查询
      queryMode: "single",// 查询类型
      fieldExtendJson: '',// 扩展参数
      fieldValueRuleCode: '',// 添值规则

      fieldHref: '',// 字段Href
      fieldValidType: '',// 验证规则
      fieldMustInput: 0,// 校验必填
      dictTable: '',// 字典Table
      dictText: '',// 字典Text
      dictField: '',// 字典code
      mainField: '',// 主表字段
      mainTable: '',// 主表名
    },
    {
      id: new Date().getTime(),
      dbFieldName: 'update_by',// 字段名称
      dbFieldTxt: '更新人',// 字段描述
      dbLength: '50',//字段长度
      dbPointLength: '0',// 小数点
      dbDefaultVal: '',// 默认值
      dbType: 'string',// 字段类型
      dbIsKey: 0,// 主键
      dbIsNull: 1,// 空值

      isShowForm: 0,// 表单显示
      isShowList: 0,// 列表显示
      fieldShowType: "text",// 控件类型
      fieldLength: '120',// 控件长度
      isQuery: 0,// 查询
      queryMode: "single",// 查询类型
      fieldExtendJson: '',// 扩展参数
      fieldValueRuleCode: '',// 添值规则

      fieldHref: '',// 字段Href
      fieldValidType: '',// 验证规则
      fieldMustInput: 0,// 校验必填
      dictTable: '',// 字典Table
      dictText: '',// 字典Text
      dictField: '',// 字典code
      mainField: '',// 主表字段
      mainTable: '',// 主表名
    },
    {
      id: new Date().getTime(),
      dbFieldName: 'update_time',// 字段名称
      dbFieldTxt: '更新日期',// 字段描述
      dbLength: '20',//字段长度
      dbPointLength: '0',// 小数点
      dbDefaultVal: '',// 默认值
      dbType: 'string',// 字段类型
      dbIsKey: 0,// 主键
      dbIsNull: 1,// 空值

      isShowForm: 0,// 表单显示
      isShowList: 0,// 列表显示
      fieldShowType: "date",// 控件类型
      fieldLength: '120',// 控件长度
      isQuery: 0,// 查询
      queryMode: "single",// 查询类型
      fieldExtendJson: '',// 扩展参数
      fieldValueRuleCode: '',// 添值规则

      fieldHref: '',// 字段Href
      fieldValidType: '',// 验证规则
      fieldMustInput: 0,// 校验必填
      dictTable: '',// 字典Table
      dictText: '',// 字典Text
      dictField: '',// 字典code
      mainField: '',// 主表字段
      mainTable: '',// 主表名
    },
    {
      id: new Date().getTime(),
      dbFieldName: 'sys_org_code',// 字段名称
      dbFieldTxt: '所属部门',// 字段描述
      dbLength: '64',//字段长度
      dbPointLength: '0',// 小数点
      dbDefaultVal: '',// 默认值
      dbType: 'string',// 字段类型
      dbIsKey: 0,// 主键
      dbIsNull: 1,// 空值

      isShowForm: 0,// 表单显示
      isShowList: 0,// 列表显示
      fieldShowType: "text",// 控件类型
      fieldLength: '120',// 控件长度
      isQuery: 0,// 查询
      queryMode: "single",// 查询类型
      fieldExtendJson: '',// 扩展参数
      fieldValueRuleCode: '',// 添值规则

      fieldHref: '',// 字段Href
      fieldValidType: '',// 验证规则
      fieldMustInput: 0,// 校验必填
      dictTable: '',// 字典Table
      dictText: '',// 字典Text
      dictField: '',// 字典code
      mainField: '',// 主表字段
      mainTable: '',// 主表名
    },
  ];

  export default {
    name: "sourcedatamanagement",
    components: {
      AInputSearch,
      AFormItem,
      PaneDataBase,
      PaneIndex,
    },
    data() {
      return {
        paneIndex_DataList: [],// 索引页签下的数据
        form: this.$form.createForm(this),

        // 外层界面的表头参数
        columns1: [
          {
            title: '#',
            align: "center",
            dataIndex: 'indexs',
            scopedSlots: {customRender: 'indexs'},
          },
          {
            title: '表类型',
            align: "center",
            dataIndex: 'tableType',
            scopedSlots: {customRender: 'tableType'},
          }, {
            title: '表名',
            align: "center",
            dataIndex: 'tableName',
            scopedSlots: {customRender: 'tableName'},
          }, {
            title: '表描述',
            align: "center",
            dataIndex: 'tableTxt',
            scopedSlots: {customRender: 'tableTxt'},
          }, {
            title: '版本',
            align: "center",
            dataIndex: 'tableVersion',
            scopedSlots: {customRender: 'tableVersion'},
          }, {
            title: '同步数据库状态',
            align: "center",
            dataIndex: 'isDbSynch',
            scopedSlots: {customRender: 'isDbSynch'},
          }, {
            title: '操作',
            align: "center",
            dataIndex: 'operation',
            scopedSlots: {customRender: 'operation'},
          }
        ],
        dataSource: [],
        loading1: true,

        columns2: [
          {
            title: '#',
            dataIndex: 'indexs',
            width: '3%',
            align: "center",
            scopedSlots: {customRender: 'indexs'},
          },
          {
            title: '字段名称',
            dataIndex: 'dbFieldName',
            width: '10%',
            align: "center",
            scopedSlots: {customRender: 'dbFieldName'},
          },
          {
            title: '字段备注',
            dataIndex: 'dbFieldTxt',
            width: '10%',
            align: "center",
            scopedSlots: {customRender: 'dbFieldTxt'},
          },
          {
            title: '表单显示',
            dataIndex: 'isShowForm',
            width: '3%',
            align: "center",
            scopedSlots: {customRender: 'isShowForm'},
          },
          {
            title: '列表显示',
            dataIndex: 'isShowList',
            width: '3%',
            align: "center",
            scopedSlots: {customRender: 'isShowList'},
          },
          {
            title: '控件类型',
            dataIndex: 'fieldShowType',
            width: '10%',
            align: "center",
            scopedSlots: {customRender: 'fieldShowType'},
          },
          {
            title: '控件长度',
            dataIndex: 'fieldLength',
            width: '10%', align: "center",
            scopedSlots: {customRender: 'fieldLength'},
          },
          {
            title: '是否查询',
            dataIndex: 'isQuery',
            width: '3%', align: "center",
            scopedSlots: {customRender: 'isQuery'},
          },
          {
            title: '查询类型',
            dataIndex: 'queryMode',
            width: '10%', align: "center",
            scopedSlots: {customRender: 'queryMode'},
          },
          {
            title: '扩展参数',
            dataIndex: 'fieldExtendJson',
            width: '10%', align: "center",
            scopedSlots: {customRender: 'fieldExtendJson'},
          },
          {
            title: '填值规则',
            dataIndex: 'fieldValueRuleCode',
            width: '10%', align: "center",
            scopedSlots: {customRender: 'fieldValueRuleCode'},
          },
        ],
        dataSource2: [],

        columns3: [
          {
            title: '#',
            dataIndex: 'indexs',
            width: '2%', align: 'center',
            scopedSlots: {customRender: 'indexs'},
          },
          {
            title: '字段名称',
            dataIndex: 'dbFieldName',
            width: '10%', align: 'center',
            scopedSlots: {customRender: 'dbFieldName'},
          },
          {
            title: '字段备注',
            dataIndex: 'dbFieldTxt',
            width: '10%', align: 'center',
            scopedSlots: {customRender: 'dbFieldTxt'},
          },
          {
            title: '字段Href',
            dataIndex: 'fieldHref',
            width: '10%', align: 'center',
            scopedSlots: {customRender: 'fieldHref'},
          },
          {
            title: '验证规则',
            dataIndex: 'fieldValidType',
            width: '10%',
            align: 'center',
            scopedSlots: {customRender: 'fieldValidType'},
          },
          {
            title: '校验必填',
            dataIndex: 'fieldMustInput',
            width: '3%',
            align: 'center',
            scopedSlots: {customRender: 'fieldMustInput'},
          },
          {
            title: '字典Table',
            dataIndex: 'dictTable',
            width: '10%', align: 'center',
            scopedSlots: {customRender: 'dictTable'},
          },
          {
            title: '字典Code',
            dataIndex: 'dictField',
            width: '10%', align: 'center',
            scopedSlots: {customRender: 'dictField'},
          },
          {
            title: '字典Text',
            dataIndex: 'dictText',
            width: '10%', align: 'center',
            scopedSlots: {customRender: 'dictText'},
          },
        ],

        columns4: [
          {
            title: '#',
            dataIndex: 'indexs',
            width: '2%', align: 'center',
            scopedSlots: {customRender: 'indexs'},
          },
          {
            title: '字段名称',
            dataIndex: 'dbFieldName',
            width: '10%', align: 'center',
            scopedSlots: {customRender: 'dbFieldName'},
          },
          {
            title: '字段备注',
            dataIndex: 'dbFieldTxt',
            width: '10%', align: 'center',
            scopedSlots: {customRender: 'dbFieldTxt'},
          }, {

            title: '主表名',
            dataIndex: 'mainTable',
            width: '10%', align: 'center',
            scopedSlots: {customRender: 'mainTable'},
          }, {

            title: '主表字段',
            dataIndex: 'mainField',
            width: '10%', align: 'center',
            scopedSlots: {customRender: 'mainField'},
          }
        ],
        title: '',
        visible: false,

        configForm: this.$form.createForm(this),
        selectedRowKeys: [],
        selectedRows: [],

        editData: [],
        indexData: [],
        rowData: {},

        selectedRow: {},
        codeGeneration: false,
        codeGenerateTitle: '',
        jspModeList: [],
        codeGenerationForm: this.$form.createForm(this),

        // codeGenerationChildrenForm: this.$form.createForm(this),

        show1: false,
        formShow1: this.$form.createForm(this),
        show1Radio: '1',
        show2: false,

        show3: false,

        // 配置地址对话框的 title文字
        configAddressTitle: '',
        // 控制隐藏的表单元素的开关
        hiddenFlg1: false,

        subFlg: false,
        subColumns: [
          {
            title: '子表名',
            dataIndex: 'tableName',
            scopedSlots: {customRender: 'tableName'},
          },
          {
            title: '子表实体',
            dataIndex: 'entityName',
            scopedSlots: {customRender: 'entityName'},
          },
          {
            title: '功能说明',
            dataIndex: 'ftlDescription',
            scopedSlots: {customRender: 'ftlDescription'},
          },
        ],
        subList: [],
      };
    },
    computed: {
      rowSelection() {
        return {
          // type: 'radio',
          selectedRowKeys: this.selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            this.selectedRowKeys = selectedRowKeys;
            this.selectedRows = selectedRows;
          },
        }
      },
    },
    methods: {
      handlePagChange(page, pageSize) {
        this.handleSubmit(page, pageSize);
      },
      showConfirm() {
        this.$confirm('此功能仍在开发中', '提示', {
          // confirmButtonText: '确定',
          // cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        }).catch(() => {
        });
      },

      // 清空已选数据
      restSelectedRow() {
        this.$nextTick(() => {
          this.selectedRowKeys = [];
          this.selectedRows = [];
        });
      },
      // 列表查询
      handleSubmit(page, pageSize) {
        let params = {
          pageNo: page ? page : 1,
          pageSize: pageSize ? pageSize : 20,
          ...this.form.getFieldsValue()
        }, obj = {};
        for (var key in  params) {
          if (params[key] && params[key] !== '') {
            obj[key] = params[key];
          }
        }
        this.$api.SourceDataManagement.c1(obj).then(res => {
          this.dataSource = res.data.result['records'];
        }).catch(err => {
        }).then(() => {
          this.loading1 = false;
        })
      },
      // 重置
      handleReset() {
        this.form.resetFields();
        this.handleSubmit();
      },
      // 删除
      headDelete(data) {
        this.$confirm('确定删除吗?', '提示', {
          type: 'warning',
          confirmButtonText: '确 定',
          cancelButtonText: '取 消'
        }).then(() => {
          this.$api.SourceDataManagement.c4({
            id: data
          }).then(res => {
            this.handleSubmit();
          }).catch((err) => {
          });
        }).catch(() => {
        });
      },
      // 移除
      removeRecord(data) {
        this.$confirm('确认要移除此记录?', '提示', {
          type: 'warning',
          confirmButtonText: '确 定',
          cancelButtonText: '取 消'
        }).then(() => {
          this.$api.SourceDataManagement.c8({
            id: data
          }).then(res => {
            this.handleSubmit();
          }).catch(() => {
            this.$message.error({
              message: '数据库中不存在改表'
            })
          })
        }).catch(() => {
        })
      },
      // 打开 同步数据 弹框
      showDoDbSynch(data) {
        this.show1 = true;
        this.temp = data.id;
        this.$nextTick(() => {
          this.formShow1.resetFields();
        })
      },
      // 同步数据库 保存
      handleDoDbSynch() {
        let params = this.formShow1.getFieldsValue();
        params = {
          ...params,
          id: this.temp
        };
        this.$api.SourceDataManagement.c11(params).then(res => {
          this.$message.success({
            message: res.data.message
          })
        }).catch(err => {
          this.$message.info({
            message: err.data.message
          })
        }).then(() => {
          this.show1 = false;
          this.temp = '';
          this.handleSubmit();
        })
      },
      // 打开 新增框/编辑框
      openModal() {
        this.title = '新增';
        this.visible = true;
        this.rowData = {};
        this.editData = [...defaultFields];
      },
      // 打开 代码生成
      codeGenerateModal() {
        if (this.selectedRows.length == 1) {
          let data = {...this.selectedRows[0]};
          if (data['tableType'] == 3) {
            this.$confirm('请选择该附表的主表进行代码生成', '提示', {
              type: 'warning',
              confirmButtonText: '确 定',
              cancelButtonText: '取 消',
              // showCancelButton: false,
              // showConfirmButton: false,
            }).then(() => {
            }).catch(() => {
            });
            return
          }

          this.codeGenerateTitle = `代码生成【${data['tableName']}】`;
          this.$api.SourceDataManagement.c9({code: data.id}).then(res => {
            this.codeGeneration = true;
            let data2 = res.data.result;
            this.jspModeList = res.data.result["jspModeList"];

            // 控制子表信息
            if (res.data.result["sub"]) {
              this.subFlg = true;
              this.subList = res.data.result["sub"].map(item => {
                return {
                  'tableName': item.tableName,
                  'entityName': toUpper(item.tableName),
                  'ftlDescription': item.tableTxt
                }
              });
            } else {
              this.subFlg = false;
            }

            this.$nextTick(() => {
              this.codeGenerationForm.setFieldsValue({
                // 'projectPath': data2.projectPath,
                'ftlDescription': data2.main.tableTxt,
                'tableName': data2.main.tableName,
                'entityName': toUpper(data2.main.tableName),
                'jformType': data2.main.tableType + '',
              })
            });

            function toUpper(str) {
              var temp = str.split('_');
              for (var i = 0; i < temp.length; i++) {
                temp[i] = temp[i].slice(0, 1).toUpperCase() + temp[i].slice(1)
              }
              return temp.join("");
            }
          })
        } else {
          this.$message.error({
            message: `请选择一条数据`,
            center: true
          })
        }
      },


      compareToFirstPassword(rule, value, callback) {
        // console.log(rule, value, callback);
      },


      handleChange(value, key, column) {
        key[column] = value;
      },
      handleSelectedChange(row, key, value) {
        row[key] = value;
      },

      // 代码生成
      handleCodeGeneration() {
        this.codeGenerationForm.validateFields((err, values) => {
          if (!err) {
            values['code'] = this.selectedRows[0].id;
            values['codeTypes'] = values['codeTypes'].toString();
            values['subList'] = [...this.subList];
            this.$api.SourceDataManagement.c100(values).then(res => {
              this.codeGeneration = false;
              this.handleSubmit();
            })
          }
        })
      },

      // 新增  编辑
      addAll() {
        let head = {};
        let obj = {};
        let ids = null;
        this.configForm.validateFields((err, values) => {
          if (!err) {
            head = values;
            head['id'] = this.rowData.id;
            obj['head'] = {...head};
            obj['fields'] = [...this.dataSource2];
            // obj['fields'] = [...this.dataSource2].map((item)=>{
            //
            // });
            obj['indexs'] = [...this.paneIndex_DataList];

            obj['deleteFieldIds'] = [];
            obj['deleteIndexIds'] = [];

            if (this.title == '新增') {
              ids = 'null';
            } else if (this.title == '编辑') {
              ids = this.rowData.id;
            }

            this.$api.SourceDataManagement.c5({
              tbname: values.tableName,
              id: ids
            }).then(res => {
              if (res.data.result == 1) {
                if (this.title == '新增') {
                  this.$api.SourceDataManagement.c2(obj).then(res => {
                    this.visible = false;
                    this.handleSubmit();
                  })
                } else if (this.title == '编辑') {
                  this.$api.SourceDataManagement.c3(obj).then(res => {
                    this.visible = false;
                    this.handleSubmit();
                  })
                }
              } else {
                this.$message.warning({
                  message: '数据表已存在,请更换数据表名'
                })
              }
            }).catch(err => {
              this.$message.error({
                message: err.data.message,
              });
              return
            });
          }
        });
      },

      getSlotData2(data) {
        this.dataSource2 = data.paneDataBase;
      },

      getSlotData(data) {
        this.paneIndex_DataList = data.paneIndexData;
      },

      // 编辑操作前的数据回显
      listByHeadId(data) {
        this.rowData = data;
        this.$api.SourceDataManagement.c6({headId: data.id}).then(res => {
          this.title = '编辑';
          this.visible = true;
          this.editData = res.data.result;
        });
        this.$api.SourceDataManagement.c7({headId: data.id}).then(res => {
          this.indexData = res.data.result;
        });
      },

      handleSelectChange(value) {
        // this.form.setFieldsValue({
        //   note: `Hi, ${value === '0' ? 'man' : 'lady'}!`,
        // });
        if (value != 3) {
          this.hiddenFlg1 = false;
          return
        }
        this.hiddenFlg1 = true;
      },

      // handleChange(value, key, column) {
      //   const newData = [...this.data];
      //   const target = newData.filter(item => key === item.key)[0];
      //   if (target) {
      //     target[column] = value;
      //     this.data = newData;
      //   }
      // },

      changeChecked(e, m) {
        // e[m] = !e[m];
        if (e[m] == 0) {
          e[m] = 1
        } else {
          e[m] = 0
        }
      },

      configurationAddress(data) {
        this.configAddressTitle = `菜单链接[${data['tableTxt']}]`;
        this.show2 = true;
      },

      // edit(key) {
      //   const newData = [...this.data];
      //   const target = newData.filter(item => key === item.key)[0];
      //   if (target) {
      //     target.editable = true;
      //     this.data = newData;
      //   }
      // },
      // save(key) {
      //   const newData = [...this.data];
      //   const target = newData.filter(item => key === item.key)[0];
      //   if (target) {
      //     delete target.editable;
      //     this.data = newData;
      //     this.cacheData = newData.map(item => ({...item}));
      //   }
      // },
      // cancel(key) {
      //   const newData = [...this.data];
      //   const target = newData.filter(item => key === item.key)[0];
      //   if (target) {
      //     Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
      //     delete target.editable;
      //     this.data = newData;
      //   }
      // },
      // onSelectChange() {
      // const { selectedRowKeys } = this;
      // return {
      //   onChange: (selectedRowKeys, selectedRows) => {
      //     // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      //   },
      //   getCheckboxProps: record => ({
      //     // props: {
      //     //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
      //     //   name: record.name,
      //     // },
      //   }),
      // };
      // },
    },
    mounted() {
      this.handleSubmit();
    }
  }

</script>

<style lang="less">

</style>
