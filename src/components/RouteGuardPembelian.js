import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getUserData } from '../variables/config';

const RouteGuardPembelian = ({ component: Component, ...rest }) => {
    const userData = getUserData();

    return (
        <Route {...rest}
            render={props => (
                userData.previlege[1].Pembelian ?
                    <Component {...props} />
                    :
                    <Redirect to={{ pathname: '/' }} />
            )}
        />
    );
};

export default RouteGuardPembelian;