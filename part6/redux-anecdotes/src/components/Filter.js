import { useDispatch } from "react-redux";
import { filterChange } from "../reducers/filterReducer";

const Filter = (props) => {
  const dispatch = useDispatch();

  const handleChange = ({ target }) => {
    dispatch(filterChange(target.value));
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      filter <input onChange={handleChange} />
    </div>
  );
};

export default Filter;
