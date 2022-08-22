import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getUserData } from '../variables/config';

export const RouteWriteGuardPembelian = ({ component: Component, ...rest }) => {
    const userData = getUserData();

    return (
        <Route {...rest}
            render={props => (
                userData.previlege[1]['Detail Akses Pembelian'].Create === "True" ?
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
                userData.previlege[1]['Detail Akses Pembelian'].Read === "True" ?
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
                userData.previlege[1].Pembelian === "True" ?
                    <Component {...props} />
                    :
                    <Redirect to={{ pathname: '/' }} />
            )}
        />
    );
};

export default RouteGuardPembelian;