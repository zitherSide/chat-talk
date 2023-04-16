<template>
  <div>
    <v-switch v-model="isRecording" :label="label" @change="startRecording" />
    <v-snackbar v-model="showsSnackbar" timeout="2000" :color=snackbarColor>
      {{ snackbarMessage }}
    </v-snackbar>
    <audio :src="audioSrc" id="audio"></audio>
  </div>
</template>

<script>
// const languageToggle = document.querySelector('#languageToggle')
const jp = 'ja-JP'
const en = 'en-US'
let language = jp

const systemDirection = [
  {
    role: 'system',
    content: '語尾に「なのだ」をつけてください'
  },
  {
    role: 'system',
    content: '前向きな意見を言ってください'
  },
  {
    role: 'system',
    content: '良いところをほめてください'
  },
  {
    role: 'system',
    content: 'あなたは友達なので敬語を使わずに話します'
  }
]
// const createDataURL = (blob) => {
//   const base64data = btoa(blob)
//   // const base64data = blob.toString('base64')
//   const ret = 'data:audio/wav;base64,' + base64data
//   console.log(ret)
//   return ret
// }

export default {
  data () {
    return {
      isRecording: false,
      recognition: null,
      showsSnackbar: false,
      snackbarMessage: '',
      snackbarColor: 'primary',
      audioSrc: ''
    }
  },
  computed: {
    label () {
      return this.isRecording.value ? 'Recording' : 'Waiting'
    }
  },
  mounted () {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      console.log('can')
      this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()

      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.lang = language

      this.recognition.onstart = () => {
        this.showsSnackbar = true
        this.snackbarMessage = 'Start Recording'
        this.snackbarColor = 'primary'
      }
      this.recognition.onend = () => {
        this.showsSnackbar = true
        this.snackbarMessage = 'End Recording'
        this.snackbarColor = 'primary'
        this.isRecording = false
      }
      this.recognition.onerror = (e) => {
        this.showsSnackbar = true
        this.snackbarMessage = `error: ${e.error}`
        this.snackbarColor = 'error'
      }

      this.recognition.onresult = this.OnResult
    } else {
      this.showsSnackbar = true
      this.snackbarMessage = 'cannot use audio'
      this.snackbarColor = 'error'
    }
  },
  methods: {
    startRecording () {
      if (this.isRecording && this.recognition) {
        this.recognition.start()
      }
    },
    updateMessage (sender, content) {
      if (content !== '') {
        this.$store.commit('add', { sender, content })
        this.getReply()
      }
    },
    OnResult (e) {
      let finalTranscript = ''

      const results = e.results
      for (let i = e.resultIndex; i < results.length; ++i) {
        const transcript = results[i][0].transcript
        if (results[i].isFinal) {
          finalTranscript += transcript
          this.updateMessage('user', finalTranscript)
          console.log(finalTranscript)
        }
      }
    },
    makeHistoricalData () {
      const numHistory = 4
      return this.$store.state.messages
        .slice(-numHistory)
        .map((e) => { return { role: e.sender, content: e.content } })
    },
    getReply () {
      const messages = systemDirection.concat(this.makeHistoricalData())
      console.log('msg', messages)
      this.$axios.$post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages,
          temperature: 0.5
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer xxxx'
          }
        }
      ).then((data) => {
        const reply = data.choices[0].message.content
        this.$store.commit('add', { sender: 'assistant', content: reply })

        return this.$axios.$post(
          `http://localhost:50021/audio_query?speaker=1&text=${'んん' + reply}`, // とりあえず先頭音切れ対策
          {
            headers: {
              'Access-Control-Allow-Origin': '*'
            }
          }
        )
      }).then((query) => {
        console.log('query', query)
        return this.$axios.$post(
          'http://localhost:50021/synthesis?speaker=1',
          query,
          {
            responseType: 'blob'
            // responseType: 'arraybuffer'
          },
          {
            headers: {
              'Access-Control-Allow-Origin': '*'
            }
          }
        )
      }).then((audio) => {
        console.log('audio', audio)
        // console.log('audio url', createDataURL(audio))
        // console.log('audio url', URL.createObjectURL(audio))
        // console.log('audio url', URL.createObjectURL(blob))
        // audioTag.src = audio.data
        // this.audioSrc = URL.createObjectURL(audio)
        const a = new Audio(URL.createObjectURL(audio))
        a.playbackRate = 2.3
        a.addEventListener('canplaythrough', () => a.play())
        // this.audioSrc = URL.createObjectURL(blob)
        // audioTag.play()
      }).catch((e) => {
        this.showsSnackbar = true
        this.snackbarMessage = e
        this.snackbarColor = 'error'
        console.log(e)
      })
    }
  }
}

</script>

<style>

</style>
