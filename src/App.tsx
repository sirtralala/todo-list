import "./index.css"
import { Todos } from "./pages/Todos"

function App() {
  return (
    <div className='w-screen'>
      <h1 className='pb-8'>Hier ist die Todo-Liste</h1>
      <Todos />
    </div>
  )
}

export default App
