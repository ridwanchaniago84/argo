import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getUserData } from '../variables/config';

const RouteGuard = ({ component: Component, ...rest }) => {

    function hasJWT() {
        let flag = false;
        localStorage.getItem("token") ? flag = true : flag = false

        return flag;
    }

    return (
        <Route {...rest}
            render={props => (
                hasJWT() ?
                    <Component {...props} />
                    :
                    <Redirect to={{ pathname: '/auth/login' }} />
            )}
        />
    );
};

export const RouteSatuan = ({ component: Component, ...rest }) => {
    const userData = getUserData();

    return (
        <Route {...rest}
            render={props => (
                userData.previlege[2].Satuan === "True" ?
                    <Component {...props} />
                    :
                    <Redirect to={{ pathname: '/admin/pembelian' }} />
            )}
        />
    );
};

export default RouteGuard;