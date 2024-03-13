import { useState } from "react";
import { DefaultService as ApiService } from "./api/client";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 className="bg-red-500">Vite + React</h1>
      <div className="card">
        <button
          onClick={() =>
            setCount((count) => {
              console.log(import.meta.env.VITE_API_URL);
              console.log(ApiService.getHealth());
              return count + 1;
            })
          }
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
