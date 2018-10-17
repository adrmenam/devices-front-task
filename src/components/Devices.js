import React, {Component} from 'react';
import {Dialog} from 'primereact/dialog';
import {Panel} from 'primereact/panel';
import {DataView, DataViewLayoutOptions} from "primereact/dataview";
import {Button} from "primereact/button";
import {Dropdown} from "primereact/dropdown";
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import axios from 'axios';

class Devices extends Component {

    constructor() {
        super();
        this.state = {
            devices: [],
            layout: 'list',
            selectedDevice: null,
            visible: false,
            sortKey: null,
            sortOrder: null
        };

        this.itemTemplate = this.itemTemplate.bind(this);
        this.onSortChange = this.onSortChange.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData(){
        axios.get(`http://localhost:3000/devices`)
            .then(res =>  {
                const data = res.data;

                this.setState({ devices: data });
                console.log("stateComponentDidMount: ", this.state);

            }).catch(function (error) {
                console.log(error);
            });
    }

    onSortChange(event) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.setState({
                sortOrder: -1,
                sortField: value.substring(1, value.length),
                sortKey: value
            });
        }
        else {
            this.setState({
                sortOrder: 1,
                sortField: value,
                sortKey: value
            });
        }
    }

    renderListItem(device) {
        return (
            <div className="p-col-12" style={{padding: '2em', borderBottom: '1px solid #d9d9d9'}}>
                <div className="p-col-12 p-md-3">

                </div>
                <div className="p-col-12 p-md-8 device-details">
                    <div className="p-grid">
                        <div className="p-col-2 p-sm-6">Id:</div>
                        <div className="p-col-10 p-sm-6">{device.id}</div>

                        <div className="p-col-2 p-sm-6">System name:</div>
                        <div className="p-col-10 p-sm-6">{device.system_name}</div>

                        <div className="p-col-2 p-sm-6">Type:</div>
                        <div className="p-col-10 p-sm-6">{device.type}</div>

                        <div className="p-col-2 p-sm-6">HDD capacity:</div>
                        <div className="p-col-10 p-sm-6">{device.hdd_capacity}</div>
                    </div>
                </div>

                <div className="p-col-12 p-md-1 search-icon" style={{marginTop:'40px'}}>
                    <Button icon="pi pi-search" onClick={(e) => this.setState({ selectedDevice: device, visible: true })}></Button>
                </div>
            </div>
        );
    }

    renderGridItem(device) {
        return (
            <div style={{ padding: '.5em' }} className="p-col-12 p-md-3">
                <Panel header={device.id} style={{ textAlign: 'center' }}>

                    <div className="device-detail">{device.system_name} - {device.hdd_capacity}</div>
                    <hr className="ui-widget-content" style={{ borderTop: 0 }} />
                    <Button icon="pi pi-search" onClick={(e) => this.setState({ selectedDevice: device, visible: true })}></Button>
                </Panel>
            </div>
        );
    }

    itemTemplate(device, layout) {
        if (!device) {
            return;
        }

        if (layout === 'list')
            return this.renderListItem(device);
        else if (layout === 'grid')
            return this.renderGridItem(device);
    }

    renderDeviceDialogContent() {
        if (this.state.selectedDevice) {
            return (
                <div className="p-grid" style={{fontSize: '16px', textAlign: 'center', padding: '20px'}}>
                    <div className="p-col-12" style={{textAlign: 'center'}}>
                    </div>

                    <div className="p-col-4">Id: </div>
                    <div className="p-col-8">{this.state.selectedDevice.id}</div>

                    <div className="p-col-4">System name: </div>
                    <div className="p-col-8">{this.state.selectedDevice.system_name}</div>

                    <div className="p-col-4">Type: </div>
                    <div className="p-col-8">{this.state.selectedDevice.type}</div>

                    <div className="p-col-4">HDD Capacity: </div>
                    <div className="p-col-8">{this.state.selectedDevice.hdd_capacity}</div>
                </div>
            );
        }
        else {
            return null;
        }
    }

    renderHeader() {
        const sortOptions = [
            {label: 'Type', value: 'type'},
            {label: 'System Name', value: 'system_name'},
            {label: 'HDD Capacity', value: 'hdd_capacity'}
        ];

        return (
            <div className="p-grid">
                <div className="p-col-6" style={{textAlign: 'left'}}>
                    <Dropdown options={sortOptions} value={this.state.sortKey} placeholder="Sort By" onChange={this.onSortChange} />
                </div>
                <div className="p-col-6" style={{textAlign: 'right'}}>
                    <DataViewLayoutOptions layout={this.state.layout} onChange={(e) => this.setState({layout: e.value})} />
                </div>
            </div>
        );
    }

    render() {
        const header = this.renderHeader();
        console.log("render: ", this.state.devices);
        return (
            <div>
                <div className="content-section introduction">
                    <div className="feature-intro">
                        <h1>DataView</h1>
                        <p>DataView displays data in grid or list layout with pagination, sorting and filtering features.</p>
                    </div>
                </div>
                {this.state.devices.map(station => <div> {station.id} </div>)}
                <div className="content-section implementation">
                    <DataView value={this.state.devices} layout={this.state.layout} header={header}
                              itemTemplate={this.itemTemplate} paginatorPosition={'both'} paginator={true} rows={20}
                              sortOrder={this.state.sortOrder} sortField={this.state.sortField} />

                    <Dialog header="Car Details" visible={this.state.visible} width="225px" modal={true} onHide={() => this.setState({visible: false})}>
                        {this.renderDeviceDialogContent()}
                    </Dialog>
                </div>


            </div>
        );
    }
}

export default Devices;