import React, {Component} from 'react';
import axios from 'axios'
import $ from 'jquery'
import _ from 'lodash'

import {
  Badge,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Table,
  Button,
  Label,
  FormGroup,
  Form,
  FormText,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Pagination,
  PaginationItem,
  PaginationLink  
} from 'reactstrap';


class Tables extends Component {
  constructor(props){
    super(props)
    this.state = {
        merchants: "",
        modal: false,
        activeMerchant: ""
    }
    this.toggle = this.toggle.bind(this)
    this.onEditClick = this.onEditClick.bind(this)
    this.updateMerchant = this.updateMerchant.bind(this)
  }
componentDidMount(){
    axios
    .get("http://localhost:3025/admin/provider/list", )
    .then((data) => {
        console.log("table: ", data)
        this.setState({
            merchants: data.data.body 
        })
    })
    .catch((error => console.log("merchant load error: ", error)))
}

updateMerchant( data ){
  const { id } = data 
  console.log("merchant id: ", id, "merchnat data: ", data)
  const merchants = this.state.merchants
  console.log("all merchants: ", merchants)
  const merchantIndex = _.findIndex(merchants, {id});
  console.log("found index: ", merchantIndex)
  if(merchantIndex){
    //this.state.merchants 
    merchants.splice(merchantIndex, 1, data );
    console.log("merchant updated: ", merchants) 
  }
  else{
    console.log("merchant added: ", merchants) 
    merchants.push(data)
  }   
  this.setState({merchants})
}
// componentDidUpdate(){
//   this.setState({
//     refresh: ! this.state.refresh
//   })
//   console.log("did update: ", this.state.refresh)
// }

toggle(e) {
  this.setState({
    modal: !this.state.modal,
    activeMerchant: ""
  });
}

onEditClick(e){
  e.preventDefault();
  const id = Number($(e.currentTarget).attr("href"))
  const activeMerchant = _.find(this.state.merchants, {id});
  this.setState({
    modal: !this.state.modal,
    activeMerchant
  });
}

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Список провайдеров услуг
              </CardHeader>
              <CardBody>
                <Button onClick={this.toggle}>Добавить</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                  <ModalContent merchant={this.state.activeMerchant} toggle={this.toggle} updateMerchant={this.updateMerchant}/>                
                </Modal>
                <Table responsive striped>
                  <thead>
                  <tr>
                    <th>MerchantID</th>
                    <th>Лого</th>
                    <th>Название</th>
                    <th>Внутрен. название</th>
                    <th>Категория</th>
                    <th>Показать? <br/>(Да/Нет)</th>
                    <th>Описание</th>
                    <th>Статус</th>
                    <th>Дата начала</th>
                    <th>Дата обнов.</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                    {console.log("merchants: ", this.state.merchants.length)}
                    {this.state.merchants && this.state.merchants.length > 0 
                    && this.state.merchants.map((merchant, key) => 
                      (<tr key={key}>
                          <td>{merchant.merchantId}</td>
                          <td><img src={merchant.image} alt="Лого"/></td>
                          <td>{merchant.displayName}</td>
                          <td>{merchant.internalName}</td>
                          <td>{merchant.category}</td>
                          <td><Badge color={merchant.isVisible == 1 ? "success" : "danger"}>{merchant.isVisible == 1 ? "ДА" : "НЕТ"}</Badge></td>
                          <td>{merchant.description}</td>                        
                          <td><Badge color={merchant.status == "ACTIVE" ? "success" : "danger"}>{merchant.status}</Badge></td>
                          <td>{merchant.createdAt}</td>
                          <td>{merchant.endDate}</td>                        
                          <td><a href={merchant.id} onClick={this.onEditClick}><i className="fa fa-pencil fa-lg mt-4"/></a></td>                        
                      </tr>)
                    )}                  
                  </tbody>
                </Table>                
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

    )
  }
}

class ModalContent extends React.Component {
  constructor(props){
    super(props)
    this.onSubmit = this.onSubmit.bind(this)    
    this.onChange = this.onChange.bind(this)    
  }
  
  onChange(e){
    const name = e.target.name   
    const value = e.target.value   
    this.setState({
      [name]: value
    })
    console.log("state value: ", this.state)
  }

