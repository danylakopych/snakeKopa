import React from "react";

const Food = (props) => {
    const style = {
        left: `${props.dot[0]}%`,
        top: `${props.dot[1]}%`,
        backgroundColor: props.type === 'First' ? 'red' : props.type === 'Second' ? 'blue' : 'green',
    };
    return <div className="food" style={style} />;
};
 
export default Food;