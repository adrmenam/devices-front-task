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
            selectedDevice: null,
            showModal: false
        };

        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);

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
        console.log(`Type selected:`, selectedType);
    };

    handleChangeSort = (selectedSort) => {
        this.setState({ selectedSort });
        console.log(`Sort selected:`, selectedSort);
    };

    replaceModalItem(index){
        this.setState({selectedDevice: index});
    }

    saveModalDetails(device){
        //guardar en api
        //this.getData();
    }

    handleHideModal(){
        this.setState({view: {showModal: false}})
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    handleShowModal() {
        this.setState({ showModal: true });
    }

    render() {
        const { selectedType, selectedSort } = this.state;

        const devices = this.state.devices
            .filter(device => (selectedType.value!=='!') ? device.type === selectedType.value : true)
            .sort((a,b) => {
                if(selectedSort){
                    if(selectedSort.value==='hdd_capacity') {
                        return parseInt(a[selectedSort.value]) > parseInt(b[selectedSort.value]);
                    } else {
                        return a[selectedSort.value] > b[selectedSort.value];
                    }
                } else {
                    return true;
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
                                    <Button onClick={this.handleShowModal}>Edit</Button>
                                    <Button>Delete</Button>
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
                            <Col xs={6} md={6}>
                                <Select
                                    value={selectedType}
                                    onChange={this.handleChangeType}
                                    options={typeOptions}
                                />
                            </Col>
                            <Col xs={6} md={6}>
                                <Select
                                    value={selectedSort}
                                    onChange={this.handleChangeSort}
                                    options={sortOptions}
                                />
                            </Col>
                        </Row>

                    </Grid>
                    <br/>
                    <ListGroup>
                        {devices}
                    </ListGroup>
                    <Modal show={this.state.showModal} onHide={this.handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>New Device</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h4>Fill the device information</h4>
                                <p><span className="modal-label">Id:</span><input disabled={true} value={this.state.selectedDevice.id} onChange={(e) => this.idHandler(e)} /></p>
                                <p><span className="modal-label">System Name:</span><input value={this.state.selectedDevice.system_name} onChange={(e) => this.systemNameHandler(e)} /></p>
                                <p><span className="modal-label">Type:</span><input value={this.state.selectedDevice.type} onChange={(e) => this.typeHandler(e)} /></p>
                                <p><span className="modal-label">HDD Capacity:</span><input value={this.state.selectedDevice.hdd_capacity} onChange={(e) => this.hddCapacityHandler(e)} /></p>
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