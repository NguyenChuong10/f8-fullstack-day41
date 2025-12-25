import { BrowserRouter as Router , Routes , Route } from 'react-router'
import Navigator from './components/ProductModal'
import Home from './pages/Home'
import './App.css'
import ProductModal from './components/ProductModal'

function App() {
  

  return (
    <Router basename={import.meta.env.PROD ? "/f8-fullstack-btvnday41" : ""}>
        <Home/>
        <Routes>
            <Route path="/productmodal" element={<ProductModal/>}></Route>
        </Routes>
    </Router>
  )
}

export default App
