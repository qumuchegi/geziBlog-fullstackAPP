const TabTypeShowing = (state = 'SHOUYE', action ) => {
    switch ( action.type ) {
        case 'SHOW_TAB_TYPE': return action.Tabtype;
        default: return state
    }
}
export default TabTypeShowing