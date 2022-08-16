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
    const [active, setActive] = useState(0);
    const [filtered, setFiltered] = useState([]);
    const [isShow, setIsShow] = useState(false);
    const [input, setInput] = useState("");

    const [items, getItems] = useState([]);
    const [selectedSatuan, setSelectedSatuan] = useState(0);
    const [satuan, setSatuan] = useState([]);
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
        }).then(async response => {
            let stateItem = [];

            await Promise.all(response.data.response_data.map(async (data) => {
                const satuan = await getSatuan(data.satuan);
                stateItem = [...stateItem, {
                    item_id: data.item_id,
                    qty: data.qty,
                    description: data.description,
                    data: {
                        name: data.item_name,
                        harga: data.harga
                    },
                    satuan: satuan
                }];
            }));

            setSavedItems(stateItem);
        })
    }

    useEffect(() => {
        axios.post(`${endPoint}satuan`, {
            page: 1,
            per_page: 10,
            name: ""
        }).then(response => {
            setSatuan(response.data.response);
        });

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

    const getItemData = () => {
        axios.post(`${endPoint}item`, {
            page: 1,
            per_page: 1,
            name: input
        }).then(async response => {
            const length = response.data.response.length;
            if (length === 0)
                return;

            const idItem = response.data.response[0].id;
            const idSatuan = parseInt(selectedSatuan) === 0 ? satuan[0].id : selectedSatuan;

            axios.get(`${endPoint}item/${idItem}`)
                .then(async response => {
                    const satuan = await getSatuan(idSatuan);

                    return {
                        item: response.data.response,
                        satuan: satuan
                    };
                }).then((data) => {
                    let stateItem = [...savedItems, {
                        item_id: idItem,
                        qty: parseInt(quantity),
                        description: description,
                        data: data.item,
                        satuan: data.satuan
                    }];

                    setTotalPrice(totalPrice + data.item.harga * parseInt(quantity));
                    setSavedItems(stateItem);
                });
        });
    }

    const saveItem = () => {
        if (quantity === '' || quantity <= 0)
            return;

        // let haveSameData = savedItems.find(object => object.item_id === selectedItem.value);
        // if (haveSameData !== undefined)
        //     return;

        getItemData();
    }

    const onChange = e => {
        const input = e.currentTarget.value;

        axios.post(`${endPoint}item`, {
            page: 1,
            per_page: 10,
            name: input
        }).then(async response => {
            let suggests = [];

            await Promise.all(response.data.response.map((data) => {
                suggests = [...suggests, data.name]
            }));

            setActive(0);
            setFiltered(suggests);
            setIsShow(true);
        });

        setInput(e.currentTarget.value);
    };
    const onClick = e => {
        setActive(0);
        setFiltered([]);
        setIsShow(false);
        setInput(e.currentTarget.innerText)
    };
    const onKeyDown = e => {
        if (e.keyCode === 13) { // enter key
            setActive(0);
            setIsShow(false);
            setInput(filtered[active])
        }
        else if (e.keyCode === 38) { // up arrow
            return (active === 0) ? null : setActive(active - 1);
        }
        else if (e.keyCode === 40) { // down arrow
            return (active - 1 === filtered.length) ? null : setActive(active + 1);
        }
    };

    const AutoCompleTes = () => {
        if (isShow && input) {
            if (filtered.length) {
                return (
                    <ul className="autocomplete">
                        {filtered.map((suggestion, index) => {
                            let className;
                            if (index === active) {
                                className = "active";
                            }
                            return (
                                <li key={index} className={className} onClick={onClick}>
                                    {suggestion}
                                </li>
                            );
                        })}
                    </ul>
                );
            } else {
                return (
                    <div className="no-autocomplete">
                        <em>Not found</em>
                    </div>
                );
            }
        }
        return <></>;
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
                                            {/* <Select options={items} placeholder="Item ..." onChange={setSelectedItem} />
                                             */}
                                            <Input
                                                placeholder="Item ..."
                                                type="text"
                                                style={{ height: 38 }}
                                                onChange={onChange}
                                                onKeyDown={onKeyDown}
                                                value={input}
                                            />
                                            <AutoCompleTes />
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
                                                Satuan
                                            </Label>
                                            <Input
                                                onChange={(e) => setSelectedSatuan(e.target.value)}
                                                name="satuan"
                                                type="select"
                                            >
                                                {satuan.map((data, key) => {
                                                    return (
                                                        <option key={key} value={data.id}>{data.name}</option>
                                                    );
                                                })}
                                            </Input>
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
