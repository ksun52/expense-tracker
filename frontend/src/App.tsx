import { Button } from '@/components/ui/button'
import { Button as Button2 } from '@headlessui/react'
import './App.css'

function App() {

  return (
    <>
      My Finance Tracker App
      <div className="flex flex-col items-center justify-center min-h-svh">
        <Button>Click me</Button>
        <Button2>Click me</Button2>
      </div>
    </>
  )
}

export default App
