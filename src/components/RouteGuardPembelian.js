import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getUserData } from '../variables/config';

export const RouteWriteGuardPembelian = ({ component: Component, ...rest }) => {
    const userData = getUserData();

    return (
        <Route {...rest}
            render={props => (
                userData.previlege[1]['Detail Akses Item'].Create ?
                    <Component {...props} />
                    :
                    <Redirect to={{ pathname: '/' }} />
            )}
        />
    );
};

export const RouteReadGuardPembelian = ({ component: Component, ...rest }) => {
    const userData = getUserData();

    return (
        <Route {...rest}
            render={props => (
                userData.previlege[1]['Detail Akses Item'].Read ?
                    <Component {...props} />
                    :
                    <Redirect to={{ pathname: '/' }} />
            )}
        />
    );
};

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