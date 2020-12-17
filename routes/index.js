import _ from 'lodash';
import {Octokit} from '@octokit/rest';

const sampleJson=[];

//function to parse the json input and produce output according to children
const parseJson = (jsonInput) => {
    try{
        let data=Object.values({...jsonInput});
        for(let i = data.length-1; i>0; i--){
            let j=0, k=0;
            while(j<data[i].length){
                if(data[i][j].parent_id === data[i-1][k].id){
                    data[i-1][k].children.push(data[i][j]);
                    j++;
                    k=0;
                }
                else{
                    k++;
                }
            }
            _.pull(data,data[i])
        }
        return _.flattenDeep(data)[0];
    }
    catch(error){
        console.log(error.message)
        throw new Error(error.message);
    };
};

//routes exported
module.exports=[
    {
        method: ['POST','GET'],
        path: '/',
        handler: async (request, h) => {
            let response = {};
            if(request.method === 'post'){
                sampleJson.push({...request.payload});
                response.status = 201;
                response.msg = 'Success';
                response.description = 'Posted json'
            }
            else{
                response.status = 200;
                response.msg = 'Success';
                response.data = await parseJson(sampleJson[0]);
            }
            return response;
        }
    },
    {
        method:['GET'],
        path: '/search',
        handler: async(request, h)=>{
            let response = {};
            const q = request.query.q;
            const per_page=request.query.limit
            const page = request.query.page
            const octokit = new Octokit();
            const result = await octokit.search.repos({
                q,
                per_page,
                page,
            });
            if(result.status === 200) {
                response.status = 200,
                response.msg = 'Success';
                response.data = result.data;
            }
            else {
                response.status = 400,
                response.msg = 'failed';
                response.data = [];
            }
            return response;
        },
        config:{
            cors: {
                origin: ['*'],
                headers: ['Access-Control-Allow-Headers', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization','Access-Control-Allow-Origin']
            }
        }
    }
];