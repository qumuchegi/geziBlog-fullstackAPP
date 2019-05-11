const history = (state = [{route:'/',name:'首页'}],action) => {
    switch(action.type){
        case 'ADD_HISTORY': {
            console.log('添加历史:',action)
            return [...state,{route:action.route, name:action.name}];
        }
        case 'DELETE_HISTORY': {
            console.log('删除历史回退:',action)
            if(action.index < 0 ) return state
            if(action.index === 0 ) return state.slice(0, 1 )
            else
            return state.slice(0, action.index + 1 )
        }
        default : return state
    }
}
export default history