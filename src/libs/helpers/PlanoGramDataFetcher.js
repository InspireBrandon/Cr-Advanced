import axios from "axios"

class PlanoGramDataFetcher {
    constructor(){

    }
    // GET api/SystemFile?db={db}&id={id}


    getPlanoData(db,id,callback){
        axios.get(process.env.VUE_APP_API +`SystemFile/JSON?db=${db}&id=${id}`).then(r=>{
            callback(r)
            return r
        })
    }
}

export default PlanoGramDataFetcher