import React, { useState } from 'react';
import { useDispatch,UseSelector } from "react-redux";
import { decrement, increment } from '../features/counter/counterSlice';

type Props = {};

const Counter = (props: Props) => {
  const count = useSelector((state: any) => state.counter.value);
  const dispatch = useDispatch();
  const (amount, setamount) = useState(0);

  const handleincrement = () => {
    dispatch(increment());
  };
  const handledecrement = () => {
    dispatch(decrement());
  };
  const handleAddAmount = () => {
    dispatch(incrementbyAmount(amount));
  };

  return 
      <div>
          <p>Count:{count}</p>
    
          <button onClick={handleincrement}>Increment</button>
          <button onClick={handledecrement}>decrement</button>

        <div>
          <input type="text" onChange={(e) => setAmount(Number(e.target.value))}
           />
          <button onClick={handleAddAmount}>add amount</button>
        </div>
          
          
  </div>;
};

export default Counter;
