
import NavBar from '@/app/navbar'
import Propuesta from './propuesta'
// import propuestas from '../../../courses'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
    const { id } = await params
    return(
      <div className='w-screen'>
        <NavBar />
        <Propuesta id={id}/>
      </div>
    )
}