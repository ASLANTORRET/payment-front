import React from 'react'
import {setUser} from './actions/user'
import  Router from './router'
import {connect} from 'react-redux'

class Auth extends React.Component{
    componentWillReceiveProps(props){
        const { data, user, setCurrentUser } = props
        if (data.currentUser && !data.loading && !user) {
            setCurrentUser(data.currentUser)
        }
    }
    componentDidMount(){
        document.title = "Мобильные финансы"        
    }
    render(){
        return <Router/>            
    }
}
const withState = connect(
    (state) => ({ user: state.user }),
    (dispatch) => ({
      setCurrentUser({_id}) {
        dispatch(setUser({_id}))
      }
    })
  )

export default withState(Auth)
  