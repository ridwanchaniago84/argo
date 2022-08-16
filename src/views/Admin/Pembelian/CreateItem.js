import Header from "components/Headers/Header.js";
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
    CardBody, Button
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from 'react';
import { endPoint } from '../../../variables/config';
import axios from 'axios';
import { Link } from "react-router-dom";

const CreateItem = () => {
    const [satuan, setSatuan] = useState([]);

    const {
        control,
        handleSubmit,
        // formState: { errors }
    } = useForm();

    const onSubmit = (data) => {
        const idSatuan = parseInt(data.satuan) === 0 ? satuan[0].id : data.satuan;

        axios.post(`${endPoint}item/save`, {
            name: data.name,
            description: data.description,
            satuan: parseInt(idSatuan),
            harga: parseInt(data.harga),
            active_flag: 1
        }).then(() => {
            window.location.href = '/admin/pembelian';
        });
    };

    useEffect(() => {
        axios.post(`${endPoint}satuan`, {
            page: 1,
            per_page: 10,
            name: ""
        }).then(response => {
            setSatuan(response.data.response);

        });
    }, []);

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
                                <h3 className="mb-0">Create Item</h3>
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
                                                    defaultValue=""
                                                    rules={{ required: true }}
                                                    render={({ field: { ref, onChange, ...field } }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Nama"
                                                            type="text"
                                                            autoComplete="name"
                                                            innerRef={ref}
                                                            onChange={({ target: { value } }) => onChange(value)}
                                                        />
                                                    )}
                                                />

                                            </InputGroup>
                                        </FormGroup>

                                        <FormGroup>
                                            <Label>
                                                Satuan
                                            </Label>
                                            <Controller
                                                name="satuan"
                                                control={control}
                                                defaultValue={satuan.length === 0 ? "0" : satuan[0].id}
                                                rules={{ required: true }}
                                                render={({ field: { ref, onChange, ...field } }) => (
                                                    <Input
                                                        {...field}
                                                        innerRef={ref}
                                                        onChange={({ target: { value } }) => onChange(value)}
                                                        name="satuan"
                                                        type="select"
                                                    >
                                                        {satuan.map((data, key) => {
                                                            return (
                                                                <option key={key} value={data.id}>{data.name}</option>
                                                            );
                                                        })}
                                                    </Input>
                                                )}
                                            />

                                        </FormGroup>

                                        <FormGroup>
                                            <Label>
                                                Harga
                                            </Label>
                                            <InputGroup>
                                                <Controller
                                                    name="harga"
                                                    control={control}
                                                    defaultValue=""
                                                    rules={{ required: true }}
                                                    render={({ field: { ref, onChange, ...field } }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Harga"
                                                            type="number"
                                                            autoComplete="harga"
                                                            innerRef={ref}
                                                            onChange={({ target: { value } }) => onChange(value)}
                                                        />
                                                    )}
                                                />

                                            </InputGroup>
                                        </FormGroup>
                                    </Col>
                                    <Col lg="6">
                                        <FormGroup>
                                            <Label>
                                                Deskripsi
                                            </Label>
                                            <InputGroup>
                                                <Controller
                                                    name="description"
                                                    control={control}
                                                    defaultValue=""
                                                    // rules={{ required: true }}
                                                    render={({ field: { ref, onChange, ...field } }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Deskripsi"
                                                            type="textarea"
                                                            rows="5"
                                                            autoComplete="description"
                                                            innerRef={ref}
                                                            onChange={({ target: { value } }) => onChange(value)}
                                                        />
                                                    )}
                                                />

                                            </InputGroup>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg="6">
                                        <Button color="primary" onClick={handleSubmit(onSubmit)}>Save</Button>
                                        <Link to="/admin/pembelian">
                                            <Button color="danger">Cancel</Button>
                                        </Link>
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

export default CreateItem;
