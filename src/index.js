import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from 'react-redux';
import {store} from './Redux/Reducers/index'

import APPRouter from './AppRouter';



ReactDOM.render(
    <Provider store = { store }>
      <APPRouter/>
    </Provider>
    , document.getElementById( 'root' ));
 