  onSubmit(e){
    e.preventDefault()
    console.log("current target: ", e.currentTarget)
    const action = $(e.currentTarget).attr("action")
    const method = $(e.currentTarget).attr("method")
    console.log("logo: ", this.state.image, "checkbox: ", this.isVisible.value)
    
    const data = new FormData();
    data.append('image', this.state.image)
    data.append('displayName', this.displayName.value)
    data.append('internalName', this.internalName.value)
    data.append('category', this.category.value)
    data.append('description', this.description.value)
    data.append('isVisible', this.isVisible.value == "on" ? true : false)
    if(method == "put"){
      data.append('id', this.props.merchant.id)
    }
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    axios({
      method,
      url: `http://localhost:3025/admin${action}`,
      data,
      config
    }) 
    .then(merchant =>{
      console.log("success: ", merchant, "method: ", method)
      this.props.toggle()
      this.props.updateMerchant(merchant.data.body[0])
      alert("Success")
    })   
    .catch(error =>{ 
      console.log("merchant load error: ", error)
      this.props.toggle()
      alert("Error")})
  }

  render(){
    const { merchant } = this.props    
    return (
      <Card>
      <CardHeader>
        <strong>{merchant ? "Редактировать" : "Создать"}</strong> провайдера
      </CardHeader>
      <CardBody>
        <Form action="/provider" 
          method={ merchant ? "put" : "post" } 
          encType="multipart/form-data" 
          className="form-horizontal"
          onSubmit={this.onSubmit}>
          
          {merchant && 
            <FormGroup row>
              <Col md="3">
                <Label>MerchantId</Label>
              </Col>
              <Col xs="12" md="9">
                <p className="form-control-static">{ merchant.merchantId ? merchant.merchantId : "Нет"}</p>
              </Col>
            </FormGroup>
          }
          
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="text-input">Название</Label>
            </Col>
            <Col xs="12" md="9">
              <input 
                type="text" 
                id="text-input" 
                name="displayName" 
                className="form-control"
                defaultValue={merchant && merchant.displayName}
                ref={ (input) => this.displayName = input}                
                placeholder="Beeline. Интернет Дома"
                required/>
            </Col>
          </FormGroup>                  
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="text-input">Внутренн. название</Label>
            </Col>
            <Col xs="12" md="9">
              <input type="text"
                id="text-input" 
                name="internalName" 
                defaultValue={merchant && merchant.internalName} 
                className="form-control"
                ref={ (input) => this.internalName = input}                
                placeholder="beeline_inet_doma"
                required/>
            </Col>
          </FormGroup>                  
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="text-input">Категория</Label>
            </Col>
            <Col xs="12" md="9">
              <input 
                type="text" 
                id="text-input" 
                defaultValue={merchant && merchant.category} 
                ref={ (input) => this.category = input}                
                className="form-control"
                name="category" 
                placeholder="Интернет"
                required/>
            </Col>
          </FormGroup>   
          <FormGroup>
            <Col md="3">
              <Label htmlFor="text-input"><b>Показать ? </b></Label>
            </Col>
            <Col xs="12" md="9">
              <Label className="switch switch-3d switch-primary">
                    <input type="checkbox" 
                      className="switch-input form-control"
                      name="isVisible"
                      ref={ (input) => this.isVisible = input }                
                      defaultChecked={ merchant && merchant.isVisible }
                      />
                    <span className="switch-label"></span>
                    <span className="switch-handle"></span>
              </Label>
            </Col>
          </FormGroup>               
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="textarea-input">Описание</Label>
            </Col>
            <Col xs="12" md="9">
              <input 
                type="textarea" 
                name="description" 
                id="textarea-input" 
                rows="9" 
                className="form-control"              
                ref={ (input) => this.description = input}                
                defaultValue={ merchant && merchant.description }
                placeholder="Интернет Дома"
                required/>
            </Col>
          </FormGroup> 

          { merchant && 
            <FormGroup row>
              <Col md="3">
                <Label>Статус</Label>
              </Col>
              <Col xs="12" md="9">
                <Badge color={merchant.status == "ACTIVE" ? "success" : "danger"}>{merchant.status}</Badge>
              </Col>
            </FormGroup>
          }
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="file-input">Лого</Label>
            </Col>
            <Col xs="12" md="9">
              <input 
                type="file" 
                id="file-input"   
                className="form-control"              
                onChange={(e) => {this.setState({"image": e.target.files[0]})}}
                //ref={ (input) => this.image = input}                
                //onChange={this.onChange}
                name="image"
                required/>
                {merchant && 
                  <img src={merchant.image} alt="Лого"/>
                }
            </Col>
          </FormGroup>  
          <Button 
            type="submit" 
            size="sm" 
            color="primary">
            <i className="fa fa-dot-circle-o"></i> Отправить
            </Button>    
          <Button 
            type="reset" 
            size="sm" 
            color="danger" 
            onClick={() => {this.props.toggle()}}>
            <i className="fa fa-ban"></i> Отмена
            </Button>                      
        </Form>
      </CardBody>
    </Card>   
    )
  }
}

export default Tables;
