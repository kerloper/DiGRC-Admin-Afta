import API from "@/services/API";

export class FuncPage {
    listItemsHandler=[]
    constructor(listItemHandler) {
        this.listItemsHandler = listItemHandler
    }

    async getList(runningFilter="false") {
        let resp = await getContainer(runningFilter)
        this.listItemsHandler.value = resp

    }
}
async function getContainer(runningFilter){
    try {
        let { data: resp } = await API.getContainers(runningFilter)
        if (resp.error){
            return null
        }else
            return resp.data
    } catch (e) {

    } finally {

    }
}

export const headers = [
    {
        title: "Title",
        align: "start",
        sortable: false,
        key: "Names"
    },
    {
        title: "Image",
        align: "start",
        sortable: false,
        key: "Image"
    },
    {
        title: "Ports",
        align: "start",
        sortable: false,
        key: "Ports"
    },
    {
        title: "Status",
        align: "start",
        sortable: false,
        key: "Status"
    },
    {
        title: "Network",
        align: "start",
        sortable: false,
        key: "NetworkSettings"
    },
    {
        title: "Labels",
        align: "start",
        sortable: false,
        key: "Labels"
    },
    {
        title: "",
        align: "start",
        sortable: false,
        key: "Actions"
    },

]

export function getContainerLabels(labels) {
    let s = []
    if (labels) {
        for (const [key, value] of Object.entries(labels)) {

            s.push(value)
        }
    }
    return (s.join(" "))
}
export function getIps(labels) {
    let s = []
    if (labels) {
        for (const [key, value] of Object.entries(labels)) {

            s.push(key + (value.IPAddress ? " , " + value.IPAddress : ""))
        }
    }
    return s
}
export function getPorts(labels) {
    let s = []
    if (labels) {
        for (const [key, value] of Object.entries(labels)) {
            s.push((value.IP ? value.IP + ":" : "") + value.PrivatePort)
        }
    }
    return s
}

export async function addContainerToNet(item,cb){
    const name = item.Names[0] ? item.Names[0].replace("/",""): ""
    const nets = getIps(item.NetworkSettings.Networks).filter(el=>{
        if(el.includes('inflow_net')){
            return el
        }
    })
    if (nets.length){
        // console.log(nets)
        return cb()
    }
    let res = await API.addContainerToNet(name,"inflow_net")
    if (res.data){
    }
    cb()
}
export async function startContainer(item,cb){
    if(item.State.includes('run')){
        return cb()
    }
    const name = item.Names[0] ? item.Names[0].replace("/",""): ""
    let {data:res} = await API.startContainer(name)
    if (res.error){
    }
    cb()

}