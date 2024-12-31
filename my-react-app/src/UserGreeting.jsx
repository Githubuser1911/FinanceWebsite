import PropTypes from 'prop-types';

function UserGreeting({ isLoggedIn = false, username = "Guest" }) {
  const welcomeMessage = <h2 className="welcome-message">Welcome {username}</h2>;
  const loginMessage = <h2 className="login-prompt">Log in or Create an Account</h2>;

  if (isLoggedIn) {
    return welcomeMessage;
  } else {
    return loginMessage;
  }
}

UserGreeting.propTypes = {
  isLoggedIn: PropTypes.bool,
  username: PropTypes.string,
};

export default UserGreeting;
