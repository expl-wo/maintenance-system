export function getData() {
    let formatData = [{
        "id": "1",
        "planStartDate": "2023-11-24 21:00:00",
        "dateEnd": "2023-12-24",
        nodeList: [{
            "id": "a" + "1",
            "nodeDate": "2023-11-30 08:00:00",
            "startDate": "2023-11-25 12:00:00",
        }, {
            "id": "b" + "1",
            "nodeDate": "2023-12-05 08:00:00",
            "startDate": "2023-11-30 12:00:00",
        }, {
            "id": "c" + "1",
            "nodeDate": "2023-12-15 08:00:00",
            "startDate": "2023-12-05 12:00:00",
        }, {
            "id": "d" + "1",
            "nodeDate": "2023-12-20 08:00:00",
            "startDate": "2023-12-15 12:00:00",
        }, {
            "id": "e" + "1",
            "nodeDate": "2023-12-24 08:00:00",
            "startDate": "2023-12-20 12:00:00",
        }]
    }]
    let list = getList();
    list.forEach((item, index) => {
        item.id = formatData[index].id;
        item.planStartDate = formatData[index].planStartDate;
        item.dateEnd = formatData[index].dateEnd;
        item.nodeList.forEach((subItem, subIndex) => {
            subItem.id = formatData[index].nodeList[subIndex].id;
            subItem.nodeDate = formatData[index].nodeList[subIndex].nodeDate;
            subItem.startDate = formatData[index].nodeList[subIndex].startDate;
        })
    })
    let data = {
        "err_code": 10000, "err_msg": null, "total_count": 1, "page_size": 10, "data": list
    }
    return data;
}

