
import './css/radiobutton.css';

const RadioButton = ( props ) => {

  return (
    <div className="radio-container" onClick={() => { props.onChange(props.value) }} >
      <p className="radio-button-label"> {props.label} </p>
      <div className={`radio-outer-circle ${props.value !== props.selected && "unselected"}`}>
        <div className={`radio-inner-circle ${props.value !== props.selected && "unselected-circle"}`} />
      </div>
    </div>
  );
}

export default RadioButton; 