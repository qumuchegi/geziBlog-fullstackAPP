import React,{Component} from 'react';
import { If, Then, Else } from 'react-if';
import PropTypes from 'prop-types';
import '../Css/TabItem.css'
 
class TabItem  extends Component{
    constructor(props){
        super(props);
        this.state={
            
        };
        this.handleClick=this.handleClick.bind(this)
    }
    componentDidMount(){
        
    }
    handleClick(){
        this.props.changeTab(this.props.type);
    }
    render(){
        return(
            <div onClick={this.handleClick} 
                 className='bar-item'
                 id={this.props.tabType===this.props.tabshowing?'clicked':'not-clicked'}>
                <If condition={this.props.tabType===this.props.tabshowing}>
                  <Then>
                      <img src={`../img/${this.props.type}-active.svg`} alt='' width="20px"></img>
                  </Then>
                  <Else>
                      <img src={`../img/${this.props.type}.svg`} alt='' width="20px"></img>
                  </Else>
                </If>
               <div className={this.props.tabType===this.props.tabshowing?'clicked':'not-clicked'}>
                  {this.props.children}
               </div>
            </div>
        )
    }
    
}
TabItem.propTypes={
    type:PropTypes.string,
};
export default TabItem;
