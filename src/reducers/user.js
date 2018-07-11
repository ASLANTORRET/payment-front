const user = (state = null, { type, _id}) => {
    switch (type) {
      case 'SET_USER':
        return { _id}
      default:
        return state
    }
  }
  
  export default user