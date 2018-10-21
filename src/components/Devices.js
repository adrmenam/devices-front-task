import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import {ListGroup, ListGroupItem, Modal} from 'react-bootstrap';
import {ButtonGroup, Button} from 'react-bootstrap';
import Select from 'react-select';

const typeOptions = [
    { value: '!', label: 'All' },
    { value: 'WINDOWS_WORKSTATION', label: 'Windows Workstation' },
    { value: 'WINDOWS_SERVER', label: 'Windows Server' },
    { value: 'MAC', label: 'MAC' }
];

const typeOptionsModal = [
    { value: 'WINDOWS_WORKSTATION', label: 'Windows Workstation' },
    { value: 'WINDOWS_SERVER', label: 'Windows Server' },
    { value: 'MAC', label: 'MAC' }
];

const sortOptions = [
    { value: 'system_name', label: 'System Name' },
    { value: 'hdd_capacity', label: 'HDD Capacity' }
];


class Devices extends Component {

    constructor() {
        super();
        this.state = {
            devices: [],
            selectedType: typeOptions[0],
            selectedSort: null,
            selectedDevice: {system_name: '', type: typeOptionsModal[0].value, hdd_capacity: ''},
            selectedTypeModal: typeOptionsModal[0],
            showModal: false,
            showNewModal: false,
            modalMethod: null
        };

        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleSaveDevice = this.handleSaveDevice.bind(this);

    }

    componentDidMount() {
        this.getData();
    }

    getData(){
        fetch('http://localhost:3000/devices')
            .catch(err => console.error(err))
            .then(results => results.json())
            .then(results => this.setState({ devices: results }));
    }

    handleChangeType = (selectedType) => {
        this.setState({ selectedType });
    };

    handleChangeSort = (selectedSort) => {
        this.setState({ selectedSort });
    };

    handleSaveDevice(){
        if(this.state.modalMethod === 'Edit'){
            return fetch(`http://localhost:3000/devices/${this.state.selectedDevice.id}`, {
                method: 'PUT',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(this.state.selectedDevice)
            }).then(response => {
                response.json();
                this.getData();
                this.setState({showModal: false});
            });
        }else{
            return fetch(`http://localhost:3000/devices`, {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(this.state.selectedDevice)
            }).then(response => {
                response.json();
                this.getData();
                this.setState({showModal: false});
            });
        }

    }

    handleDeleteDevice(device){
        return fetch(`http://localhost:3000/devices/${device.id}`, {
            method: 'DELETE',
        }).then(response => {
            response.json();
            this.getData();
        });

    }

    systemNameHandler(e){
        let selectedDevice = Object.assign({}, this.state.selectedDevice);
        selectedDevice.system_name = e.target.value;
        this.setState({selectedDevice});
    }

    handleChangeTypeModal = (selectedTypeModal) => {
        let selectedDevice = Object.assign({}, this.state.selectedDevice);
        selectedDevice.type = selectedTypeModal.value;
        this.setState({selectedDevice, selectedTypeModal});
    };


    hddCapacityHandler(e){
        let selectedDevice = Object.assign({}, this.state.selectedDevice);
        selectedDevice.hdd_capacity = e.target.value;
        this.setState({selectedDevice});
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    handleShowModal(type, device) {
        console.log('modal -> ', type);
        this.setState({ showModal: true, modalMethod : type, selectedDevice: device });
        if(device.type === 'WINDOWS_WORKSTATION')
            this.setState({selectedTypeModal: typeOptionsModal[0]});
        else if(device.type === 'WINDOWS_SERVER')
            this.setState({selectedTypeModal: typeOptionsModal[1]});
        else
            this.setState({selectedTypeModal: typeOptionsModal[2]});

    }

    onKeyPressNumbers(e) {
        const re = /^[0-9\b]+$/;
        const keyCode = e.keyCode || e.which;
        const keyValue = String.fromCharCode(keyCode);
        if (!re.test(keyValue))
            e.preventDefault();
    }

    render() {
        const { selectedType, selectedSort } = this.state;

        const devices = this.state.devices
            .filter(device => (selectedType.value!=='!') ? device.type === selectedType.value : true)
            .sort((a,b) => {
                if(selectedSort){
                    if(selectedSort.value==='hdd_capacity') {
                        return (parseInt(a[selectedSort.value]) > parseInt(b[selectedSort.value])) ? 1 : -1;
                    } else {
                        return (a[selectedSort.value] > b[selectedSort.value]) ? 1 : -1;
                    }
                } else {
                    return 0;
                }
            } )
            .map((device, index) => {
                return(
                <ListGroupItem key={index}>
                    <Grid>
                        <Row>
                            <Col xs={6} md={6}>
                                {device.system_name}<br/>
                                {device.type}<br/>
                                {device.hdd_capacity}
                            </Col>
                            <Col xs={6} md={6}>
                                <ButtonGroup>
                                    <Button onClick={this.handleShowModal.bind(this, 'Edit', device)}>Edit</Button>
                                    <Button onClick={this.handleDeleteDevice.bind(this, device)}>Delete</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </Grid>
                </ListGroupItem>
                )
            });


        if(this.state.devices.length > 0) {
            return(
                <div>
                    <br/>
                    <Grid>
                        <Row>
                            <Col xs={6} md={6} lg={6} sm={6}>
                                <p className="filter-label">Device Type:</p>
                                <Select
                                    value={selectedType}
                                    onChange={this.handleChangeType}
                                    options={typeOptions}
                                />
                            </Col>
                            <Col xs={6} md={6} lg={6} sm={6}>
                                <p className="filter-label">Sort by:</p>
                                <Select
                                    value={selectedSort}
                                    onChange={this.handleChangeSort}
                                    options={sortOptions}
                                    placeholder={"Select an option... "}
                                />
                            </Col>
                        </Row>

                    </Grid>
                    <br/>
                    <Button onClick={this.handleShowModal.bind(this, 'Add', {system_name: '', type: typeOptionsModal[0].value, hdd_capacity: ''})}>Add Device</Button>
                    <br/>
                    <br/>

                    <ListGroup>
                        {devices}
                    </ListGroup>
                    <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>{this.state.modalMethod} Device</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h4>Fill the device information</h4>
                                <p><span className="modal-label">System Name *: </span><input value={this.state.selectedDevice.system_name} onChange={(e) => this.systemNameHandler(e)} /></p>
                                <p><span className="modal-label">Type *: </span><Select value={this.state.selectedTypeModal} onChange={this.handleChangeTypeModal} options={typeOptionsModal}/></p>
                                <p><span className="modal-label">HDD Capacity (GB) *: </span><input type="number" value={this.state.selectedDevice.hdd_capacity} onKeyPress={this.onKeyPressNumbers.bind(this)} onChange={(e) => this.hddCapacityHandler(e)} /></p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.handleSaveDevice}>Save</Button>
                            <Button onClick={this.handleCloseModal}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )
        } else {
            return(
                <h3>Loading data...</h3>
            )
        }
    }

}

export default Devices;