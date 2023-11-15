export default {
  getNodeList: function () {
    let nodeData = [];
    let k = 1;
    let baseData = {
      selected: false,
      status: 'normal'
    }
    nodeData.push({
      id: k + '',
      name: '套装绝缘件',
      ...baseData,
      status: 'normal'
    });
    k = k + 1;
    nodeData.push({
      id: k + '',
      name: '成型件',
      ...baseData,
      status: 'error'
    });
    k = k + 1;
    nodeData.push({
      id: k + '',
      name: '绕线角环油道',
      ...baseData,
      status: 'alarm'
    });
    k = k + 1;
    nodeData.push({
      id: k + '',
      name: '绕线绝缘',
      ...baseData,
      status: 'error'
    });
    k = k + 1;
    nodeData.push({
      id: k + '',
      name: '线材',
      ...baseData,
      status: 'error'
    });
    k = k + 1;
    nodeData.push({
      id: k + '',
      name: '器身绝缘',
      ...baseData,
      status: 'normal'
    });
    k = k + 1;
    nodeData.push({
      id: k + '',
      name: '引线绝缘',
      ...baseData,
      status: 'normal'
    });
    k = k + 1;
    nodeData.push({
      id: k + '',
      name: '总装绝缘',
      ...baseData,
      status: 'normal'
    });
    k = k + 1;
    nodeData.push({
      id: k + '',
      name: '绕线（含线圈干燥）',
      ...baseData,
      status: 'alarm'
    });
    k = k + 1;
    nodeData.push({
      id: k + '',
      name: '相套件',
      ...baseData,
      status: 'normal'
    });
    k = k + 1;
    nodeData.push({
      id: k + '',
      name: '相套件干燥',
      ...baseData,
      status: 'normal'
    });
    k = k + 1;

    nodeData.push({
      id: k + '',
      name: '夹件',
      ...baseData
    });
    k = k + 1;
    nodeData.push({
      id: k + '',
      name: '铁芯饼',
      ...baseData
    });
    k = k + 1;
    nodeData.push({
      id: k + '',
      name: '剪片',
      ...baseData
    });
    k = k + 1;

    nodeData.push({
      id: k + '',
      name: '叠片',
      ...baseData
    });
    k = k + 1;

    nodeData.push({
      id: k + '',
      name: '开关',
      ...baseData
    });
    k = k + 1;

    nodeData.push({
      id: k + '',
      name: '器身',
      ...baseData
    });
    k = k + 1;

    nodeData.push({
      id: k + '',
      name: '引线',
      ...baseData
    });
    k = k + 1;

    nodeData.push({
      id: k + '',
      name: '油枕',
      ...baseData
    });
    k = k + 1;

    nodeData.push({
      id: k + '',
      name: '冷却器',
      ...baseData
    });
    k = k + 1;

    nodeData.push({
      id: k + '',
      name: '油箱',
      ...baseData
    });
    k = k + 1;

    nodeData.push({
      id: k + '',
      name: '器身干燥',
      ...baseData
    });
    k = k + 1;

    nodeData.push({
      id: k + '',
      name: 'CT',
      ...baseData
    });
    k = k + 1;

    nodeData.push({
      id: k + '',
      name: '套管',
      ...baseData
    });
    k = k + 1;

    nodeData.push({
      id: k + '',
      name: '片散',
      ...baseData
    });
    k = k + 1;
    nodeData.push({
      id: k + '',
      name: '总装',
      ...baseData
    });
    k = k + 1;
    nodeData.push({
      id: k + '',
      name: '注油、静放',
      ...baseData
    });
    k = k + 1;

    nodeData.push({
      id: k + '',
      name: '试验',
      ...baseData
    });
    k = k + 1;

    nodeData.push({
      id: k + '',
      name: '吊芯',
      ...baseData
    });
    k = k + 1;
    nodeData.push({
      id: k + '',
      name: '包装',
      ...baseData
    });
    k = k + 1;
    return nodeData;
  },

  getCacheData() {
    return [{
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "dbff2511-051b-4e00-9899-20261c290c98",
      "zIndex": 0,
      "source": {"cell": "29", "port": "529a0f65-1b25-4c14-8433-8b4c93b21b2f"},
      "target": {"cell": "30", "port": "7d31a5ff-7249-4b2c-8e5c-9e207d94dca5"},
      "tools": {"items": [{"name": "button-remove", "args": {"distance": -40}}]}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "0451b297-f1f2-4dfe-8b88-ce5f4d103513",
      "zIndex": 0,
      "source": {"cell": "28", "port": "6eab2877-e0ff-4a02-bf43-00a6fcaa865c"},
      "target": {"cell": "29", "port": "624033c8-4ac3-4427-9806-4d750e0e1ded"},
      "tools": {"items": [{"name": "button-remove", "args": {"distance": -40}}]}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "4e47479f-aaaf-4a61-bfeb-24e3e25aaf3e",
      "zIndex": 0,
      "source": {"cell": "27", "port": "8b41ace1-824c-4b85-a213-66aa61c5735c"},
      "target": {"cell": "28", "port": "5240fc30-1b50-4842-a36b-322ddece05cf"},
      "tools": {"items": [{"name": "button-remove", "args": {"distance": -40}}]}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "d94f9d32-1f65-44ff-b80e-2df550c9ad8a",
      "zIndex": 0,
      "source": {"cell": "26", "port": "bab63b76-add1-4911-86c6-cd993c104fad"},
      "target": {"cell": "27", "port": "32728834-cce7-4765-96a5-cabaf07a8238"},
      "tools": {"items": [{"name": "button-remove", "args": {"distance": -40}}]}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "790961b2-39a0-4ef7-b734-f25c1e87004e",
      "zIndex": 0,
      "source": {"cell": "22", "port": "ad256d02-6ee0-4ab8-9d82-af982e7e5fe7"},
      "target": {"cell": "26", "port": "8878bdf5-ce64-4b94-bbd6-79f644d20743"},
      "tools": {"items": [{"name": "button-remove", "args": {"distance": -40}}]}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "56ba78c2-e700-4b09-94c4-b3c8eb952a96",
      "zIndex": 0,
      "source": {"cell": "21", "port": "15461a11-ed44-4db1-baca-800504c02897"},
      "target": {"cell": "26", "port": "ad8d4cb7-06b3-4e73-bcb6-270f12c8e02d"},
      "tools": {"items": [{"name": "button-remove", "args": {"distance": -40}}]}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "3d46ad83-276c-40c6-904d-a6d0a1641892",
      "zIndex": 0,
      "source": {"cell": "23", "port": "c559465e-440b-498a-bed3-ac629dc55ea7"},
      "target": {"cell": "26", "port": "159da03d-ab6b-4292-b285-0614a62b6761"},
      "tools": {"items": [{"name": "button-remove", "args": {"distance": -40}}]}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "a34f311e-ecde-46ee-b1fc-c7e7587f2083",
      "zIndex": 0,
      "source": {"cell": "24", "port": "2e232141-349e-4841-baa1-8b4e30312a1c"},
      "target": {"cell": "26", "port": "159da03d-ab6b-4292-b285-0614a62b6761"},
      "tools": {"items": [{"name": "button-remove", "args": {"distance": -40}}]}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "8ecad936-93f3-4deb-9280-14aa7dc83f40",
      "zIndex": 0,
      "source": {"cell": "25", "port": "c11350bd-27c2-4b27-9bb6-de476c7705f6"},
      "target": {"cell": "26", "port": "159da03d-ab6b-4292-b285-0614a62b6761"},
      "tools": {"items": [{"name": "button-remove", "args": {"distance": -40}}]}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "89c06028-ffa8-4154-9fc4-c30a4c145492",
      "zIndex": 0,
      "source": {"cell": "18", "port": "7b6ed154-74ca-4624-9e31-253e641fa71d"},
      "target": {"cell": "22", "port": "870eeb92-df32-4770-b956-92255436845f"},
      "tools": {"items": [{"name": "button-remove", "args": {"distance": -40}}]}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "4edbb03c-b40c-413c-9b81-19b644ffbc07",
      "zIndex": 0,
      "source": {"cell": "17", "port": "cc2248cb-9f0d-42e4-8b5b-ed7eed213cc7"},
      "target": {"cell": "18", "port": "18a20c30-4ce7-466b-86fe-fc7980806fa0"},
      "tools": {"items": [{"name": "button-remove", "args": {"distance": -40}}]}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "f0ec2c3e-742b-470f-8245-a073914f0b87",
      "zIndex": 0,
      "source": {"cell": "20", "port": "5f74c389-0d30-464c-8806-f41f067844cc"},
      "target": {"cell": "21", "port": "2f99a411-57b9-4d42-a3d6-56820a9a091e"},
      "tools": {"items": [{"name": "button-remove", "args": {"distance": -40}}]}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "3f6cbf6d-8368-42aa-aa96-1b910bc0a9a3",
      "zIndex": 0,
      "source": {"cell": "19", "port": "65d3ca3f-c3e3-4938-bec6-13ff169ee004"},
      "target": {"cell": "21", "port": "2f99a411-57b9-4d42-a3d6-56820a9a091e"},
      "tools": {"items": [{"name": "button-remove", "args": {"distance": -40}}]}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "363737c8-6032-41f3-b78d-a9d841e00436",
      "zIndex": 0,
      "source": {"cell": "16", "port": "73bda5d1-1114-441c-a968-a1eb26a5eb7f"},
      "target": {"cell": "18", "port": "aeba8095-dd53-44de-8077-7dded735f1b7"},
      "tools": {"items": [{"name": "button-remove", "args": {"distance": -40}}]}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "b7eea7ea-bac6-4428-af83-f05fc5c82a9b",
      "zIndex": 0,
      "source": {"cell": "14", "port": "cadf1b62-e229-46c2-9d25-74e74f2ab4c8"},
      "target": {"cell": "15", "port": "43e708fb-a970-4757-8f5d-fcad537048f3"},
      "tools": {"items": [{"name": "button-remove", "args": {"distance": -40}}]}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "3130b4db-27f3-4b3a-98bb-3f01a7581e6e",
      "zIndex": 0,
      "source": {"cell": "13", "port": "e5a2e449-f791-4ec0-8d18-f49afee920dc"},
      "target": {"cell": "15", "port": "43e708fb-a970-4757-8f5d-fcad537048f3"},
      "tools": {"items": [{"name": "button-remove", "args": {"distance": -40}}]}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "736c6b4e-5af1-4b63-9cdb-e24a291e1461",
      "zIndex": 0,
      "source": {"cell": "12", "port": "4aa32243-fb13-4e4b-9fe4-bfb8910d9643"},
      "target": {"cell": "15", "port": "43e708fb-a970-4757-8f5d-fcad537048f3"},
      "tools": {"items": [{"name": "button-remove", "args": {"distance": -40}}]}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "f4901b65-1965-4906-991c-8951e43513bf",
      "zIndex": 0,
      "source": {"cell": "11", "port": "600e73eb-2f69-48d0-b699-bb614f6f7d87"},
      "target": {"cell": "15", "port": "fe8a80bb-3a12-4e96-abeb-eb8cb676193f"},
      "tools": {"items": [{"name": "button-remove", "args": {"distance": -40}}]}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "cdb2a513-3d37-45c8-8d87-814486757550",
      "zIndex": 0,
      "source": {"cell": "15", "port": "3dcb4e05-2b19-4b82-ab03-613d8f9ff9ce"},
      "target": {"cell": "17", "port": "2a317c51-4a82-4030-baa7-a4550dadc4f5"},
      "tools": {"items": [{"name": "button-remove", "args": {"distance": -40}}]}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "855ba686-1091-44b3-9191-257c0b01ebd0",
      "zIndex": 0,
      "source": {"cell": "10", "port": "37841031-0ce2-40d9-85c2-11c1d0effbdc"},
      "target": {"cell": "11", "port": "d0b6fc66-11d4-46e6-98a7-a323e67cf383"},
      "tools": {"items": [{"name": "button-remove", "args": {"distance": -40}}]}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "2b74f6ce-5d2e-4870-9b6c-cd30eff1542e",
      "zIndex": 0,
      "source": {"cell": "9", "port": "600f3a8c-4e8f-4ded-b253-4a0c48533415"},
      "target": {"cell": "10", "port": "d252bf76-aa6d-4047-b7fb-f98ae071993e"},
      "tools": {"items": [{"name": "button-remove", "args": {"distance": -40}}]}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "74e21cb0-1820-44f8-9bec-b18b02c16d15",
      "zIndex": 0,
      "source": {"cell": "1", "port": "70551687-e14a-49f1-bd12-7ff04685c343"},
      "target": {"cell": "9", "port": "e8a01b22-694e-429b-b79b-aac2c364b043"}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "09e88dcf-b07e-45b6-b937-b8b7f0fdb0fe",
      "zIndex": 0,
      "source": {"cell": "2", "port": "478ca1f7-e4be-4c61-bfff-f404ff4a7e9b"},
      "target": {"cell": "9", "port": "e8a01b22-694e-429b-b79b-aac2c364b043"}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "b37a9fe1-7074-46b9-b16f-c61a45e85d38",
      "zIndex": 0,
      "source": {"cell": "3", "port": "777633ad-5ed8-4538-98da-bf83a4067c62"},
      "target": {"cell": "9", "port": "e8a01b22-694e-429b-b79b-aac2c364b043"}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "53a19f69-1622-4523-96e5-3e6334be93cf",
      "zIndex": 0,
      "source": {"cell": "4", "port": "5ac4f271-7b56-4bf5-8f4a-a0db4318b50b"},
      "target": {"cell": "9", "port": "e8a01b22-694e-429b-b79b-aac2c364b043"}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "b550eee5-b27e-426b-94a6-1875fe721081",
      "zIndex": 0,
      "source": {"cell": "5", "port": "9f548fe2-6a81-4fe4-828b-b80bdfb5218a"},
      "target": {"cell": "9", "port": "711ee80d-059c-4f1b-b64f-7e5e41f7eb00"}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "ff66b6bd-4a5d-42d8-b479-5d48d8b7bb37",
      "zIndex": 0,
      "source": {"cell": "6", "port": "bddbb0bc-9cf5-4038-9baf-e8876dd601f5"},
      "target": {"cell": "9", "port": "48a7db7e-103e-462a-9494-da785e5affb5"}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "89dca1bc-4340-4767-b163-8f39a110a6cb",
      "zIndex": 0,
      "source": {"cell": "7", "port": "394cdece-7373-4edd-8e66-76e2417562a2"},
      "target": {"cell": "9", "port": "48a7db7e-103e-462a-9494-da785e5affb5"}
    }, {
      "shape": "edge",
      "attrs": {"line": {"stroke": "#333"}},
      "id": "a0e758d6-531a-4552-9c9f-916a724db490",
      "zIndex": 0,
      "source": {"cell": "8", "port": "842bd2b6-eeb5-479a-a910-0b338a5ab5fe"},
      "target": {"cell": "9", "port": "48a7db7e-103e-462a-9494-da785e5affb5"}
    }, {
      "position": {"x": -580, "y": -610},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "56ce2c62-822d-431c-acc1-8455bfb81fcc"}, {
          "group": "right",
          "id": "8942200a-d1f4-4a85-9a43-5bae191ab4ff"
        }, {"group": "bottom", "id": "70551687-e14a-49f1-bd12-7ff04685c343"}, {
          "group": "left",
          "id": "8e0c5366-626c-4641-8a72-084307c9e851"
        }]
      },
      "id": "1",
      "data": {"text": "套装绝缘件", "status": "alarm", "selected": false},
      "zIndex": 1
    }, {
      "position": {"x": -440, "y": -610},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "c78eed2f-054d-43dd-be9f-0e03bd1e3283"}, {
          "group": "right",
          "id": "54b33a91-45f2-4391-b5fe-a87a81c16705"
        }, {"group": "bottom", "id": "478ca1f7-e4be-4c61-bfff-f404ff4a7e9b"}, {
          "group": "left",
          "id": "5aa4864c-64ce-42db-aa53-6a8a445bb36f"
        }]
      },
      "id": "2",
      "data": {"text": "成型件", "status": "error", "selected": false},
      "zIndex": 2
    }, {
      "position": {"x": -294, "y": -610},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "9e423b3d-6f49-482a-86cd-8bad7d651430"}, {
          "group": "right",
          "id": "06275850-e48e-462f-a29b-53c9268151ea"
        }, {"group": "bottom", "id": "777633ad-5ed8-4538-98da-bf83a4067c62"}, {
          "group": "left",
          "id": "08be541d-7349-43a4-b875-a2b2ddbecbd5"
        }]
      },
      "id": "3",
      "data": {"text": "绕线角环油道", "status": "alarm", "selected": false},
      "zIndex": 3
    }, {
      "position": {"x": -140, "y": -610},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "d7ed7b1a-3226-48bd-9c1d-4d62cc57398f"}, {
          "group": "right",
          "id": "9fb1c153-c332-45b2-8508-aff39fe023cc"
        }, {"group": "bottom", "id": "5ac4f271-7b56-4bf5-8f4a-a0db4318b50b"}, {
          "group": "left",
          "id": "3987d5a9-2f7c-4521-a82c-da7f062d9e2f"
        }]
      },
      "id": "4",
      "data": {"text": "绕线绝缘", "status": "normal", "selected": false},
      "zIndex": 4
    }, {
      "position": {"x": -10, "y": -610},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "4d0049ea-4e99-4506-aafb-150f8d4e7dbe"}, {
          "group": "right",
          "id": "36166f9e-902a-4200-91e1-a99f44bc97af"
        }, {"group": "bottom", "id": "9f548fe2-6a81-4fe4-828b-b80bdfb5218a"}, {
          "group": "left",
          "id": "dbecf33e-4bd8-4249-b838-3f11b7afe693"
        }]
      },
      "id": "5",
      "data": {"text": "线材", "status": "normal", "selected": false},
      "zIndex": 5
    }, {
      "position": {"x": 150, "y": -610},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "119d2a4c-97fd-4968-813d-72351716b0c0"}, {
          "group": "right",
          "id": "3646727f-e3e3-4749-bd2b-1d835c878722"
        }, {"group": "bottom", "id": "bddbb0bc-9cf5-4038-9baf-e8876dd601f5"}, {
          "group": "left",
          "id": "4b60e457-2a5f-404f-a99f-1b2b9b0c7a25"
        }]
      },
      "id": "6",
      "data": {"text": "器身绝缘", "status": "error", "selected": false},
      "zIndex": 6
    }, {
      "position": {"x": 290, "y": -610},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "f9d943cf-7778-4ffb-81ea-80fbc7983544"}, {
          "group": "right",
          "id": "4c5d2c26-5d4b-4dec-a773-8ade70b6a7a5"
        }, {"group": "bottom", "id": "394cdece-7373-4edd-8e66-76e2417562a2"}, {
          "group": "left",
          "id": "f5078a41-6895-4038-8f31-2baeb3588c17"
        }]
      },
      "id": "7",
      "data": {"text": "引线绝缘", "status": "alarm", "selected": false},
      "zIndex": 7
    }, {
      "position": {"x": 430, "y": -610},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "f559b5ec-922b-450b-a8c2-800c32f221ec"}, {
          "group": "right",
          "id": "2cff3d02-7f5c-471d-8b5f-e3d09f74efcc"
        }, {"group": "bottom", "id": "842bd2b6-eeb5-479a-a910-0b338a5ab5fe"}, {
          "group": "left",
          "id": "6aa50182-d29c-4bc6-9dc8-7062720638cf"
        }]
      },
      "id": "8",
      "data": {"text": "总装绝缘", "status": "normal", "selected": false},
      "zIndex": 8
    }, {
      "position": {"x": -10, "y": -540},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "711ee80d-059c-4f1b-b64f-7e5e41f7eb00"}, {
          "group": "right",
          "id": "48a7db7e-103e-462a-9494-da785e5affb5"
        }, {"group": "bottom", "id": "600f3a8c-4e8f-4ded-b253-4a0c48533415"}, {
          "group": "left",
          "id": "e8a01b22-694e-429b-b79b-aac2c364b043"
        }]
      },
      "id": "9",
      "data": {"text": "绕线（含线圈干燥）", "status": "alarm", "selected": false},
      "zIndex": 9
    }, {
      "position": {"x": -10, "y": -460},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "d252bf76-aa6d-4047-b7fb-f98ae071993e"}, {
          "group": "right",
          "id": "0835a924-84df-4efd-867c-9264726f523e"
        }, {"group": "bottom", "id": "37841031-0ce2-40d9-85c2-11c1d0effbdc"}, {
          "group": "left",
          "id": "3a1c126d-3680-4445-a34a-f77cc0ff0b69"
        }]
      },
      "id": "10",
      "data": {"text": "相套件", "status": "", "selected": false},
      "zIndex": 10
    }, {
      "position": {"x": -10, "y": -385},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "d0b6fc66-11d4-46e6-98a7-a323e67cf383"}, {
          "group": "right",
          "id": "26511dc6-16d6-4fbf-a356-e682c6f007d3"
        }, {"group": "bottom", "id": "600e73eb-2f69-48d0-b699-bb614f6f7d87"}, {
          "group": "left",
          "id": "3c873036-1b7b-4645-88fa-899bfb6dc55b"
        }]
      },
      "id": "11",
      "data": {"text": "相套件干燥", "status": "", "selected": false},
      "zIndex": 11
    }, {
      "position": {"x": -440, "y": -385},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "6cc9fed9-0a9e-4f26-9e92-638f24eac8c8"}, {
          "group": "right",
          "id": "15c17a89-b5ea-469c-964d-1bff94c04a2b"
        }, {"group": "bottom", "id": "4aa32243-fb13-4e4b-9fe4-bfb8910d9643"}, {
          "group": "left",
          "id": "bd746077-9e8e-4d42-9c22-2a26caba666e"
        }]
      },
      "id": "12",
      "data": {"text": "夹件", "status": "", "selected": false},
      "zIndex": 12
    }, {
      "position": {"x": -294, "y": -385},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "55603903-7102-4b97-9fb5-774053e2e8dc"}, {
          "group": "right",
          "id": "c2af2e27-fa8d-439d-bdb1-6c9a7e41fa39"
        }, {"group": "bottom", "id": "e5a2e449-f791-4ec0-8d18-f49afee920dc"}, {
          "group": "left",
          "id": "2b54e8d7-a1be-4bc8-85ef-5e6c1cc9a947"
        }]
      },
      "id": "13",
      "data": {"text": "铁芯饼", "status": "", "selected": false},
      "zIndex": 13
    }, {
      "position": {"x": -150, "y": -385},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "216c8446-ad92-4aca-8c33-7ddb8be367e0"}, {
          "group": "right",
          "id": "018b8924-4bc6-4175-b6dd-c7d8a84d972f"
        }, {"group": "bottom", "id": "cadf1b62-e229-46c2-9d25-74e74f2ab4c8"}, {
          "group": "left",
          "id": "9ad19a5d-6ef9-4dce-b84c-ef785e263237"
        }]
      },
      "id": "14",
      "data": {"text": "剪片", "status": "", "selected": false},
      "zIndex": 14
    }, {
      "position": {"x": -10, "y": -310},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "fe8a80bb-3a12-4e96-abeb-eb8cb676193f"}, {
          "group": "right",
          "id": "3c6ee511-9f99-4f79-bbb9-90832608f3dd"
        }, {"group": "bottom", "id": "3dcb4e05-2b19-4b82-ab03-613d8f9ff9ce"}, {
          "group": "left",
          "id": "43e708fb-a970-4757-8f5d-fcad537048f3"
        }]
      },
      "id": "15",
      "data": {"text": "叠片", "status": "", "selected": false},
      "zIndex": 15
    }, {
      "position": {"x": -150, "y": -255},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "bdd9c870-b6aa-41a8-880b-be4d898c0c0b"}, {
          "group": "right",
          "id": "28c6f7f2-a393-4fd0-8438-6f99d07fff7d"
        }, {"group": "bottom", "id": "73bda5d1-1114-441c-a968-a1eb26a5eb7f"}, {
          "group": "left",
          "id": "32c3fa50-fe58-4940-ad87-79bc4ecd4325"
        }]
      },
      "id": "16",
      "data": {"text": "开关", "status": "", "selected": false},
      "zIndex": 16
    }, {
      "position": {"x": -10, "y": -235},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "2a317c51-4a82-4030-baa7-a4550dadc4f5"}, {
          "group": "right",
          "id": "853c4821-812e-4a1e-9f30-07732d485105"
        }, {"group": "bottom", "id": "cc2248cb-9f0d-42e4-8b5b-ed7eed213cc7"}, {
          "group": "left",
          "id": "1a637166-15bb-4a00-92c1-2d2c62b97f9e"
        }]
      },
      "id": "17",
      "data": {"text": "器身", "status": "", "selected": false},
      "zIndex": 17
    }, {
      "position": {"x": -10, "y": -155},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "18a20c30-4ce7-466b-86fe-fc7980806fa0"}, {
          "group": "right",
          "id": "b227a078-3cb0-467f-9b9f-9b209eff6534"
        }, {"group": "bottom", "id": "7b6ed154-74ca-4624-9e31-253e641fa71d"}, {
          "group": "left",
          "id": "aeba8095-dd53-44de-8077-7dded735f1b7"
        }]
      },
      "id": "18",
      "data": {"text": "引线", "status": "", "selected": false},
      "zIndex": 18
    }, {
      "position": {"x": -440, "y": -155},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "d172b515-cb76-403d-9f6b-4aee16f43769"}, {
          "group": "right",
          "id": "defe39c2-f4ad-49d4-bc98-49ccb3b77e73"
        }, {"group": "bottom", "id": "65d3ca3f-c3e3-4938-bec6-13ff169ee004"}, {
          "group": "left",
          "id": "18d13240-8545-4759-b339-d2ed916970d2"
        }]
      },
      "id": "19",
      "data": {"text": "油枕", "status": "", "selected": false},
      "zIndex": 19
    }, {
      "position": {"x": -294, "y": -155},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "4fa5b209-59de-4b8f-8426-dd79a4164727"}, {
          "group": "right",
          "id": "0a3a1e07-7a83-4964-99bf-8753b28c9759"
        }, {"group": "bottom", "id": "5f74c389-0d30-464c-8806-f41f067844cc"}, {
          "group": "left",
          "id": "c97f0ff2-8fe4-4a95-8fb5-1af1b89560ce"
        }]
      },
      "id": "20",
      "data": {"text": "冷却器", "status": "", "selected": false},
      "zIndex": 20
    }, {
      "position": {"x": -150, "y": -80},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "af26b85e-aea6-488e-a256-abe83499a546"}, {
          "group": "right",
          "id": "5fc97686-32c2-4667-86f9-c593d61e8155"
        }, {"group": "bottom", "id": "15461a11-ed44-4db1-baca-800504c02897"}, {
          "group": "left",
          "id": "2f99a411-57b9-4d42-a3d6-56820a9a091e"
        }]
      },
      "id": "21",
      "data": {"text": "油箱", "status": "", "selected": false},
      "zIndex": 21
    }, {
      "position": {"x": -10, "y": -80},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "870eeb92-df32-4770-b956-92255436845f"}, {
          "group": "right",
          "id": "707359bf-28d3-48ea-8585-622ff5a6bc7b"
        }, {"group": "bottom", "id": "ad256d02-6ee0-4ab8-9d82-af982e7e5fe7"}, {
          "group": "left",
          "id": "0715e50e-46b9-4f2d-b7c0-8d72d35ad240"
        }]
      },
      "id": "22",
      "data": {"text": "器身干燥", "status": "", "selected": false},
      "zIndex": 22
    }, {
      "position": {"x": 150, "y": -80},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "e80b108a-7e8a-451b-a41e-5bd92dc3e4d0"}, {
          "group": "right",
          "id": "ac0dff57-7a72-4c43-b8c3-c786a350da2f"
        }, {"group": "bottom", "id": "c559465e-440b-498a-bed3-ac629dc55ea7"}, {
          "group": "left",
          "id": "55d4fe3f-25ba-4aef-adc2-596072bcf756"
        }]
      },
      "id": "23",
      "data": {"text": "CT", "status": "", "selected": false},
      "zIndex": 23
    }, {
      "position": {"x": 290, "y": -80},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "53350f5b-a6d4-4be3-ac27-12d223398aaa"}, {
          "group": "right",
          "id": "b70bc812-9af6-4f8b-809c-09cff4bc85c6"
        }, {"group": "bottom", "id": "2e232141-349e-4841-baa1-8b4e30312a1c"}, {
          "group": "left",
          "id": "74b1bcbc-f87c-4dbe-b3eb-d8ae577661b1"
        }]
      },
      "id": "24",
      "data": {"text": "套管", "status": "", "selected": false},
      "zIndex": 24
    }, {
      "position": {"x": 430, "y": -80},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "7a488a9c-4b82-413e-9c2b-b34cb3a06211"}, {
          "group": "right",
          "id": "656d14f4-fbc1-4213-aea3-87f654ec9265"
        }, {"group": "bottom", "id": "c11350bd-27c2-4b27-9bb6-de476c7705f6"}, {
          "group": "left",
          "id": "1a056e50-ff7e-44ed-b944-e0e0d89b68e1"
        }]
      },
      "id": "25",
      "data": {"text": "片散", "status": "", "selected": false},
      "zIndex": 25
    }, {
      "position": {"x": -10, "y": 5},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "8878bdf5-ce64-4b94-bbd6-79f644d20743"}, {
          "group": "right",
          "id": "159da03d-ab6b-4292-b285-0614a62b6761"
        }, {"group": "bottom", "id": "bab63b76-add1-4911-86c6-cd993c104fad"}, {
          "group": "left",
          "id": "ad8d4cb7-06b3-4e73-bcb6-270f12c8e02d"
        }]
      },
      "id": "26",
      "data": {"text": "总装", "status": "", "selected": false},
      "zIndex": 26
    }, {
      "position": {"x": -10, "y": 90},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "32728834-cce7-4765-96a5-cabaf07a8238"}, {
          "group": "right",
          "id": "8c4de7f0-e16f-4848-9131-bec6d8dcf887"
        }, {"group": "bottom", "id": "8b41ace1-824c-4b85-a213-66aa61c5735c"}, {
          "group": "left",
          "id": "e75930ab-36e1-4975-bb0f-ce5dcd8839dc"
        }]
      },
      "id": "27",
      "data": {"text": "注油、静放", "status": "", "selected": false},
      "zIndex": 27
    }, {
      "position": {"x": -10, "y": 165},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "5240fc30-1b50-4842-a36b-322ddece05cf"}, {
          "group": "right",
          "id": "e1020bfa-85ce-4931-bf60-bd8733f05fcc"
        }, {"group": "bottom", "id": "6eab2877-e0ff-4a02-bf43-00a6fcaa865c"}, {
          "group": "left",
          "id": "3cca705c-4658-4e25-9be7-12c9c06ab182"
        }]
      },
      "id": "28",
      "data": {"text": "试验", "status": "", "selected": false},
      "zIndex": 28
    }, {
      "position": {"x": -10, "y": 250},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "624033c8-4ac3-4427-9806-4d750e0e1ded"}, {
          "group": "right",
          "id": "75c44c19-7543-4602-bc10-e2e50ec800b8"
        }, {"group": "bottom", "id": "529a0f65-1b25-4c14-8433-8b4c93b21b2f"}, {
          "group": "left",
          "id": "2ac33282-cc36-4b9d-8bf6-fa30d0be3afb"
        }]
      },
      "id": "29",
      "data": {"text": "吊芯", "status": "", "selected": false},
      "zIndex": 29
    }, {
      "position": {"x": -10, "y": 320},
      "size": {"width": 96, "height": 55},
      "view": "vue-shape-view",
      "shape": "my-component",
      "ports": {
        "groups": {
          "top": {
            "position": "top",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "right": {
            "position": "right",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "bottom": {
            "position": "bottom",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          },
          "left": {
            "position": "left",
            "attrs": {
              "circle": {
                "r": 4,
                "magnet": true,
                "stroke": "#5F95FF",
                "strokeWidth": 1,
                "fill": "#fff",
                "style": {"visibility": "hidden"}
              }
            }
          }
        },
        "items": [{"group": "top", "id": "7d31a5ff-7249-4b2c-8e5c-9e207d94dca5"}, {
          "group": "right",
          "id": "ada1a934-d007-4e8e-9bb9-327b2a26f929"
        }, {"group": "bottom", "id": "0ae67d62-7a59-4de3-b1a9-1297d8287fcb"}, {
          "group": "left",
          "id": "dfa70e34-3641-4add-88ad-6ae5907305e5"
        }]
      },
      "id": "30",
      "data": {"text": "包装", "status": "", "selected": false},
      "zIndex": 30
    }]
  }
}
