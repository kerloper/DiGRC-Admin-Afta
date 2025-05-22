export const InflowNodeType = {
    RouterNode: "routerNodeType",
    RouterIFNode: "routerIfType",
    RegularNode: "regularNodeType",
    StartNode: "startNodeType",
    RestCallNode: "restNodeType",
    JsCodeNode: "jsNodeType",
    GoToNode: "gotoNodeType",
    Template: "template",
}

export const rawRuleIFCondition = {
    nodeType: "",
    vfId: "",
    "path": [

    ],
    "formId": "",
    "proc": [

    ],
    "if": {
        "op": "=",
        "result": 0,
        "conditions": [
        ]
    },
    "description": "",
    proc_next: null,
    "next": { "policyId": "", rule: "" }
}

export const rawRuleApiCall = {
    nodeType: "",
    ext_resource:{
        title: "",
        formId: "",
        proto_type:"raw",
        method:"post",
        bodyForm:"",
        url: "",
        headers: [],
        jsonpath:"",
        params:null,
        description: ""
    },
    vfId: "",
    "path": [

    ],
    "formId": "",
    "proc": [

    ],
    "if": {
        "op": "=",
        "result": 0,
        "conditions": [
        ]
    },
    "description": "",
    proc_next: null,
    "next": { "policyId": "", rule: "" }
}

export const rawRuleJSNode = {
    nodeType: "",
    vfId: "",
    prog:{src:""},
    "path": [ ],
    "formId": "",
    "proc": [  ],
    "if": {
        "op": "=",
        "result": 0,
        "conditions": [
        ]
    },
    "description": "",
    proc_next: null,
    "next": { "policyId": "", rule: "" }
}

export const rawRule = {
    nodeType: "",
    vfId: "",
    "path": [

    ],
    "formId": "",
    "proc": [
    ],
    "if": {
        "op": "=",
        "result": 0,
        "conditions": [
        ]
    },
    "description": "",
    proc_next: null,
    "next": { "policyId": "", rule: "" }
}

export const genId = function (salt = "") {
    return `i${salt}_node_${new Date().getTime() + Math.floor(Math.random() * 16)}`
}

export const RouterIfNodeStyle = { backgroundColor: 'rgba(23, 35, 129, 0.5)', width: "200px", height: "45px" }
