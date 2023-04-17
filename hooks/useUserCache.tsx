import { AuthContext } from '@/context/authContext'
import { IUser } from '@/models/User'
import React, { useContext, useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'

const useUserCache = (
    author_id?: string
) => {
    const [author, setAuthor] = useState<IUser | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const { cache } = useSWRConfig()
    // const updateTweet = (what: 'liked' | 'retweeted' | 'add-comment') => {
    //     setTweet((prev_author) => {
    //         let new_ = { ...prev_author } as IUser | undefined
    //         if (!new_) return
    //         if (what === 'liked') {
    //             new_ = {
    //                 ...new_,
    //                 have_liked: (new_.have_liked) ? (false) : true,
    //                 num_likes: (!new_.have_liked) ? (new_.num_likes + 1) : (new_.num_likes - 1)
    //             }
    //             console.log('liked')
    //         }
    //         if (what === 'retweeted') {
    //             new_ = {
    //                 ...new_,
    //                 have_retweeted: (new_.have_retweeted) ? (false) : true,
    //                 num_retweet: (!new_.have_retweeted) ? (new_.num_retweet + 1) : (new_.num_retweet - 1)
    //             }
    //         }
    //         //@ts-ignore
    //         cache.set(`tweet/${new_._id}`, new_)
    //         return new_
    //     })
    // }
    const { setAuthState } = useContext(AuthContext)
    useEffect(() => {
        if (!author_id || typeof author_id !== 'string') return;

        // console.log("Here to look for user", author_id)
        setLoading(true)
        //@ts-ignore
        let check: IUser | undefined = cache.get(`user/${author_id}`)
        if (check && check._id) {
            setAuthor(check)
            setLoading(false)
        } else {
            fetch(`/api/user/${author_id}`, { credentials: 'include' })
                .then((res) => {
                    if (res.status === 401) {
                        setAuthState(null)
                        return null;
                    }
                    return res.json()
                })
                .then(data => {
                    if (data && data._id) {
                        setAuthor(data)
                        console.log(data)
                        //@ts-ignore
                        cache.set(`user/${data._id}`, data)
                    } else {
                        setError('Some error occured')
                    }
                })
                .catch((err) => {
                    setError(err.msg || 'Some error occured')
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [author_id])
    return {
        authorDetails: author,
        loading,
        error
    }
}

export default useUserCache