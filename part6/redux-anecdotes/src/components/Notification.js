import { useSelector, useDispatch } from "react-redux";
import { resetNotification } from "../reducers/notificationReducer";

const Notification = () => {
  const dispatch = useDispatch();
  const notification = useSelector(({ notification }) => notification);

  const style = {
    padding: 10,
    border: "2px solid teal",
    borderRadius: "5px",
    color: "darkMagenta",
  };

  const renderNotification = () => {
    setTimeout(() => dispatch(resetNotification()), 5000);
    return <div style={style}>{notification}</div>;
  };

  if (notification) {
    return renderNotification();
  }
};

export default Notification;
