import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './app/store';
import { increment, decrement, incrementByAmount } from './features/counter/counterSlice';

const App: React.FC = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();

  const [amount, setAmount] = useState(0);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>🔢 Redux Counter</h1>
      <h2>Count: {count}</h2>

      <div style={{ margin: '1rem' }}>
        <button onClick={() => dispatch(increment())}>➕ Increment</button>{' '}
        <button onClick={() => dispatch(decrement())}>➖ Decrement</button>
      </div>

      <div style={{ margin: '1rem' }}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Amount"
        />
        <button onClick={() => dispatch(incrementByAmount(amount))}>
          ➕ Add {amount}
        </button>
      </div>
    </div>
  );
};

export default App;
