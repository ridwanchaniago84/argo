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
    InputGroup,
    CardBody,
    Button,
    Table
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from 'react';
import { endPoint, formatRupiah } from '../../../variables/config';
import axios from 'axios';
import Select from 'react-select'

const UpdateBeli = () => {
    const [items, getItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState({
        value: '',
        label: ''
    });
    const [savedItems, setSavedItems] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [description, setDescription] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [defaultData, setDefaultData] = useState({
        username: '',
        description: '',
        price_total: 0
    });
    const params = useParams();

    const {
        control,
        handleSubmit,
        // formState: { errors }
    } = useForm();

    const onSubmit = (data) => {
        let dataItems = [];
        savedItems.map((dataItem) => dataItems = [...dataItems, { item_id: dataItem.item_id, qty: dataItem.qty, description: dataItem.description }]);

        axios.post(`${endPoint}pembelian/update/${params.beliId}`, {
            username: defaultData.username,
            description: data.description === "" ? defaultData.description : data.description,
            items: dataItems,
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(() => {
            window.location.href = '/admin/pembelian';
        });
    };

    const getItemDataSaved = () => {
        axios.post(`${endPoint}pembelian/list-item`, {
            kode_pembelian: params.beliId
        }).then(response => {
            response.data.response_data.map(async (data) => {
                const satuan = await getSatuan(data.satuan);

                let stateItem = [...savedItems, {
                    item_id: data.item_id,
                    qty: data.qty,
                    description: data.description,
                    data: {
                        name: data.item_name,
                        harga: data.harga
                    },
                    satuan: satuan
                }];

                setSavedItems(stateItem);
            });
        })
    }

    useEffect(() => {
        axios.get(`${endPoint}pembelian/get/${params.beliId}`).then((response) => {
            setDefaultData(response.data.response_data);
            setTotalPrice(response.data.response_data.price_total);
            getItemDataSaved();
        });

        axios.post(`${endPoint}item`, {
            page: 1,
            per_page: 10,
            name: ""
        }).then((response) => {
            let state = [];
            response.data.response.map((data) => state = [...state, { value: data.id, label: data.name }]);

            getItems(state);
        });
        // eslint-disable-next-line
    }, []);

    const getSatuan = (id) => new Promise((resolve) => {
        axios.get(`${endPoint}satuan/${id}`)
            .then(response => {
                resolve(response.data.response);
            });
    });

    const deleteItem = (id) => {
        let array = [...savedItems];

        let index = array.findIndex(object => {
            return object.item_id === id;
        });

        if (index !== -1) {
            setTotalPrice(totalPrice - array[index].data.harga * array[index].qty);
            array.splice(index, 1);
            setSavedItems(array);
        }
    }

    const getItemData = (quantityItem, desciptionItem, idItem) => {
        axios.get(`${endPoint}item/${idItem}`)
            .then(async response => {
                const satuan = await getSatuan(response.data.response.satuan);

                return {
                    item: response.data.response,
                    satuan: satuan
                };
            }).then((data) => {
                let stateItem = [...savedItems, {
                    item_id: idItem,
                    qty: parseInt(quantityItem),
                    description: desciptionItem,
                    data: data.item,
                    satuan: data.satuan
                }];

                setTotalPrice(totalPrice + data.item.harga * parseInt(quantityItem));
                setSavedItems(stateItem);
            });
    }

    const saveItem = (quantityItem = quantity, desciptionItem = description, idItem = selectedItem.value) => {
        if (quantity === '' || quantity <= 0)
            return;

        let haveSameData = savedItems.find(object => object.item_id === selectedItem.value);
        if (haveSameData !== undefined)
            return;

        getItemData(quantityItem, desciptionItem, idItem);
    }

    return (
        <>
            <Header />=
            <Container className="mt--7" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">Update Pembelian</h3>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col lg="6">
                                        <FormGroup>
                                            <Label>
                                                Nama
                                            </Label>
                                            <InputGroup>
                                                <Controller
                                                    name="name"
                                                    control={control}
                                                    defaultValue={defaultData.username}
                                                    // rules={{ required: true }}
                                                    render={({ field: { ref, onChange, ...field } }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Nama"
                                                            type="text"
                                                            autoComplete="name"
                                                            innerRef={ref}
                                                            disabled
                                                            value={defaultData.username}
                                                            onChange={({ target: { value } }) => onChange(value)}
                                                        />
                                                    )}
                                                />

                                            </InputGroup>
                                        </FormGroup>
                                    </Col>
                                    <Col lg="12">
                                        <FormGroup>
                                            <Label>
                                                Deskripsi
                                            </Label>
                                            <InputGroup>
                                                <Controller
                                                    name="description"
                                                    control={control}
                                                    defaultValue={defaultData.description}
                                                    // rules={{ required: true }}
                                                    render={({ field: { ref, onChange, ...field } }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Deskripsi"
                                                            type="textarea"
                                                            rows="2"
                                                            autoComplete="description"
                                                            innerRef={ref}
                                                            value={defaultData.description}
                                                            onChange={({ target: { value } }) => onChange(value)}
                                                        />
                                                    )}
                                                />

                                            </InputGroup>
                                        </FormGroup>
                                    </Col>
                                    <Col xs="12">
                                        <hr />
                                    </Col>

                                    <Col xl="10">
                                        <FormGroup>
                                            <Label>
                                                Item
                                            </Label>
                                            <Select options={items} placeholder="Item ..." onChange={setSelectedItem} />
                                        </FormGroup>
                                    </Col>
                                    <Col xl="2">
                                        <FormGroup>
                                            <Label>
                                                Quantity
                                            </Label>
                                            <Input
                                                placeholder="Quantity"
                                                type="number"
                                                style={{ height: 38 }}
                                                onChange={(e) => setQuantity(e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xl="12">
                                        <FormGroup>
                                            <Label>
                                                Deskripsi
                                            </Label>
                                            <Input
                                                placeholder="Deskripsi"
                                                type="textarea"
                                                rows="2"
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col xl="12">
                                        <Button color="primary" className="mb-3" onClick={() => saveItem()}>Add</Button>
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
                                                    <th>Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    savedItems.map((savedItem, key) => {
                                                        return (
                                                            <tr key={key}>
                                                                <td>{savedItem.data.name}</td>
                                                                <td>{savedItem.satuan.name}</td>
                                                                <td>{savedItem.qty}</td>
                                                                <td>{formatRupiah(savedItem.data.harga)}</td>
                                                                <td>{formatRupiah(savedItem.data.harga * savedItem.qty)}</td>
                                                                <td>
                                                                    <Button color="danger" onClick={() => deleteItem(savedItem.item_id)}>Delete</Button>
                                                                </td>
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
                                                value={totalPrice}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg="6" className="mt-3">
                                        <Button color="primary" onClick={handleSubmit(onSubmit)}>Save</Button>
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

export default UpdateBeli;