function getList() {
    return [{
        id: "",
        "ztBm": null,
        "createDt": null,
        "editDt": null,
        "isDeleted": null,
        "deleteDt": null,
        "creatorId": null,
        "creatorName": null,
        "editorId": null,
        "editorName": null,
        "deleterId": null,
        "deleterName": null,
        "contractNo": "GC-2017-0901",
        "serialCount": 1,
        "customerName": null,
        "dateEnd": "2023-12-24",
        "designSource": null,
        "drawingNo": "1TBEA.710.20815",
        "edition": null,
        "importmentLevel": null,
        "isExportProduct": 0,
        "madeMode": 1,
        "materialName": null,
        "pcModel": "SFPSZ9-150000/220",
        "noTaxAmount": 970000.0,
        "orderIssuedTime": null,
        "outPut": "150000",
        "pauseReason": null,
        "planStartDate": "2023-11-24 21:00:00",
        "productNo": "TBGC170901-1",
        "projectManager": null,
        "projectName": "司崇左供电局220kV下雷站1号主变冷却系统修理等2个项目服务合同",
        "salesEndReply": null,
        "salesPerson": null,
        "salesReply": null,
        "schedulingStatus": 1,
        "schedulingStatusName": "粗排",
        "taxPrice": null,
        "tentativeEndTime": null,
        "tentativeTime": null,
        "timeLimitId": null,
        "trialShop": null,
        "urgentLevel": null,
        "planCompletime": null,
        "timeLimitName": "220kV三相发电机变压器（容量30万以下）",
        "nodeList": [{
            "id": "20231113175713190691000960606106" + "1",
            "ztBm": "C06",
            "createDt": "2023-11-13 17:57:13.013",
            "editDt": "2023-11-13 17:57:13.013",
            "isDeleted": 0,
            "deleteDt": null,
            "creatorId": null,
            "creatorName": null,
            "editorId": null,
            "editorName": null,
            "deleterId": null,
            "deleterName": null,
            "actualStartDate": null,
            "confirmStatus": 0,
            "finishDate": null,
            "isMaterialPreparation": null,
            "materialVersion": null,
            "pnName": null,
            "nodeDate": "2019-03-10 08:00:00",
            "nodeId": "5",
            "nodeName": "绕线绝缘",
            "pausereason": null,
            "productplanId": "20231113175708190691000958169835",
            "status": -1,
            "startDate": "2023-11-25 12:00:00",
            "pnStatus": 0,
            "pnType": 2,
            "usedEquipment": null,
            "wmsMid": null,
            "bomInfo": null,
            "difDay": "1720",
            "finishUserCode": null,
            "finishUserName": null,
            "startUserCode": null,
            "startUserName": null,
            "dversion": 0
        }, {
            "id": "20231113175713190691000960606108",
            "ztBm": "C06",
            "createDt": "2023-11-13 17:57:13.013",
            "editDt": "2023-11-13 17:57:13.013",
            "isDeleted": 0,
            "deleteDt": null,
            "creatorId": null,
            "creatorName": null,
            "editorId": null,
            "editorName": null,
            "deleterId": null,
            "deleterName": null,
            "actualStartDate": null,
            "confirmStatus": 0,
            "finishDate": null,
            "isMaterialPreparation": null,
            "materialVersion": null,
            "pnName": null,
            "nodeDate": "2019-03-10 12:00:00",
            "nodeId": "4",
            "nodeName": "叠片",
            "pausereason": null,
            "productplanId": "20231113175708190691000958169835",
            "status": -1,
            "startDate": "2019-03-10 12:00:00",
            "pnStatus": 0,
            "pnType": 2,
            "usedEquipment": null,
            "wmsMid": null,
            "bomInfo": null,
            "difDay": "1720",
            "finishUserCode": null,
            "finishUserName": null,
            "startUserCode": null,
            "startUserName": null,
            "dversion": 0
        }, {
            "id": "20231113175713190691000959773724",
            "ztBm": "C06",
            "createDt": "2023-11-13 17:57:13.013",
            "editDt": "2023-11-13 17:57:13.013",
            "isDeleted": 0,
            "deleteDt": null,
            "creatorId": null,
            "creatorName": null,
            "editorId": null,
            "editorName": null,
            "deleterId": null,
            "deleterName": null,
            "actualStartDate": null,
            "confirmStatus": 0,
            "finishDate": null,
            "isMaterialPreparation": null,
            "materialVersion": null,
            "pnName": null,
            "nodeDate": "2019-04-27 01:00:00",
            "nodeId": "79",
            "nodeName": "附件发货",
            "pausereason": null,
            "productplanId": "20231113175708190691000958169835",
            "status": -1,
            "startDate": "2019-04-27 00:00:00",
            "pnStatus": 0,
            "pnType": 2,
            "usedEquipment": null,
            "wmsMid": null,
            "bomInfo": null,
            "difDay": "1672",
            "finishUserCode": null,
            "finishUserName": null,
            "startUserCode": null,
            "startUserName": null,
            "dversion": 0
        }, {
            "id": "20231113175713190691000960606107",
            "ztBm": "C06",
            "createDt": "2023-11-13 17:57:13.013",
            "editDt": "2023-11-13 17:57:13.013",
            "isDeleted": 0,
            "deleteDt": null,
            "creatorId": null,
            "creatorName": null,
            "editorId": null,
            "editorName": null,
            "deleterId": null,
            "deleterName": null,
            "actualStartDate": null,
            "confirmStatus": 0,
            "finishDate": null,
            "isMaterialPreparation": null,
            "materialVersion": null,
            "pnName": null,
            "nodeDate": "2019-05-05 00:00:00",
            "nodeId": "20",
            "nodeName": "入炉",
            "pausereason": null,
            "productplanId": "20231113175708190691000958169835",
            "status": -1,
            "startDate": "2019-05-02 00:00:00",
            "pnStatus": 0,
            "pnType": 2,
            "usedEquipment": null,
            "wmsMid": null,
            "bomInfo": null,
            "difDay": "1664",
            "finishUserCode": null,
            "finishUserName": null,
            "startUserCode": null,
            "startUserName": null,
            "dversion": 0
        }, {
            "id": "20231113175713190691000960606109",
            "ztBm": "C06",
            "createDt": "2023-11-13 17:57:13.013",
            "editDt": "2023-11-13 17:57:13.013",
            "isDeleted": 0,
            "deleteDt": null,
            "creatorId": null,
            "creatorName": null,
            "editorId": null,
            "editorName": null,
            "deleterId": null,
            "deleterName": null,
            "actualStartDate": null,
            "confirmStatus": 0,
            "finishDate": null,
            "isMaterialPreparation": null,
            "materialVersion": null,
            "pnName": null,
            "nodeDate": "2019-05-05 00:00:00",
            "nodeId": "23",
            "nodeName": "试验",
            "pausereason": null,
            "productplanId": "20231113175708190691000958169835",
            "status": -1,
            "startDate": "2019-05-02 00:00:00",
            "pnStatus": 0,
            "pnType": 2,
            "usedEquipment": null,
            "wmsMid": null,
            "bomInfo": null,
            "difDay": "1664",
            "finishUserCode": null,
            "finishUserName": null,
            "startUserCode": null,
            "startUserName": null,
            "dversion": 0
        }],
        "processStatus": "delay",
        "actualStartTime": null,
        "inHead": null,
        "duration": null,
        "voltageLevel": null,
        "planCount": null,
        "outputPlan": null,
        "actualCount": null,
        "outputActual": null,
        "planEndTime": null,
        "orderTypeValue": null,
        "productNoMain": null,
        "orderTypeName": null,
        "coilCnt": null,
        "capacity": null,
        "weekId": null,
        "planStatus": null,
        "selectAble": null,
        "isRepair": null,
        "limitRelation": null,
        "dversion": null
    }];

}
