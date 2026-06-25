
import './App.css'
import { Canvas } from '@react-three/fiber'
import BoxAnimation from './BoxAnimation'



function App() {
  return (
    <main className='app'>
    <Canvas>
      <BoxAnimation />
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 5]} color="red" />
    </Canvas>
    </main>
  )
}

export default App
