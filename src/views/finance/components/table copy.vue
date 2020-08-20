<template>
 <section>
     <div class="costlayout">
            <ul>
              <li>检验依据</li>
              <li>项目代码</li>
              <li><input type="checkbox" name="box"  checked=true/>试验项目</li>
              <li>费用名称</li>
              <li>公告试验次数</li>
              <li>CCC试验次数</li>
              <li>费用</li>
              <li>次数</li>
              <li>收费小计</li>
            </ul>
        </div>
        <div class="costlayout" >
          <ul ref="costlayout"></ul>
        </div>
 </section>
</template>

<script>
  import base from '@/api/base.js'

  export default {
    name: 'tabel',
    data () {
      return {
         // ceshi
        dynamicTableData:  {
            "account" : 9980000,
            "attAccount" : 0,
            "caccount" : 9980000,
            "caccount2" : "��99,800.00",
            "cattAccount" : 0,
            "cattaccountf" : "��0.00",
            "citemAccount" : 9980000,
            "citemAccount2" : "��99,800.00",
            "ckd_dx" : "nu.ll",
            "cobjAccount" : 0,
            "cobjaccountf" : "��0.00",
            "companyCheck" : "",
            "currentPage" : 0,
            "discount" : 0,
            "flag" : 0,
            "ftdalist" : [],
            "ftdalist3" : [],
            "inAccount" : 0,
            "itemAccount" : 9980000,
            "itemlist" : [],
            "laccountchina" : "�����Ǫ�ư���ʰ��Բ",
            "laccountchina2" : "�����Ǫ�ư���ʰ��Բ",
            "list" : [
                {
                  "account" : 3980000,
                  "attAccount" : 0,
                  "caccount" : 3980000,
                  "caccount2" : "��39,800.00",
                  "cattAccount" : 0,
                  "cattaccountf" : "��0.00",
                  "citemAccount" : 3980000,
                  "citemAccount2" : "��39,800.00",
                  "ckd_dx" : "0.0",
                  "cobjAccount" : 0,
                  "cobjaccountf" : "��0.00",
                  "companyCheck" : "����ɭԴ�ع����޹�˾",
                  "currentPage" : 0,
                  "discount" : 100,
                  "flag" : 30,
                  "ftdalist" : [],
                  "ftdalist3" : [],
                  "ftdalist6" : [],
                  "inAccount" : 0,
                  "itemAccount" : 3980000,
                  "itemlist" : [],
                  "laccountchina" : "1级",
                  "laccountchina2" : "�����Ǫ�ư���ʰ��Բ",
                  "list" : [
                      {
                        "account" : 3980000,
                        "attAccount" : 0,
                        "caccount" : 3980000,
                        "cattAccount" : 0,
                        "checkflag" : 0,
                        "citemAccount" : 3980000,
                        "cobjAccount" : 0,
                        "companyCheck" : "",
                        "contentsize" : 1,
                        "currentPage" : 0,
                        "deptname" : "2级1",
                        "flag" : 20,
                        "id" : "8B9B8B4EFE744E9DB356CB0FE5296B56",
                        "ids" : "8B9B8B4EFE744E9DB356CB0FE5296B56",
                        "inAccount" : 0,
                        "itemAccount" : 3980000,
                        "list" : [
                            {
                              "account" : 1500000,
                              "accountdate" : 0,
                              "caccount" : 1500000,
                              "chargeList" : [],
                              "chargeid" : "4437119FB3B147959F24BC8FD11F61AD",
                              "citemAccount" : 1500000,
                              "cobjAccount" : 0,
                              "confirmDate" : "2020-05-28 14:54:03",
                              "confirmName" : "xtqx三级1",
                              "currentPage" : 0,
                              "dector" : "",
                              "dectorConfirmStatus" : "",
                              "discount" : 100,
                              "ftdalist" : [],
                              "id" : "2E769FDF214B4389BF572491061D6213",
                              "ids" : "2E769FDF214B4389BF572491061D6213",
                              "ilist" : [
                                  {
                                    "account" : 111500000,
                                    "attarchid" : "",
                                    "caccount" : 1500000,
                                    "charges" : 1500000,
                                    "currentPage" : 0,
                                    "cyaccount" : "15000.00",
                                    "formual" : "",
                                    "id" : "BEA09342B9A94EF6918F3E3F15129336",
                                    "inaccount" : 0,
                                    "itype" : 0,
                                    "list" : [],
                                    "name" : "PM",
                                    "orgabc" : "",
                                    "page" : false,
                                    "pageHtml" : "",
                                    "pageSize" : 15,
                                    "saccount" : "15000.00",
                                    "sformual" : "",
                                    "sinaccount" : "0.0",
                                    "taskflag" : 0,
                                    "times" : 1,
                                    "total" : 0,
                                    "version" : 0,
                                    "yaccount" : "15000.00",
                                    "ycharges" : "15000.00"
                                  },
                                  {
                                    "account" : 464,
                                    "attarchid" : "",
                                    "caccount" : 0,
                                    "charges" : 0,
                                    "currentPage" : 0,
                                    "cyaccount" : "0.0",
                                    "formual" : "",
                                    "id" : "9D9493AC6BF9436D813BFA384FFAE385",
                                    "inaccount" : 0,
                                    "itype" : 5,
                                    "list" : [],
                                    "name" : "����",
                                    "orgabc" : "",
                                    "page" : false,
                                    "pageHtml" : "",
                                    "pageSize" : 15,
                                    "saccount" : "0.0",
                                    "sformual" : "",
                                    "sinaccount" : "0.0",
                                    "taskflag" : 0,
                                    "times" : 0,
                                    "total" : 0,
                                    "version" : 0,
                                    "yaccount" : "0.0",
                                    "ycharges" : "0.0"
                                  },
                                  {
                                    "account" : 0,
                                    "attarchid" : "",
                                    "caccount" : 0,
                                    "charges" : 0,
                                    "currentPage" : 0,
                                    "cyaccount" : "0.0",
                                    "formual" : "",
                                    "id" : "62A2F300F7244F44A9933794F572EEB6",
                                    "inaccount" : 0,
                                    "itype" : 5,
                                    "list" : [],
                                    "name" : "����",
                                    "orgabc" : "",
                                    "page" : false,
                                    "pageHtml" : "",
                                    "pageSize" : 15,
                                    "saccount" : "0.0",
                                    "sformual" : "",
                                    "sinaccount" : "0.0",
                                    "taskflag" : 0,
                                    "times" : 0,
                                    "total" : 0,
                                    "version" : 0,
                                    "yaccount" : "0.0",
                                    "ycharges" : "0.0"
                                  }
                              ],
                              "inaccount" : 0,
                              "indexid" : 2220,
                              "itemAccount" : 1500000,
                              "itemcode" : "01",
                              "itemname" : "���������ŷ���Ⱦ��(����ֱ�����)",
                              "itemsBasis" : "GB18352.5-2013",
                              "itimes" : 0,
                              "itype" : 0,
                              "list" : [],
                              "normalCharge" : 1500000,
                              "note" : "",
                              "objAccount" : 0,
                              "oilCharge" : 0,
                              "orgabc" : "P",
                              "page" : false,
                              "pageHtml" : "",
                              "pageSize" : 15,
                              "placeCharge" : 0,
                              "saccount" : "15000.00",
                              "sinaccount" : "0.0",
                              "sitemAccount" : "15000.00",
                              "sobjAccount" : "0.0",
                              "taskIndexOrderId" : "",
                              "taskflag" : 2,
                              "taskid" : "2278D4B3E4D148B2B816CD5454082FD4",
                              "tcItemsCode" : "",
                              "total" : 0,
                              "version" : 1
                            },
                            {
                              "account" : 1000000,
                              "accountdate" : 0,
                              "caccount" : 1000000,
                              "chargeList" : [],
                              "chargeid" : "823AF9B67B5E4EE0AFF5BC5F7206A051",
                              "citemAccount" : 1000000,
                              "cobjAccount" : 0,
                              "confirmDate" : "2020-05-28 14:54:03",
                              "confirmName" : "xtqx三级2",
                              "currentPage" : 0,
                              "dector" : "",
                              "dectorConfirmStatus" : "",
                              "discount" : 100,
                              "ftdalist" : [],
                              "id" : "57691D381E7E40F689E976B55F4AF065",
                              "ids" : "57691D381E7E40F689E976B55F4AF065",
                              "ilist" : [
                                  {
                                    "account" : 888888,
                                    "attarchid" : "",
                                    "caccount" : 1000000,
                                    "charges" : 1000000,
                                    "currentPage" : 0,
                                    "cyaccount" : "10000.00",
                                    "formual" : "",
                                    "id" : "06254D0332CB4641B74ABAA5E6D08CE2",
                                    "inaccount" : 0,
                                    "itype" : 0,
                                    "list" : [],
                                    "name" : "���������ŷ���Ⱦ��",
                                    "orgabc" : "",
                                    "page" : false,
                                    "pageHtml" : "",
                                    "pageSize" : 15,
                                    "saccount" : "10000.00",
                                    "sformual" : "",
                                    "sinaccount" : "0.0",
                                    "taskflag" : 0,
                                    "times" : 1,
                                    "total" : 0,
                                    "version" : 0,
                                    "yaccount" : "10000.00",
                                    "ycharges" : "10000.00"
                                  },
                                  {
                                    "account" : 0,
                                    "attarchid" : "",
                                    "caccount" : 0,
                                    "charges" : 0,
                                    "currentPage" : 0,
                                    "cyaccount" : "0.0",
                                    "formual" : "",
                                    "id" : "F10A6C0CE4084D11AC549EC5506D37A5",
                                    "inaccount" : 0,
                                    "itype" : 5,
                                    "list" : [],
                                    "name" : "����",
                                    "orgabc" : "",
                                    "page" : false,
                                    "pageHtml" : "",
                                    "pageSize" : 15,
                                    "saccount" : "0.0",
                                    "sformual" : "",
                                    "sinaccount" : "0.0",
                                    "taskflag" : 0,
                                    "times" : 0,
                                    "total" : 0,
                                    "version" : 0,
                                    "yaccount" : "0.0",
                                    "ycharges" : "0.0"
                                  },
                                  {
                                    "account" : 0,
                                    "attarchid" : "",
                                    "caccount" : 0,
                                    "charges" : 0,
                                    "currentPage" : 0,
                                    "cyaccount" : "0.0",
                                    "formual" : "",
                                    "id" : "E15671D7D51E47E7806A76001F80ADCD",
                                    "inaccount" : 0,
                                    "itype" : 5,
                                    "list" : [],
                                    "name" : "����",
                                    "orgabc" : "",
                                    "page" : false,
                                    "pageHtml" : "",
                                    "pageSize" : 15,
                                    "saccount" : "0.0",
                                    "sformual" : "",
                                    "sinaccount" : "0.0",
                                    "taskflag" : 0,
                                    "times" : 0,
                                    "total" : 0,
                                    "version" : 0,
                                    "yaccount" : "0.0",
                                    "ycharges" : "0.0"
                                  }
                              ],
                              "inaccount" : 0,
                              "indexid" : 2710,
                              "itemAccount" : 1000000,
                              "itemcode" : "01",
                              "itemname" : "���������ŷ���Ⱦ��(���ͷ�ֱ�����)",
                              "itemsBasis" : "GB18352.5-2013",
                              "itimes" : 0,
                              "itype" : 0,
                              "list" : [],
                              "normalCharge" : 1000000,
                              "note" : "",
                              "objAccount" : 0,
                              "oilCharge" : 0,
                              "orgabc" : "P",
                              "page" : false,
                              "pageHtml" : "",
                              "pageSize" : 15,
                              "placeCharge" : 0,
                              "saccount" : "10000.00",
                              "sinaccount" : "0.0",
                              "sitemAccount" : "10000.00",
                              "sobjAccount" : "0.0",
                              "taskIndexOrderId" : "",
                              "taskflag" : 2,
                              "taskid" : "2278D4B3E4D148B2B816CD5454082FD4",
                              "tcItemsCode" : "",
                              "total" : 0,
                              "version" : 1
                            },
                            {
                              "account" : 148220000,
                              "accountdate" : 0,
                              "caccount" : 1480000,
                              "chargeList" : [],
                              "chargeid" : "6A1BECAC61F5473B85D580A9701BD86E",
                              "citemAccount" : 1480000,
                              "cobjAccount" : 0,
                              "confirmDate" : "2020-05-28 14:54:03",
                              "confirmName" : "xtqx三级3",
                              "currentPage" : 0,
                              "dector" : "",
                              "dectorConfirmStatus" : "",
                              "discount" : 100,
                              "ftdalist" : [],
                              "id" : "EA0AB906C06147779EC6EB908D7CF017",
                              "ids" : "EA0AB906C06147779EC6EB908D7CF017",
                              "ilist" : [
                                  {
                                    "account" : 1400000,
                                    "attarchid" : "",
                                    "caccount" : 1480000,
                                    "charges" : 1480000,
                                    "currentPage" : 0,
                                    "cyaccount" : "14800.00",
                                    "formual" : "",
                                    "id" : "162D0125333D428AB8685A2D778EBE7C",
                                    "inaccount" : 0,
                                    "itype" : 1,
                                    "list" : [],
                                    "name" : "��������������Ⱦ��(��϶�������)�����",
                                    "orgabc" : "",
                                    "page" : false,
                                    "pageHtml" : "",
                                    "pageSize" : 15,
                                    "saccount" : "14800.00",
                                    "sformual" : "",
                                    "sinaccount" : "0.0",
                                    "taskflag" : 0,
                                    "times" : 100,
                                    "total" : 0,
                                    "version" : 0,
                                    "yaccount" : "14800.00",
                                    "ycharges" : "14800.00"
                                  },
                                  {
                                    "account" : 789,
                                    "attarchid" : "",
                                    "caccount" : 0,
                                    "charges" : 0,
                                    "currentPage" : 0,
                                    "cyaccount" : "0.0",
                                    "formual" : "",
                                    "id" : "6D85B94CC62B48EDA56A6816D8BACC2B",
                                    "inaccount" : 0,
                                    "itype" : 5,
                                    "list" : [],
                                    "name" : "����",
                                    "orgabc" : "",
                                    "page" : false,
                                    "pageHtml" : "",
                                    "pageSize" : 15,
                                    "saccount" : "0.0",
                                    "sformual" : "",
                                    "sinaccount" : "0.0",
                                    "taskflag" : 0,
                                    "times" : 0,
                                    "total" : 0,
                                    "version" : 0,
                                    "yaccount" : "0.0",
                                    "ycharges" : "0.0"
                                  },
                                  {
                                    "account" : 0,
                                    "attarchid" : "",
                                    "caccount" : 0,
                                    "charges" : 0,
                                    "currentPage" : 0,
                                    "cyaccount" : "0.0",
                                    "formual" : "",
                                    "id" : "81D12508CA18452B9835017B16B8DCE5",
                                    "inaccount" : 0,
                                    "itype" : 5,
                                    "list" : [],
                                    "name" : "����",
                                    "orgabc" : "",
                                    "page" : false,
                                    "pageHtml" : "",
                                    "pageSize" : 15,
                                    "saccount" : "0.0",
                                    "sformual" : "",
                                    "sinaccount" : "0.0",
                                    "taskflag" : 0,
                                    "times" : 5,
                                    "total" : 0,
                                    "version" : 0,
                                    "yaccount" : "0.0",
                                    "ycharges" : "0.0"
                                  }
                              ],
                              "inaccount" : 0,
                              "indexid" : 2223,
                              "itemAccount" : 1480000,
                              "itemcode" : "01",
                              "itemname" : "��������������Ⱦ��(��϶�������)",
                              "itemsBasis" : "GB 18352.3-2005,GB/T 19755-2005",
                              "itimes" : 0,
                              "itype" : 0,
                              "list" : [],
                              "normalCharge" : 1480000,
                              "note" : "",
                              "objAccount" : 0,
                              "oilCharge" : 0,
                              "orgabc" : "P",
                              "page" : false,
                              "pageHtml" : "",
                              "pageSize" : 15,
                              "placeCharge" : 0,
                              "saccount" : "14800.00",
                              "sinaccount" : "0.0",
                              "sitemAccount" : "14800.00",
                              "sobjAccount" : "0.0",
                              "taskIndexOrderId" : "",
                              "taskflag" : 2,
                              "taskid" : "2278D4B3E4D148B2B816CD5454082FD4",
                              "tcItemsCode" : "",
                              "total" : 0,
                              "version" : 5
                            }
                        ],
                        "objAccount" : 0,
                        "orgabc" : "P",
                        "page" : false,
                        "pageHtml" : "",
                        "pageSize" : 15,
                        "partitiondate" : 2020,
                        "rowspan" : 9,
                        "saccount" : "39800.00",
                        "sampleName" : "",
                        "sampleType" : "",
                        "sattAccount" : "0.0",
                        "saveflag" : 0,
                        "scaccount" : "39800.00",
                        "sinAccount" : "0.0",
                        "sitemAccount" : "39800.00",
                        "sobjAccount" : "0.0",
                        "taskCode" : "",
                        "taskid" : "2278D4B3E4D148B2B816CD5454082FD4",
                        "total" : 0,
                        "version" : 1,
                        "wordFinishDate" : "",
                        "wordFinishDates" : 0
                      },
                    
                      
                  ],
                  "normalCharge" : 0,
                  "objAccount" : 0,
                  "oilCharge" : 0,
                  "page" : false,
                  "pageHtml" : "",
                  "pageSize" : 15,
                  "partitiondate" : 2020,
                  "placeCharge" : 0,
                  "rowspan" : 9,
                  "saccount" : "39800.00",
                  "saccount2" : "��39,800.00",
                  "sampleName" : "��ϴ��",
                  "sampleType" : "SMQ5250GQXDFE5",
                  "sattAccount" : "0.0",
                  "sattAccount2" : "��0.00",
                  "sinAccount" : "0.0",
                  "sinAccount2" : "��0.00",
                  "sitemAccount" : "39800.00",
                  "sitemAccount2" : "��39,800.00",
                  "sobjAccount" : "0.0",
                  "sobjAccount2" : "��0.00",
                  "taskcode" : "QA12AX21",
                  "taskid" : "2278D4B3E4D148B2B816CD5454082FD4",
                  "total" : 0,
                  "version" : 0,
                  "xlsList" : [],
                  "zkflag" : 0
                },
                {
                  "account" : 6000000,
                  "attAccount" : 0,
                  "caccount" : 6000000,
                  "caccount2" : "��60,000.00",
                  "cattAccount" : 0,
                  "cattaccountf" : "��0.00",
                  "citemAccount" : 6000000,
                  "citemAccount2" : "��60,000.00",
                  "ckd_dx" : "0.0",
                  "cobjAccount" : 0,
                  "cobjaccountf" : "��0.00",
                  "companyCheck" : "55",
                  "currentPage" : 0,
                  "discount" : 100,
                  "flag" : 30,
                  "ftdalist" : [],
                  "ftdalist3" : [],
                  "ftdalist6" : [],
                  "inAccount" : 0,
                  "itemAccount" : 6000000,
                  "itemlist" : [],
                  "laccountchina" : "1级2",
                  "laccountchina2" : "½����Ǫ�����ʰ��Բ",
                  "list" : [
                      {
                        "account" : 6000000,
                        "attAccount" : 0,
                        "caccount" : 6000000,
                        "cattAccount" : 0,
                        "checkflag" : 0,
                        "citemAccount" : 6000000,
                        "cobjAccount" : 0,
                        "companyCheck" : "",
                        "contentsize" : 1,
                        "currentPage" : 0,
                        "deptname" : "2级2",
                        "flag" : 20,
                        "id" : "5A4EFDCCF26D40C390446A6334A8BB7D",
                        "ids" : "5A4EFDCCF26D40C390446A6334A8BB7D",
                        "inAccount" : 0,
                        "itemAccount" : 6000000,
                        "list" : [
                            {
                              "account" : 6000000,
                              "accountdate" : 0,
                              "caccount" : 6000000,
                              "chargeList" : [],
                              "chargeid" : "F2418F312A1540ECA1DCFE15F4DEBFD1",
                              "citemAccount" : 6000000,
                              "cobjAccount" : 0,
                              "confirmDate" : "2020-05-28 16:29:10",
                              "confirmName" : "xtqx",
                              "currentPage" : 0,
                              "dector" : "",
                              "dectorConfirmStatus" : "",
                              "discount" : 100,
                              "ftdalist" : [],
                              "id" : "6DE6B1C25AE2457AA6B56054882734A6",
                              "ids" : "6DE6B1C25AE2457AA6B56054882734A6",
                              "ilist" : [
                                  {
                                    "account" : 6000000,
                                    "attarchid" : "",
                                    "caccount" : 6000000,
                                    "charges" : 6000000,
                                    "currentPage" : 0,
                                    "cyaccount" : "60000.00",
                                    "formual" : "",
                                    "id" : "95885B19F9444F39ADD94083376EB323",
                                    "inaccount" : 0,
                                    "itype" : 0,
                                    "list" : [],
                                    "name" : "�������Ρ����ι̶�װ��ǿ��",
                                    "orgabc" : "",
                                    "page" : false,
                                    "pageHtml" : "",
                                    "pageSize" : 15,
                                    "saccount" : "60000.00",
                                    "sformual" : "",
                                    "sinaccount" : "0.0",
                                    "taskflag" : 0,
                                    "times" : 1,
                                    "total" : 0,
                                    "version" : 0,
                                    "yaccount" : "60000.00",
                                    "ycharges" : "60000.00"
                                  },
                                  {
                                    "account" : 0,
                                    "attarchid" : "",
                                    "caccount" : 0,
                                    "charges" : 0,
                                    "currentPage" : 0,
                                    "cyaccount" : "0.0",
                                    "formual" : "",
                                    "id" : "19F47171ED0641FBA45F28413B2EB065",
                                    "inaccount" : 0,
                                    "itype" : 5,
                                    "list" : [],
                                    "name" : "����",
                                    "orgabc" : "",
                                    "page" : false,
                                    "pageHtml" : "",
                                    "pageSize" : 15,
                                    "saccount" : "0.0",
                                    "sformual" : "",
                                    "sinaccount" : "0.0",
                                    "taskflag" : 0,
                                    "times" : 0,
                                    "total" : 0,
                                    "version" : 0,
                                    "yaccount" : "0.0",
                                    "ycharges" : "0.0"
                                  },
                                  {
                                    "account" : 0,
                                    "attarchid" : "",
                                    "caccount" : 0,
                                    "charges" : 0,
                                    "currentPage" : 0,
                                    "cyaccount" : "0.0",
                                    "formual" : "",
                                    "id" : "4E21FBDA5416429F8BA7F99601443710",
                                    "inaccount" : 0,
                                    "itype" : 5,
                                    "list" : [],
                                    "name" : "����",
                                    "orgabc" : "",
                                    "page" : false,
                                    "pageHtml" : "",
                                    "pageSize" : 15,
                                    "saccount" : "0.0",
                                    "sformual" : "",
                                    "sinaccount" : "0.0",
                                    "taskflag" : 0,
                                    "times" : 0,
                                    "total" : 0,
                                    "version" : 0,
                                    "yaccount" : "0.0",
                                    "ycharges" : "0.0"
                                  },
                                  {
                                    "account" : 0,
                                    "attarchid" : "",
                                    "caccount" : 0,
                                    "charges" : 0,
                                    "currentPage" : 0,
                                    "cyaccount" : "0.0",
                                    "formual" : "",
                                    "id" : "A04C9A90EC914DA9A23DAC325B819CE9",
                                    "inaccount" : 0,
                                    "itype" : 5,
                                    "list" : [],
                                    "name" : "����",
                                    "orgabc" : "",
                                    "page" : false,
                                    "pageHtml" : "",
                                    "pageSize" : 15,
                                    "saccount" : "0.0",
                                    "sformual" : "",
                                    "sinaccount" : "0.0",
                                    "taskflag" : 0,
                                    "times" : 0,
                                    "total" : 0,
                                    "version" : 0,
                                    "yaccount" : "0.0",
                                    "ycharges" : "0.0"
                                  },
                                  {
                                    "account" : 0,
                                    "attarchid" : "",
                                    "caccount" : 0,
                                    "charges" : 0,
                                    "currentPage" : 0,
                                    "cyaccount" : "0.0",
                                    "formual" : "",
                                    "id" : "5D20D6BFB84B42CFB42C690E396F2F2D",
                                    "inaccount" : 0,
                                    "itype" : 5,
                                    "list" : [],
                                    "name" : "����",
                                    "orgabc" : "",
                                    "page" : false,
                                    "pageHtml" : "",
                                    "pageSize" : 15,
                                    "saccount" : "0.0",
                                    "sformual" : "",
                                    "sinaccount" : "0.0",
                                    "taskflag" : 0,
                                    "times" : 0,
                                    "total" : 0,
                                    "version" : 0,
                                    "yaccount" : "0.0",
                                    "ycharges" : "0.0"
                                  }
                              ],
                              "inaccount" : 0,
                              "indexid" : 1012,
                              "itemAccount" : 6000000,
                              "itemcode" : "M2",
                              "itemname" : "�������Ρ����ι̶�װ��ǿ��",
                              "itemsBasis" : "GB15083-2006",
                              "itimes" : 0,
                              "itype" : 0,
                              "list" : [],
                              "normalCharge" : 6000000,
                              "note" : "",
                              "objAccount" : 0,
                              "oilCharge" : 0,
                              "orgabc" : "M",
                              "page" : false,
                              "pageHtml" : "",
                              "pageSize" : 15,
                              "placeCharge" : 0,
                              "saccount" : "60000.00",
                              "sinaccount" : "0.0",
                              "sitemAccount" : "60000.00",
                              "sobjAccount" : "0.0",
                              "taskIndexOrderId" : "",
                              "taskflag" : 2,
                              "taskid" : "D49CB11D2FC7476C9E0D2DC93FE958F6",
                              "tcItemsCode" : "",
                              "total" : 0,
                              "version" : 6
                            }
                        ],
                        "objAccount" : 0,
                        "orgabc" : "M",
                        "page" : false,
                        "pageHtml" : "",
                        "pageSize" : 15,
                        "partitiondate" : 2020,
                        "rowspan" : 5,
                        "saccount" : "60000.00",
                        "sampleName" : "",
                        "sampleType" : "",
                        "sattAccount" : "0.0",
                        "saveflag" : 0,
                        "scaccount" : "60000.00",
                        "sinAccount" : "0.0",
                        "sitemAccount" : "60000.00",
                        "sobjAccount" : "0.0",
                        "taskCode" : "",
                        "taskid" : "D49CB11D2FC7476C9E0D2DC93FE958F6",
                        "total" : 0,
                        "version" : 1,
                        "wordFinishDate" : "",
                        "wordFinishDates" : 0
                      }
                  ],
                  "normalCharge" : 0,
                  "objAccount" : 0,
                  "oilCharge" : 0,
                  "page" : false,
                  "pageHtml" : "",
                  "pageSize" : 15,
                  "partitiondate" : 2020,
                  "placeCharge" : 0,
                  "rowspan" : 5,
                  "saccount" : "60000.00",
                  "saccount2" : "��60,000.00",
                  "sampleName" : "555",
                  "sampleType" : "555",
                  "sattAccount" : "0.0",
                  "sattAccount2" : "��0.00",
                  "sinAccount" : "0.0",
                  "sinAccount2" : "��0.00",
                  "sitemAccount" : "60000.00",
                  "sitemAccount2" : "��60,000.00",
                  "sobjAccount" : "0.0",
                  "sobjAccount2" : "��0.00",
                  "taskcode" : "WT124929",
                  "taskid" : "D49CB11D2FC7476C9E0D2DC93FE958F6",
                  "total" : 0,
                  "version" : 0,
                  "xlsList" : [],
                  "zkflag" : 0
                },
                
            ],
        },
        myLiClick : window.myClickAdd = (item)=>{
          let _span = item.getElementsByTagName('span')[0];
          let _input = item.getElementsByTagName('input')[0];
          _span.style.display = 'none';
          _input.style.display = 'block';
          _input.focus();
          _input.onfocus = m();
          function m(){
            _input.value = _span.innerHTML
          };
          _input.onblur = function(){
            _span.innerHTML = _input.value
            _span.style.display = 'block';
            _input.style.display = 'none';

            let cspan = document.getElementsByTagName('span')
            for(let i=0; i<cspan.length; i++){

            }
            _span.getAttribute("data-c")
          };

        }
        

      }
    },
    methods: {
    
      
      dynamicTable(){ //动态生产表格
        let dome = this.$refs.costlayout;
        let data = this.dynamicTableData;
        this.setDynamicTable(dome,data) //将数据穿入js中处理
        
      },
      setDynamicTable(table,data){
        let listData = data;
        let _h = 35
        for(var i=0; i<listData.list.length; i++){  //一级
          var _oneli = document.createElement('li');
          _oneli.style.height = "auto"
          _oneli.style.overflow = "hidden"
          var _onespan = document.createElement('span');
          _onespan.innerHTML = listData.list[i].laccountchina;
          _onespan.style.float = 'left';
          _onespan.style.display = 'block';
          _onespan.style.width = '11%';
          _onespan.style.border = '1px solid #DCDFE6';
          _onespan.style.height = listData.list[i].list[0].list[0].ilist.length *  
                                  listData.list[i].list[0].list.length *
                                  listData.list[i].list.length * _h +'px';
          _onespan.style.lineHeight = listData.list[i].list[0].list[0].ilist.length *  
                                  listData.list[i].list[0].list.length *
                                  listData.list[i].list.length * _h +'px';
          _oneli.appendChild(_onespan);
            var _towul = document.createElement('ul');//二级
            var _towli = document.createElement('li');//二级
                var _threeul = document.createElement('ul');//三级
                var _threeli = document.createElement('li');//三级
                  var _fowul = document.createElement('ul');//四级
                  var _fowul2 = document.createElement('ul');//四级
                  var _fowul3 = document.createElement('ul');//四级
                  var _fowul4 = document.createElement('ul');//四级
                  var _fowul5 = document.createElement('ul');//四级
                  var _fowul6 = document.createElement('ul');//四级
            for(var t=0; t<listData.list[i].list.length; t++){  //二级
              _towul.style.float = 'left'
              _towul.style.width = '11%';
              var _towul_ul =document.createElement('ul');
              var _towli_li = document.createElement('li');
              _towli_li.style.border = '1px solid #DCDFE6';
              _towli_li.style.height = listData.list[i].list[0].list[0].ilist.length *  
                                      listData.list[i].list[0].list.length * _h +'px';
              _towli_li.style.lineHeight = listData.list[i].list[0].list[0].ilist.length *  
                                          listData.list[i].list[0].list.length * _h +'px';
              var _towspan = document.createElement('span');
              _towspan.innerHTML = listData.list[i].list[t].deptname;
              _towli_li.appendChild(_towspan);
              _towul_ul.appendChild(_towli_li);
              _towli.appendChild(_towul_ul)
                var _threeul_ul =document.createElement('ul'); //三级
                for(var m=0; m<listData.list[i].list[t].list.length; m++){ //三级
                  _threeul.style.float = 'left'
                  _threeul.style.width = '11%';
                  var _threeli_li = document.createElement('li');
                  _threeli_li.style.border = '1px solid #DCDFE6'
                  _threeli_li.style.height = listData.list[i].list[0].list[0].ilist.length * _h +'px';
                  _threeli_li.style.lineHeight = listData.list[i].list[0].list[0].ilist.length * _h +'px';
                  var _threespan = document.createElement('span');
                  _threespan.innerHTML = listData.list[i].list[t].list[m].confirmName;
                  _threeli_li.appendChild(_threespan);
                  _threeul_ul.appendChild(_threeli_li);
                  _threeli.appendChild(_threeul_ul);
                     var _fowli = document.createElement('li');//四级
                     var _lul = document.createElement('ul'); //四级

                     var _fowli2 = document.createElement('li');//四级
                     var _lul2 = document.createElement('ul'); //四级

                     var _fowli3 = document.createElement('li');//四级
                     var _lul3 = document.createElement('ul'); //四级

                     var _fowli4 = document.createElement('li');//四级
                     var _lul4 = document.createElement('ul'); //四级

                     var _fowli5 = document.createElement('li');//四级
                     var _lul5 = document.createElement('ul'); //四级

                     var _fowli6 = document.createElement('li');//四级
                     var _lul6 = document.createElement('ul'); //四级
                     
                     for(var f=0; f<listData.list[i].list[t].list[m].ilist.length; f++){  //四级
                        // _fowul.style.float = 'left'
                        // _fowul.style.width = '14%';
                        // var _lli = document.createElement('li');
                        // _lli.style.border = '1px solid #DCDFE6';
                        // _lli.style.height = _h+'px';
                        // _lli.style.lineHeight = _h+'px';
                        // var _fowspan = document.createElement('span');
                        // _fowspan.innerHTML = listData.list[i].list[t].list[m].ilist[f].account;
                        // _lli.appendChild(_fowspan)
                        // _lul.appendChild(_lli)

                        var centom = listData.list[i].list[t].list[m].ilist[f].account   //费用名称
                        this.copySpan(_fowul,centom,_lul,_h)

                        // 是否显示列
                        var centom = listData.list[i].list[t].list[m].ilist[f].account  //公告试验次数
                        this.copySpan(_fowul5,centom,_lul5,_h)

                        // 是否显示列
                        var centom = listData.list[i].list[t].list[m].ilist[f].account  //CCC试验次数
                        this.copySpan(_fowul6,centom,_lul6,_h)

                        var centom = listData.list[i].list[t].list[m].ilist[f].yaccount  //费用
                        this.copySpan(_fowul2,centom,_lul2,_h,'m',foot+i+t+m+f)
  
                        var centom = listData.list[i].list[t].list[m].ilist[f].times   //次数
                        this.copySpan(_fowul3,centom,_lul3,_h,'s',foot+i+t+m+f)

                        var centom = listData.list[i].list[t].list[m].ilist[f].cyaccount  //收费小计
                        this.copySpan(_fowul4,centom,_lul4,_h,'z',foot+i+t+m+f)

                     }
                   _fowli.appendChild(_lul);
                   _fowul.appendChild(_fowli);

                   _fowli2.appendChild(_lul2);
                   _fowul2.appendChild(_fowli2);

                   _fowli3.appendChild(_lul3);
                   _fowul3.appendChild(_fowli3);

                   _fowli4.appendChild(_lul4);
                   _fowul4.appendChild(_fowli4);

                   _fowli5.appendChild(_lul5);
                   _fowul5.appendChild(_fowli5);

                   _fowli6.appendChild(_lul6);
                   _fowul6.appendChild(_fowli6);
                  
                }
            } 
            _threeul.appendChild(_threeli)//三级
            _towul.appendChild(_towli)//二级
            _oneli.appendChild(_towul);//二级
            _oneli.appendChild(_threeul);//三级
            _oneli.appendChild(_fowul);//四级
            _oneli.appendChild(_fowul5);//四级
            _oneli.appendChild(_fowul6);//四级
            _oneli.appendChild(_fowul2);//四级
            _oneli.appendChild(_fowul3);//四级
            _oneli.appendChild(_fowul4);//四级

         this.$refs.costlayout.appendChild(_oneli)
        }
        // var nodeTr = document.createElement('tbody')
        //     nodeTr.innerHTML = std
        //     table.appendChild(nodeTr)
      },
      copySpan(_fowul,centom,_lul,_h,field,identifier){
        _fowul.style.float = 'left'
        _fowul.style.width = '11%';
        var _lli = document.createElement('li');
        _lli.style.border = '1px solid #DCDFE6';
        _lli.style.height = _h+'px';
        _lli.style.lineHeight = _h+'px';
        _lli.setAttribute('onclick', 'myClickAdd(this)');
        var _fowspan = document.createElement('span');
        _fowspan.innerHTML = centom;

        if(identifier){

          _fowspan.setAttribute('data-c', identifier);
        }

        var _fowinput = document.createElement('input');
        _fowinput.style.width = '90%';
        _fowinput.style.height = _h-5+'px';
        _fowinput.style.display = "none"
        _fowinput.value = '';
        _fowinput.autofocus="autofocus"

        _lli.appendChild(_fowspan)
        _lli.appendChild(_fowinput)
        _lul.appendChild(_lli)
      },
    
    },
    watch: {
     
    },
    mounted () {
      
      this.dynamicTable();
     
    },
    props: [
      
    ],
    components: {
     
      
    }
  }
</script>
<style lang="scss" scoped>
 
// 表格样式
.standardCost{ width: 90%; height: auto; overflow: hidden; margin: 0 auto;}
.standardCost h2{ margin: 10px 0;}
.standardCost table{width: 100%; box-sizing: border-box; border:1px solid #DCDFE6;}
.standardCost table tr{ height: 30px; line-height: 30px; text-align: center;}
.costlayout{ width: 100%; height: auto; overflow: hidden; margin: 0 auto;}
.red{ color: red;}
.costlayout ul li{ border: 1px solid #DCDFE6; float: left; width: 11%;}
.onfloat{float: left;}
</style>
