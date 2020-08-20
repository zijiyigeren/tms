export default {
  tooltip: {},
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',
  textStyle: {
    color: '#000'
  },
  series: [
    {
      type: 'graph',
      tooltip: {
        backgroundColor: 'skyblue',
      },
      layout: 'none',
      symbolSize: 10,
      roam: false,
      label: {
        normal: {
          show: true,
          position: 'bottom',
          offset: [0, -60],//居上 20
          textStyle: {
            fontSize: '18rem'
          },
          formatter: '{c}'
        }
      },
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: 'bottom',//居下
            offset: [0, 20],//居下 20
            formatter: function (para) {//格式化提示文本
              return para.name
            }
          }
        }
      },
      edgeSymbol: [
        // 'circle',
        // 'arrow',
      ],
      edgeSymbolSize: [4, 10],
      edgeLabel: {
        normal: {
          textStyle: {
            fontSize: 12
          }
        }
      },
      data: [
        {
          name: '卖家发货',
          x: 100,
          y: 300,
          // y: 100,
          // value:data['卖家发货'],
          value: 1111,
          //symbol:'rect', // 让节点为矩形显示
          symbolSize: 10,// 节点的长和宽
          itemStyle: {
            normal: {
              color: '#ee5255'
            }
          }
        },
        {
          name: '平台收货',
          x: 200,
          y: 300,
          // y: 100,
          //symbol:'rect',
          symbolSize: 10,
          // value:data['平台收货'],
          value: 22222,
          itemStyle: {
            normal: {
              color: '#399'
            }
          }
        },
        {
          name: '平台验货',
          x: 300,
          y: 300,
          // value:data['平台验货'],
          value: 3333,
          // symbol:'rect',
          symbolSize: [10, 10],
          itemStyle: {
            normal: {
              color: '#399'
            }
          }
        },
        {
          name: '平台入库',
          x: 400,
          y: 300,
          //symbol:'rect',// 方块
          symbolSize: [10, 10],
          // value:data['平台入库'],
          value: 4444,
          itemStyle: {
            normal: {
              color: '#399'
            }
          }
        },
        {
          name: '竞拍成功',
          x: 500,
          y: 300,
          // value:data['竞拍成功'],
          value: 55555,
          //symbol:'rect',
          symbolSize: [10, 10],
          itemStyle: {
            normal: {
              color: '#ee5255'
            }
          }
        },
        {
          name: '平台发货',
          x: 600,
          y: 300,
          // value:data['平台发货'],
          value: 66666,
          //symbol:'rect',
          symbolSize: [10, 10],
          itemStyle: {
            normal: {
              color: '#399'
            }
          }
        },
        {
          name: '买家收货',
          x: 700,
          y: 300,
          // value:data['买家收货'],
          value: 777777,
          //symbol:'rect',
          symbolSize: [10, 10],
          itemStyle: {
            normal: {
              color: '#ee5255'
            }
          }
        },
        {
          name: '买家退货',
          x: 800,
          y: 300,
          // value:data['买家退货'],
          value: 888888,
          //symbol:'rect',
          symbolSize: 10,
          itemStyle: {
            normal: {
              color: '#ee5255'
            }
          }
        },
        {
          name: '退货审核',
          x: 900,
          y: 300,
          value: 999999,
          // value:data['退货审核'],
          //symbol:'rect',
          symbolSize: 10,
          itemStyle: {
            normal: {
              color: '#399'
            }
          }
        },
        {
          name: '卖家退货',
          x: 400,
          y: 400,
          // value:data['卖家退货'],
          value: '000000000',
          //symbol:'rect',
          symbolSize: [10, 10],
          itemStyle: {
            normal: {
              color: '#ee5255'
            }
          }
        }
      ],
      links: [
        {
          source: '卖家发货',
          target: '平台收货'
        },
        {
          source: '平台收货',
          target: '平台验货'
        },
        {
          source: '平台验货',
          target: '平台入库'
        },
        // {
        //   source: '平台验货',
        //   target: '卖家退货'
        // },
        {
          source: '平台入库',
          target: '竞拍成功'
        },
        {
          source: '竞拍成功',
          target: '平台发货'
        },
        {
          source: '平台发货',
          target: '买家收货'
        },
        {
          source: '买家收货',
          target: '买家退货'
        },
        {
          source: '买家退货',
          target: '退货审核'
        },
        {
          source: '平台入库',
          target: '卖家退货'
        }
      ],
      lineStyle: {
        normal: {
          // opacity: 0.5,
          // type: 'dashed',
          width: 5
        }
      }
    },
