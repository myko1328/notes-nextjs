import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { prisma } from '../lib/prisma'

interface FormData {
  title: string
  content: string
  id: string
}

interface Notes {
  notes: {
    id: string
    title: string
    content: string
  }[]
}

function Home({ notes }: Notes) {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    title: '',
    content: '',
    id: '',
  })

  const refreshData = () => {
    router.replace(router.asPath)
  }

  async function create(data: FormData) {
    try {
      fetch('http://localhost:3000/api/create', {
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json'
        },
        method: 'POST',
      }).then(() => {
        setForm({ title: '', content: '', id: '' })
        refreshData()
      })
    } catch (error) {
      console.log('Error create')
    }
  }

  const handleSubmit = async (data: FormData) => {
    try {
      create(data)
    } catch (error) {
      console.log(error)
    }
  }

  async function deleteNote(id: string) {
    try {
      fetch(`http://localhost:3000/api/note/${id}`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: 'DELETE'
      }).then(() => {
        refreshData()
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <h1 className='text-center font-bold text-2xl mt-4'>Notes</h1>
      <form
        onSubmit={e => {
          e.preventDefault()
          handleSubmit(form)
        }}
        className='w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch'
      >

        <input
          className='border-2 rounded border-gray-600 p-1'
          type='text'
          placeholder='Title'
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })} />

        <input
          className='border-2 rounded border-gray-600 p-1'
          type='text'
          placeholder='Content'
          value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })} />

        <button className='bg-blue-500 text-white rounded p-1' type='submit'>Add +</button>
      </form>
      <div className='w-auto min-w-[25%] max-w-min mt-20 mx-auto space-y-6 flex flex-col items-stretch'>
        <ul>
          {notes && notes.map(note => (
            <li key={note.id} className='border-b border-gray-600 p-2'>
              <div className='flex justify-between'>
                <div className="flex-1">
                  <h3 className='font-bold'>{note.title}</h3>
                  <p className='font-small'>{note.content}</p>
                </div>
                <button className='bg-red-500 px-3 text-white' onClick={() => deleteNote(note.id)}>X</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const notes = await prisma.note.findMany({
    select: {
      title: true,
      id: true,
      content: true
    }
  })

  return {
    props: {
      notes
    }
  }
}
