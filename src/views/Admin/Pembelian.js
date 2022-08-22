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
// reactstrap components
import {
  Card,
  CardHeader,
  Container,
  Row,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CardBody
} from "reactstrap";
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
// core components
import Header from "components/Headers/Header.js";
import { endPoint, getUserData } from '../../variables/config';
import axios from 'axios';
import TableBoostrap from '../../components/Content/Table';
import { formatRupiah } from '../../variables/config';

const Pembelian = () => {
  const userData = getUserData();
  const [products, setProducts] = useState([]);
  const [pembelian, setPembelian] = useState([]);
  const [activeTab, setActiveTab] = useState(userData.previlege[0].Item === "True" ? "1" : "2");

  useEffect(() => {
    axios.post(`${endPoint}item`, {
      page: 1,
      per_page: 10,
      name: ""
    })
      .then(response => {
        setProducts(response.data.response);
      });

    axios.post(`${endPoint}pembelian`, {
      page: 1,
      per_page: 10
    })
      .then(response => {
        setPembelian(response.data.response);
      });
  }, []);

  const ButtonUpdate = (props) => {
    if (userData.previlege[1]['Detail Akses Pembelian'].Create === "True") {
      return (
        <Button
          color="primary"
          onClick={() => {
            window.location.href = `/admin/beli/${props.id}`;
          }}>
          Update
        </Button>
      );
    }
    return (
      <></>
    )
  }

  const ButtonDetail = (props) => {
    if (userData.previlege[1]['Detail Akses Pembelian'].Read === "True") {
      return (
        <Button
          color="secondary"
          onClick={() => {
            window.location.href = `/admin/view/beli/${props.id}`;
          }}>
          View
        </Button>
      );
    }
    return (
      <></>
    )
  }

  const columns = [{
    dataField: 'id',
    text: 'text',
    hidden: true
  },
  {
    dataField: 'name',
    text: 'Nama'
  }, {
    dataField: 'description',
    text: 'Deskripsi'
  },
  {
    dataField: 'satuan',
    text: 'Satuan'
  },
  {
    dataField: 'harga',
    text: 'Harga',
    formatter: (value) => formatRupiah(value)
  },
  ];

  const columnPembelian = [{
    dataField: 'id',
    text: 'text',
    hidden: true
  },
  {
    dataField: 'username',
    text: 'Nama'
  }, {
    dataField: 'description',
    text: 'Deskripsi'
  },
  {
    dataField: 'qty_total',
    text: 'Quantity'
  },
  {
    dataField: 'price_total',
    text: 'Harga Total',
    formatter: (value) => formatRupiah(value)
  },
  {
    isDummyField: true,
    text: 'Aksi',
    formatter: (cell, row, rowIndex) => {
      return <>
        <ButtonUpdate id={row.id} />
        <ButtonDetail id={row.id} />
      </>
    }
  },
  ];

  const NavItemPriv = () => {
    if (userData.previlege[0].Item === "True") {
      return (
        <NavItem>
          <NavLink
            className={activeTab === "1" ? "active" : ''}
            onClick={() => setActiveTab("1")}
          >
            Item
          </NavLink>
        </NavItem>
      )
    }
    return (
      <></>
    )
  }

  const AddItem = () => {
    if (userData.previlege[0]['Detail Akses Item'].Create === "True") {
      return (
        <Link
          to="/admin/item/create"
        >
          <Button className="my-3 float-right" color="primary">Add</Button>
        </Link>
      );
    }
    return (
      <></>
    )
  }

  const TableItem = () => {
    if (userData.previlege[0].Item === "True") {
      return (
        <TabPane tabId="1">
          <AddItem />
          <TableBoostrap products={products} columns={columns} />
        </TabPane>
      )
    }
    return (
      <></>
    )
  }

  const NavPembelianPriv = () => {
    if (userData.previlege[1].Pembelian === "True") {
      return (
        <NavItem>
          <NavLink
            className={activeTab === "2" ? "active" : ''}
            onClick={() => setActiveTab("2")}
          >
            Pembelian
          </NavLink>
        </NavItem>
      )
    }
    return (
      <></>
    )
  }

  const AddPembelian = () => {
    if (userData.previlege[1]['Detail Akses Pembelian'].Create === "True") {
      return (
        <Link
          to="/admin/beli/create"
        >
          <Button className="my-3 float-right" color="primary">Add</Button>
        </Link>
      );
    }
    return (
      <></>
    )
  }

  const TablePembelian = () => {
    if (userData.previlege[1].Pembelian === "True") {
      return (
        <TabPane tabId="2">
          <AddPembelian />
          <TableBoostrap products={pembelian} columns={columnPembelian} />
        </TabPane>
      )
    }
    return (
      <></>
    )
  }

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Pembelian</h3>
              </CardHeader>
              <CardBody>
                <Nav tabs>
                  <NavItemPriv />
                  <NavPembelianPriv />
                </Nav>
                <TabContent activeTab={activeTab}>
                  <TableItem />
                  <TablePembelian />
                </TabContent>
              </CardBody>

            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Pembelian;
