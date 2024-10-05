import { Button, Input } from "@nextui-org/react"




function App() {

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen gap-5">
      <div>
        <img src="https://placehold.co/600x400" alt="React logo" className="h-48 w-96" />
      </div>
      <div className="flex flex-col justify-center items-center gap-3">
        <Input type="password" radius="sm" />
        <Button type="submit" variant="solid" radius="sm" >Login</Button>
      </div>
    </div>
  )
}

export default App
