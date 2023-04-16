const languageToggle = document.querySelector('#languageToggle')
const jp = 'ja-JP'
const en = 'en-US'
let language = jp

const OnResult = e => {
    let interimTranscript = ''
    let finalTranscript = ''

    const results = e.results
    for(let i = e.resultIndex; i < results.length; ++i){
        const transcript = results[i][0].transcript
        if(results[i].isFinal){
            finalTranscript += transcript
        }else{
            interimTranscript += transcript
        }
    }

    const result = document.querySelector('#result')
    result.innerHTML = `
        <p>Interim transcript: ${interimTranscript}</p>
        <p>Final transcript: ${finalTranscript}</p>
    `
}

if('SpeechRecognition' in window || 'webkitSpeechRecognition' in window){
    console.log('can')
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language
    
    languageToggle.addEventListener('click', () => {
        console.log('button text', language)
        console.log('inner text', language)
        if(language === jp){
            language = en
            languageToggle.innerText = 'English'
        }else {
            language = jp
            languageToggle.innerText = 'Japanese'
        }

        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language

        recognition.onresult = OnResult
        recognition.start()
    })

    recognition.onstart = () => {
        console.log('started')
    }
    recognition.onend = () => {
        console.log('ended')
    }

    recognition.onresult = OnResult

    recognition.start()
}else{
    console.log('cannot')
}