//       {
//         type: 'graph',
//         tooltip: {
//           backgroundColor: 'skyblue',
// //                      formatter: "{b} <br/>{a} : {c} h "
//         },
//         layout: 'none',
//         symbolSize: 10,
//         roam: false,
//         label: {
//           normal: {
//             show: true
//           }
//         },
//         itemStyle: {
//           normal: {
//             label: {
//               show: true,
//               position: 'bottom',//居下
//               offset: [0, 20],//居下 20
//               formatter: function (para) {//格式化提示文本
//                 return para.name
//               }
//             }
//           }
//         },
//         //edgeSymbol: ['circle', 'arrow'],
//         edgeSymbol: ['none', 'none'],
//         edgeSymbolSize: [4, 10],
//         edgeLabel: {
//           normal: {
//             show: false,
//             textStyle: {
//               fontSize: 12
//             }
//           }
//         },
//         data: [
//           {
//             name: '卖家发货',
//             x: 100,
//             y: 300,
//             // value:data['卖家发货'],
//             value: 345,
//             //symbol:'rect', //让节点为矩形显示
//             symbolSize: 10,//节点的长和宽
//             itemStyle: {
//               normal: {
//                 color: '#ee5255'
//               }
//             }
//           }, {
//             name: '平台收货',
//             x: 200,
//             y: 300,
//             //symbol:'rect',
//             symbolSize: 10,
//             value: '1000台/30h',
//             itemStyle: {
//               normal: {
//                 color: '#399'
//               }
//             }
//           }, {
//             name: '平台验货',
//             x: 300,
//             y: 300,
//             value: '1000台/30h',
//             //symbol:'rect',
//             symbolSize: [10, 10],
//             itemStyle: {
//               normal: {
//                 color: '#399'
//               }
//             }
//           }, {
//             name: '平台入库',
//             x: 400,
//             y: 300,
//             //symbol:'rect',
//             symbolSize: [10, 10],
//             value: '1000台/30h',
//             itemStyle: {
//               normal: {
//                 color: '#399'
//               }
//             }
//           }, {
//             name: '竞拍成功',
//             x: 500,
//             y: 300,
//             value: '1000台/30h',
//             //symbol:'rect',
//             symbolSize: [10, 10],
//             itemStyle: {
//               normal: {
//                 color: '#ee5255'
//               }
//             }
//           },
//           {
//             name: '平台发货',
//             x: 600,
//             y: 300,
//             value: '10000 台/33 h',
//             //symbol:'rect',
//             symbolSize: [10, 10],
//             itemStyle: {
//               normal: {
//                 color: '#399'
//               }
//             }
//           },
//           {
//             name: '买家收货',
//             x: 700,
//             y: 300,
//             value: '1000台/30h',
//             //symbol:'rect',
//             symbolSize: [10, 10],
//             itemStyle: {
//               normal: {
//                 color: '#ee5255'
//               }
//             }
//           },
//           {
//             name: '买家退货',
//             x: 800,
//             y: 300,
//             value: '1000台/30h',
//             //symbol:'rect',
//             symbolSize: 10,
//             itemStyle: {
//               normal: {
//                 color: '#ee5255'
//               }
//             }
//           },
//           {
//             name: '退货审核',
//             x: 900,
//             y: 300,
//             value: '1000台/30h',
//             //symbol:'rect',
//             symbolSize: 10,
//             itemStyle: {
//               normal: {
//                 color: '#399'
//               }
//             }
//           },
//           {
//             name: '卖家退货',
//             x: 500,
//             y: 400,
//             value: '1000台/30h',
//             //symbol:'rect',
//             symbolSize: [10, 10],
//             itemStyle: {
//               normal: {
//                 color: '#ee5255'
//               }
//             }
//           }
//         ],
//         links: [
//           {
//             source: '卖家发货',
//             target: '平台收货'
//           },
//           {
//             source: '平台收货',
//             target: '平台验货'
//           },
//           {
//             source: '平台验货',
//             target: '平台入库'
//           },
//           {
//             source: '平台验货',
//             target: '卖家退货'
//           },
//           {
//             source: '平台入库',
//             target: '竞拍成功'
//           },
//           {
//             source: '竞拍成功',
//             target: '平台发货'
//           },
//           {
//             source: '平台发货',
//             target: '买家收货'
//           },
//           {
//             source: '买家收货',
//             target: '买家退货'
//           },
//           {
//             source: '买家退货',
//             target: '退货审核'
//           },
//           {
//             source: '平台入库',
//             target: '卖家退货'
//           }
//         ],
//         lineStyle: {
//           normal: {
//             opacity: 0.9,
//             type: 'dashed',
//             width: 1
//           }
//         }
//       }
  ]
}
