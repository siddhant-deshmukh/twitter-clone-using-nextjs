import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Modal from 'react-modal'

Modal.setAppElement('#desktop_layout')

const ArticlePage = () => {
  const router = useRouter()

  useEffect(() => {
    router.prefetch('/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Modal
        isOpen={true} // The modal should always be shown on page load, it is the 'page'
        onRequestClose={() => router.push('/')}
        contentLabel="Post modal"
      >
        <div>
            Meow
        </div>
      </Modal>
    </>
  )
}

export default ArticlePage