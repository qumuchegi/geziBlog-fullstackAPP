import axios from './axios.config'
import qs from 'querystring'
 

let url = "http://localhost:3001" 
let token = localStorage.getItem("token");
if(token){
    axios.defaults.headers.common['Authorization'] = token
}
export default {
    async get(route='/', data={}) {
        let params = qs.stringify( data )
        if(params) params = '?' + params
        console.log(axios)
        return this.apiResponse( await axios.get( url + route + params))
    },
    async post(route='/', data = {} ) {
        return this.apiResponse( await axios.post( url + route, data  ))
    },
    apiResponse(res) {
        let {status, data} = res
        console.log( "status", status, 'data', data);
        return data
    }
}