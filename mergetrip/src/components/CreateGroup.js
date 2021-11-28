import './CreateGroup.css';
import React, { Component, setState} from 'react';
import { withRouter } from 'react-router';
import { collection, addDoc, getFirestore, setDoc, doc, updateDoc } from 'firebase/firestore';
import withAuthHOC from './withAuthHOC';
import Groups from './Groups';

class CreateGroup extends Component {
  constructor () {
    super();
    this.state = {
      name: '',
      profileURL: '',
      groupName: ''
    };
    this.onInputchange = this.onInputchange.bind(this);
    this.clickMenu = this.clickMenu.bind(this);
    this.createGroup = this.createGroup.bind(this);
  }

  componentDidMount () {
    const auth = this.props.authState.user.auth;

    const defaultName = 'User';
    const defaultProfileURL = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?f=y&d=mp';

    this.setState({
      name: auth.currentUser.displayName ? auth.currentUser.displayName : defaultName,
      profileURL: auth.currentUser.photoURL ? auth.currentUser.photoURL : defaultProfileURL
    });
  }

  clickMenu () {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
  }
/*
  onGroup () {
    //this.props.history.push('/groups');
    this.setCurrentPage(<Groups />);
  }
*/
  onInputchange (event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  createGroup () {
    const auth = this.props.authState.user.auth;
    const userId = auth.currentUser.uid;
    const db = getFirestore();
    setDoc(doc(db, 'groups', `${this.state.groupName}`), {
      groupName: this.state.groupName
    });
    setDoc(doc(db, `groups/${this.state.groupName}/members`, userId), {
      uid: userId
    });
    const userRef = doc(db, 'users', userId);
    // Update group field of current user in firestore
    updateDoc(userRef, 'group', `${this.state.groupName}`);
    //this.onGroup();
    //this.setState(<Groups />);
  }

  render () {
    return (
      <>
        <div class='text'>Create a new group</div>
        <div>
          <input
            class='group-input'
            name='groupName'
            type='text'
            value={this.state.groupName}
            placeholder='Enter your group name'
            onChange={this.onInputchange}
          />
        </div>
        <div>
          <button class='create-button' onClick={this.createGroup}>Create</button>
        </div>
      </>
    );
  }
}
export default withRouter(withAuthHOC(CreateGroup));
