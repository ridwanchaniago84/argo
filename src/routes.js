/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Login from "views/examples/Login.js";
import Satuan from "views/Admin/Satuan.js";
import Pembelian from "views/Admin/Pembelian.js";

var routes = [
  {
    path: "/index",
    name: "Satuan",
    icon: "ni ni-tv-2 text-primary",
    component: Satuan,
    layout: "/admin",
  },
  {
    path: "/pembelian",
    name: "Pembelian",
    icon: "ni ni-cart text-blue",
    component: Pembelian,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
  },
];
export default routes;
