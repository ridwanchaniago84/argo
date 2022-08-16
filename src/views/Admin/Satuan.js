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
  CardBody
} from "reactstrap";
import { useEffect, useState } from 'react';
// core components
import Header from "components/Headers/Header.js";
import TableBoostrap from '../../components/Content/Table';
import { endPoint } from '../../variables/config';
import axios from 'axios';

const Satuan = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.post(`${endPoint}satuan`, {
      page: 1,
      per_page: 10,
      name: ""
    }).then(response => {
      setProducts(response.data.response);
    });
  }, []);

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
  }];

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
                <h3 className="mb-0">Satuan</h3>
              </CardHeader>
              <CardBody>
                <Button className="mb-3 float-right" color="primary">Add</Button>
                <TableBoostrap products={products} columns={columns} />
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Satuan;
