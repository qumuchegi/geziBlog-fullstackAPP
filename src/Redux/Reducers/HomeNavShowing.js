const HomeNavShowing = (state = 'BLOG',action) => {
    switch(action.type) {
        case 'SHOW_HOME_NAV':return action.navShowing;
        default:return state
    }
}
export default HomeNavShowing