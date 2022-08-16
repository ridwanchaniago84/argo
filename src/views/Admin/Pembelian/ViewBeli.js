import Header from "components/Headers/Header.js";
import { useParams } from 'react-router-dom';
import {
    Card,
    CardHeader,
    Container,
    Row,
    Col,
    FormGroup,
    Input,
    Label,
    CardBody,
    Table
} from "reactstrap";
import { useEffect, useState } from 'react';
import { endPoint, formatRupiah } from '../../../variables/config';
import axios from 'axios';

const ViewBeli = () => {
    const [savedItems, setSavedItems] = useState([]);
    const [defaultData, setDefaultData] = useState({
        username: '',
        description: '',
        price_total: 0
    });
    const params = useParams();

    const getItemData = () => {
        axios.post(`${endPoint}pembelian/list-item`, {
            kode_pembelian: params.beliId
        }).then(response => {
            response.data.response_data.map(async (data) => {
                const satuan = await getSatuan(data.satuan);

                let stateItem = [...savedItems, {
                    item_id: data.item_id,
                    qty: data.qty,
                    description: data.description,
                    data: data,
                    satuan: satuan
                }];

                setSavedItems(stateItem);
            });
        })
    }

    useEffect(() => {
        axios.get(`${endPoint}pembelian/get/${params.beliId}`).then((response) => {
            setDefaultData(response.data.response_data);

            getItemData();
        });
        // eslint-disable-next-line
    }, []);

    const getSatuan = (id) => new Promise((resolve) => {
        axios.get(`${endPoint}satuan/${id}`)
            .then(response => {
                resolve(response.data.response);
            });
    });

    return (
        <>
            <Header />=
            <Container className="mt--7" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">Detail Pembelian</h3>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col lg="6">
                                        <p>Nama: {defaultData.username}</p>
                                    </Col>
                                    <Col lg="12">
                                        <p>Deskripsi: {defaultData.description}</p>
                                    </Col>
                                    <Col xs="12">
                                        <hr />
                                    </Col>

                                    <Col xs="12">
                                        <Table className="align-items-center table-flush" responsive>
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Satuan</th>
                                                    <th>QTY</th>
                                                    <th>Harga</th>
                                                    <th>Sub Harga</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    savedItems.map((savedItem, key) => {
                                                        return (
                                                            <tr key={key}>
                                                                <td>{savedItem.data.item_name}</td>
                                                                <td>{savedItem.satuan.name}</td>
                                                                <td>{savedItem.qty}</td>
                                                                <td>{formatRupiah(savedItem.data.harga)}</td>
                                                                <td>{formatRupiah(savedItem.data.harga * savedItem.qty)}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                    </Col>
                                    <Col xs="9">
                                        <FormGroup className="mt-4">
                                            <Label className="text-right float-right">
                                                Total Harga:
                                            </Label>
                                        </FormGroup>
                                    </Col>
                                    <Col xs="3">
                                        <FormGroup className="mt-3">
                                            <Input
                                                placeholder="Total Harga"
                                                type="number"
                                                disabled
                                                value={defaultData.price_total}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
}

export default ViewBeli;
