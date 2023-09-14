import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector(({ notification }) => notification);

  const style = {
    padding: 10,
    border: "2px solid teal",
    borderRadius: "5px",
    color: "darkMagenta",
  };

  if (notification) {
    return <div style={style}>{notification}</div>;
  }
};

export default Notification;
