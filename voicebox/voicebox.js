const sendButton = document.querySelector("#send")
sendButton.addEventListener("click", () => {
    const text = document.querySelector("#text").value
    console.log(text)

    axios.post(
        `http://localhost:50021/audio_query?speaker=1&text=${text}`,
        {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        }
    ).then(query => {
        console.log('query', query.data)
        return axios.post(
            "http://localhost:50021/synthesis?speaker=1",
            query.data,
            { 
                responseType: "blob" 
            },
            {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            }
        )
    }).then(audio => {
        console.log('audio', audio)
        const audioTag = document.querySelector("#audio")
        // audioTag.src = "G:/Music/タッチ_256k.mp3"
        console.log('audio url', URL.createObjectURL(audio.data))
        // audioTag.src = audio.data
        audioTag.src = URL.createObjectURL(audio.data)
        audioTag.play()
    }).catch(e =>{
        console.log(e)
    })
})