
const talkButton = document.getElementById('talkButton')
const result = document.querySelector('#result')

talkButton.addEventListener('click', () => {
    console.log('click')
    axios.post(
        'https://api.openai.com/v1/chat/completions', 
        {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: "Hello! I'm new to chat GPT completion API!"
                }
            ],
            temperature: 0.7,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'
                },
        }
    )
    .then(data => {
        result.innerHTML = `
            <p>Reply: ${JSON.stringify(data.data.choices[0].message.content)}</p>
        `
    })
})