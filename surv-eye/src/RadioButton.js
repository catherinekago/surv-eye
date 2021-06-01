
import './radiobutton.css';

const RadioButton = ( props ) => {

  return (
    <div className="radio-container" onClick={() => { props.onChange(props.value) }} >
      <div className={`radio-outer-circle ${props.value !== props.selected && "unselected"}`}>
        <div className={`radio-inner-circle ${props.value !== props.selected && "unselected-circle"}`} />
      </div>
    </div>
  );
}

export default RadioButton; 