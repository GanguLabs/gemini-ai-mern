import { useState } from 'react'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import './App.css'

const makeRequestAPI = async (prompt) => {
  const res = await axios.post('http://www.localhost:8080/generate', { prompt });

  return res.data;
}

function App() {
  const [prompt, setPrompt] = useState("")

  const mutation = useMutation({
    mutationFn: makeRequestAPI,
    mutationKey: ['gemini-ai-request']
  })

  const submitHandler = (e) => {
    e.preventDefault();

    mutation.mutate(prompt);
  }

  console.log({ mutation })
  return (
    <div className='App'>
      <header>Gemini AI Content Generator</header>
      <p>Enter a prompt and let Gemini AI craft a unique content for you</p>

      <form className='App-form' onSubmit={submitHandler}>
        <label>Enter your prompt:</label>
        <input
          type="text"
          name="prompt"
          id="promptInput"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Write a content about...'
          className='App-input'
        />
        <button className='App-button' type="submit">Generate button</button>

        <section className='App-response'>
          {mutation.isPending && <p>generating your conent</p>}
          {mutation.isError && <p>{mutation.error.message}</p>}
          {mutation.isSuccess && <p>{mutation.data}</p>}
        </section>
      </form>
    </div>
  )
}

export default App
