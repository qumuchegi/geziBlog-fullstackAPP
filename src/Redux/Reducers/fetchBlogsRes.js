const fetchBlogsRes = (state = { status: 'Loading……' }, action) =>{
    switch(action.type) {
        case 'FETCH_START': return state;
        case 'FETCH_SUCCESS':return {...state, res: action.res,status: 'success', code: action.code, page: action.page};
        case 'FETCH_FAIL':return {status: 'fail', code: action.code};
        default : return state
    }
}
export default fetchBlogsRes;