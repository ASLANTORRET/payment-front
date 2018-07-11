import React, {Component} from 'react';
import {Container, Row, Col, CardGroup, Card, CardBody, Button, Input, InputGroup, InputGroupAddon, Form} from 'reactstrap';
import $ from 'jquery'
import axios from 'axios'
import { withRouter } from 'react-router'

class Login extends Component {
  constructor(props){
    super(props)
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)   
    this.state = {
      error: null
    }
  }
  onChange(e){
    const name = e.target.name   
    const value = e.target.value   
    this.setState({
      [name]: value
    })
  }  
  onSubmit(e){
    e.preventDefault()
    console.log("current target: ", e.currentTarget)
    const action = $(e.currentTarget).attr("action")
    const method = $(e.currentTarget).attr("method")
    console.log("state value: ", this.state, "action: ", action, "method: ", method)
    const { email, password} = this.state
    console.log("state: ", this.state)
    axios({
      method,
      url: `http://localhost:3025/admin${action}`,
      data: {
        email,
        password
      }
    }) 
    .then(result =>{
      console.log("success: ", result)
      this.props.history.push('/dashboard')
    })   
    .catch(error =>{ 
      console.log("signin error: ", error.response.data)
      this.setState({
        error: error.response.data.error
      })
      console.log("this state: ", this.state)
    })
  }
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                  <Form action="/signin" 
                    method="post" 
                    encType="multipart/form-data" 
                    onSubmit={this.onSubmit}>
                    <h1>Авторизация</h1>
                    <p className="text-muted">Введите авторизационные данные</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon><i className="icon-user"></i></InputGroupAddon>
                      <Input type="text" name="email" onChange={this.onChange} placeholder="Username"/>
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon><i className="icon-lock"></i></InputGroupAddon>
                      <Input type="password" name="password" onChange={this.onChange} color="danger" placeholder="Password"/>
                    </InputGroup>
                    {this.state.error && <p style={{color:"red"}}>{this.state.error}</p>}
                    <Row>
                      <Col xs="6">
                        <Button color="primary" type="submit" className="px-4">Войти</Button>
                      </Col>
                      <Col xs="6" className="text-right">
                        {/* <Button color="link" className="px-0">Forgot password?</Button> */}
                      </Col>
                    </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Регистрация</h2>
                      <p>Зарегистрируйтесь с помощью корпоративной почты.</p>
                      <Button color="primary" className="mt-3" active>Зарегистрироваться</Button>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(Login);
